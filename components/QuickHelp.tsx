"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, Mail, MessageCircle, Phone, Send, X } from "lucide-react";
import type { Locale } from "@/lib/i18n";

export const WHATSAPP_CHAT_URL = "https://wa.me/917771842703";

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.02Zm-7.01 15.24h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23Zm4.51-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.76-1.84-.2-.48-.4-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.10-.23-.17-.48-.29Z"/>
    </svg>
  );
}

type Message = { id: number; from: "assistant" | "user"; text: string };
type Coords = { latitude: number; longitude: number };

const topics = ["I am lost", "Current prayer times", "What is Umrah?", "Umrah duas", "Compare packages"];

export function QuickHelp({ locale = "en" }: { locale?: Locale }) {
  const hindi = locale === "hi";
  const urdu = locale === "ur";
  const pick = (en: string, hi: string, ur: string) => (hindi ? hi : urdu ? ur : en);
  const shownTopics = hindi
    ? ["मैं खो गया हूँ", "अभी नमाज़ का समय", "उमराह क्या है?", "दुआ उमराह", "पैकेज की तुलना"]
    : urdu
      ? ["میں گم ہوگیا ہوں", "ابھی نماز کا وقت", "عمرہ کیا ہے؟", "عمرہ کی دعائیں", "پیکیجز کا موازنہ"]
      : topics;

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [aiReady, setAiReady] = useState(false);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [messages, setMessages] = useState<Message[]>([{
    id: 1,
    from: "assistant",
    text: pick(
      "Assalamu alaikum! I am your AlSafar help assistant. Ask anything — if you are lost, need prayer times, Umrah steps, duas, booking help, or want to leave a message for our team. English, Hindi or Urdu.",
      "अस्सलामु अलैकुम! मैं आपका अलसफ़र सहायता सहायक हूँ। कुछ भी पूछें — खो जाना, नमाज़ के समय, उमराह, दुआएँ, बुकिंग, या टीम के लिए संदेश। हिंदी, अंग्रेज़ी या उर्दू।",
      "السلام علیکم! میں آپ کا السفر مددگار اسسٹنٹ ہوں۔ کچھ بھی پوچھیں — گم ہونا، نماز کے اوقات، عمرہ، دعائیں، بکنگ، یا ٹیم کے لیے پیغام۔ اردو، انگریزی یا ہندی۔",
    ),
  }]);
  const listRef = useRef<HTMLDivElement>(null);
  const askingRef = useRef(false);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, pending]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    fetch("/api/help")
      .then((response) => response.json())
      .then((data) => setAiReady(Boolean(data?.ai)))
      .catch(() => setAiReady(false));
  }, []);

  useEffect(() => {
    if (!open || coords || !("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords: position }) => {
        setCoords({ latitude: position.latitude, longitude: position.longitude });
      },
      () => undefined,
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 },
    );
  }, [open, coords]);

  const ask = async (question: string) => {
    const clean = question.trim();
    if (!clean || askingRef.current) return;
    askingRef.current = true;
    setPending(true);
    const id = Date.now();
    const history = messages
      .filter((message) => message.id !== 1)
      .slice(-8)
      .map((message) => ({
        role: message.from === "assistant" ? "assistant" as const : "user" as const,
        content: message.text,
      }));

    setMessages((current) => [...current, { id, from: "user", text: clean }]);
    setInput("");

    try {
      const response = await fetch("/api/help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: clean,
          locale,
          history,
          latitude: coords?.latitude ?? null,
          longitude: coords?.longitude ?? null,
        }),
      });
      const data = await response.json();
      const answer = typeof data.answer === "string" && data.answer.trim()
        ? data.answer.trim()
        : pick(
          "I could not answer just now. Please call or WhatsApp +91 77718 42703.",
          "अभी जवाब नहीं दे पाया। कृपया कॉल या WhatsApp करें: +91 77718 42703।",
          "ابھی جواب نہیں دے سکا۔ براہِ کرم کال یا WhatsApp کریں: +91 77718 42703۔",
        );
      setMessages((current) => [...current, { id: id + 1, from: "assistant", text: answer }]);
    } catch {
      setMessages((current) => [...current, {
        id: id + 1,
        from: "assistant",
        text: pick(
          "Connection issue. For urgent help call / WhatsApp +91 77718 42703 or use the green WhatsApp button.",
          "कनेक्शन समस्या। अत्यावश्यक मदद के लिए कॉल/WhatsApp +91 77718 42703 या हरा WhatsApp बटन।",
          "کنکشن مسئلہ۔ فوری مدد کے لیے کال/WhatsApp +91 77718 42703 یا سبز WhatsApp بٹن۔",
        ),
      }]);
    } finally {
      setPending(false);
      askingRef.current = false;
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void ask(input);
  };

  return (
    <div className="quick-help">
      {open && (
        <section className="help-panel" role="dialog" aria-modal="false" aria-label="AlSafar quick help">
          <header className="help-header">
            <div className="help-bot"><Bot size={21} /></div>
            <div>
              <strong>{pick("AlSafar Assistant", "अलसफ़र सहायक", "السفر اسسٹنٹ")}</strong>
              <span>{aiReady
                ? pick("AI assistant · EN · HI · UR", "एआई सहायक · अंग्रेज़ी · हिंदी · उर्दू", "AI اسسٹنٹ · انگریزی · ہندی · اردو")
                : pick("Smart help · add GEMINI_API_KEY for full AI", "स्मार्ट मदद · पूर्ण एआई के लिए GEMINI_API_KEY जोड़ें", "سمارٹ مدد · مکمل AI کے لیے GEMINI_API_KEY شامل کریں")
              }</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close quick help"><X size={20} /></button>
          </header>
          <div className="help-messages" ref={listRef} aria-live="polite">
            {messages.map((message) => (
              <div className={`help-message ${message.from}`} key={message.id}>{message.text}</div>
            ))}
            {pending && (
              <div className="help-message assistant help-typing">
                {pick("Thinking…", "सोच रहा हूँ…", "سوچ رہا ہوں…")}
              </div>
            )}
          </div>
          <div className="help-topics">
            {shownTopics.map((topic) => (
              <button key={topic} type="button" disabled={pending} onClick={() => void ask(topic)}>{topic}</button>
            ))}
          </div>
          <form className="help-form" onSubmit={submit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={pick("Ask anything — lost, prayer times, Umrah…", "कुछ भी पूछें — खो जाना, नमाज़, उमराह…", "کچھ بھی پوچھیں — گم ہونا، نماز، عمرہ…")}
              aria-label="Ask a question"
              maxLength={800}
              disabled={pending}
            />
            <button aria-label="Send question" disabled={pending || !input.trim()}><Send size={18} /></button>
          </form>
          <footer className="help-contact">
            <a href="tel:+917771842703"><Phone size={14} />{pick("Call team", "टीम को कॉल करें", "ٹیم کو کال کریں")}</a>
            <a href={WHATSAPP_CHAT_URL} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />{pick("WhatsApp", "व्हाट्सऐप", "واٹس ایپ")}</a>
            <a href="mailto:sheikhrehan2121@gmail.com"><Mail size={14} />{pick("Email", "ईमेल", "ای میل")}</a>
            <span>{pick("Urgent? Call first. Guidance only for fiqh/travel details.", "अत्यावश्यक? पहले कॉल करें। फ़िक़्ह/यात्रा विवरण मार्गदर्शन मात्र।", "فوری؟ پہلے کال کریں۔ فقہ/سفری تفصیل صرف رہنمائی ہے۔")}</span>
          </footer>
        </section>
      )}
      <a
        className="whatsapp-launcher"
        href={WHATSAPP_CHAT_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={pick("Chat on WhatsApp", "व्हाट्सऐप पर बात करें", "واٹس ایپ پر بات کریں")}
      >
        <WhatsAppIcon /><span>{pick("WhatsApp", "व्हाट्सऐप", "واٹس ایپ")}</span>
      </a>
      <button
        className="help-launcher"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={open ? "Close quick help" : "Open quick help"}
      >
        {open ? <X size={23} /> : <MessageCircle size={24} />}
        <span>{open ? pick("Close", "बंद करें", "بند کریں") : pick("Quick Help", "त्वरित सहायता", "فوری مدد")}</span>
      </button>
    </div>
  );
}
