import type { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

function csvCell(value: unknown) {
  const text = value == null ? "" : String(value);
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT CONCAT('ALS-', LPAD(b.id, 5, '0')) AS reference, u.name AS traveler,
      u.email, b.phone, p.name AS package_name, DATE_FORMAT(b.travel_date, '%Y-%m-%d') AS departure,
      b.travelers, b.total_price, b.status, b.payment_status, COALESCE(g.name, '') AS guide,
      DATE_FORMAT(b.created_at, '%Y-%m-%d %H:%i') AS created_at
     FROM bookings b JOIN users u ON u.id = b.user_id JOIN packages p ON p.id = b.package_id
     LEFT JOIN users g ON g.id = b.guide_id ORDER BY b.created_at DESC`,
  );
  const headers = ["Reference", "Traveler", "Email", "Phone", "Package", "Departure", "Travelers", "Total INR", "Status", "Payment", "Guide", "Created"];
  const keys = ["reference", "traveler", "email", "phone", "package_name", "departure", "travelers", "total_price", "status", "payment_status", "guide", "created_at"];
  const csv = [headers.map(csvCell).join(","), ...rows.map((row) => keys.map((key) => csvCell(row[key])).join(","))].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(`\uFEFF${csv}`, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="alsafar-bookings-${date}.csv"`, "cache-control": "private, no-store" } });
}
