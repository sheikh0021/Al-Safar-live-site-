"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalculationMethod, Coordinates, Madhab, PrayerTimes as AdhanPrayerTimes } from "adhan";
import { Clock3, LocateFixed, MapPin, MoonStar, Sunrise } from "lucide-react";
import type { Locale } from "@/lib/i18n";

type Prayer = { name: "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha"; time: Date };
type Location = { latitude: number; longitude: number; label: string };

const defaultLocation: Location = { latitude: 28.6139, longitude: 77.209, label: "New Delhi, India" };

function getPrayers(location: Location, date: Date): Prayer[] {
  const parameters = CalculationMethod.Karachi();
  parameters.madhab = Madhab.Hanafi;
  const times = new AdhanPrayerTimes(new Coordinates(location.latitude, location.longitude), date, parameters);
  return [
    { name: "Fajr", time: times.fajr }, { name: "Dhuhr", time: times.dhuhr },
    { name: "Asr", time: times.asr }, { name: "Maghrib", time: times.maghrib },
    { name: "Isha", time: times.isha },
  ];
}

const displayTime = (date: Date, locale:Locale) => new Intl.DateTimeFormat(locale==="hi"?"hi-IN":"en-IN", { hour: "numeric", minute: "2-digit" }).format(date);

export function PrayerTimes({locale="en"}:{locale?:Locale}) {
  const h=(en:string,hi:string)=>locale==="hi"?hi:en;
  const prayerName=(name:Prayer["name"])=>locale==="hi"?({Fajr:"फ़ज्र",Dhuhr:"ज़ुहर",Asr:"अस्र",Maghrib:"मग़रिब",Isha:"इशा"}[name]):name;
  const [location, setLocation] = useState<Location>(defaultLocation);
  const [usingFallback, setUsingFallback] = useState(true);
  const [locating, setLocating] = useState(false);
  // `null` is intentional: it gives the server and the browser the same first render.
  const [now, setNow] = useState<Date | null>(null);

  const requestLocation = useCallback(() => {
    if (!("geolocation" in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone.replaceAll("_", " ");
        setLocation({ latitude: coords.latitude, longitude: coords.longitude, label: timezone || h("Your current location","आपका वर्तमान स्थान") });
        setUsingFallback(false); setLocating(false);
      },
      () => { setUsingFallback(true); setLocating(false); },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 15 * 60 * 1000 }
    );
  }, [locale]);

  useEffect(() => {
    setNow(new Date());
    requestLocation();
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, [requestLocation]);

  const prayerData = useMemo(() => {
    if (!now) return null;
    const today = getPrayers(location, now);
    let next = today.find((prayer) => prayer.time.getTime() > now.getTime());
    if (!next) {
      const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);
      next = getPrayers(location, tomorrow)[0];
    }
    const remaining = Math.max(0, next.time.getTime() - now.getTime());
    const hours = Math.floor(remaining / 3_600_000);
    const minutes = Math.floor((remaining % 3_600_000) / 60_000);
    const seconds = Math.floor((remaining % 60_000) / 1000);
    return { prayers: today, nextPrayer: next, countdown: `${hours.toString().padStart(2,"0")}:${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}` };
  }, [location, now]);

  if (!now || !prayerData) {
    return <section className="prayer-section" id="prayer-times"><div className="container">
      <div className="prayer-shell prayer-loading" aria-label="Loading prayer times">
        <div className="prayer-intro"><span className="eyebrow" style={{color:"#e4c37e"}}><MoonStar size={15}/> {h("Prayer companion","नमाज़ सहायक")}</span><h2>{h("Pause. Pray. Continue with peace.","रुकें। नमाज़ पढ़ें। सुकून से आगे बढ़ें।")}</h2><p>{h("Preparing accurate prayer times for your location…","आपके स्थान के लिए सही नमाज़ के समय तैयार हो रहे हैं…")}</p></div>
        <div className="prayer-content"><div className="loading-line loading-line-short"/><div className="loading-card"/><div className="loading-prayers">{[1,2,3,4,5].map(item=><span key={item}/>)}</div></div>
      </div>
    </div></section>;
  }

  const { prayers, nextPrayer, countdown } = prayerData;

  return <section className="prayer-section" id="prayer-times"><div className="container">
    <div className="prayer-shell"><div className="prayer-intro">
      <span className="eyebrow" style={{color:"#e4c37e"}}><MoonStar size={15}/> {h("Prayer companion","नमाज़ सहायक")}</span>
      <h2>{h("Pause. Pray. Continue with peace.","रुकें। नमाज़ पढ़ें। सुकून से आगे बढ़ें।")}</h2>
      <p>{h("Prayer times are calculated for your coordinates using the Karachi method and Hanafi Asr calculation, commonly used across India.","नमाज़ के समय आपके स्थान के अनुसार कराची विधि और भारत में प्रचलित हनफ़ी अस्र गणना से निकाले जाते हैं।")}</p>
      <button className="location-button" onClick={requestLocation} disabled={locating}><LocateFixed size={16}/>{locating ? h("Finding your location…","आपका स्थान खोज रहे हैं…") : h("Refresh my location","मेरा स्थान अपडेट करें")}</button>
      {usingFallback && <small>{h("Location unavailable—showing New Delhi times for now.","स्थान उपलब्ध नहीं—अभी नई दिल्ली का समय दिखाया जा रहा है।")}</small>}
    </div><div className="prayer-content">
      <div className="prayer-location"><span><MapPin size={17}/>{locale==="hi"&&location.label==="New Delhi, India"?"नई दिल्ली, भारत":location.label}</span><span>{now.toLocaleDateString(locale==="hi"?"hi-IN":"en-IN",{weekday:"long",day:"numeric",month:"long"})}</span></div>
      <div className="next-prayer"><div><span>{h("Next prayer","अगली नमाज़")}</span><strong>{prayerName(nextPrayer.name)}</strong></div><div className="next-time"><strong>{displayTime(nextPrayer.time,locale)}</strong><span><Clock3 size={14}/>{h("in","में")} {countdown}</span></div></div>
      <div className="prayer-list">{prayers.map((prayer) => <div className={`prayer-item ${prayer.name === nextPrayer.name && prayer.time.getDate() === nextPrayer.time.getDate() ? "active" : ""}`} key={prayer.name}><span>{prayer.name === "Fajr" ? <Sunrise size={17}/> : <MoonStar size={17}/>} {prayerName(prayer.name)}</span><strong>{displayTime(prayer.time,locale)}</strong></div>)}</div>
      <p className="prayer-note">{h("Times are estimates and may differ slightly from your local mosque.","समय अनुमानित हैं और आपकी स्थानीय मस्जिद से थोड़ा अलग हो सकते हैं।")}</p>
    </div></div>
  </div></section>;
}
