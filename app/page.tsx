import Link from "next/link";
import { ArrowRight, BadgeCheck, Headphones, ShieldCheck, Star } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PackageCard } from "@/components/PackageCard";
import { packages } from "@/lib/packages";
import { PrayerTimes } from "@/components/PrayerTimes";
import { QiblaCompass } from "@/components/QiblaCompass";
import { DailyBlessing } from "@/components/DailyBlessing";
import { getTranslations } from "@/lib/i18n-server";

export default async function Home() {
  const {locale,t}=await getTranslations();
  return <><Header/><main>
    <section className="hero"><DailyBlessing locale={locale}/><div className="container hero-grid"><div>
      <span className="eyebrow"><Star size={14} fill="currentColor"/> {t("hero.eyebrow","Journeys made with intention")}</span>
      <h1>{t("hero.title1","Your sacred journey,")} <em>{t("hero.title2","beautifully planned.")}</em></h1>
      <p className="hero-copy">{t("hero.copy","From the first prayer to the final farewell, AlSafar takes care of every detail—so you can focus on what truly matters.")}</p>
      <div className="hero-actions"><Link href="#packages" className="btn btn-primary">{t("hero.explore","Explore packages")} <ArrowRight size={17}/></Link><Link href="#journey" className="btn btn-light">{t("nav.how","How it works")}</Link></div>
      <div className="trust"><span><ShieldCheck size={17}/>{t("hero.trusted","Trusted arrangements")}</span><span><Headphones size={17}/>{t("hero.care","24/7 pilgrim care")}</span></div>
    </div><div className="hero-art"><div className="arch"><div className="sun"/><div className="kaaba"/></div><div className="float-card"><span className="eyebrow"><BadgeCheck size={14}/>{t("hero.served","Pilgrims served")}</span><strong>12,000+</strong><span className="muted">{t("hero.lifetime","Journeys of a lifetime")}</span></div></div></div></section>
    <PrayerTimes locale={locale}/><QiblaCompass locale={locale}/>
    <section className="section" id="packages"><div className="container"><div className="section-head"><div><span className="eyebrow">{t("packages.find","Find your journey")}</span><h2>{t("packages.heading","Made for every pilgrim")}</h2></div><p>{t("packages.copy","Transparent pricing, carefully selected hotels, and people who understand the importance of your journey.")}</p></div><div className="package-grid">{packages.map(pkg=><PackageCard pkg={pkg} locale={locale} key={pkg.id}/>)}</div></div></section>
    <section className="section section-soft" id="journey"><div className="container"><div className="section-head"><div><span className="eyebrow">{t("journey.simple","Simple & supported")}</span><h2>{t("journey.heading","From intention to arrival")}</h2></div></div><div className="steps"><div><div className="step-number">01</div><h3>{t("journey.choose","Choose your package")}</h3><p className="muted">{t("journey.chooseCopy","Compare durations, stays and services to find the journey that feels right.")}</p></div><div><div className="step-number">02</div><h3>{t("journey.share","Share your details")}</h3><p className="muted">{t("journey.shareCopy","Reserve securely and let our pilgrimage team review your travel requirements.")}</p></div><div><div className="step-number">03</div><h3>{t("journey.travel","Travel with peace")}</h3><p className="muted">{t("journey.travelCopy","Your local guide and support team stay beside you at every important step.")}</p></div></div></div></section>
    <section className="section"><div className="container"><div className="cta"><div><span className="eyebrow" style={{color:"#d8b875"}}>Bismillah</span><h2>{t("journey.waiting","A beautiful journey is waiting for you.")}</h2><p>{t("journey.speak","Speak with our pilgrimage care team today.")}</p></div><Link href="/login" className="btn btn-light">{t("journey.plan","Plan my journey")} <ArrowRight size={17}/></Link></div></div></section>
  </main><Footer/></>;
}
