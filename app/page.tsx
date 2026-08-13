import Link from "next/link";
import { ArrowRight, BadgeCheck, Headphones, ShieldCheck, Star } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PackageCard } from "@/components/PackageCard";
import { packages } from "@/lib/packages";
import { PrayerTimes } from "@/components/PrayerTimes";
import { QiblaCompass } from "@/components/QiblaCompass";

export default function Home() {
  return <><Header/><main>
    <section className="hero"><div className="container hero-grid"><div>
      <span className="eyebrow"><Star size={14} fill="currentColor"/> Journeys made with intention</span>
      <h1>Your sacred journey, <em>beautifully</em> planned.</h1>
      <p className="hero-copy">From the first prayer to the final farewell, AlSafar takes care of every detail—so you can focus on what truly matters.</p>
      <div className="hero-actions"><Link href="#packages" className="btn btn-primary">Explore packages <ArrowRight size={17}/></Link><Link href="#journey" className="btn btn-light">How it works</Link></div>
      <div className="trust"><span><ShieldCheck size={17}/>Trusted arrangements</span><span><Headphones size={17}/>24/7 pilgrim care</span></div>
    </div><div className="hero-art"><div className="arch"><div className="sun"/><div className="kaaba"/></div><div className="float-card"><span className="eyebrow"><BadgeCheck size={14}/>Pilgrims served</span><strong>12,000+</strong><span className="muted">Journeys of a lifetime</span></div></div></div></section>
    <PrayerTimes/>
    <QiblaCompass/>
    <section className="section" id="packages"><div className="container"><div className="section-head"><div><span className="eyebrow">Find your journey</span><h2>Made for every pilgrim</h2></div><p>Transparent pricing, carefully selected hotels, and people who understand the importance of your journey.</p></div><div className="package-grid">{packages.map(pkg=><PackageCard pkg={pkg} key={pkg.id}/>)}</div></div></section>
    <section className="section section-soft" id="journey"><div className="container"><div className="section-head"><div><span className="eyebrow">Simple & supported</span><h2>From intention to arrival</h2></div></div><div className="steps"><div><div className="step-number">01</div><h3>Choose your package</h3><p className="muted">Compare durations, stays and services to find the journey that feels right.</p></div><div><div className="step-number">02</div><h3>Share your details</h3><p className="muted">Reserve securely and let our pilgrimage team review your travel requirements.</p></div><div><div className="step-number">03</div><h3>Travel with peace</h3><p className="muted">Your local guide and support team stay beside you at every important step.</p></div></div></div></section>
    <section className="section"><div className="container"><div className="cta"><div><span className="eyebrow" style={{color:"#d8b875"}}>Begin with Bismillah</span><h2>A beautiful journey is waiting for you.</h2><p>Speak with our pilgrimage care team today.</p></div><Link href="/login" className="btn btn-light">Plan my journey <ArrowRight size={17}/></Link></div></div></section>
  </main><Footer/></>;
}
