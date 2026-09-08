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

const topics = ["Compare packages", "Booking process", "Required documents", "Prayer & Qibla", "Talk to our team"];

function getAnswer(question: string) {
  const text = question.toLowerCase();
  if (/price|cost|package|basic|standard|premium|deluxe|compare/.test(text)) return "AlSafar offers Basic, Standard, Premium and Deluxe journeys. Prices begin at ₹85,000 per person. Open the Packages section to compare duration, hotel category, meals and distance from Haram.";
  if (/book|reserve|process|payment/.test(text)) return "Choose a package, sign in as a traveler, select your preferred departure date and traveler count, then submit the reservation request. No payment is taken on that form; our team contacts you to confirm the details.";
  if (/document|passport|visa|photo|vaccin/.test(text)) return "Travelers generally need a valid passport, recent photographs and the documents required for the current Saudi visa process. Requirements can change, so please contact the AlSafar team before submitting anything sensitive.";
  if (/prayer|qibla|namaz|salah/.test(text)) return "Use the Prayer Companion for location-based prayer times and the Qibla Finder for a bearing toward Makkah. Allow precise location for better results, and calibrate your phone compass away from metal or magnets.";
  if (/guide|local guide|group/.test(text)) return "Local guides can access their own dashboard for assigned groups and briefings. Traveler-specific guide assignments are shared after a booking is confirmed.";
  if (/cancel|refund/.test(text)) return "Cancellation and refund terms depend on the selected package, flight and visa stage. Please speak directly with our team before cancelling so they can review your particular booking.";
  if (/phone|email|human|team|call|contact|help|urgent/.test(text)) return "You can call +91 77718 42703 or email sheikhrehan2121@gmail.com. Our listed support hours are Monday–Saturday, 9am–7pm.";
  return "I can quickly help with packages, reservations, documents, prayer times, Qibla direction and contacting the AlSafar team. For personal booking decisions or urgent matters, please speak directly with our team.";
}

export function QuickHelp({locale="en"}:{locale?:Locale}) {
  const hindi=locale==="hi";
  const urdu=locale==="ur";
  const pick=(en:string,hi:string,ur:string)=>hindi?hi:urdu?ur:en;
  const shownTopics=hindi?["पैकेज की तुलना","बुकिंग प्रक्रिया","आवश्यक दस्तावेज़","नमाज़ और क़िबला","हमारी टीम से बात करें"]:urdu?["پیکیجز کا موازنہ","بکنگ کا طریقہ","ضروری دستاویزات","نماز اور قبلہ","ہماری ٹیم سے بات کریں"]:topics;
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ id: 1, from: "assistant", text: pick("Assalamu alaikum! How can I help with your AlSafar journey today?","अस्सलामु अलैकुम! आज आपकी अलसफ़र यात्रा में मैं कैसे मदद कर सकता हूँ?","السلام علیکم! آج میں آپ کے السفر سفر میں کیسے مدد کرسکتا ہوں؟") }]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }); }, [messages, open]);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const ask = (question: string) => {
    const clean = question.trim();
    if (!clean) return;
    const id = Date.now();
    const answer=hindi?"मैं पैकेज, बुकिंग, दस्तावेज़, नमाज़ के समय, क़िबला दिशा और अलसफ़र टीम से संपर्क में मदद कर सकता हूँ। व्यक्तिगत या अत्यावश्यक सहायता के लिए हमारी टीम को कॉल करें।":urdu?"میں پیکیجز، بکنگ، دستاویزات، نماز کے اوقات، قبلہ کی سمت اور السفر ٹیم سے رابطے میں مدد کرسکتا ہوں۔ ذاتی یا فوری مدد کے لیے ہماری ٹیم کو کال کریں۔":getAnswer(clean);
    setMessages((current) => [...current, { id, from: "user", text: clean }, { id: id + 1, from: "assistant", text: answer }]);
    setInput("");
  };

  const submit = (event: FormEvent) => { event.preventDefault(); ask(input); };

  return <div className="quick-help">
    {open && <section className="help-panel" role="dialog" aria-modal="false" aria-label="AlSafar quick help">
      <header className="help-header"><div className="help-bot"><Bot size={21}/></div><div><strong>{pick("AlSafar Quick Help","अलसफ़र त्वरित सहायता","السفر فوری مدد")}</strong><span>{pick("Instant pilgrimage guidance","तुरंत यात्रा मार्गदर्शन","فوری زیارتی رہنمائی")}</span></div><button onClick={() => setOpen(false)} aria-label="Close quick help"><X size={20}/></button></header>
      <div className="help-messages" ref={listRef} aria-live="polite">{messages.map((message) => <div className={`help-message ${message.from}`} key={message.id}>{message.text}</div>)}</div>
      <div className="help-topics">{shownTopics.map((topic) => <button key={topic} onClick={() => ask(topic)}>{topic}</button>)}</div>
      <form className="help-form" onSubmit={submit}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder={pick("Ask a quick question…","एक सवाल पूछें…","فوری سوال پوچھیں…")} aria-label="Ask a quick question" maxLength={300}/><button aria-label="Send question" disabled={!input.trim()}><Send size={18}/></button></form>
      <footer className="help-contact"><a href="tel:+917771842703"><Phone size={14}/>{pick("Call team","टीम को कॉल करें","ٹیم کو کال کریں")}</a><a href={WHATSAPP_CHAT_URL} target="_blank" rel="noopener noreferrer"><WhatsAppIcon/>{pick("WhatsApp","व्हाट्सऐप","واٹس ایپ")}</a><a href="mailto:sheikhrehan2121@gmail.com"><Mail size={14}/>{pick("Email","ईमेल","ای میل")}</a><span>{pick("Guidance only—verify important travel details.","केवल मार्गदर्शन—महत्वपूर्ण यात्रा विवरण की पुष्टि करें।","صرف رہنمائی—اہم سفری تفصیلات کی تصدیق کریں۔")}</span></footer>
    </section>}
    <a className="whatsapp-launcher" href={WHATSAPP_CHAT_URL} target="_blank" rel="noopener noreferrer" aria-label={pick("Chat on WhatsApp","व्हाट्सऐप पर बात करें","واٹس ایپ پر بات کریں")}>
      <WhatsAppIcon/><span>{pick("WhatsApp","व्हाट्सऐप","واٹس ایپ")}</span>
    </a>
    <button className="help-launcher" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-label={open ? "Close quick help" : "Open quick help"}>{open ? <X size={23}/> : <MessageCircle size={24}/>}<span>{open ? pick("Close","बंद करें","بند کریں") : pick("Quick Help","त्वरित सहायता","فوری مدد")}</span></button>
  </div>;
}
