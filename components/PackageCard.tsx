import Link from "next/link";
import { Check, Clock3, Hotel, MapPin } from "lucide-react";
import { formatRupees } from "@/lib/packages";
import type { Package } from "@/lib/types";
import { packageTranslation, translate, type Locale } from "@/lib/i18n";

export function PackageCard({ pkg, locale="en" }: { pkg: Package; locale?: Locale }) {
  const t=(key:string,fallback:string)=>translate(locale,key,fallback);
  return <article className={`package-card ${pkg.featured ? "featured" : ""}`}>
    <span className="package-tag">{pkg.featured ? t("packages.loved","Most loved") : locale==="hi"?({Basic:"बेसिक",Standard:"स्टैंडर्ड",Premium:"प्रीमियम",Deluxe:"डीलक्स"}[pkg.tier]):pkg.tier}</span>
    <h3>{packageTranslation(locale,pkg.slug,"name",pkg.name)}</h3><p className="muted">{packageTranslation(locale,pkg.slug,"description",pkg.description)}</p>
    <div className="price">{formatRupees(pkg.price)} <small>/ {t("packages.person","person")}</small></div>
    <ul className="features"><li><Clock3 size={16}/>{pkg.durationDays} {t("packages.days","peaceful days")}</li><li><Hotel size={16}/>{packageTranslation(locale,pkg.slug,"hotel",pkg.hotel)}</li><li><MapPin size={16}/>{packageTranslation(locale,pkg.slug,"distance",pkg.distance)}</li>{pkg.meals && <li><Check size={16}/>{t("packages.meals","Daily breakfast & dinner")}</li>}</ul>
    <Link href={`/packages/${pkg.slug}`} className={`btn ${pkg.featured ? "btn-light" : "btn-outline"}`}>{t("packages.view","View details")}</Link>
  </article>;
}
