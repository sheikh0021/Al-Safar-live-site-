"use client";

import { useActionState, useState } from "react";
import { ArrowLeft, ArrowRight, Building2, Check, FileUp, ShieldCheck } from "lucide-react";
import { createBooking, type BookingState } from "@/app/book/[slug]/actions";
import { formatRupees } from "@/lib/packages";
import type { Package } from "@/lib/types";

const steps = ["Journey", "Documents", "Payment"];

export function BookingForm({ pkg }: { pkg: Package }) {
  const [count, setCount] = useState(1);
  const [step, setStep] = useState(1);
  const [state, action, pending] = useActionState(createBooking, {} as BookingState);
  function nextStep(form: HTMLFormElement) {
    const fields = step === 1 ? ["travelDate", "travelers", "phone"] : ["passportNumber", "passportFile", "aadhaarNumber", "aadhaarFile", "panNumber", "panFile"];
    const valid = fields.every((name) => (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null)?.reportValidity());
    if (valid) setStep((current) => Math.min(3, current + 1));
  }

  return <div className="booking-grid"><form action={action} className="panel booking-form">
    <span className="eyebrow">Book {pkg.name}</span><h1>Complete your booking</h1>
    <div className="booking-steps">{steps.map((label, index) => <div className={step >= index + 1 ? "active" : ""} key={label}><span>{step > index + 1 ? <Check size={15}/> : index + 1}</span><small>{label}</small></div>)}</div>
    {state.error && <p className="error" role="alert">{state.error}</p>}<input type="hidden" name="packageId" value={pkg.id}/>
    <section className={step === 1 ? "booking-stage active" : "booking-stage"}><h2>Your journey details</h2><p className="muted">Tell us when you would like to travel and how our team can reach you.</p>
      <label className="field">Preferred departure date<input type="date" name="travelDate" required/></label>
      <label className="field">Number of travelers<select name="travelers" value={count} onChange={(event) => setCount(Number(event.target.value))}>{[1,2,3,4,5,6].map((number) => <option key={number} value={number}>{number} {number === 1 ? "traveler" : "travelers"}</option>)}</select></label>
      <label className="field">Phone / WhatsApp number<input name="phone" type="tel" placeholder="+91 98765 43210" required minLength={8} maxLength={30}/></label>
      <button type="button" className="btn btn-primary booking-next" onClick={(event) => nextStep(event.currentTarget.form!)}>Continue to documents <ArrowRight size={17}/></button>
    </section>
    <section className={step === 2 ? "booking-stage active" : "booking-stage"}><h2>Identity documents</h2><p className="muted">Upload clear PDF, JPG, or PNG copies. Each file must be smaller than 2 MB.</p>
      <label className="field">Passport number<input name="passportNumber" placeholder="For example, A1234567" required minLength={6} maxLength={20} pattern="[A-Za-z0-9]+"/></label>
      <label className="field file-field"><span><FileUp size={18}/>Passport document</span><input name="passportFile" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" required/></label>
      <label className="field">Aadhaar number<input name="aadhaarNumber" inputMode="numeric" placeholder="12-digit Aadhaar number" required pattern="[0-9 ]{12,15}"/></label>
      <label className="field file-field"><span><FileUp size={18}/>Aadhaar card</span><input name="aadhaarFile" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" required/></label>
      <label className="field">PAN number<input name="panNumber" placeholder="ABCDE1234F" required pattern="[A-Za-z]{5}[0-9]{4}[A-Za-z]" maxLength={10}/></label>
      <label className="field file-field"><span><FileUp size={18}/>PAN card</span><input name="panFile" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" required/></label>
      <div className="booking-actions"><button type="button" className="btn btn-outline" onClick={() => setStep(1)}><ArrowLeft size={17}/>Back</button><button type="button" className="btn btn-primary" onClick={(event) => nextStep(event.currentTarget.form!)}>Continue to payment <ArrowRight size={17}/></button></div>
    </section>
    <section className={step === 3 ? "booking-stage active" : "booking-stage"}><h2>Payment method</h2><p className="muted">Online payment will be added later. For now, reserve your package and pay after our office confirms your documents.</p>
      <label className="payment-option"><input type="radio" name="paymentMethod" value="pay_in_office" defaultChecked required/><span className="payment-icon"><Building2/></span><span><strong>Pay in office</strong><small>Pay by cash at the AlSafar office after confirmation.</small></span><Check className="payment-check"/></label>
      <div className="secure-note"><ShieldCheck size={18}/><span>Your booking remains pending until our team reviews the documents and contacts you.</span></div>
      <div className="booking-actions"><button type="button" className="btn btn-outline" onClick={() => setStep(2)}><ArrowLeft size={17}/>Back</button><button type="submit" className="btn btn-primary" disabled={pending}>{pending ? "Creating booking…" : "Confirm booking"}<ArrowRight size={17}/></button></div>
    </section>
  </form><aside className="panel booking-summary"><span className="package-tag">{pkg.tier}</span><h2>{pkg.name}</h2><p className="muted">{pkg.description}</p><div className="summary-row"><span>Package</span><strong>{formatRupees(pkg.price)}</strong></div><div className="summary-row"><span>Travelers</span><strong>× {count}</strong></div><div className="summary-row"><span>Duration</span><strong>{pkg.durationDays} days</strong></div><div className="summary-row total"><span>Estimated total</span><strong>{formatRupees(pkg.price * count)}</strong></div><p className="muted">Payment due at the AlSafar office after document review and confirmation.</p></aside></div>;
}
