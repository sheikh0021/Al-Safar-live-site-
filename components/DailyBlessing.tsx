"use client";

import { useEffect, useState } from "react";
import { localize, type Locale } from "@/lib/i18n";
import { getDailyPair, type DailyMessage } from "@/lib/daily-verses";

export function DailyBlessing({ locale = "en" }: { locale?: Locale }) {
  const h = (en: string, hi: string, ur: string) => localize(locale, en, hi, ur);
  const [pair, setPair] = useState(() => getDailyPair());
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setPair(getDailyPair());
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((current) => (current === 0 ? 1 : 0));
        setVisible(true);
      }, 380);
    }, 9000);
    return () => window.clearInterval(timer);
  }, []);

  const message: DailyMessage = pair[index];

  return (
    <div className="daily-blessing" role="region" aria-label={h("Today’s Quranic message", "आज का कुरआनी संदेश", "آج کا قرآنی پیغام")}>
      <div className="container daily-blessing-inner">
        <div className="blessing-figure" aria-hidden="true">
          <div className="blessing-halo" />
          <div className="blessing-stars">
            <span /><span /><span />
          </div>
          <div className="blessing-kaaba-wrap">
            <div className="blessing-crescent" />
            <div className="blessing-kaaba">
              <span className="blessing-kiswah" />
              <span className="blessing-door" />
            </div>
            <div className="blessing-floor" />
          </div>
        </div>

        <div className={`blessing-speech ${visible ? "is-visible" : ""}`}>
          <p className="blessing-kicker">{h("A word of light for today", "आज के लिए रोशनी का एक शब्द", "آج کے لیے روشنی کا ایک لفظ")}</p>
          <p className="blessing-greeting">{message.greeting[locale]}</p>
          <p className="blessing-arabic" lang="ar" dir="rtl">{message.arabic}</p>
          <p className="blessing-meaning">{message.meaning[locale]}</p>
          <div className="blessing-meta">
            <span>{message.ref}</span>
            <span>{h("Two gentle messages · changes each day", "दो नरम संदेश · हर दिन बदलते हैं", "دو نرم پیغام · ہر دن بدلتے ہیں")}</span>
          </div>
          <div className="blessing-dots" role="tablist" aria-label={h("Today’s messages", "आज के संदेश", "آج کے پیغامات")}>
            {pair.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-label={h(`Message ${i + 1}`, `संदेश ${i + 1}`, `پیغام ${i + 1}`)}
                aria-selected={index === i}
                className={index === i ? "active" : ""}
                onClick={() => { setVisible(true); setIndex(i); }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
