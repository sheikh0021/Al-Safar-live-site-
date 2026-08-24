import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Clock3, Hotel, MapPin, ShieldCheck, Utensils } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { formatRupees, packages } from "@/lib/packages";

export default async function PackageDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = packages.find((item) => item.slug === slug);
  if (!pkg) notFound();

  return <><Header/><main className="package-detail">
    <section className={`package-detail-hero package-detail-${pkg.accent}`}>
      <div className="container package-detail-grid">
        <div><span className="package-tag">{pkg.tier} package</span><h1>{pkg.name}</h1>
          <p>{pkg.description} Every major arrangement is coordinated by the AlSafar pilgrimage team.</p>
          <div className="detail-price">{formatRupees(pkg.price)} <small>per traveler</small></div>
          <Link href={`/book/${pkg.slug}`} className="btn btn-light">Book this package <ArrowRight size={17}/></Link>
        </div>
        <aside className="detail-facts">
          <div><Clock3/><span><small>Journey duration</small><strong>{pkg.durationDays} days</strong></span></div>
          <div><Hotel/><span><small>Accommodation</small><strong>{pkg.hotel}</strong></span></div>
          <div><MapPin/><span><small>Distance</small><strong>{pkg.distance}</strong></span></div>
          <div><Utensils/><span><small>Meals</small><strong>{pkg.meals ? "Breakfast and dinner included" : "Available separately"}</strong></span></div>
        </aside>
      </div>
    </section>
    <section className="section"><div className="container detail-content">
      <div><span className="eyebrow">What is included</span><h2>A supported journey from start to finish</h2><p className="muted">Our care team reviews your documents, confirms availability, and contacts you before any office payment is collected.</p></div>
      <ul className="detail-inclusions"><li><Check/>Visa processing assistance</li><li><Check/>{pkg.hotel}</li><li><Check/>Airport and intercity transfers</li><li><Check/>Guided ziyarat arrangements</li><li><Check/>Local guide and pilgrim support</li><li><Check/>Pre-departure orientation</li></ul>
    </div></section>
    <section className="section section-soft"><div className="container detail-booking-note">
      <ShieldCheck size={42}/><div><h2>Ready to reserve your place?</h2><p className="muted">You will enter journey details, upload the required identity documents, and select pay in office.</p></div>
      <Link href={`/book/${pkg.slug}`} className="btn btn-primary">Book now <ArrowRight size={17}/></Link>
    </div></section>
  </main><Footer/></>;
}
