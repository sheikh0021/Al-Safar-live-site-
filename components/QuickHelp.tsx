"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, Mail, MessageCircle, Phone, Send, X } from "lucide-react";
import type { Locale } from "@/lib/i18n";

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
  const shownTopics=hindi?["पैकेज की तुलना","बुकिंग प्रक्रिया","आवश्यक दस्तावेज़","नमाज़ और क़िबला","हमारी टीम से बात करें"]:topics;
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ id: 1, from: "assistant", text: hindi?"अस्सलामु अलैकुम! आज आपकी अलसफ़र यात्रा में मैं कैसे मदद कर सकता हूँ?":"Assalamu alaikum! How can I help with your AlSafar journey today?" }]);
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
    const answer=hindi?"मैं पैकेज, बुकिंग, दस्तावेज़, नमाज़ के समय, क़िबला दिशा और अलसफ़र टीम से संपर्क में मदद कर सकता हूँ। व्यक्तिगत या अत्यावश्यक सहायता के लिए हमारी टीम को कॉल करें।":getAnswer(clean);
    setMessages((current) => [...current, { id, from: "user", text: clean }, { id: id + 1, from: "assistant", text: answer }]);
    setInput("");
  };

  const submit = (event: FormEvent) => { event.preventDefault(); ask(input); };

  return <div className="quick-help">
    {open && <section className="help-panel" role="dialog" aria-modal="false" aria-label="AlSafar quick help">
      <header className="help-header"><div className="help-bot"><Bot size={21}/></div><div><strong>{hindi?"अलसफ़र त्वरित सहायता":"AlSafar Quick Help"}</strong><span>{hindi?"तुरंत यात्रा मार्गदर्शन":"Instant pilgrimage guidance"}</span></div><button onClick={() => setOpen(false)} aria-label="Close quick help"><X size={20}/></button></header>
      <div className="help-messages" ref={listRef} aria-live="polite">{messages.map((message) => <div className={`help-message ${message.from}`} key={message.id}>{message.text}</div>)}</div>
      <div className="help-topics">{shownTopics.map((topic) => <button key={topic} onClick={() => ask(topic)}>{topic}</button>)}</div>
      <form className="help-form" onSubmit={submit}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder={hindi?"एक सवाल पूछें…":"Ask a quick question…"} aria-label="Ask a quick question" maxLength={300}/><button aria-label="Send question" disabled={!input.trim()}><Send size={18}/></button></form>
      <footer className="help-contact"><a href="tel:+917771842703"><Phone size={14}/>{hindi?"टीम को कॉल करें":"Call team"}</a><a href="mailto:sheikhrehan2121@gmail.com"><Mail size={14}/>{hindi?"ईमेल":"Email"}</a><span>{hindi?"केवल मार्गदर्शन—महत्वपूर्ण यात्रा विवरण की पुष्टि करें।":"Guidance only—verify important travel details."}</span></footer>
    </section>}
    <button className="help-launcher" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-label={open ? "Close quick help" : "Open quick help"}>{open ? <X size={23}/> : <MessageCircle size={24}/>}<span>{open ? (hindi?"बंद करें":"Close") : (hindi?"त्वरित सहायता":"Quick Help")}</span></button>
  </div>;
}
