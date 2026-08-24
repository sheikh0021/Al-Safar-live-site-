import Link from "next/link";
import { Check, Clock3, Hotel, MapPin } from "lucide-react";
import { formatRupees } from "@/lib/packages";
import type { Package } from "@/lib/types";

export function PackageCard({ pkg }: { pkg: Package }) {
  return <article className={`package-card ${pkg.featured ? "featured" : ""}`}>
    <span className="package-tag">{pkg.featured ? "Most loved" : pkg.tier}</span>
    <h3>{pkg.name}</h3><p className="muted">{pkg.description}</p>
    <div className="price">{formatRupees(pkg.price)} <small>/ person</small></div>
    <ul className="features"><li><Clock3 size={16}/>{pkg.durationDays} peaceful days</li><li><Hotel size={16}/>{pkg.hotel}</li><li><MapPin size={16}/>{pkg.distance}</li>{pkg.meals && <li><Check size={16}/>Daily breakfast & dinner</li>}</ul>
    <Link href={`/packages/${pkg.slug}`} className={`btn ${pkg.featured ? "btn-light" : "btn-outline"}`}>View details</Link>
  </article>;
}
