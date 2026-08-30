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
  await db.execute("UPDATE bookings SET guide_id = ? WHERE id = ?", [guideId, parsed.bookingId]);
  await audit(parsed.bookingId, admin.id, "guide_assignment_changed", `Guide: ${guideName}.`);
  refresh(parsed.bookingId);
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
