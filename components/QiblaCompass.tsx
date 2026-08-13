"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Compass, LocateFixed, LockKeyhole } from "lucide-react";
import { bearingToCardinal, calculateQiblaBearing } from "@/lib/qibla";

type CompassPermission = "idle" | "requesting" | "active" | "unsupported" | "denied";
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
  const smoothedHeading = useRef<number | null>(null);

  const bearing = useMemo(() => location ? calculateQiblaBearing(location.latitude, location.longitude) : null, [location]);
  const arrowRotation = bearing === null ? 0 : shortestAngle(heading ?? 0, bearing);
  const isAligned = bearing !== null && heading !== null && Math.abs(shortestAngle(heading, bearing)) <= 5;

  const handleOrientation = useCallback((event: Event) => {
    const orientation = event as CompassEvent;
    const screenAngle = window.screen.orientation?.angle ?? 0;
    const rawHeading = orientation.webkitCompassHeading ??
      (orientation.alpha === null ? null : normalizeAngle(360 - orientation.alpha + screenAngle));
    if (rawHeading === null) return;

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
    window.addEventListener("deviceorientation", handleOrientation);
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [handleOrientation, permission]);

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
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        smoothedHeading.current = null;
        setHeading(null);
        setLocation({ latitude: coords.latitude, longitude: coords.longitude, accuracy: coords.accuracy });
        void enableCompass();
      },
      (error) => setLocationError(error.code === 1 ? "Location permission was denied. Enable it in your browser settings and try again." : "We could not determine your location. Move near a window and try again."),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }, [enableCompass]);

  return <section className="qibla-section" id="qibla"><div className="container"><div className="qibla-card">
    <div className="qibla-copy"><span className="eyebrow"><Compass size={15}/> Qibla finder</span><h2>Turn your heart toward the Kaaba.</h2><p>Allow precise location to calculate the Qibla bearing. On supported phones, the compass moves as you turn—hold the phone flat and rotate until the gold arrow points upward.</p>
      <button className="btn btn-primary" onClick={findQibla}><LocateFixed size={17}/>{location ? "Refresh precise location" : "Find my Qibla direction"}</button>
      <span className="privacy-note"><LockKeyhole size={14}/>Your coordinates stay on this device and are never saved.</span>
      {locationError && <p className="qibla-error">{locationError}</p>}
    </div>
    <div className="qibla-result">
      <div className="compass-wrap" aria-label={bearing === null ? "Qibla compass awaiting location" : `Qibla direction ${Math.round(bearing)} degrees from true north`}>
        <div className={`compass-face ${isAligned ? "aligned" : ""}`}><span className="north">N</span><span className="east">E</span><span className="south">S</span><span className="west">W</span><div className="compass-ticks"/>
          <div className="qibla-needle" style={{transform:`translate(-50%, -50%) rotate(${arrowRotation}deg)`}}><span className="needle-tip"/><span className="needle-line"/><span className="needle-label">Qibla</span></div><div className="compass-pin"/>
        </div>
      </div>
      {bearing === null ? <div className="qibla-reading"><strong>Ready when you are</strong><span>Tap the button to use your location.</span></div> : <div className="qibla-reading"><strong>{Math.round(bearing)}° from true north</strong><span>Face {bearingToCardinal(bearing)} toward Makkah</span><small>Location accuracy: approximately {Math.round(location!.accuracy)} m</small></div>}
      {location && heading === null && permission === "active" && <p className="sensor-note">Waiting for compass data. Move your phone in a figure-eight to calibrate it.</p>}
      {isAligned && <p className="alignment-message"><CheckCircle2 size={16}/>You are facing the Qibla</p>}
      {location && permission === "unsupported" && <p className="sensor-note">Live compass is unavailable on this device. Use the degree bearing with a trusted compass.</p>}
      {location && permission === "denied" && <p className="sensor-note">Motion permission was denied. The calculated true-north bearing is still shown.</p>}
    </div>
  </div><p className="qibla-disclaimer">For best results, move away from magnets, metal objects and electronics. Verify with your local mosque when precision is important.</p></div></section>;
}
