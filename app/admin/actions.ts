"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { bookingStatuses, documentStatuses } from "@/lib/admin";
import { getDb } from "@/lib/db";

async function context() {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is not configured.");
  return { admin, db };
}

async function audit(bookingId: number, adminId: number, action: string, details: string) {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is not configured.");
  await db.execute("INSERT INTO booking_audit_log (booking_id, admin_id, action, details) VALUES (?, ?, ?, ?)", [bookingId, adminId, action, details]);
}

function refresh(bookingId: number) {
  revalidatePath("/admin");
  revalidatePath(`/admin/bookings/${bookingId}`);
}

export async function updateBookingStatus(formData: FormData) {
  const parsed = z.object({ bookingId: z.coerce.number().int().positive(), status: z.enum(bookingStatuses) }).parse(Object.fromEntries(formData));
  const { admin, db } = await context();
  if (parsed.status === "confirmed") {
    const [rows] = await db.execute<import("mysql2").RowDataPacket[]>("SELECT guide_id FROM bookings WHERE id = ? LIMIT 1", [parsed.bookingId]);
    if (!rows[0]?.guide_id) redirect(`/admin/bookings/${parsed.bookingId}?error=guide-required`);
  }
  await db.execute("UPDATE bookings SET status = ? WHERE id = ?", [parsed.status, parsed.bookingId]);
  await audit(parsed.bookingId, admin.id, "booking_status_changed", `Status changed to ${parsed.status}.`);
  refresh(parsed.bookingId);
}

export async function assignGuide(formData: FormData) {
  const parsed = z.object({ bookingId: z.coerce.number().int().positive(), guideId: z.string() }).parse(Object.fromEntries(formData));
  const { admin, db } = await context();
  let guideId: number | null = null;
  let guideName = "Unassigned";
  if (parsed.guideId) {
    guideId = Number(parsed.guideId);
    const [guides] = await db.execute<import("mysql2").RowDataPacket[]>("SELECT name FROM users WHERE id = ? AND role = 'guide' LIMIT 1", [guideId]);
    if (!guides[0]) throw new Error("The selected guide is invalid.");
    guideName = guides[0].name;
  }
  const [bookings] = await db.execute<import("mysql2").RowDataPacket[]>("SELECT package_id, travel_date FROM bookings WHERE id = ? LIMIT 1", [parsed.bookingId]);
  if (!bookings[0]) throw new Error("Booking not found.");
  const { package_id: packageId, travel_date: travelDate } = bookings[0];
  await db.execute(
    `INSERT INTO package_departures (package_id, travel_date, capacity, guide_id) VALUES (?, ?, 40, ?)
     ON DUPLICATE KEY UPDATE guide_id = VALUES(guide_id)`,
    [packageId, travelDate, guideId],
  );
  await db.execute("UPDATE bookings SET guide_id = ? WHERE package_id = ? AND travel_date = ?", [guideId, packageId, travelDate]);
  await db.execute(
    `INSERT INTO booking_audit_log (booking_id, admin_id, action, details)
     SELECT id, ?, 'group_guide_assignment_changed', ? FROM bookings WHERE package_id = ? AND travel_date = ?`,
    [admin.id, `Departure group guide: ${guideName}.`, packageId, travelDate],
  );
  refresh(parsed.bookingId);
}

export async function confirmBooking(formData: FormData) {
  const parsed = z.object({ bookingId: z.coerce.number().int().positive() }).parse(Object.fromEntries(formData));
  const { admin, db } = await context();
  const [rows] = await db.execute<import("mysql2").RowDataPacket[]>("SELECT guide_id FROM bookings WHERE id = ? LIMIT 1", [parsed.bookingId]);
  if (!rows[0]) throw new Error("Booking not found.");
  if (!rows[0].guide_id) redirect(`/admin/bookings/${parsed.bookingId}?error=guide-required`);
  await db.execute("UPDATE bookings SET status = 'confirmed' WHERE id = ?", [parsed.bookingId]);
  await audit(parsed.bookingId, admin.id, "booking_confirmed", "The administrator confirmed the booking after guide assignment.");
  revalidatePath("/admin");
  redirect(`/admin/bookings/${parsed.bookingId}?message=confirmed`);
}

export async function reviewDocument(formData: FormData) {
  const parsed = z.object({
    bookingId: z.coerce.number().int().positive(),
    documentType: z.enum(["passport", "aadhaar", "pan"]),
    documentStatus: z.enum(documentStatuses),
    reviewNotes: z.string().trim().max(2000).optional(),
  }).parse(Object.fromEntries(formData));
  const { admin, db } = await context();
  const column = `${parsed.documentType}_status`;
  await db.execute(
    `UPDATE booking_documents SET ${column} = ?, review_notes = ?, reviewed_by = ?, reviewed_at = NOW() WHERE booking_id = ?`,
    [parsed.documentStatus, parsed.reviewNotes || null, admin.id, parsed.bookingId],
  );
  await audit(parsed.bookingId, admin.id, "document_reviewed", `${parsed.documentType} marked ${parsed.documentStatus}.`);
  refresh(parsed.bookingId);
}

export async function updatePayment(formData: FormData) {
  const parsed = z.object({ bookingId: z.coerce.number().int().positive(), paymentStatus: z.enum(["pending", "received"]) }).parse(Object.fromEntries(formData));
  const { admin, db } = await context();
  if (parsed.paymentStatus === "received") {
    await db.execute("UPDATE bookings SET payment_status = 'received', payment_received_at = NOW(), payment_received_by = ?, status = IF(status IN ('pending','documents_review','confirmed'), 'payment_received', status) WHERE id = ?", [admin.id, parsed.bookingId]);
  } else {
    await db.execute("UPDATE bookings SET payment_status = 'pending', payment_received_at = NULL, payment_received_by = NULL WHERE id = ?", [parsed.bookingId]);
  }
  await audit(parsed.bookingId, admin.id, "payment_status_changed", `Office payment marked ${parsed.paymentStatus}.`);
  refresh(parsed.bookingId);
}

export async function addBookingNote(formData: FormData) {
  const parsed = z.object({ bookingId: z.coerce.number().int().positive(), note: z.string().trim().min(2).max(4000) }).parse(Object.fromEntries(formData));
  const { admin, db } = await context();
  await db.execute("INSERT INTO booking_notes (booking_id, admin_id, note) VALUES (?, ?, ?)", [parsed.bookingId, admin.id, parsed.note]);
  await audit(parsed.bookingId, admin.id, "internal_note_added", "An internal note was added.");
  refresh(parsed.bookingId);
}

export async function updateDepartureCapacity(formData: FormData) {
  const parsed = z.object({ bookingId: z.coerce.number().int().positive(), packageId: z.coerce.number().int().positive(), travelDate: z.string().date(), capacity: z.coerce.number().int().min(1).max(1000) }).parse(Object.fromEntries(formData));
  const { admin, db } = await context();
  await db.execute(
    `INSERT INTO package_departures (package_id, travel_date, capacity) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE capacity = VALUES(capacity)`,
    [parsed.packageId, parsed.travelDate, parsed.capacity],
  );
  await audit(parsed.bookingId, admin.id, "departure_capacity_changed", `Capacity changed to ${parsed.capacity}.`);
  refresh(parsed.bookingId);
}

export async function updateGuideProfile(formData: FormData) {
  const parsed = z.object({
    guideId: z.coerce.number().int().positive(), name: z.string().trim().min(2).max(120),
    phone: z.string().trim().max(30).optional(), city: z.string().trim().max(100).optional(),
    languages: z.string().trim().max(255).optional(), experienceYears: z.union([z.literal(""), z.coerce.number().int().min(0).max(80)]),
    notes: z.string().trim().max(2000).optional(),
  }).parse(Object.fromEntries(formData));
  const { db } = await context();
  const [result] = await db.execute<import("mysql2").ResultSetHeader>("UPDATE users SET name = ? WHERE id = ? AND role = 'guide'", [parsed.name, parsed.guideId]);
  if (result.affectedRows !== 1) throw new Error("Guide account not found.");
  await db.execute(
    `INSERT INTO guide_profiles (user_id, phone, city, languages, experience_years, notes)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE phone = VALUES(phone), city = VALUES(city), languages = VALUES(languages), experience_years = VALUES(experience_years), notes = VALUES(notes)`,
    [parsed.guideId, parsed.phone || null, parsed.city || null, parsed.languages || null, parsed.experienceYears === "" ? null : parsed.experienceYears, parsed.notes || null],
  );
  revalidatePath("/admin/guides");
  revalidatePath("/admin");
}
