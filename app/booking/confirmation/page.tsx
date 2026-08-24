import Link from "next/link";
import { redirect } from "next/navigation";
import type { RowDataPacket } from "mysql2";
import { Building2, CalendarDays, CheckCircle2, FileCheck2 } from "lucide-react";
import { Header } from "@/components/Header";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { formatRupees, packages } from "@/lib/packages";

export default async function BookingConfirmationPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const user = await getSession();
  if (!user) redirect("/login");
  const { id } = await searchParams;
  const bookingId = Number(id);
  if (!Number.isInteger(bookingId) || bookingId < 1) redirect("/dashboard");
  const db = getDb();
  if (!db) redirect("/dashboard");
  const [rows] = await db.execute<RowDataPacket[]>("SELECT id, package_id, travel_date, travelers, total_price, status FROM bookings WHERE id = ? AND user_id = ? LIMIT 1", [bookingId, user.id]);
  const booking = rows[0];
  if (!booking) redirect("/dashboard");
  const pkg = packages.find((item) => item.id === booking.package_id);

  return <><Header/><main className="confirmation-page"><section className="confirmation-card">
    <div className="confirmation-icon"><CheckCircle2/></div><span className="eyebrow">Booking received</span>
    <h1>Your journey request is with us.</h1><p className="muted">Alhamdulillah, your documents and booking details were submitted successfully. Our team will review them and contact you before payment.</p>
    <div className="confirmation-reference">Booking reference <strong>ALS-{String(booking.id).padStart(5, "0")}</strong></div>
    <div className="confirmation-details"><div><FileCheck2/><span><small>Package</small><strong>{pkg?.name ?? `Package ${booking.package_id}`}</strong></span></div><div><CalendarDays/><span><small>Travelers and total</small><strong>{booking.travelers} · {formatRupees(booking.total_price)}</strong></span></div><div><Building2/><span><small>Payment</small><strong>Pay in office</strong></span></div></div>
    <p className="secure-note">Do not pay anyone until an authorized AlSafar representative confirms your booking.</p>
    <Link href="/dashboard" className="btn btn-primary">Go to my dashboard</Link>
  </section></main></>;
}
