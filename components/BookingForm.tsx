"use client";

import { useActionState, useState } from "react";
import { ArrowLeft, ArrowRight, Building2, Check, FileUp, ShieldCheck } from "lucide-react";
import { createBooking, type BookingState } from "@/app/book/[slug]/actions";
import { formatRupees } from "@/lib/packages";
import type { Package } from "@/lib/types";
import { packageTranslation, translate, type Locale } from "@/lib/i18n";

const steps = ["Journey", "Documents", "Payment"];

export function BookingForm({ pkg, locale="en" }: { pkg: Package;locale?:Locale }) {
  const t=(key:string,fallback:string)=>translate(locale,key,fallback);
  const name=packageTranslation(locale,pkg.slug,"name",pkg.name), description=packageTranslation(locale,pkg.slug,"description",pkg.description);
  const [count, setCount] = useState(1);
  const [step, setStep] = useState(1);
  const [state, action, pending] = useActionState(createBooking, {} as BookingState);
  function nextStep(form: HTMLFormElement) {
    const fields = step === 1 ? ["travelDate", "travelers", "phone"] : ["passportNumber", "passportFile", "aadhaarNumber", "aadhaarFile", "panNumber", "panFile"];
    const valid = fields.every((name) => (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null)?.reportValidity());
    if (valid) setStep((current) => Math.min(3, current + 1));
  }

  return <div className="booking-grid"><form action={action} className="panel booking-form">
    <span className="eyebrow">{t("booking.book","Book")} {name}</span><h1>{t("booking.complete","Complete your booking")}</h1>
    <div className="booking-steps">{steps.map((label, index) => <div className={step >= index + 1 ? "active" : ""} key={label}><span>{step > index + 1 ? <Check size={15}/> : index + 1}</span><small>{t(`booking.${["journey","documents","payment"][index]}`,label)}</small></div>)}</div>
    {state.error && <p className="error" role="alert">{state.error}</p>}<input type="hidden" name="packageId" value={pkg.id}/>
    <input type="hidden" name="locale" value={locale}/>
    <section className={step === 1 ? "booking-stage active" : "booking-stage"}><h2>{t("booking.details","Your journey details")}</h2><p className="muted">{t("booking.detailsCopy","Tell us when you would like to travel and how our team can reach you.")}</p>
      <label className="field">{t("booking.date","Preferred departure date")}<input type="date" name="travelDate" required/></label>
      <label className="field">{t("booking.travelers","Number of travelers")}<select name="travelers" value={count} onChange={(event) => setCount(Number(event.target.value))}>{[1,2,3,4,5,6].map((number) => <option key={number} value={number}>{number} {t("booking.traveler",number === 1 ? "traveler" : "travelers")}</option>)}</select></label>
      <label className="field">{t("booking.phone","Phone / WhatsApp number")}<input name="phone" type="tel" placeholder="+91 98765 43210" required minLength={8} maxLength={30}/></label>
      <button type="button" className="btn btn-primary booking-next" onClick={(event) => nextStep(event.currentTarget.form!)}>{t("booking.toDocuments","Continue to documents")} <ArrowRight size={17}/></button>
    </section>
    <section className={step === 2 ? "booking-stage active" : "booking-stage"}><h2>{t("booking.identity","Identity documents")}</h2><p className="muted">{t("booking.uploadCopy","Upload clear PDF, JPG, or PNG copies. Each file must be smaller than 2 MB.")}</p>
      <label className="field">{t("booking.passportNo","Passport number")}<input name="passportNumber" placeholder={locale==="hi"?"उदाहरण: A1234567":"For example, A1234567"} required minLength={6} maxLength={20} pattern="[A-Za-z0-9]+"/></label>
      <label className="field file-field"><span><FileUp size={18}/>{t("booking.passport","Passport document")}</span><input name="passportFile" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" required/></label>
      <label className="field">{t("booking.aadhaarNo","Aadhaar number")}<input name="aadhaarNumber" inputMode="numeric" placeholder={locale==="hi"?"12 अंकों का आधार नंबर":"12-digit Aadhaar number"} required pattern="[0-9 ]{12,15}"/></label>
      <label className="field file-field"><span><FileUp size={18}/>{t("booking.aadhaar","Aadhaar card")}</span><input name="aadhaarFile" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" required/></label>
      <label className="field">{t("booking.panNo","PAN number")}<input name="panNumber" placeholder="ABCDE1234F" required pattern="[A-Za-z]{5}[0-9]{4}[A-Za-z]" maxLength={10}/></label>
      <label className="field file-field"><span><FileUp size={18}/>{t("booking.pan","PAN card")}</span><input name="panFile" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" required/></label>
      <div className="booking-actions"><button type="button" className="btn btn-outline" onClick={() => setStep(1)}><ArrowLeft size={17}/>{t("common.back","Back")}</button><button type="button" className="btn btn-primary" onClick={(event) => nextStep(event.currentTarget.form!)}>{t("booking.toPayment","Continue to payment")} <ArrowRight size={17}/></button></div>
    </section>
    <section className={step === 3 ? "booking-stage active" : "booking-stage"}><h2>{t("booking.method","Payment method")}</h2><p className="muted">{t("booking.methodCopy","Online payment will be added later. For now, reserve your package and pay after our office confirms your documents.")}</p>
      <label className="payment-option"><input type="radio" name="paymentMethod" value="pay_in_office" defaultChecked required/><span className="payment-icon"><Building2/></span><span><strong>{t("booking.office","Pay in office")}</strong><small>{t("booking.officeCopy","Pay by cash at the AlSafar office after confirmation.")}</small></span><Check className="payment-check"/></label>
      <div className="secure-note"><ShieldCheck size={18}/><span>{t("booking.pendingNote","Your booking remains pending until our team reviews the documents and contacts you.")}</span></div>
      <div className="booking-actions"><button type="button" className="btn btn-outline" onClick={() => setStep(2)}><ArrowLeft size={17}/>{t("common.back","Back")}</button><button type="submit" className="btn btn-primary" disabled={pending}>{pending ? t("booking.creating","Creating booking…") : t("booking.confirm","Confirm booking")}<ArrowRight size={17}/></button></div>
    </section>
  </form><aside className="panel booking-summary"><span className="package-tag">{pkg.tier}</span><h2>{name}</h2><p className="muted">{description}</p><div className="summary-row"><span>{t("common.package","Package")}</span><strong>{formatRupees(pkg.price)}</strong></div><div className="summary-row"><span>{t("booking.travelers","Travelers")}</span><strong>× {count}</strong></div><div className="summary-row"><span>{t("booking.duration","Duration")}</span><strong>{pkg.durationDays} {t("common.days","days")}</strong></div><div className="summary-row total"><span>{t("booking.total","Estimated total")}</span><strong>{formatRupees(pkg.price * count)}</strong></div><p className="muted">{t("booking.due","Payment due at the AlSafar office after document review and confirmation.")}</p></aside></div>;
}
