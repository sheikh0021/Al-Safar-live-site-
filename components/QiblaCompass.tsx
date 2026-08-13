"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Compass, LocateFixed, LockKeyhole } from "lucide-react";
import { bearingToCardinal, calculateQiblaBearing } from "@/lib/qibla";

type CompassPermission = "idle" | "requesting" | "active" | "unsupported" | "denied";
type HeadingSource = "webkit" | "absolute" | "relative" | null;
type LocationResult = { latitude: number; longitude: number; accuracy: number };
type CompassEvent = DeviceOrientationEvent & { webkitCompassHeading?: number };
type OrientationConstructor = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };

const normalizeAngle = (angle: number) => (angle % 360 + 360) % 360;
const shortestAngle = (from: number, to: number) => ((to - from + 540) % 360) - 180;

export function QiblaCompass() {
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
    if (!("geolocation" in navigator)) { setLocationError("Location is not supported by this browser."); return; }
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
        setLocationError(error.code === 1 ? "Precise location was denied. Enable Precise Location in browser settings and try again." : "We could not determine your precise location. Move outdoors or near a window and try again.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
    locationTimer.current = window.setTimeout(() => {
      if (locationWatch.current !== null) { navigator.geolocation.clearWatch(locationWatch.current); locationWatch.current = null; }
      setLocating(false);
    }, 12000);
  }, [enableCompass]);

  return <section className="qibla-section" id="qibla"><div className="container"><div className="qibla-card">
    <div className="qibla-copy"><span className="eyebrow"><Compass size={15}/> Qibla finder</span><h2>Turn your heart toward the Kaaba.</h2><p>Allow precise location to calculate the Qibla bearing. On supported phones, the compass moves as you turn—hold the phone flat and rotate until the gold arrow points upward.</p>
      <button className="btn btn-primary" onClick={findQibla} disabled={locating}><LocateFixed size={17}/>{locating ? "Improving GPS accuracy…" : location ? "Refresh precise location" : "Find my Qibla direction"}</button>
      <span className="privacy-note"><LockKeyhole size={14}/>Your coordinates stay on this device and are never saved.</span>
      {locationError && <p className="qibla-error">{locationError}</p>}
    </div>
    <div className="qibla-result">
      <div className="compass-wrap" aria-label={bearing === null ? "Qibla compass awaiting location" : `Qibla direction ${Math.round(bearing)} degrees from true north`}>
        <div className={`compass-face ${isAligned ? "aligned" : ""}`}><span className="north">N</span><span className="east">E</span><span className="south">S</span><span className="west">W</span><div className="compass-ticks"/>
          <div className="qibla-needle" style={{transform:`translate(-50%, -50%) rotate(${arrowRotation}deg)`}}><span className="needle-tip"/><span className="needle-line"/><span className="needle-label">Qibla</span></div><div className="compass-pin"/>
        </div>
      </div>
      {bearing === null ? <div className="qibla-reading"><strong>Ready when you are</strong><span>Tap the button to use your location.</span></div> : <div className="qibla-reading"><strong>{bearing.toFixed(1)}° from true north</strong><span>Face {bearingToCardinal(bearing)} toward Makkah</span><small>GPS accuracy: approximately {Math.round(location!.accuracy)} m{locating ? " · improving…" : ""}</small></div>}
      {location && heading === null && permission === "active" && <p className="sensor-note">Waiting for compass data. Move your phone in a figure-eight to calibrate it.</p>}
      {location && headingSource === "relative" && <p className="sensor-note sensor-warning">This browser supplied only a relative orientation, so the moving arrow may not match true north. Follow the {bearing?.toFixed(1)}° true-north bearing with your phone’s trusted compass app.</p>}
      {isAligned && <p className="alignment-message"><CheckCircle2 size={16}/>You are facing the Qibla</p>}
      {location && permission === "unsupported" && <p className="sensor-note">Live compass is unavailable on this device. Use the degree bearing with a trusted compass.</p>}
      {location && permission === "denied" && <p className="sensor-note">Motion permission was denied. The calculated true-north bearing is still shown.</p>}
    </div>
  </div><p className="qibla-disclaimer">For best results, move away from magnets, metal objects and electronics. Verify with your local mosque when precision is important.</p></div></section>;
}
