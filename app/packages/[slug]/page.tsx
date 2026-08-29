import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Clock3, Hotel, MapPin, ShieldCheck, Utensils } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { formatRupees, packages } from "@/lib/packages";
import { getTranslations } from "@/lib/i18n-server";
import { packageTier,packageTranslation } from "@/lib/i18n";

export default async function PackageDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = packages.find((item) => item.slug === slug);
  if (!pkg) notFound();
  const {locale,t}=await getTranslations();
  const name=packageTranslation(locale,pkg.slug,"name",pkg.name), description=packageTranslation(locale,pkg.slug,"description",pkg.description), hotel=packageTranslation(locale,pkg.slug,"hotel",pkg.hotel), distance=packageTranslation(locale,pkg.slug,"distance",pkg.distance);

  return <><Header/><main className="package-detail">
    <section className={`package-detail-hero package-detail-${pkg.accent}`}>
      <div className="container package-detail-grid">
        <div><span className="package-tag">{packageTier(locale,pkg.tier)} {t("detail.tier","package")}</span><h1>{name}</h1>
          <p>{description} {locale==="hi"?"हर प्रमुख व्यवस्था अलसफ़र तीर्थयात्रा टीम द्वारा समन्वित की जाती है।":locale==="ur"?"ہر اہم انتظام السفر کی زیارتی ٹیم مربوط کرتی ہے۔":"Every major arrangement is coordinated by the AlSafar pilgrimage team."}</p>
          <div className="detail-price">{formatRupees(pkg.price)} <small>{t("detail.per","per traveler")}</small></div>
          <Link href={`/book/${pkg.slug}`} className="btn btn-light">{t("detail.book","Book this package")} <ArrowRight size={17}/></Link>
        </div>
        <aside className="detail-facts">
          <div><Clock3/><span><small>{t("detail.duration","Journey duration")}</small><strong>{pkg.durationDays} {t("common.days","days")}</strong></span></div>
          <div><Hotel/><span><small>{t("detail.accommodation","Accommodation")}</small><strong>{hotel}</strong></span></div>
          <div><MapPin/><span><small>{t("detail.distance","Distance")}</small><strong>{distance}</strong></span></div>
          <div><Utensils/><span><small>{t("detail.meals","Meals")}</small><strong>{pkg.meals ? t("detail.mealsYes","Breakfast and dinner included") : t("detail.mealsNo","Available separately")}</strong></span></div>
        </aside>
      </div>
    </section>
    <section className="section"><div className="container detail-content">
      <div><span className="eyebrow">{t("detail.included","What is included")}</span><h2>{t("detail.supported","A supported journey from start to finish")}</h2><p className="muted">{t("detail.review","Our care team reviews your documents, confirms availability, and contacts you before any office payment is collected.")}</p></div>
      <ul className="detail-inclusions"><li><Check/>{t("detail.visa","Visa processing assistance")}</li><li><Check/>{hotel}</li><li><Check/>{t("detail.transfer","Airport and intercity transfers")}</li><li><Check/>{t("detail.ziyarat","Guided ziyarat arrangements")}</li><li><Check/>{t("detail.guide","Local guide and pilgrim support")}</li><li><Check/>{t("detail.orientation","Pre-departure orientation")}</li></ul>
    </div></section>
    <section className="section section-soft"><div className="container detail-booking-note">
      <ShieldCheck size={42}/><div><h2>{t("detail.ready","Ready to reserve your place?")}</h2><p className="muted">{t("detail.readyCopy","You will enter journey details, upload the required identity documents, and select pay in office.")}</p></div>
      <Link href={`/book/${pkg.slug}`} className="btn btn-primary">{t("detail.bookNow","Book now")} <ArrowRight size={17}/></Link>
    </div></section>
  </main><Footer/></>;
}
