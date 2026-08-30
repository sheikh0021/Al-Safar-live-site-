import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, CheckCircle2, Download, FileText, Mail, MessageSquareText, Phone, Save, ShieldCheck, UserRoundCheck, WalletCards } from "lucide-react";
import { addBookingNote, assignGuide, reviewDocument, updateBookingStatus, updateDepartureCapacity, updatePayment } from "@/app/admin/actions";
import { bookingStatuses, documentStatuses, getAdminBooking, maskDocumentNumber, statusLabels, type BookingStatus, type DocumentStatus } from "@/lib/admin";
import { formatRupees } from "@/lib/packages";

const documentLabels = { passport: "Passport", aadhaar: "Aadhaar card", pan: "PAN card" } as const;

export default async function AdminBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) notFound();
  const data = await getAdminBooking(id);
  if (!data) notFound();
  const { booking, guides, notes, audit, capacity } = data;
  const reference = `ALS-${String(id).padStart(5, "0")}`;
  const seatsRemaining = Math.max(0, Number(capacity.capacity) - Number(capacity.booked_seats));

  return <div className="admin-container">
    <Link href="/admin" className="admin-back"><ArrowLeft size={17}/>Back to all bookings</Link>
    <section className="admin-detail-heading"><div><span className="eyebrow">Booking {reference}</span><h1>{booking.traveler_name}</h1><p>{booking.package_name} · {booking.travel_date} · Created {booking.created_at}</p></div><span className={`admin-badge admin-large-badge status-${booking.status}`}>{statusLabels[booking.status as BookingStatus]}</span></section>

    <div className="admin-detail-grid">
      <div className="admin-detail-main">
        <section className="admin-panel admin-contact-card"><div><h2>Traveler and journey</h2><div className="admin-info-grid"><div><small>Email</small><strong>{booking.traveler_email}</strong></div><div><small>Phone</small><strong>{booking.phone}</strong></div><div><small>Travelers</small><strong>{booking.travelers}</strong></div><div><small>Booking total</small><strong>{formatRupees(Number(booking.total_price))}</strong></div></div></div><div className="admin-contact-actions"><a className="btn btn-outline" href={`mailto:${booking.traveler_email}?subject=${encodeURIComponent(`AlSafar booking ${reference}`)}`}><Mail size={16}/>Email</a><a className="btn btn-outline" href={`tel:${booking.phone}`}><Phone size={16}/>Call</a></div></section>

        <section className="admin-panel"><div className="admin-panel-head"><div><h2><FileText size={21}/>Document review</h2><p>Numbers stay masked on screen. Downloads are restricted to authenticated administrators.</p></div></div>
          {!booking.document_id && <div className="admin-empty">No document record was found for this booking.</div>}
          {booking.document_id && <div className="admin-document-list">{(["passport", "aadhaar", "pan"] as const).map((type) => {
            const status = booking[`${type}_status`] as DocumentStatus;
            const fileName = booking[`${type}_file_name`] as string;
            const number = booking[`${type}_number`] as string;
            return <article className="admin-document-card" key={type}><div className="admin-document-title"><span><FileText size={19}/></span><div><strong>{documentLabels[type]}</strong><small>{maskDocumentNumber(number)} · {fileName}</small></div><span className={`admin-badge ${status}`}>{status}</span></div><a className="btn btn-outline admin-download" href={`/admin/bookings/${id}/documents/${type}`}><Download size={15}/>Open securely</a><form action={reviewDocument} className="admin-document-form"><input type="hidden" name="bookingId" value={id}/><input type="hidden" name="documentType" value={type}/><label>Decision<select name="documentStatus" defaultValue={status}>{documentStatuses.map((value) => <option value={value} key={value}>{value[0].toUpperCase() + value.slice(1)}</option>)}</select></label><label>Review note<input name="reviewNotes" defaultValue={booking.review_notes || ""} placeholder="Optional reason or correction required"/></label><button className="btn btn-primary"><Save size={15}/>Save review</button></form></article>;
          })}</div>}
        </section>

        <section className="admin-panel"><div className="admin-panel-head"><div><h2><MessageSquareText size={21}/>Internal notes</h2><p>Visible only to administrators.</p></div></div><form action={addBookingNote} className="admin-note-form"><input type="hidden" name="bookingId" value={id}/><textarea name="note" required minLength={2} maxLength={4000} placeholder="Add a follow-up note, document issue, payment detail or traveler request…"/><button className="btn btn-primary">Add note</button></form><div className="admin-notes">{notes.map((note) => <article key={note.id}><p>{note.note}</p><small>{note.admin_name} · {note.created_at}</small></article>)}{!notes.length && <div className="admin-empty">No internal notes yet.</div>}</div></section>
      </div>

      <aside className="admin-detail-sidebar">
        <section className="admin-panel"><h2>Booking controls</h2><form action={updateBookingStatus} className="admin-control-form"><input type="hidden" name="bookingId" value={id}/><label>Status<select name="status" defaultValue={booking.status}>{bookingStatuses.map((value) => <option key={value} value={value}>{statusLabels[value]}</option>)}</select></label><button className="btn btn-primary"><Save size={15}/>Update status</button></form></section>

        <section className="admin-panel"><h2><UserRoundCheck size={20}/>Local guide</h2><form action={assignGuide} className="admin-control-form"><input type="hidden" name="bookingId" value={id}/><label>Assigned guide<select name="guideId" defaultValue={booking.guide_id || ""}><option value="">Not assigned</option>{guides.map((guide) => <option key={guide.id} value={guide.id}>{guide.name} · {guide.email}</option>)}</select></label><button className="btn btn-primary"><Save size={15}/>Save assignment</button></form></section>

        <section className="admin-panel"><h2><WalletCards size={20}/>Office payment</h2><div className={`admin-payment-state ${booking.payment_status}`}><span>{booking.payment_status === "received" ? <CheckCircle2/> : <WalletCards/>}</span><div><strong>{booking.payment_status === "received" ? "Payment received" : "Payment pending"}</strong><small>{booking.payment_received_at || "No office payment recorded"}</small></div></div><form action={updatePayment} className="admin-payment-actions"><input type="hidden" name="bookingId" value={id}/>{booking.payment_status === "received" ? <button className="btn btn-outline" name="paymentStatus" value="pending">Mark pending</button> : <button className="btn btn-primary" name="paymentStatus" value="received">Confirm payment received</button>}</form></section>

        <section className="admin-panel"><h2><CalendarDays size={20}/>Departure seats</h2><div className="admin-seat-summary"><strong>{seatsRemaining}</strong><span>seats remaining</span><small>{Number(capacity.booked_seats)} booked out of {Number(capacity.capacity)}</small></div><form action={updateDepartureCapacity} className="admin-control-form"><input type="hidden" name="bookingId" value={id}/><input type="hidden" name="packageId" value={booking.package_id}/><input type="hidden" name="travelDate" value={booking.travel_date}/><label>Maximum capacity<input name="capacity" type="number" min={1} max={1000} defaultValue={Number(capacity.capacity)} required/></label><button className="btn btn-primary"><Save size={15}/>Update capacity</button></form></section>

        <section className="admin-panel"><h2><ShieldCheck size={20}/>Activity history</h2><div className="admin-audit">{audit.map((entry, index) => <article key={`${entry.created_at}-${index}`}><span/><div><strong>{String(entry.action).replaceAll("_", " ")}</strong><p>{entry.details}</p><small>{entry.admin_name} · {entry.created_at}</small></div></article>)}{!audit.length && <div className="admin-empty">No changes recorded yet.</div>}</div></section>
      </aside>
    </div>
  </div>;
}
