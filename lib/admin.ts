import type { RowDataPacket } from "mysql2";
import { getDb } from "@/lib/db";

export const bookingStatuses = ["pending", "documents_review", "confirmed", "payment_received", "completed", "cancelled"] as const;
export const documentStatuses = ["pending", "approved", "rejected"] as const;
export type BookingStatus = typeof bookingStatuses[number];
export type DocumentStatus = typeof documentStatuses[number];

export const statusLabels: Record<BookingStatus, string> = {
  pending: "Pending",
  documents_review: "Documents under review",
  confirmed: "Confirmed",
  payment_received: "Payment received",
  completed: "Completed",
  cancelled: "Cancelled",
};

export type AdminBookingSummary = {
  id: number; traveler_name: string; traveler_email: string; phone: string;
  package_name: string; travel_date: string; travelers: number; total_price: number;
  status: BookingStatus; payment_status: "pending" | "received"; guide_name: string | null;
  passport_status: DocumentStatus | null; aadhaar_status: DocumentStatus | null;
  pan_status: DocumentStatus | null; created_at: string;
};

export type DepartureSummary = {
  package_id: number; package_name: string; travel_date: string;
  capacity: number; booked_seats: number; seats_remaining: number;
  guide_name: string | null; guide_email: string | null;
};

export async function getAdminDashboardData(search = "", status = "all") {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is not configured.");
  const normalizedSearch = search.trim();
  const where: string[] = [];
  const values: Array<string | number> = [];

  if (normalizedSearch) {
    const bookingNumber = normalizedSearch.toUpperCase().replace(/^ALS-0*/, "");
    where.push("(u.name LIKE ? OR u.email LIKE ? OR b.phone LIKE ? OR CAST(b.id AS CHAR) = ?)");
    const like = `%${normalizedSearch}%`;
    values.push(like, like, like, /^\d+$/.test(bookingNumber) ? Number(bookingNumber) : -1);
  }
  if (status !== "all" && bookingStatuses.includes(status as BookingStatus)) {
    where.push("b.status = ?");
    values.push(status);
  }
  const condition = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const [bookings] = await db.execute<RowDataPacket[]>(
    `SELECT b.id, u.name AS traveler_name, u.email AS traveler_email, b.phone,
      p.name AS package_name, DATE_FORMAT(b.travel_date, '%Y-%m-%d') AS travel_date,
      b.travelers, b.total_price, b.status, b.payment_status, g.name AS guide_name,
      d.passport_status, d.aadhaar_status, d.pan_status,
      DATE_FORMAT(b.created_at, '%Y-%m-%d %H:%i') AS created_at
     FROM bookings b
     JOIN users u ON u.id = b.user_id
     JOIN packages p ON p.id = b.package_id
     LEFT JOIN users g ON g.id = b.guide_id AND g.role = 'guide'
     LEFT JOIN booking_documents d ON d.booking_id = b.id
     ${condition}
     ORDER BY b.created_at DESC LIMIT 200`,
    values,
  );
  const [statsRows] = await db.execute<RowDataPacket[]>(
    `SELECT COUNT(*) AS total,
      SUM(status IN ('pending','documents_review')) AS needs_attention,
      SUM(status = 'confirmed') AS confirmed,
      SUM(payment_status = 'received') AS paid,
      COALESCE(SUM(CASE WHEN payment_status = 'received' THEN total_price ELSE 0 END), 0) AS revenue
     FROM bookings`,
  );
  const [departures] = await db.execute<RowDataPacket[]>(
    `SELECT b.package_id, p.name AS package_name,
      DATE_FORMAT(b.travel_date, '%Y-%m-%d') AS travel_date,
      COALESCE(pd.capacity, 40) AS capacity,
      COALESCE(SUM(CASE WHEN b.status <> 'cancelled' THEN b.travelers ELSE 0 END), 0) AS booked_seats,
      GREATEST(COALESCE(pd.capacity, 40) - COALESCE(SUM(CASE WHEN b.status <> 'cancelled' THEN b.travelers ELSE 0 END), 0), 0) AS seats_remaining,
      dg.name AS guide_name, dg.email AS guide_email
     FROM bookings b
     JOIN packages p ON p.id = b.package_id
     LEFT JOIN package_departures pd ON pd.package_id = b.package_id AND pd.travel_date = b.travel_date
     LEFT JOIN users dg ON dg.id = pd.guide_id AND dg.role = 'guide'
     GROUP BY b.package_id, p.name, b.travel_date, pd.capacity, dg.name, dg.email
     ORDER BY b.travel_date ASC LIMIT 30`,
  );
  return {
    bookings: bookings as AdminBookingSummary[],
    stats: statsRows[0] as { total: number; needs_attention: number; confirmed: number; paid: number; revenue: number },
    departures: departures as DepartureSummary[],
  };
}

export async function getAdminBooking(id: number) {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is not configured.");
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT b.*, DATE_FORMAT(b.travel_date, '%Y-%m-%d') AS travel_date,
      DATE_FORMAT(b.created_at, '%Y-%m-%d %H:%i') AS created_at,
      u.name AS traveler_name, u.email AS traveler_email,
      p.name AS package_name, p.slug AS package_slug,
      g.name AS guide_name,
      d.id AS document_id, d.passport_number, d.aadhaar_number, d.pan_number,
      d.passport_file_name, d.passport_file_type, d.passport_status,
      d.aadhaar_file_name, d.aadhaar_file_type, d.aadhaar_status,
      d.pan_file_name, d.pan_file_type, d.pan_status,
      d.review_notes, DATE_FORMAT(d.reviewed_at, '%Y-%m-%d %H:%i') AS reviewed_at
     FROM bookings b
     JOIN users u ON u.id = b.user_id
     JOIN packages p ON p.id = b.package_id
     LEFT JOIN users g ON g.id = b.guide_id
     LEFT JOIN booking_documents d ON d.booking_id = b.id
     WHERE b.id = ? LIMIT 1`,
    [id],
  );
  if (!rows[0]) return null;
  const [guides] = await db.execute<RowDataPacket[]>(
    `SELECT u.id, u.name, u.email, gp.phone, gp.city, gp.languages, gp.experience_years, gp.notes
     FROM users u LEFT JOIN guide_profiles gp ON gp.user_id = u.id WHERE u.role = 'guide' ORDER BY u.name`,
  );
  const [notes] = await db.execute<RowDataPacket[]>(
    `SELECT n.id, n.note, DATE_FORMAT(n.created_at, '%Y-%m-%d %H:%i') AS created_at, u.name AS admin_name
     FROM booking_notes n JOIN users u ON u.id = n.admin_id WHERE n.booking_id = ? ORDER BY n.created_at DESC`, [id],
  );
  const [audit] = await db.execute<RowDataPacket[]>(
    `SELECT a.action, a.details, DATE_FORMAT(a.created_at, '%Y-%m-%d %H:%i') AS created_at, u.name AS admin_name
     FROM booking_audit_log a JOIN users u ON u.id = a.admin_id WHERE a.booking_id = ? ORDER BY a.created_at DESC LIMIT 30`, [id],
  );
  const [capacity] = await db.execute<RowDataPacket[]>(
    `SELECT COALESCE(pd.capacity, 40) AS capacity, pd.guide_id,
      COALESCE(SUM(CASE WHEN b.status <> 'cancelled' THEN b.travelers ELSE 0 END), 0) AS booked_seats
     FROM bookings b LEFT JOIN package_departures pd ON pd.package_id = b.package_id AND pd.travel_date = b.travel_date
     WHERE b.package_id = ? AND b.travel_date = ? GROUP BY b.package_id, b.travel_date, pd.capacity`,
    [rows[0].package_id, rows[0].travel_date],
  );
  return { booking: rows[0], guides, notes, audit, capacity: capacity[0] || { capacity: 40, booked_seats: 0 } };
}

export async function getAdminGuides() {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL is not configured.");
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT u.id, u.name, u.email, gp.phone, gp.city, gp.languages, gp.experience_years, gp.notes,
      COUNT(DISTINCT CONCAT(pd.package_id, '-', pd.travel_date)) AS assigned_groups
     FROM users u
     LEFT JOIN guide_profiles gp ON gp.user_id = u.id
     LEFT JOIN package_departures pd ON pd.guide_id = u.id
     WHERE u.role = 'guide'
     GROUP BY u.id, u.name, u.email, gp.phone, gp.city, gp.languages, gp.experience_years, gp.notes
     ORDER BY u.name`,
  );
  return rows;
}

export function maskDocumentNumber(value: string | null | undefined, visible = 4) {
  if (!value) return "Not provided";
  return `${"•".repeat(Math.max(4, value.length - visible))}${value.slice(-visible)}`;
}
