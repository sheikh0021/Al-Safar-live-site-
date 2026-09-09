import { CalculationMethod, Coordinates, Madhab, PrayerTimes as AdhanPrayerTimes } from "adhan";
import type { Locale } from "@/lib/i18n";
import { packages, formatRupees } from "@/lib/packages";
import { getQuickHelpAnswer, detectHelpTopic } from "@/lib/quick-help";

export type ChatTurn = { role: "user" | "assistant"; content: string };

export type HelpChatInput = {
  message: string;
  locale: Locale;
  history?: ChatTurn[];
  latitude?: number | null;
  longitude?: number | null;
};

const CONTACT = {
  phone: "+91 77718 42703",
  whatsapp: "https://wa.me/917771842703",
  email: "sheikhrehan2121@gmail.com",
  hours: "Monday–Saturday, 9am–7pm (India time)",
};

function formatTime(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "hi" ? "hi-IN" : locale === "ur" ? "ur-PK" : "en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function getPrayerTimesSnapshot(latitude: number, longitude: number, locale: Locale, label?: string) {
  const parameters = CalculationMethod.Karachi();
  parameters.madhab = Madhab.Hanafi;
  const now = new Date();
  const times = new AdhanPrayerTimes(new Coordinates(latitude, longitude), now, parameters);
  type PrayerSlot = { name: "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha"; time: Date };
  const prayers: PrayerSlot[] = [
    { name: "Fajr", time: times.fajr },
    { name: "Dhuhr", time: times.dhuhr },
    { name: "Asr", time: times.asr },
    { name: "Maghrib", time: times.maghrib },
    { name: "Isha", time: times.isha },
  ];

  let next: PrayerSlot = prayers[0];
  for (const prayer of prayers) {
    if (prayer.time > now) {
      next = prayer;
      break;
    }
  }
  if (prayers.every((prayer) => prayer.time <= now)) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextDay = new AdhanPrayerTimes(new Coordinates(latitude, longitude), tomorrow, parameters);
    next = { name: "Fajr", time: nextDay.fajr };
  }

  const place = label || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
  if (locale === "hi") {
    return `आज की नमाज़ के समय (${place}) — कराची विधि, हनफ़ी अस्र:\n` +
      prayers.map((p) => `• ${p.name}: ${formatTime(p.time, locale)}`).join("\n") +
      `\n\nअगली नमाज़: ${next.name} · ${formatTime(next.time, locale)}\n` +
      `ये अनुमान हैं — सटीकता के लिए स्थानीय मस्जिद से मिलाएँ।`;
  }
  if (locale === "ur") {
    return `آج کے نماز کے اوقات (${place}) — کراچی طریقہ، حنفی عصر:\n` +
      prayers.map((p) => `• ${p.name}: ${formatTime(p.time, locale)}`).join("\n") +
      `\n\nاگلی نماز: ${next.name} · ${formatTime(next.time, locale)}\n` +
      `یہ اندازے ہیں — درستگی کے لیے مقامی مسجد سے ملیں۔`;
  }
  return `Today’s prayer times (${place}) — Karachi method, Hanafi Asr:\n` +
    prayers.map((p) => `• ${p.name}: ${formatTime(p.time, locale)}`).join("\n") +
    `\n\nNext prayer: ${next.name} · ${formatTime(next.time, locale)}\n` +
    `These are estimates — verify with your local mosque when precision matters.`;
}

function packageCatalog() {
  return packages.map((pkg) =>
    `${pkg.name} (${pkg.tier}): ${formatRupees(pkg.price)} / person · ${pkg.durationDays} days · ${pkg.hotel} · ${pkg.distance} · meals: ${pkg.meals ? "breakfast & dinner included" : "separate"}`
  ).join("\n");
}

function emergencyAnswer(locale: Locale) {
  if (locale === "hi") {
    return `अस्सलामु अलैकुम — यदि आप खो गए हैं या ग्रुप से बिछड़ गए हैं, शांत रहें और ये कदम अपनाएँ:

1. तुरंत अलसफ़र टीम को कॉल करें: ${CONTACT.phone}
2. WhatsApp पर अपना स्थान भेजें: ${CONTACT.whatsapp}
   लिखें: “मैं खो गया/गई हूँ”, अपना नाम, होटल/पैकेज, और यदि संभव हो तो Google Maps लोकेशन शेयर करें।
3. अपने लोकल गाइड / ग्रुप लीडर को अभी कॉल या मैसेज करें (डैशबोर्ड या व्हाट्सऐप ग्रुप में नंबर देखें)।
4. पास की सुरक्षा/पुलिस या होटल रिसेप्शन से मदद माँगें; हरम के अंदर सुरक्षा कर्मचारी से बात करें।
5. एक ही जगह सुरक्षित ठहरें ताकि गाइड आपको ढूँढ सके — बेतरतीब घूमने से बचें।

आप यहीं संदेश भी छोड़ सकते हैं और टीम जवाब देगी। अत्यावश्यक होने पर पहले कॉल करें, केवल चैट पर निर्भर न रहें।
समय: ${CONTACT.hours} · ईमेल: ${CONTACT.email}`;
  }
  if (locale === "ur") {
    return `السلام علیکم — اگر آپ گم ہوگئے ہیں یا گروپ سے بچھڑ گئے ہیں، پرسکون رہیں اور یہ قدم اٹھائیں:

1. فوراً السفر ٹیم کو کال کریں: ${CONTACT.phone}
2. WhatsApp پر اپنا مقام بھیجیں: ${CONTACT.whatsapp}
   لکھیں: “میں گم ہوگیا/ہوگی ہوں”، اپنا نام، ہوٹل/پیکیج، اور ممکن ہو تو Google Maps لوکیشن شیئر کریں۔
3. اپنے مقامی گائیڈ / گروپ لیڈر کو ابھی کال یا میسج کریں (ڈیش بورڈ یا واٹس ایپ گروپ میں نمبر دیکھیں)۔
4. قریبی سیکیورٹی/پولیس یا ہوٹل ریسیپشن سے مدد مانگیں؛ حرم کے اندر سیکیورٹی سے بات کریں۔
5. ایک محفوظ جگہ ٹھہریں تاکہ گائیڈ آپ کو تلاش کر سکے — بے ترتیب نہ گھومیں۔

آپ یہاں بھی پیغام چھوڑ سکتے ہیں اور ٹیم جواب دے گی۔ فوری صورت میں پہلے کال کریں۔
اوقات: ${CONTACT.hours} · ای میل: ${CONTACT.email}`;
  }
  return `Assalamu alaikum — if you are lost or separated from your group, stay calm and do this now:

1. Call the AlSafar team immediately: ${CONTACT.phone}
2. WhatsApp your location: ${CONTACT.whatsapp}
   Write: “I am lost”, your name, hotel/package, and share your Google Maps pin if you can.
3. Call or message your local guide / group leader right away (number on your dashboard or WhatsApp group).
4. Ask nearby security/police or hotel reception for help; inside the Haram, speak to security staff.
5. Stay in one safe visible place so your guide can find you — avoid wandering.

You can also leave a message here and our team will reply. If it is urgent, call first — do not rely only on chat.
Hours: ${CONTACT.hours} · Email: ${CONTACT.email}`;
}

function isEmergency(text: string) {
  const q = text.toLowerCase();
  return /(i('?m| am) lost|we are lost|lost in|separated|can't find|cannot find|stranded|emergency|help me|sos|panic|گم|کھو|खो गए|खो गयी|खो गई|बिछड़|मैं खो|हम खो|مدد کرو|بچاؤ)/i.test(q);
}

function wantsPrayerTimes(text: string) {
  const q = text.toLowerCase();
  return /(prayer time|namaz time|salah time|current prayer|next prayer|what('?s| is) (the )?time for|नमाज़.?समय|नमाज.?समय|अगली नماز|نماز.?وقت|اگلی نماز)/i.test(q);
}

function buildSystemPrompt(locale: Locale) {
  return `You are AlSafar Assistant — a warm, practical pilgrimage help AI for AlSafar (Umrah travel from India), created under Sheikh Rehan.

Answer in ${locale === "hi" ? "Hindi (Devanagari)" : locale === "ur" ? "Urdu (Arabic script)" : "clear English"}. If the user writes in another of these three languages, answer in that language.

PRIORITIES:
1) Safety first. If the user is lost, scared, separated from group, injured, or in emergency: give calm numbered steps IMMEDIATELY — call ${CONTACT.phone}, WhatsApp ${CONTACT.whatsapp}, contact local guide, stay put, ask Haram/hotel security. Do NOT talk about packages.
2) Answer the exact question asked. Do not dump package prices unless they ask about packages/prices/booking.
3) Be specific with steps. Offer duas when discussing Umrah rites.
4) For current prayer times, use the get_prayer_times tool. If location is missing, still call the tool (it may use New Delhi fallback) and say so.
5) Never invent visa law, medical advice, or fake emergency numbers. For fiqh details, note they should follow their scholar/guide.
6) Keep answers helpful and not too long; use short paragraphs and numbered steps.
7) You may invite them to leave a message for the human team and always mention WhatsApp/call for urgent cases.

ALSafar FACTS:
- Phone/WhatsApp: ${CONTACT.phone} · ${CONTACT.whatsapp}
- Email: ${CONTACT.email}
- Hours: ${CONTACT.hours}
- Payment on site: pay in office after document review (no online UPI/card on the form yet)
- Booking needs traveler account + passport, Aadhaar, PAN uploads
- Packages:
${packageCatalog()}

Umrah (brief): voluntary pilgrimage — ihram, tawaf, sa'i, halq/taqsir. Hajj is on specific Dhul-Hijjah days with more rites.
Site tools: homepage Prayer Companion, Qibla Finder, daily Quranic message, EN/HI/UR language switcher.`;
}

type GeminiPart = { text?: string; functionCall?: { name: string; args?: Record<string, unknown> }; functionResponse?: { name: string; response: Record<string, unknown> } };
type GeminiContent = { role: "user" | "model"; parts: GeminiPart[] };

const prayerTool = {
  functionDeclarations: [
    {
      name: "get_prayer_times",
      description: "Get today’s Islamic prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha) and the next prayer for a location. Use Karachi method with Hanafi Asr.",
      parameters: {
        type: "OBJECT",
        properties: {
          latitude: { type: "NUMBER", description: "Latitude. If unknown, omit and New Delhi will be used." },
          longitude: { type: "NUMBER", description: "Longitude. If unknown, omit and New Delhi will be used." },
          label: { type: "STRING", description: "Optional place label" },
        },
      },
    },
  ],
};

async function callGemini(input: HelpChatInput, apiKey: string): Promise<string> {
  const history = (input.history || []).slice(-10);
  const contents: GeminiContent[] = [];
  for (const turn of history) {
    contents.push({
      role: turn.role === "assistant" ? "model" : "user",
      parts: [{ text: turn.content }],
    });
  }
  contents.push({ role: "user", parts: [{ text: input.message }] });

  const locationHint =
    typeof input.latitude === "number" && typeof input.longitude === "number"
      ? `User device coordinates available: ${input.latitude}, ${input.longitude}. Prefer these for prayer times.`
      : "User coordinates not provided; if prayer times are needed without coords, use New Delhi fallback.";

  const body = {
    systemInstruction: { parts: [{ text: `${buildSystemPrompt(input.locale)}\n\n${locationHint}` }] },
    contents,
    tools: [prayerTool],
    generationConfig: { temperature: 0.4, maxOutputTokens: 1200 },
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  let data = await geminiRequest(url, body);

  for (let round = 0; round < 3; round++) {
    const candidate = data?.candidates?.[0]?.content;
    const parts: GeminiPart[] = candidate?.parts || [];
    const functionCalls = parts.filter((part) => part.functionCall);
    if (!functionCalls.length) {
      const text = parts.map((part) => part.text || "").join("\n").trim();
      if (text) return text;
      break;
    }

    const responseParts: GeminiPart[] = [];
    for (const part of functionCalls) {
      const call = part.functionCall!;
      if (call.name === "get_prayer_times") {
        const lat = typeof call.args?.latitude === "number" ? call.args.latitude : input.latitude;
        const lng = typeof call.args?.longitude === "number" ? call.args.longitude : input.longitude;
        const usedLat = typeof lat === "number" ? lat : 28.6139;
        const usedLng = typeof lng === "number" ? lng : 77.209;
        const label = typeof call.args?.label === "string" ? call.args.label : typeof lat === "number" ? "your location" : "New Delhi, India (fallback)";
        const snapshot = getPrayerTimesSnapshot(usedLat, usedLng, input.locale, label);
        responseParts.push({ functionResponse: { name: "get_prayer_times", response: { result: snapshot } } });
      } else {
        responseParts.push({ functionResponse: { name: call.name, response: { error: "Unknown tool" } } });
      }
    }

    contents.push({ role: "model", parts });
    contents.push({ role: "user", parts: responseParts });
    data = await geminiRequest(url, { ...body, contents });
  }

  throw new Error("Empty AI response");
}

async function geminiRequest(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    const message = data?.error?.message || `Gemini error ${response.status}`;
    throw new Error(message);
  }
  return data;
}

function offlineAssistant(input: HelpChatInput): string {
  const locale = input.locale;
  const message = input.message.trim();

  if (isEmergency(message)) return emergencyAnswer(locale);

  if (wantsPrayerTimes(message)) {
    const lat = typeof input.latitude === "number" ? input.latitude : 28.6139;
    const lng = typeof input.longitude === "number" ? input.longitude : 77.209;
    const label = typeof input.latitude === "number" ? "your location" : "New Delhi, India (fallback — allow location for exact times)";
    return getPrayerTimesSnapshot(lat, lng, locale, label);
  }

  // Strong offline answers for known topics; avoid wrong package dumps for vague chat.
  const topic = detectHelpTopic(message);
  if (topic !== "fallback") return getQuickHelpAnswer(message, locale);

  if (locale === "hi") {
    return `मैं आपकी मदद के लिए यहाँ हूँ। आप मुझसे कुछ भी पूछ सकते हैं — जैसे “मैं खो गया हूँ”, “अभी नमाज़ का समय?”, “उमराह क्या है?”, “दुआएँ”, पैकेज या बुकिंग।\n\nअत्यावश्यक: कॉल/WhatsApp ${CONTACT.phone}\n${CONTACT.whatsapp}`;
  }
  if (locale === "ur") {
    return `میں آپ کی مدد کے لیے حاضر ہوں۔ کچھ بھی پوچھیں — جیسے “میں گم ہوگیا ہوں”، “ابھی نماز کا وقت؟”، “عمرہ کیا ہے؟”، دعائیں، پیکیج یا بکنگ۔\n\nفوری مدد: کال/WhatsApp ${CONTACT.phone}\n${CONTACT.whatsapp}`;
  }
  return `I am here to help with anything about your journey — including “I am lost”, current prayer times, what Umrah is, duas, packages, booking, documents and guides.\n\nUrgent: call / WhatsApp ${CONTACT.phone}\n${CONTACT.whatsapp}`;
}

export function hasHelpAiKey() {
  return Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY);
}

export async function answerHelpChat(input: HelpChatInput): Promise<{ answer: string; mode: "ai" | "offline" }> {
  const message = input.message.trim();
  if (!message) {
    return { answer: offlineAssistant({ ...input, message: "help" }), mode: "offline" };
  }

  // Always handle clear emergencies instantly, even when AI is on.
  if (isEmergency(message)) {
    return { answer: emergencyAnswer(input.locale), mode: hasHelpAiKey() ? "ai" : "offline" };
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    return { answer: offlineAssistant(input), mode: "offline" };
  }

  try {
    const answer = await callGemini(input, apiKey);
    return { answer, mode: "ai" };
  } catch {
    // If AI fails but user asked prayer times, still serve times.
    if (wantsPrayerTimes(message)) {
      return { answer: offlineAssistant(input), mode: "offline" };
    }
    return { answer: offlineAssistant(input), mode: "offline" };
  }
}
