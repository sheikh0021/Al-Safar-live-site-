"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Compass, LocateFixed, LockKeyhole } from "lucide-react";
import { bearingToCardinal, calculateQiblaBearing } from "@/lib/qibla";
import { localize,type Locale } from "@/lib/i18n";

type CompassPermission = "idle" | "requesting" | "active" | "unsupported" | "denied";
type HeadingSource = "webkit" | "absolute" | "relative" | null;
type LocationResult = { latitude: number; longitude: number; accuracy: number };
type CompassEvent = DeviceOrientationEvent & { webkitCompassHeading?: number };
type OrientationConstructor = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };

const normalizeAngle = (angle: number) => (angle % 360 + 360) % 360;
const shortestAngle = (from: number, to: number) => ((to - from + 540) % 360) - 180;

export function QiblaCompass({locale="en"}:{locale?:Locale}) {
  const h=(en:string,hi:string,ur:string=en)=>localize(locale,en,hi,ur);
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [permission, setPermission] = useState<CompassPermission>("idle");
  const [locationError, setLocationError] = useState("");
  const [locating, setLocating] = useState(false);
  const [headingSource, setHeadingSource] = useState<HeadingSource>(null);
  const smoothedHeading = useRef<number | null>(null);
  const activeHeadingSource = useRef<HeadingSource>(null);
  const sensorStartedAt = useRef(0);
  const locationWatch = useRef<number | null>(null);
  const locationTimer = useRef<number | null>(null);

  const bearing = useMemo(() => location ? calculateQiblaBearing(location.latitude, location.longitude) : null, [location]);
  const arrowRotation = bearing === null ? 0 : shortestAngle(heading ?? 0, bearing);
  const isAligned = bearing !== null && heading !== null && headingSource !== "relative" && Math.abs(shortestAngle(heading, bearing)) <= 5;

  const handleOrientation = useCallback((event: Event) => {
    const orientation = event as CompassEvent;
    const isWebKitCompass = typeof orientation.webkitCompassHeading === "number";
    const isAbsoluteCompass = event.type === "deviceorientationabsolute" || orientation.absolute === true;
    const source: Exclude<HeadingSource, null> = isWebKitCompass ? "webkit" : isAbsoluteCompass ? "absolute" : "relative";

    // Ignore relative-alpha readings while waiting for an earth-referenced event.
    if (source === "relative" && (Date.now() - sensorStartedAt.current < 2000 || activeHeadingSource.current === "absolute" || activeHeadingSource.current === "webkit")) return;
    if (source === "absolute" && activeHeadingSource.current === "webkit") return;

    const rawHeading = isWebKitCompass ? orientation.webkitCompassHeading! :
      (orientation.alpha === null ? null : normalizeAngle(360 - orientation.alpha));
    if (rawHeading === null) return;

    if (activeHeadingSource.current !== source && source !== "relative") smoothedHeading.current = null;
    activeHeadingSource.current = source;
    setHeadingSource(source);

    if (smoothedHeading.current === null) {
      smoothedHeading.current = rawHeading;
    } else {
      const change = shortestAngle(smoothedHeading.current, rawHeading);
      // Ignore sub-degree sensor noise and ease larger changes around the 0°/360° boundary.
      if (Math.abs(change) >= 0.8) smoothedHeading.current = normalizeAngle(smoothedHeading.current + change * 0.16);
    }
    setHeading(smoothedHeading.current);
  }, []);

  useEffect(() => {
    if (permission !== "active") return;
    sensorStartedAt.current = Date.now();
    window.addEventListener("deviceorientationabsolute", handleOrientation);
    window.addEventListener("deviceorientation", handleOrientation);
    return () => {
      window.removeEventListener("deviceorientationabsolute", handleOrientation);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [handleOrientation, permission]);

  useEffect(() => () => {
    if (locationWatch.current !== null) navigator.geolocation.clearWatch(locationWatch.current);
    if (locationTimer.current !== null) window.clearTimeout(locationTimer.current);
  }, []);

  const enableCompass = useCallback(async () => {
    if (!("DeviceOrientationEvent" in window)) { setPermission("unsupported"); return; }
    setPermission("requesting");
    try {
      const Orientation = window.DeviceOrientationEvent as OrientationConstructor;
      if (typeof Orientation.requestPermission === "function") {
        const result = await Orientation.requestPermission();
        if (result !== "granted") { setPermission("denied"); return; }
      }
      setPermission("active");
    } catch { setPermission("denied"); }
  }, []);

  const findQibla = useCallback(() => {
    setLocationError("");
    if (!("geolocation" in navigator)) { setLocationError(h("Location is not supported by this browser.","यह ब्राउज़र स्थान सुविधा का समर्थन नहीं करता।")); return; }
    setLocating(true);
    smoothedHeading.current = null; activeHeadingSource.current = null;
    setHeading(null); setHeadingSource(null);
    void enableCompass();
    if (locationWatch.current !== null) navigator.geolocation.clearWatch(locationWatch.current);
    if (locationTimer.current !== null) window.clearTimeout(locationTimer.current);

    let bestAccuracy = Number.POSITIVE_INFINITY;
    locationWatch.current = navigator.geolocation.watchPosition(
      ({ coords }) => {
        if (coords.accuracy < bestAccuracy) {
          bestAccuracy = coords.accuracy;
          setLocation({ latitude: coords.latitude, longitude: coords.longitude, accuracy: coords.accuracy });
        }
        if (coords.accuracy <= 25 && locationWatch.current !== null) {
          navigator.geolocation.clearWatch(locationWatch.current); locationWatch.current = null; setLocating(false);
          if (locationTimer.current !== null) { window.clearTimeout(locationTimer.current); locationTimer.current = null; }
        }
      },
      (error) => {
        setLocating(false);
        if (bestAccuracy !== Number.POSITIVE_INFINITY) return;
        setLocationError(error.code === 1 ? h("Precise location was denied. Enable Precise Location in browser settings and try again.","सटीक स्थान की अनुमति नहीं मिली। ब्राउज़र सेटिंग में सटीक स्थान चालू करके फिर प्रयास करें।") : h("We could not determine your precise location. Move outdoors or near a window and try again.","आपका सटीक स्थान नहीं मिल सका। बाहर या खिड़की के पास जाकर फिर प्रयास करें।"));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
    locationTimer.current = window.setTimeout(() => {
      if (locationWatch.current !== null) { navigator.geolocation.clearWatch(locationWatch.current); locationWatch.current = null; }
      setLocating(false);
    }, 12000);
  }, [enableCompass,locale]);

  return <section className="qibla-section" id="qibla"><div className="container"><div className="qibla-card">
    <div className="qibla-copy"><span className="eyebrow"><Compass size={15}/> {h("Qibla finder","क़िबला खोजें","قبلہ تلاش کریں")}</span><h2>{h("Turn your heart toward the Kaaba.","अपना रुख़ काबा की ओर करें।","اپنا رخ کعبہ کی طرف کریں۔")}</h2><p>{h("Allow precise location to calculate the Qibla bearing. On supported phones, the compass moves as you turn—hold the phone flat and rotate until the gold arrow points upward.","क़िबला दिशा जानने के लिए सटीक स्थान की अनुमति दें। फ़ोन को समतल रखें और तब तक घुमाएँ जब तक सुनहरा तीर ऊपर न आए।","قبلہ کی سمت معلوم کرنے کے لیے درست مقام کی اجازت دیں۔ فون کو ہموار رکھیں اور اس وقت تک گھمائیں جب تک سنہری تیر اوپر نہ ہو۔")}</p>
      <button className="btn btn-primary" onClick={findQibla} disabled={locating}><LocateFixed size={17}/>{locating ? h("Improving GPS accuracy…","GPS सटीकता बेहतर हो रही है…","GPS کی درستگی بہتر ہو رہی ہے…") : location ? h("Refresh precise location","सटीक स्थान अपडेट करें","درست مقام تازہ کریں") : h("Find my Qibla direction","मेरी क़िबला दिशा खोजें","میرے قبلہ کی سمت تلاش کریں")}</button>
      <span className="privacy-note"><LockKeyhole size={14}/>{h("Your coordinates stay on this device and are never saved.","आपका स्थान इसी डिवाइस पर रहता है और कभी सहेजा नहीं जाता।","آپ کا مقام اسی ڈیوائس پر رہتا ہے اور کبھی محفوظ نہیں کیا جاتا۔")}</span>
      {locationError && <p className="qibla-error">{locationError}</p>}
    </div>
    <div className="qibla-result">
      <div className="compass-wrap" aria-label={bearing === null ? "Qibla compass awaiting location" : `Qibla direction ${Math.round(bearing)} degrees from true north`}>
        <div className={`compass-face ${isAligned ? "aligned" : ""}`}><span className="north">N</span><span className="east">E</span><span className="south">S</span><span className="west">W</span><div className="compass-ticks"/>
          <div className="qibla-needle" style={{transform:`translate(-50%, -50%) rotate(${arrowRotation}deg)`}}><span className="needle-tip"/><span className="needle-line"/><span className="needle-label">{h("Qibla","क़िबला")}</span></div><div className="compass-pin"/>
        </div>
      </div>
      {bearing === null ? <div className="qibla-reading"><strong>{h("Ready when you are","तैयार होने पर शुरू करें","تیار ہوں تو شروع کریں")}</strong><span>{h("Tap the button to use your location.","स्थान उपयोग करने के लिए बटन दबाएँ।","اپنا مقام استعمال کرنے کے لیے بٹن دبائیں۔")}</span></div> : <div className="qibla-reading"><strong>{bearing.toFixed(1)}° {h("from true north","सही उत्तर से","حقیقی شمال سے")}</strong><span>{h(`Face ${bearingToCardinal(bearing)} toward Makkah`,"मक्का की ओर इस दिशा में रुख़ करें","مکہ کی طرف اس سمت رخ کریں")}</span><small>{h("GPS accuracy: approximately","GPS सटीकता: लगभग","GPS درستگی: تقریباً")} {Math.round(location!.accuracy)} m{locating ? h(" · improving…"," · बेहतर हो रही है…"," · بہتر ہو رہی ہے…") : ""}</small></div>}
      {location && heading === null && permission === "active" && <p className="sensor-note">{h("Waiting for compass data. Move your phone in a figure-eight to calibrate it.","कम्पास डेटा की प्रतीक्षा है। कैलिब्रेट करने के लिए फ़ोन को आठ के आकार में घुमाएँ।")}</p>}
      {location && headingSource === "relative" && <p className="sensor-note sensor-warning">{h(`This browser supplied only a relative orientation, so the moving arrow may not match true north. Follow the ${bearing?.toFixed(1)}° true-north bearing with your phone’s trusted compass app.`,`इस ब्राउज़र ने केवल सापेक्ष दिशा दी है, इसलिए चलता तीर सही उत्तर से मेल नहीं खा सकता। अपने विश्वसनीय कम्पास ऐप में ${bearing?.toFixed(1)}° दिशा का पालन करें।`)}</p>}
      {isAligned && <p className="alignment-message"><CheckCircle2 size={16}/>{h("You are facing the Qibla","आप क़िबला की ओर हैं","آپ قبلہ رخ ہیں")}</p>}
      {location && permission === "unsupported" && <p className="sensor-note">{h("Live compass is unavailable on this device. Use the degree bearing with a trusted compass.","इस डिवाइस पर लाइव कम्पास उपलब्ध नहीं है। विश्वसनीय कम्पास में दिखाई गई डिग्री का उपयोग करें।")}</p>}
      {location && permission === "denied" && <p className="sensor-note">{h("Motion permission was denied. The calculated true-north bearing is still shown.","मोशन अनुमति नहीं मिली। गणना की गई सही-उत्तर दिशा फिर भी दिखाई जा रही है।")}</p>}
    </div>
  </div><p className="qibla-disclaimer">{h("For best results, move away from magnets, metal objects and electronics. Verify with your local mosque when precision is important.","बेहतर परिणाम के लिए चुंबक, धातु और इलेक्ट्रॉनिक वस्तुओं से दूर रहें। ज़रूरी होने पर स्थानीय मस्जिद से पुष्टि करें।","بہتر نتیجے کے لیے مقناطیس، دھات اور الیکٹرانک اشیاء سے دور رہیں۔ ضرورت ہو تو مقامی مسجد سے تصدیق کریں۔")}</p></div></section>;
}
