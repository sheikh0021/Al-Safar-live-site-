import type { Locale } from "@/lib/i18n";

export type HelpTopic =
  | "umrah"
  | "duas"
  | "packages"
  | "booking"
  | "documents"
  | "prayer"
  | "guide"
  | "cancel"
  | "contact"
  | "payment"
  | "account"
  | "whatsapp"
  | "language"
  | "dashboard"
  | "fallback";

type HelpAnswer = Record<Locale, string>;

const answers: Record<HelpTopic, HelpAnswer> = {
  umrah: {
    en: `What is Umrah?

Umrah is a voluntary pilgrimage to Makkah. Unlike Hajj, it can be performed at any time of the year (outside the main Hajj days for the full Hajj rites). It is a journey of worship: purify intention, enter ihram, honour the Kaaba, and seek Allah’s forgiveness and nearness.

How Umrah is performed — main steps:
1. Niyyah (intention) for Umrah, purely for Allah.
2. Enter Ihram at or before the Miqat (men: two white sheets; women: modest clothes without face-veil/gloves in ihram rulings as taught to you). Recite the Talbiyah.
3. Reach Masjid al-Haram, keep calm and respectful, and begin Tawaf: walk seven circuits around the Kaaba, starting from the Black Stone corner, with the Kaaba on your left.
4. After Tawaf, pray two rak‘ahs if possible (often near Maqam Ibrahim when space allows), and drink Zamzam with dua.
5. Perform Sa‘i: seven lengths between Safa and Marwah, starting at Safa.
6. End with Halq (shave) or Taqsir (trim) for men; women trim a small portion of hair as taught in their school of thought.
7. Your Umrah is complete. You may then leave ihram.

Difference from Hajj (simple):
• Umrah = shorter, any season (with visa/rules).
• Hajj = specific days of Dhul-Hijjah, more rites (Arafah, Muzdalifah, Mina, etc.).

Would you like Umrah duas next? Ask: “Umrah duas” or “दुआ उमराह” or “عمرہ کی دعائیں”.
For AlSafar travel packages after you understand the rites, ask “packages” or WhatsApp +91 77718 42703.

Note: Follow your local scholar or AlSafar guide for detailed fiqh; this is clear beginner guidance, not a fatwa.`,
    hi: `उमराह क्या है?

उमराह मक्का की एक नेक इबादत वाली यात्रा है। हज के विपरीत, इसे साल में अधिकतर समय किया जा सकता है (पूर्ण हज के विशेष दिनों/रीतियों से अलग)। नीयत शुद्ध रखें, इहराम बाँधें, काबा का सम्मान करें, और अल्लाह की मग़फ़िरत व क़ुर्बत माँगें।

उमराह कैसे किया जाता है — मुख्य कदम:
1. केवल अल्लाह के लिए उमराह की नीयत।
2. मीक़ात पर/पहले इहराम (पुरुष: दो सफ़ेद चादरें; महिलाएँ: सादा/शालीन कपड़े — अपने मज़हब की बताई हुई हिदायत के अनुसार)। तल्बिया पढ़ें।
3. मस्जिदुल हराम पहुँचकर तवाफ़: काबा के सात चक्कर, हजरे असवद की तरफ़ से शुरू, काबा बाईं ओर।
4. तवाफ़ के बाद अवसर हो तो दो रकअत (अक्सर मक़ामे इब्राहीम के पास जब जगह हो), ज़मज़म पीएँ और दुआ करें।
5. सई: सफ़ा से मरवा तक सात चक्कर/लंबाइयाँ, सफ़ा से शुरू।
6. अंत में हलक़ (मुंडन) या तक़सीर (बाल कटवाना) — पुरुष; महिलाएँ अपने मज़हब के अनुसार थोड़े बाल काटती हैं।
7. उमराह पूरा — फिर इहराम खोल सकते हैं।

हज से अंतर (सरल):
• उमराह = छोटा, अधिकतर मौसमों में (वीज़ा/नियमों के साथ)।
• हज = ज़ुल-हिज्जा के खास दिन, अधिक रीतियाँ (अराफ़ात, मुज़दलिफ़ा, मिना आदि)।

उमराह की दुआएँ चाहिए? पूछें: “Umrah duas” या “दुआ उमराह” या “عمرہ کی دعائیں”।
रीतियाँ समझने के बाद पैकेज पूछें: “packages” — या WhatsApp +91 77718 42703।

नोट: विस्तृत फ़िक़्ह के लिए अपने आलिम या अलसफ़र गाइड का पालन करें; यह शुरुआती मार्गदर्शन है, फ़तवा नहीं।`,
    ur: `عمرہ کیا ہے؟

عمرہ مکہ معظمہ کی ایک نفلی عبادت والی زیارت ہے۔ حج کے برعکس یہ سال کے زیادہ تر اوقات میں ادا کی جا سکتی ہے (مکمل حج کے مخصوص ایام/مناسک سے الگ)۔ نیت خالص رکھیں، احرام باندھیں، کعبہ کا احترام کریں، اور اللہ سے مغفرت و قرب مانگیں۔

عمرہ کیسے ادا ہوتا ہے — اہم قدم:
1. صرف اللہ کے لیے عمرہ کی نیت۔
2. میقات پر/پہلے احرام (مرد: دو سفید چادریں؛ خواتین: باحیاء لباس — اپنے مسلک کی ہدایت کے مطابق)۔ تلبیہ پڑھیں۔
3. مسجد الحرام پہنچ کر طواف: کعبہ کے سات چکر، حجرِ اسود کی طرف سے شروع، کعبہ بائیں جانب۔
4. طواف کے بعد موقع ہو تو دو رکعت (اکثر مقامِ ابراہیم کے قریب جب جگہ ہو)، زمزم پییں اور دعا کریں۔
5. سعی: صفا سے مروہ تک سات لمبائیاں، صفا سے شروع۔
6. آخر میں حلق (مونڈنا) یا تقصیر (بال کٹوانا) — مرد؛ خواتین اپنے مسلک کے مطابق تھوڑے بال کاٹتی ہیں۔
7. عمرہ مکمل — پھر احرام کھول سکتے ہیں۔

حج سے فرق (آسان):
• عمرہ = مختصر، زیادہ تر موسموں میں (ویزا/قواعد کے ساتھ)۔
• حج = ذوالحجہ کے خاص دن، زیادہ مناسک (عرفات، مزدلفہ، منا وغیرہ)۔

عمرہ کی دعائیں چاہییں؟ پوچھیں: “Umrah duas” یا “दुआ उमराह” یا “عمرہ کی دعائیں”۔
مناسک سمجھنے کے بعد پیکیج پوچھیں: “packages” — یا WhatsApp +91 77718 42703۔

نوٹ: تفصیلی فقہ کے لیے اپنے عالم یا السفر گائیڈ کی پیروی کریں؛ یہ ابتدائی رہنمائی ہے، فتویٰ نہیں۔`,
  },
  duas: {
    en: `Common duas and remembrances for Umrah (learn Arabic with meaning; follow your guide for exact wording):

1) Talbiyah (after ihram, often repeated on the way):
لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ
“Here I am, O Allah, here I am… You have no partner…”

2) At the start of Tawaf / near the Black Stone (intention in the heart is enough; many also say Bismillah, Allahu Akbar).

3) Between the Yemeni Corner and the Black Stone, many recite:
رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ
“Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.” (Qur’an 2:201)

4) On Safa and Marwah (often at the start of Sa‘i), the Prophet ﷺ would face the Kaaba, say Allahu Akbar, and make dua. You may ask for faith, forgiveness, family, and an accepted Umrah.

5) When drinking Zamzam — ask Allah for beneficial knowledge, provision, and healing, with a sincere heart.

6) After completing Umrah — thank Allah, seek forgiveness, and ask that He accept your pilgrimage.

Want the full “what is Umrah / how it is done” steps? Ask: “What is Umrah?”
For packages or booking help: ask “packages” / “booking”, or WhatsApp +91 77718 42703.

This is educational remembrance — verify preferred wordings with your scholar or group guide.`,
    hi: `उमराह की आम दुआएँ और अज़कार (अरबी के साथ अर्थ सीखें; सटीक पाठ के लिए गाइड/आलिम से पुष्टि करें):

1) तल्बिया (इहराम के बाद, रास्ते में दोहराई जाती है):
لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ
“ऐ अल्लाह, मैं हाज़िर हूँ… तेरा कोई शरीक नहीं…”

2) तवाफ़ की शुरुआत / हजरे असवद के पास — दिल की नीयत काफ़ी; बहुत से बिस्मिल्लाह, अल्लाहु अकबर भी कहते हैं।

3) रुक्न यमानी और हजरे असवद के बीच अक्सर:
رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ
“ऐ हमारे रब, हमें दुनिया में भलाई दे और आख़िरत में भलाई दे, और आग की सज़ा से बचा।” (कुरआन 2:201)

4) सफ़ा और मरवा पर (सई की शुरुआत पर) नबी ﷺ क़िबला रुख़ करके तकबीर और दुआ करते थे — ईमान, मग़फ़िरत, परिवार और क़ुबूलियत माँगें।

5) ज़मज़म पीते समय — इल्म, रिज़्क़ और शिफ़ा की दुआ दिल से करें।

6) उमराह पूरा होने के बाद — शुक्र, इस्तिग़फ़ार, और क़ुबूलियत की दुआ।

पूरा “उमराह क्या है / कैसे करें” चाहिए? पूछें: “What is Umrah?” या “उमराह क्या है?”
पैकेज/बुकिंग: “packages” / “booking” — या WhatsApp +91 77718 42703।

यह शिक्षा के लिए है — पसंदीदा अल्फ़ाज़ अपने आलिम या ग्रुप गाइड से मिलाएँ।`,
    ur: `عمرہ کی عام دعائیں اور اذکار (عربی کے ساتھ معنی سیکھیں؛ درست الفاظ کے لیے گائیڈ/عالم سے تصدیق کریں):

1) تلبیہ (احرام کے بعد، راستے میں دہرائی جاتی ہے):
لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ
“اے اللہ میں حاضر ہوں… تیرا کوئی شریک نہیں…”

2) طواف کی شروعات / حجرِ اسود کے پاس — دل کی نیت کافی؛ بہت سے بسم اللہ، اللہ اکبر بھی کہتے ہیں۔

3) رکن یمانی اور حجرِ اسود کے درمیان اکثر:
رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ
“اے ہمارے رب، ہمیں دنیا میں بھلائی دے اور آخرت میں بھلائی دے، اور آگ کے عذاب سے بچا۔” (قرآن 2:201)

4) صفا و مروہ پر (سعی کے آغاز پر) نبی ﷺ قبلہ رخ کر کے تکبیر اور دعا کرتے تھے — ایمان، مغفرت، خاندان اور قبولیت مانگیں۔

5) زمزم پیتے وقت — علم، رزق اور شفا کی دعا دل سے کریں۔

6) عمرہ مکمل ہونے کے بعد — شکر، استغفار، اور قبولیت کی دعا۔

پورا “عمرہ کیا ہے / کیسے کریں” چاہیے؟ پوچھیں: “What is Umrah?” یا “عمرہ کیا ہے؟”
پیکیج/بکنگ: “packages” / “booking” — یا WhatsApp +91 77718 42703۔

یہ تعلیم کے لیے ہے — پسندیدہ الفاظ اپنے عالم یا گروپ گائیڈ سے ملیں۔`,
  },
  packages: {
    en: `AlSafar currently offers 4 Umrah packages (prices are per person, INR):

1) Essential Umrah (Basic) — ₹85,000 · 10 days · 3-star stay · about 900m from Haram · meals separate
2) Serene Journey (Standard) — ₹1,20,000 · 14 days · 4-star stay · about 550m from Haram · breakfast & dinner included
3) Royal Pilgrimage (Premium) — ₹1,49,999 · 15 days · 5-star stay · about 250m from Haram · breakfast & dinner included
4) Signature AlSafar (Deluxe) — ₹2,19,999 · 18 days · Kaaba-view 5-star suite · steps from Haram · breakfast & dinner included

How to compare on the website:
1. Open the homepage and scroll to Packages, or tap Packages in the menu.
2. Read duration, hotel category, Haram distance and meals on each card.
3. Tap “View details” for inclusions (visa help, transfers, ziyarat, guide, orientation).
4. Choose the package that fits your budget and comfort, then tap “Book this package”.

Want to know what Umrah itself is (rites & meaning)? Ask “What is Umrah?”
Want duas? Ask “Umrah duas”.
For a personal recommendation, WhatsApp or call +91 77718 42703.`,
    hi: `अलसफ़र पर अभी 4 उमराह पैकेज हैं (कीमत प्रति व्यक्ति, ₹ में):

1) आवश्यक उमराह (बेसिक) — ₹85,000 · 10 दिन · 3-सितारा ठहराव · हरम से लगभग 900 मीटर · भोजन अलग
2) सुकून भरी यात्रा (स्टैंडर्ड) — ₹1,20,000 · 14 दिन · 4-सितारा · हरम से लगभग 550 मीटर · नाश्ता और रात का खाना शामिल
3) शाही तीर्थयात्रा (प्रीमियम) — ₹1,49,999 · 15 दिन · 5-सितारा · हरम से लगभग 250 मीटर · नाश्ता और रात का खाना शामिल
4) सिग्नेचर अलसफ़र (डीलक्स) — ₹2,19,999 · 18 दिन · काबा-दृश्य वाला 5-सितारा सुइट · हरम से कुछ कदम · नाश्ता और रात का खाना शामिल

वेबसाइट पर तुलना कैसे करें:
1. होमपेज पर Packages / पैकेज सेक्शन खोलें।
2. हर कार्ड पर अवधि, होटल श्रेणी, हरम से दूरी और भोजन देखें।
3. “विवरण देखें” पर टैप करें।
4. बजट के अनुसार चुनें, फिर “यह पैकेज बुक करें” दबाएँ।

उमराह क्या है (रीतियाँ)? पूछें “उमराह क्या है?”
दुआएँ? पूछें “दुआ उमराह”।
व्यक्तिगत सलाह: WhatsApp या कॉल +91 77718 42703।`,
    ur: `السفر پر اس وقت 4 عمرہ پیکیجز ہیں (قیمت فی فرد، روپے میں):

1) ضروری عمرہ (بیسک) — ₹85,000 · 10 دن · 3 ستارہ قیام · حرم سے تقریباً 900 میٹر · کھانا الگ
2) پُرسکون سفر (اسٹینڈرڈ) — ₹1,20,000 · 14 دن · 4 ستارہ · حرم سے تقریباً 550 میٹر · ناشتہ اور رات کا کھانا شامل
3) شاہانہ زیارت (پریمیم) — ₹1,49,999 · 15 دن · 5 ستارہ · حرم سے تقریباً 250 میٹر · ناشتہ اور رات کا کھانا شامل
4) سگنیچر السفر (ڈیلکس) — ₹2,19,999 · 18 دن · کعبہ کے نظارے والا 5 ستارہ سوئٹ · حرم سے چند قدم · ناشتہ اور رات کا کھانا شامل

ویب سائٹ پر موازنہ:
1. ہوم پیج پر Packages کھولیں۔
2. مدت، ہوٹل، حرم سے فاصلہ اور کھانا دیکھیں۔
3. “تفصیل دیکھیں” دبائیں۔
4. بجٹ کے مطابق چنیں، پھر بک کریں۔

عمرہ کیا ہے؟ پوچھیں “عمرہ کیا ہے؟”
دعائیں؟ پوچھیں “عمرہ کی دعائیں”۔
ذاتی مشورہ: WhatsApp یا کال +91 77718 42703۔`,
  },
  booking: {
    en: `How to book an AlSafar Umrah package — step by step:

1. Open Packages and choose the journey you want.
2. Tap “Book this package” / “Book now”.
3. If you are not signed in, create a Traveler account (or sign in with email/Google).
4. Enter preferred departure date, number of travelers (1–6), and your phone / WhatsApp number.
5. Upload clear copies of Passport, Aadhaar and PAN (PDF, JPG or PNG, under 2 MB each).
6. Select “Pay in office” and confirm the booking request.
7. You will get a booking reference. Status stays Pending until our team reviews documents and seats.
8. After review, we contact you to confirm details. Payment is collected at the AlSafar office — not on the website form.

Important: never pay anyone before an authorised AlSafar representative confirms your booking.
Need help mid-way? Call / WhatsApp +91 77718 42703 (Mon–Sat, 9am–7pm).`,
    hi: `अलसफ़र उमराह पैकेज कैसे बुक करें — कदम दर कदम:

1. Packages खोलें और अपनी यात्रा चुनें।
2. “यह पैकेज बुक करें” / “अभी बुक करें” दबाएँ।
3. साइन इन न हों तो यात्री खाता बनाएँ (ईमेल/Google से भी हो सकता है)।
4. पसंदीदा प्रस्थान तिथि, यात्रियों की संख्या (1–6) और फ़ोन/WhatsApp नंबर भरें।
5. पासपोर्ट, आधार और PAN की साफ़ कॉपी अपलोड करें (PDF/JPG/PNG, हर फ़ाइल 2 MB से कम)।
6. “कार्यालय में भुगतान” चुनें और बुकिंग अनुरोध की पुष्टि करें।
7. आपको बुकिंग संदर्भ मिलेगा। दस्तावेज़ और सीट की समीक्षा तक स्थिति Pending / लंबित रहती है।
8. समीक्षा के बाद टीम आपसे संपर्क करेगी। भुगतान अलसफ़र कार्यालय में लिया जाता है — वेबसाइट फ़ॉर्म पर नहीं।

ज़रूरी: अधिकृत अलसफ़र प्रतिनिधि की पुष्टि से पहले किसी को भुगतान न करें।
मदद चाहिए तो कॉल/WhatsApp: +91 77718 42703 (सोम–शनि, सुबह 9–शाम 7)।`,
    ur: `السفر عمرہ پیکیج کیسے بک کریں — قدم بہ قدم:

1. Packages کھولیں اور اپنا سفر منتخب کریں۔
2. “یہ پیکیج بک کریں” / “ابھی بک کریں” دبائیں۔
3. سائن اِن نہ ہوں تو زائر اکاؤنٹ بنائیں (ای میل/Google سے بھی ممکن)۔
4. پسندیدہ روانگی کی تاریخ، زائرین کی تعداد (1–6) اور فون/WhatsApp نمبر درج کریں۔
5. پاسپورٹ، آدھار اور PAN کی واضح کاپیاں اپ لوڈ کریں (PDF/JPG/PNG، ہر فائل 2 MB سے کم)۔
6. “دفتر میں ادائیگی” منتخب کریں اور بکنگ درخواست کی تصدیق کریں۔
7. آپ کو بکنگ حوالہ ملے گا۔ دستاویزات اور سیٹ کے جائزے تک حالت Pending / التوا میں رہتی ہے۔
8. جائزے کے بعد ٹیم رابطہ کرے گی۔ ادائیگی السفر دفتر میں لی جاتی ہے — ویب فارم پر نہیں۔

ضروری: مجاز السفر نمائندے کی تصدیق سے پہلے کسی کو ادائیگی نہ کریں۔
مدد کے لیے کال/WhatsApp: +91 77718 42703 (پیر–ہفتہ، صبح 9–شام 7)۔`,
  },
  documents: {
    en: `Documents needed for an AlSafar booking request:

Required on the website form:
1. Passport number + passport scan/photo (PDF, JPG or PNG, under 2 MB)
2. Aadhaar number (12 digits) + Aadhaar card file
3. PAN number + PAN card file

Also keep ready for the team / visa stage (may be asked later):
• Passport with enough validity for Saudi travel
• Recent passport-size photographs
• Any current Saudi visa / Nusuk related papers the process requires

Tips for a smooth review:
1. Upload clear, full-page scans — not cropped or dark photos.
2. Make sure names match across passport, Aadhaar and PAN.
3. After upload, wait for admin review.
4. Visa rules change — confirm latest requirements with our team before travel.

Questions? WhatsApp or call +91 77718 42703 with your booking reference.`,
    hi: `अलसफ़र बुकिंग अनुरोध के लिए आवश्यक दस्तावेज़:

वेबसाइट फ़ॉर्म पर ज़रूरी:
1. पासपोर्ट नंबर + पासपोर्ट स्कैन/फ़ोटो (PDF, JPG या PNG, 2 MB से कम)
2. आधार नंबर (12 अंक) + आधार कार्ड फ़ाइल
3. PAN नंबर + PAN कार्ड फ़ाइल

टीम / वीज़ा चरण के लिए तैयार रखें:
• पर्याप्त वैधता वाला पासपोर्ट
• हाल की पासपोर्ट-साइज़ तस्वीरें
• सऊदी वीज़ा / Nusuk संबंधी कागज़ात

सलाह: साफ़ स्कैन दें; नाम मिलान रखें; समीक्षा का इंतज़ार करें।
सवाल हों तो बुकिंग संदर्भ के साथ WhatsApp/कॉल: +91 77718 42703।`,
    ur: `السفر بکنگ درخواست کے لیے ضروری دستاویزات:

ویب فارم پر ضروری:
1. پاسپورٹ نمبر + پاسپورٹ اسکین/تصویر (PDF، JPG یا PNG، 2 MB سے کم)
2. آدھار نمبر (12 ہندسے) + آدھار کارڈ فائل
3. PAN نمبر + PAN کارڈ فائل

ٹیم / ویزا مرحلے کے لیے تیار رکھیں:
• کافی میعاد والا پاسپورٹ
• حالیہ پاسپورٹ سائز تصاویر
• سعودی ویزا / Nusuk کاغذات

مشورہ: صاف اسکین دیں؛ نام میل رکھیں؛ جائزے کا انتظار کریں۔
سوال ہوں تو بکنگ حوالے کے ساتھ WhatsApp/کال: +91 77718 42703۔`,
  },
  prayer: {
    en: `Prayer times and Qibla on AlSafar:

Prayer Companion (homepage):
1. Allow location (or refresh location).
2. Times are calculated on your device (Karachi method, Hanafi Asr — common in India).
3. See Fajr, Dhuhr, Asr, Maghrib, Isha and next-prayer countdown.
4. Fallback without permission: New Delhi. Verify with your local mosque when needed.

Qibla Finder:
1. Allow precise location.
2. On supported phones, hold flat and rotate until the gold arrow points up.
3. Coordinates stay on your device.

For Umrah meaning, steps and duas, ask “What is Umrah?” or “Umrah duas”.`,
    hi: `अलसफ़र पर नमाज़ के समय और क़िबला:

1. स्थान अनुमति दें — समय डिवाइस पर गणना होते हैं (कराची + हनफ़ी अस्र)।
2. फ़ज्र से इशा और अगली नमाज़ का काउंटडाउन देखें।
3. क़िबला के लिए सटीक स्थान दें; फ़ोन समतल घुमाएँ जब तक सोने का तीर ऊपर हो।

उमराह क्या है / दुआएँ? पूछें “उमराह क्या है?” या “दुआ उमराह”.`,
    ur: `السفر پر نماز کے اوقات اور قبلہ:

1. مقام کی اجازت دیں — اوقات ڈیوائس پر حساب ہوتے ہیں (کراچی + حنفی عصر)۔
2. فجر تا عشاء اور اگلی نماز کا کاؤنٹ ڈاؤن دیکھیں۔
3. قبلہ کے لیے درست مقام دیں؛ فون برابر گھمائیں جب تک سنہرا تیر اوپر ہو۔

عمرہ کیا ہے / دعائیں؟ پوچھیں “عمرہ کیا ہے؟” یا “عمرہ کی دعائیں”۔`,
  },
  guide: {
    en: `Local guides on AlSafar:

For travelers: after booking and confirmation, an admin may assign a registered local guide to your departure group. Guide details are shared after confirmation.

For guides: sign in with the Guide role and open the Guide dashboard for assigned groups.

Ask “What is Umrah?” for rites, or WhatsApp +91 77718 42703 with your booking reference.`,
    hi: `अलसफ़र पर स्थानीय गाइड: बुकिंग पुष्टि के बाद ग्रुप को गाइड सौंपा जा सकता है। गाइड “गाइड” भूमिका से डैशबोर्ड देखें।

उमराह रीतियाँ: “उमराह क्या है?” — या WhatsApp +91 77718 42703।`,
    ur: `السفر پر مقامی گائیڈ: بکنگ تصدیق کے بعد گروپ کو گائیڈ مل سکتا ہے۔ گائیڈ کردار سے ڈیش بورڈ دیکھیں۔

عمرہ کے مناسک: “عمرہ کیا ہے؟” — یا WhatsApp +91 77718 42703۔`,
  },
  cancel: {
    en: `Cancellation and refunds: there is no auto-cancel on the website. Terms depend on flights, visa and hotels. Contact AlSafar before cancelling with your booking reference. WhatsApp / call +91 77718 42703 · email sheikhrehan2121@gmail.com · Mon–Sat 9am–7pm.`,
    hi: `रद्दीकरण/रिफ़ंड: साइट पर स्वचालित रद्द नहीं। फ्लाइट, वीज़ा, होटल पर निर्भर। पहले टीम से बात करें। WhatsApp/कॉल +91 77718 42703।`,
    ur: `منسوخی/ریفنڈ: سائٹ پر خودکار منسوخ نہیں۔ فلائٹ، ویزا، ہوٹل پر منحصر۔ پہلے ٹیم سے بات کریں۔ WhatsApp/کال +91 77718 42703۔`,
  },
  contact: {
    en: `Talk to AlSafar: Phone/WhatsApp +91 77718 42703 · green WhatsApp button on this site · email sheikhrehan2121@gmail.com · Mon–Sat 9am–7pm. Send name, booking reference, preferred month, and traveler count.`,
    hi: `संपर्क: फ़ोन/WhatsApp +91 77718 42703 · हरा WhatsApp बटन · ईमेल sheikhrehan2121@gmail.com · सोम–शनि सुबह 9–शाम 7।`,
    ur: `رابطہ: فون/WhatsApp +91 77718 42703 · سبز WhatsApp بٹن · ای میل sheikhrehan2121@gmail.com · پیر–ہفتہ صبح 9–شام 7۔`,
  },
  payment: {
    en: `Payment: choose “Pay in office” on booking. No online UPI/card on the form yet. After document review and confirmation, pay only an authorised AlSafar representative. Never send money to unknown numbers. WhatsApp +91 77718 42703.`,
    hi: `भुगतान: “कार्यालय में भुगतान” चुनें। फ़ॉर्म पर अभी ऑनलाइन UPI/कार्ड नहीं। पुष्टि के बाद केवल अधिकृत प्रतिनिधि को भुगतान करें। WhatsApp +91 77718 42703।`,
    ur: `ادائیگی: “دفتر میں ادائیگی” منتخب کریں۔ فارم پر ابھی آن لائن UPI/کارڈ نہیں۔ تصدیق کے بعد صرف مجاز نمائندے کو ادائیگی کریں۔ WhatsApp +91 77718 42703۔`,
  },
  account: {
    en: `Account: Login/Signup → choose Traveler or Guide → email/password or Google. Traveler dashboard shows journey updates; Guide dashboard shows assigned groups. Admin signup is not public. Help: +91 77718 42703.`,
    hi: `खाता: Login/Signup → यात्री या गाइड → ईमेल/पासवर्ड या Google। मदद: +91 77718 42703।`,
    ur: `اکاؤنٹ: Login/Signup → زائر یا گائیڈ → ای میل/پاس ورڈ یا Google۔ مدد: +91 77718 42703۔`,
  },
  whatsapp: {
    en: `WhatsApp AlSafar: tap the green WhatsApp button, or open https://wa.me/917771842703, or message +91 77718 42703. Hours Mon–Sat 9am–7pm.`,
    hi: `WhatsApp: हरा बटन या https://wa.me/917771842703 या +91 77718 42703। समय सोम–शनि सुबह 9–शाम 7।`,
    ur: `WhatsApp: سبز بٹن یا https://wa.me/917771842703 یا +91 77718 42703۔ اوقات پیر–ہفتہ صبح 9–شام 7۔`,
  },
  language: {
    en: `Language: use English · हिन्दी · اردو in the top nav. Ask this bot in any of the three languages.`,
    hi: `भाषा: ऊपर English · हिन्दी · اردو चुनें। बॉट से तीनों भाषाओं में पूछ सकते हैं।`,
    ur: `زبان: اوپر English · हिन्दी · اردو چنیں۔ بوٹ سے تینوں زبانوں میں پوچھ سکتے ہیں۔`,
  },
  dashboard: {
    en: `Dashboard: after login open My dashboard for bookings and updates. Guides use the Guide dashboard. If missing, use the same email as booking, then call +91 77718 42703.`,
    hi: `डैशबोर्ड: लॉगिन के बाद मेरा डैशबोर्ड खोलें। न दिखे तो उसी ईमेल से जाँचें, फिर +91 77718 42703।`,
    ur: `ڈیش بورڈ: لاگ اِن کے بعد میرا ڈیش بورڈ کھولیں۔ نظر نہ آئے تو اُسی ای میل سے چیک کریں، پھر +91 77718 42703۔`,
  },
  fallback: {
    en: `Assalamu alaikum — ask me anything in English, Hindi or Urdu. I can explain with clear steps:

• What Umrah is and how it is done
• Umrah duas (Talbiyah and common remembrances)
• Packages & prices, booking, documents, payment
• Prayer times, Qibla, guides, WhatsApp / contact

Examples: “What is Umrah?”, “Umrah duas”, “How do I book?”, “आधार कैसे अपलोड करूँ?”

Personal or urgent help: WhatsApp / call +91 77718 42703.`,
    hi: `अस्सलामु अलैकुम — अंग्रेज़ी, हिंदी या उर्दू में कुछ भी पूछें:

• उमराह क्या है और कैसे किया जाता है
• उमराह की दुआएँ
• पैकेज, बुकिंग, दस्तावेज़, भुगतान
• नमाज़, क़िबला, गाइड, WhatsApp

उदाहरण: “उमराह क्या है?”, “दुआ उमराह”, “कैसे बुक करें?”

अत्यावश्यक: WhatsApp / कॉल +91 77718 42703।`,
    ur: `السلام علیکم — انگریزی، ہندی یا اردو میں کچھ بھی پوچھیں:

• عمرہ کیا ہے اور کیسے ادا ہوتا ہے
• عمرہ کی دعائیں
• پیکیجز، بکنگ، دستاویزات، ادائیگی
• نماز، قبلہ، گائیڈ، WhatsApp

مثال: “عمرہ کیا ہے؟”، “عمرہ کی دعائیں”، “کیسے بک کریں؟”

فوری مدد: WhatsApp / کال +91 77718 42703۔`,
  },
};

const topicPatterns: { topic: HelpTopic; patterns: RegExp[] }[] = [
  {
    topic: "duas",
    patterns: [
      /dua|duaa|du'a|talbiyah|talbiya|zikr|dhikr|supplication|prayer for umrah|umrah dua/,
      /दुआ|दुआएँ|दुआएं|तल्बिया|ज़िक्र|अज़कार|उमराह.*दुआ|दुआ.*उमराह/,
      /دعا|دعائیں|تلبیہ|ذکر|اذکار|عمرہ.*دعا|دعا.*عمرہ/,
    ],
  },
  {
    topic: "umrah",
    patterns: [
      /what is umrah|what's umrah|whats umrah|explain umrah|meaning of umrah|how (to |do |is )?umrah|umrah (rites|rituals|steps|performed|done)|perform umrah|ihram|tawaf|sa'?i|saee|halq|taqsir|miqat|zamzam|kaaba|kabah|hajj vs umrah|difference.*umrah|umrah.*mean/,
      /उमराह क्या|उमराह क्या है|उमरा क्या|हज और उमराह|इहराम|तवाफ़|तवाफ|सई|मीक़ात|मीकात|ज़मज़म|काबा|उमराह कैसे|कैसे.*उमराह|उमराह.*कैसे|रीति|مناسک/,
      /عمرہ کیا|عمرہ کیا ہے|حج اور عمرہ|احرام|طواف|سعی|میقات|زمزم|کعبہ|عمرہ کیسے|کیسے.*عمرہ|مناسک|طریقہ.*عمرہ/,
    ],
  },
  {
    topic: "packages",
    patterns: [
      /package|packages|price|prices|cost|tier|basic|standard|premium|deluxe|compare|essential umrah|serene|royal|signature|hotel|budget|cheap|expensive|kitna|kitne|alsafar package/,
      /पैकेज|कीमत|मूल्य|तुलना|बेसिक|स्टैंडर्ड|प्रीमियम|डीलक्स|होटल|सस्ता|महंगा|कितना|कितने|आवश्यक उमराह|सुकून|शाही|सिग्नेचर/,
      /پیکیج|قیمت|موازنہ|بیسک|اسٹینڈرڈ|پریمیم|ڈیلکس|ہوٹل|سستا|مہنگا|کتنا|ضروری عمرہ|پُرسکون|شاہانہ|سگنیچر/,
    ],
  },
  {
    topic: "booking",
    patterns: [
      /book|booking|reserve|reservation|process|how to book|apply|register trip|departure|travelers?|seat/,
      /बुक|बुकिंग|आरक्षित|प्रक्रिया|कैसे बुक|यात्रा कैसे|प्रस्थान|यात्री|सीट/,
      /بک|بکنگ|محفوظ|طریقہ بکنگ|کیسے بک|روانگی|زائر|سیٹ/,
    ],
  },
  {
    topic: "documents",
    patterns: [
      /document|passport|aadhaar|aadhar|pan\b|visa|photo|upload|scan|id proof|identity/,
      /दस्तावेज़|दस्तावेज|पासपोर्ट|आधार|पैन|वीज़ा|वीजा|फ़ोटो|अपलोड|स्कैन|पहचान/,
      /دستاویز|پاسپورٹ|آدھار|ویزا|تصویر|اپ لوڈ|اسکین|شناخت/,
    ],
  },
  {
    topic: "prayer",
    patterns: [
      /prayer time|namaz time|salah time|qibla|kibla|fajr|dhuhr|asr|maghrib|isha|compass|direction.*makkah|makkah.*direction/,
      /नमाज़.?समय|नमाज.?समय|क़िबला|किबला|फ़ज्र|ज़ुहर|अस्र|मग़रिब|इशा|दिशा.*मक्का/,
      /نماز.?وقت|قبلہ|فجر|ظہر|عصر|مغرب|عشاء|سمت.*مکہ/,
    ],
  },
  {
    topic: "guide",
    patterns: [
      /guide|muallim|mutawwif|local guide|group leader|escort/,
      /गाइड|मुअल्लिम|स्थानीय गाइड/,
      /گائیڈ|معلم|مقامی گائیڈ/,
    ],
  },
  {
    topic: "cancel",
    patterns: [
      /cancel|cancellation|refund|return money|postpone|reschedule/,
      /रद्द|रद्दीकरण|रिफ़ंड|रिफंड|पैसे वापस|स्थगित|तारीख बदल/,
      /منسوخ|منسوخی|ریفنڈ|پیسے واپس|ملتوی|تاریخ بدل/,
    ],
  },
  {
    topic: "whatsapp",
    patterns: [
      /whatsapp|wa\.me|chat on whatsapp|message on whatsapp/,
      /व्हाट्सऐप|व्हाट्सएप|व्हाट्स ऐप/,
      /واٹس ایپ|واٹسایپ/,
    ],
  },
  {
    topic: "payment",
    patterns: [
      /payment|pay in office|upi|cash|transfer money|fee|fees/,
      /भुगतान|पेमेंट|कार्यालय.*भुगतान|यूपीआई|नकद|शुल्क/,
      /ادائیگی|پیمنٹ|دفتر.*ادائیگی|نقد|فیس/,
    ],
  },
  {
    topic: "account",
    patterns: [
      /sign ?up|sign ?in|log ?in|log ?out|account|password|google login|create account/,
      /साइन अप|साइन इन|लॉग इन|लॉगआउट|खाता|पासवर्ड|खाता बना/,
      /سائن اپ|سائن اِن|لاگ اِن|لاگ آؤٹ|اکاؤنٹ|پاس ورڈ/,
    ],
  },
  {
    topic: "language",
    patterns: [
      /language|hindi|urdu|english|translate|translation/,
      /भाषा|हिंदी|हिन्दी|उर्दू|अंग्रेज़ी|अंग्रेजी/,
      /زبان|ہندی|اردو|انگریزی/,
    ],
  },
  {
    topic: "dashboard",
    patterns: [
      /dashboard|my journey|booking status|assignment|profile/,
      /डैशबोर्ड|मेरी यात्रा|बुकिंग स्थिति|प्रोफ़ाइल|प्रोफाइल/,
      /ڈیش بورڈ|میرا سفر|بکنگ کی حالت|پروفائل/,
    ],
  },
  {
    topic: "contact",
    patterns: [
      /contact|phone|call|email|team|human|urgent|support|talk to|speak to|office number|i('?m| am) lost|lost|stranded|emergency|sos/,
      /संपर्क|फ़ोन|फोन|कॉल|ईमेल|टीम|सहायता|कार्यालय|खो गए|खो गयी|खो गई|मैं खो|बिछड़|आपातकाल/,
      /رابطہ|فون|کال|ای میل|ٹیم|دفتر|گم|کھو|بچھڑ|ہنگامی/,
    ],
  },
];

function normalizeQuestion(question: string) {
  return question
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
    .replace(/[’']/g, "'");
}

function detectAnswerLocale(question: string, siteLocale: Locale): Locale {
  if (/[\u0900-\u097F]/.test(question)) return "hi";
  if (/[\u0600-\u06FF]/.test(question)) return "ur";
  if (/[a-z]/i.test(question) && !/[\u0900-\u097F\u0600-\u06FF]/.test(question)) return "en";
  return siteLocale;
}

export function detectHelpTopic(question: string): HelpTopic {
  const text = normalizeQuestion(question);
  let best: HelpTopic = "fallback";
  let bestScore = 0;

  // Definition / how-to questions about Umrah must win over package pricing.
  if (
    /(what('?s| is)?\s+umrah|explain umrah|meaning of umrah|how (to |do |is )?umrah|umrah (rites|rituals|steps|performed|done)|उमराह क्या|उमरा क्या|उमराह कैसे|कैसे.*उमराह|عمرہ کیا|عمرہ کیسے|کیسے.*عمرہ)/.test(text)
  ) {
    return "umrah";
  }
  if (/(dua|duaa|du'a|talbiyah|दुआ|تلبیہ|دعائ)/.test(text) && /(umrah|उमराह|उमरा|عمرہ|tawaf|ihram|sa'?i|तवाफ़|इहराم|طواف|احرام)/.test(text)) {
    return "duas";
  }
  if (/(dua|duaa|du'a|talbiyah|दुआ|دعائ|تلبیہ)/.test(text)) {
    return "duas";
  }
  // Bare "umrah" without package/price words → educational answer
  if (/(umrah|उमराह|उमरा|عمرہ)/.test(text) && !/(package|price|cost|compare|book|पैकेज|कीमत|بک|پیکیج|قیمت)/.test(text)) {
    return "umrah";
  }

  for (const { topic, patterns } of topicPatterns) {
    let score = 0;
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) score += Math.max(2, match[0].length);
    }
    if (topic === "umrah" && /(umrah|hajj|ihram|tawaf|उमराह|हज|عمرہ|حج)/.test(text)) score += 10;
    if (topic === "duas" && /(dua|दुआ|دعا)/.test(text)) score += 12;
    if (topic === "booking" && /(book|reserve|बुकिंग|बुक|بکنگ|بک)/.test(text)) score += 8;
    if (topic === "packages" && /(price|cost|compare|package|कीमत|तुलना|पैकेज|قیمت|موازنہ|پیکیج)/.test(text)) score += 6;
    if (topic === "documents" && /(passport|aadhaar|aadhar|pan|पासपोर्ट|आधार|پاسپورٹ|آدھار)/.test(text)) score += 8;
    if (topic === "prayer" && /(qibla|kibla|prayer time|namaz|क़िبला|नमाज़.?समय|قبلہ|نماز.?وقت)/.test(text)) score += 8;
    if (score > bestScore) {
      bestScore = score;
      best = topic;
    }
  }

  return bestScore > 0 ? best : "fallback";
}

export function getQuickHelpAnswer(question: string, siteLocale: Locale = "en"): string {
  const topic = detectHelpTopic(question);
  const locale = detectAnswerLocale(question, siteLocale);
  return answers[topic][locale];
}
