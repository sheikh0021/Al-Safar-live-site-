import Link from "next/link";
import { CalendarRange, CheckCircle2, CircleDollarSign, Clock3, Eye, Search, UsersRound } from "lucide-react";
import { bookingStatuses, getAdminDashboardData, statusLabels, type BookingStatus } from "@/lib/admin";
import { formatRupees } from "@/lib/packages";

function documentProgress(booking: { passport_status: string | null; aadhaar_status: string | null; pan_status: string | null }) {
  const statuses = [booking.passport_status, booking.aadhaar_status, booking.pan_status];
  if (statuses.every((status) => status === "approved")) return { label: "All approved", tone: "approved" };
  if (statuses.some((status) => status === "rejected")) return { label: "Action required", tone: "rejected" };
  if (statuses.every((status) => status === null)) return { label: "Not uploaded", tone: "pending" };
  return { label: "Review pending", tone: "pending" };
}

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const params = await searchParams;
  const search = params.q || "";
  const status = params.status || "all";
  const { bookings, stats, departures } = await getAdminDashboardData(search, status);
  const metrics = [
    { label: "Total bookings", value: Number(stats.total || 0), icon: UsersRound },
    { label: "Needs attention", value: Number(stats.needs_attention || 0), icon: Clock3 },
    { label: "Confirmed", value: Number(stats.confirmed || 0), icon: CheckCircle2 },
    { label: "Office payments", value: Number(stats.paid || 0), icon: CircleDollarSign },
  ];
  return <div className="admin-container">
    <section className="admin-heading"><div><span className="eyebrow">Operations overview</span><h1>Booking administration</h1><p>Review every reservation, document, guide assignment and office payment.</p></div><div className="admin-revenue"><small>Recorded office revenue</small><strong>{formatRupees(Number(stats.revenue || 0))}</strong></div></section>
    <section className="admin-metrics">{metrics.map(({ label, value, icon: Icon }) => <div className="admin-metric" key={label}><span><Icon size={19}/></span><div><small>{label}</small><strong>{value}</strong></div></div>)}</section>

    <section className="admin-panel">
      <div className="admin-panel-head"><div><h2>Bookings</h2><p>{bookings.length} result{bookings.length === 1 ? "" : "s"}</p></div>
        <form className="admin-filters" method="get"><label><Search size={16}/><input name="q" defaultValue={search} placeholder="Reference, traveler, email or phone"/></label><select name="status" defaultValue={status}><option value="all">All statuses</option>{bookingStatuses.map((value) => <option value={value} key={value}>{statusLabels[value]}</option>)}</select><button className="btn btn-primary">Search</button>{(search || status !== "all") && <Link className="btn btn-outline" href="/admin">Clear</Link>}</form>
      </div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Reference</th><th>Traveler</th><th>Package and departure</th><th>Documents</th><th>Guide</th><th>Status</th><th>Payment</th><th/></tr></thead><tbody>
        {bookings.map((booking) => { const docs = documentProgress(booking); return <tr key={booking.id}>
          <td><strong>ALS-{String(booking.id).padStart(5, "0")}</strong><small>{booking.created_at}</small></td>
          <td><strong>{booking.traveler_name}</strong><small>{booking.traveler_email}</small><small>{booking.phone}</small></td>
          <td><strong>{booking.package_name}</strong><small>{booking.travel_date} · {booking.travelers} traveler{booking.travelers === 1 ? "" : "s"}</small><small>{formatRupees(booking.total_price)}</small></td>
          <td><span className={`admin-badge ${docs.tone}`}>{docs.label}</span></td>
          <td>{booking.guide_name || <span className="admin-muted">Unassigned</span>}</td>
          <td><span className={`admin-badge status-${booking.status}`}>{statusLabels[booking.status as BookingStatus]}</span></td>
          <td><span className={`admin-badge ${booking.payment_status === "received" ? "approved" : "pending"}`}>{booking.payment_status === "received" ? "Received" : "Pending"}</span></td>
          <td><Link className="admin-icon-link" aria-label={`Open booking ALS-${booking.id}`} href={`/admin/bookings/${booking.id}`}><Eye size={18}/></Link></td>
        </tr>; })}
        {!bookings.length && <tr><td colSpan={8}><div className="admin-empty">No bookings match these filters.</div></td></tr>}
      </tbody></table></div>
    </section>

    <section className="admin-panel admin-departures"><div className="admin-panel-head"><div><h2><CalendarRange size={21}/>Departure capacity</h2><p>Seat totals exclude cancelled bookings. Open a booking to change its departure capacity.</p></div></div>
      <div className="admin-departure-grid">{departures.map((departure) => <article key={`${departure.package_id}-${departure.travel_date}`}><div><strong>{departure.package_name}</strong><small>{departure.travel_date}</small></div><div className="seat-bar"><span style={{ width: `${Math.min(100, (Number(departure.booked_seats) / Number(departure.capacity)) * 100)}%` }}/></div><p><strong>{Number(departure.seats_remaining)}</strong> seats remaining <small>{Number(departure.booked_seats)} of {Number(departure.capacity)} booked</small></p><div className={`admin-departure-guide ${departure.guide_name ? "assigned" : ""}`}>{departure.guide_name ? <>Guide: <strong>{departure.guide_name}</strong><small>{departure.guide_email}</small></> : "No group guide assigned"}</div></article>)}{!departures.length && <div className="admin-empty">Departure capacity will appear after the first booking.</div>}</div>
    </section>
  </div>;
}
