import type { Locale } from "@/lib/i18n";

export type DailyMessage = {
  ref: string;
  arabic: string;
  greeting: Record<Locale, string>;
  meaning: Record<Locale, string>;
};

export type DailyPair = [DailyMessage, DailyMessage];

const m = (
  ref: string,
  arabic: string,
  greeting: Record<Locale, string>,
  meaning: Record<Locale, string>,
): DailyMessage => ({ ref, arabic, greeting, meaning });

export const dailyPairs: DailyPair[] = [
  [
    m(
      "Qur’an 94:5–6",
      "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      {
        en: "Peace be upon your heart today.",
        hi: "आज आपके दिल पर सलाम हो।",
        ur: "آج آپ کے دل پر سلام ہو۔",
      },
      {
        en: "With hardship comes ease — and with hardship comes ease again. Hold this promise close; relief is already walking toward you.",
        hi: "हर कठिनाई के साथ आसानी है — और फिर आसानी है। इस वादे को संभालें; राहत आपकी ओर आ रही है।",
        ur: "ہر تنگی کے ساتھ آسانی ہے — اور پھر آسانی ہے۔ اس وعدے کو سینے سے لگائیں؛ راحت آپ کی طرف آ رہی ہے۔",
      },
    ),
    m(
      "Qur’an 39:53",
      "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
      {
        en: "A gentle reminder for the weary.",
        hi: "थके हुए दिल के लिए एक नरम याद।",
        ur: "تھکے ہوئے دل کے لیے ایک نرم یاد۔",
      },
      {
        en: "Do not despair of the mercy of Allah. His compassion is wider than any worry you carry today.",
        hi: "अल्लाह की रहमत से निराश न हों। उनकी मेहरबानी आज की हर चिंता से विशाल है।",
        ur: "اللہ کی رحمت سے مایوس نہ ہوں۔ اُن کی مہربانی آج کی ہر فکر سے وسیع ہے۔",
      },
    ),
  ],
  [
    m(
      "Qur’an 13:28",
      "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
      {
        en: "May your heart find stillness.",
        hi: "आपका दिल सुकून पाए।",
        ur: "آپ کا دل سکون پائے۔",
      },
      {
        en: "Truly, in the remembrance of Allah do hearts find rest. A quiet moment of dhikr is enough to soften the day.",
        hi: "सचमुच अल्लाह की याद से दिलों को सुकून मिलता है। एक शांत ज़िक्र का पल दिन को नरम कर देता है।",
        ur: "یقیناً اللہ کی یاد سے دلوں کو اطمینان ملتا ہے۔ ذکر کا ایک خاموش لمحہ دن کو نرم کر دیتا ہے۔",
      },
    ),
    m(
      "Qur’an 2:152",
      "فَاذْكُرُونِي أَذْكُرْكُمْ",
      {
        en: "You are never unnoticed.",
        hi: "आप कभी अनदेखे नहीं हैं।",
        ur: "آپ کبھی اَن دیکھے نہیں ہیں۔",
      },
      {
        en: "Remember Me, and I will remember you. Every sincere remembrance is met with a remembrance more generous than your own.",
        hi: "मुझे याद करो, मैं तुम्हें याद रखूँगा। हर सच्ची याद का जवाब उससे भी बड़ी याद से मिलता है।",
        ur: "مجھے یاد کرو، میں تمہیں یاد رکھوں گا۔ ہر سچی یاد کا جواب اس سے بھی بڑی یاد سے ملتا ہے۔",
      },
    ),
  ],
  [
    m(
      "Qur’an 2:286",
      "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
      {
        en: "You are given only what you can carry.",
        hi: "आपको वही दिया जाता है जिसे आप उठा सकें।",
        ur: "آپ کو وہی دیا جاتا ہے جسے آپ اٹھا سکیں۔",
      },
      {
        en: "Allah does not burden a soul beyond what it can bear. Walk today with that mercy as your measure.",
        hi: "अल्लाह किसी जान पर उसकी क्षमता से अधिक बोझ नहीं डालते। आज इसी रहमत को अपना नाप बनाएँ।",
        ur: "اللہ کسی جان پر اس کی طاقت سے زیادہ بوجھ نہیں ڈالتے۔ آج اسی رحمت کو اپنا پیمانہ بنائیں۔",
      },
    ),
    m(
      "Qur’an 65:3",
      "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
      {
        en: "Trust is a place of rest.",
        hi: "भरोसा एक आराम की जगह है।",
        ur: "بھروسہ آرام کی جگہ ہے۔",
      },
      {
        en: "Whoever places their trust in Allah — He is sufficient for them. Let the unseen be handled by the One who already sees it.",
        hi: "जो अल्लाह पर भरोसा करता है, वही उसके लिए काफ़ी है। अनदेखे को उसी के हवाले करें जो उसे पहले से देखता है।",
        ur: "جو اللہ پر بھروسہ کرے، وہ اُس کے لیے کافی ہے۔ اَن دیکھے کو اُسی کے سپرد کریں جو اسے پہلے سے دیکھتا ہے۔",
      },
    ),
  ],
  [
    m(
      "Qur’an 2:153",
      "اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
      {
        en: "Help is near in two gifts.",
        hi: "मदद दो नेमतों में पास है।",
        ur: "مدد دو نعمتوں میں قریب ہے۔",
      },
      {
        en: "Seek help through patience and prayer. When the path feels heavy, these two lights will steady your steps.",
        hi: "सब्र और नमाज़ से मदद माँगें। जब रास्ता भारी लगे, ये दो रोशनियाँ आपके क़दम थाम लेंगी।",
        ur: "صبر اور نماز سے مدد مانگیں۔ جب راستہ بھاری لگے، یہ دو روشنیاں آپ کے قدم سنبھال لیں گی۔",
      },
    ),
    m(
      "Qur’an 14:7",
      "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
      {
        en: "Gratitude opens more doors.",
        hi: "शुक्र और दरवाज़े खोलता है।",
        ur: "شکر دروازے کھولتا ہے۔",
      },
      {
        en: "If you are grateful, I will surely increase you. Name one blessing slowly — increase often begins with noticing.",
        hi: "यदि तुम शुक्र करोगे, तो मैं तुम्हें और दूँगा। एक नेमत को धीरे नाम लें — बढ़ोतरी अक्सर देखने से शुरू होती है।",
        ur: "اگر تم شکر کرو گے تو میں تمہیں اور دوں گا۔ ایک نعمت کا آہستہ نام لیں — اضافہ اکثر دیکھنے سے شروع ہوتا ہے۔",
      },
    ),
  ],
  [
    m(
      "Qur’an 93:5",
      "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ",
      {
        en: "What is coming will satisfy the heart.",
        hi: "जो आने वाला है, वह दिल को राज़ी करेगा।",
        ur: "جو آنے والا ہے وہ دل کو راضی کرے گا۔",
      },
      {
        en: "Your Lord will give you, and you will be pleased. Delay is not denial — it may be a gift still unfolding.",
        hi: "आपका रब आपको देगा और आप राज़ी होंगे। देरी इंकार नहीं है — शायद वह नेमत अभी खुल रही है।",
        ur: "آپ کا رب آپ کو دے گا اور آپ راضی ہوں گے۔ تاخیر انکار نہیں — شاید وہ نعمت ابھی کھل رہی ہے۔",
      },
    ),
    m(
      "Qur’an 94:8",
      "وَإِلَىٰ رَبِّكَ فَارْغَبْ",
      {
        en: "Turn your hope toward the Most Generous.",
        hi: "अपनी आशा सबसे उदार की ओर मोड़ें।",
        ur: "اپنی امید سب سے سخی کی طرف موڑیں۔",
      },
      {
        en: "And to your Lord turn your longing. After every task, lift the heart again toward the One who never tires of giving.",
        hi: "और अपने रब की ओर झुकें। हर काम के बाद दिल को उसी की ओर उठाएँ जो देना नहीं थकता।",
        ur: "اور اپنے رب کی طرف رغبت رکھیں۔ ہر کام کے بعد دل کو اُسی کی طرف اٹھائیں جو دینا نہیں تھکتا۔",
      },
    ),
  ],
  [
    m(
      "Qur’an 49:13",
      "إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ",
      {
        en: "Honor is measured by the heart.",
        hi: "इज़्ज़त दिल से नापी जाती है।",
        ur: "عزت دل سے ناپی جاتی ہے۔",
      },
      {
        en: "The most honored among you, in the sight of Allah, is the most mindful. Walk gently with people; nobility lives in taqwa.",
        hi: "अल्लाह के निकट तुममें सबसे इज़्ज़त वाला वही है जो सबसे ज़्यादा परहेज़गार है। लोगों के साथ नरमी से चलें।",
        ur: "اللہ کے نزدیک تم میں سب سے معزز وہ ہے جو سب سے زیادہ پرہیزگار ہے۔ لوگوں کے ساتھ نرمی سے چلیں۔",
      },
    ),
    m(
      "Qur’an 16:18",
      "وَإِن تَعُدُّوا نِعْمَةَ اللَّهِ لَا تُحْصُوهَا",
      {
        en: "You are already surrounded by gifts.",
        hi: "आप पहले से नेमतों से घिरे हैं।",
        ur: "آپ پہلے سے نعمتوں سے گھیرے ہوئے ہیں۔",
      },
      {
        en: "If you tried to count the blessings of Allah, you could not number them. Begin with breath, safety, and this new day.",
        hi: "यदि तुम अल्लाह की नेमतें गिनो, तो गिन न सकोगे। साँस, सुरक्षा और इस नए दिन से शुरू करें।",
        ur: "اگر تم اللہ کی نعمتیں گنو تو شمار نہ کر سکو گے۔ سانس، حفاظت اور اس نئے دن سے شروع کریں۔",
      },
    ),
  ],
  [
    m(
      "Qur’an 2:201",
      "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً",
      {
        en: "A balanced prayer for the road.",
        hi: "रास्ते के लिए एक संतुलित दुआ।",
        ur: "راستے کے لیے ایک متوازن دعا۔",
      },
      {
        en: "Our Lord, grant us good in this world and good in the Hereafter. Ask for both — a beautiful journey here, and a beautiful return.",
        hi: "ऐ हमारे रब, हमें दुनिया में भलाई दे और आख़िरत में भलाई दे। दोनों माँगें — यहाँ सुंदर यात्रा, और सुंदर वापसी।",
        ur: "اے ہمارے رب، ہمیں دنیا میں بھلائی دے اور آخرت میں بھلائی دے۔ دونوں مانگیں — یہاں خوبصورت سفر، اور خوبصورت واپسی۔",
      },
    ),
    m(
      "Qur’an 17:80",
      "رَبِّ أَدْخِلْنِي مُدْخَلَ صِدْقٍ وَأَخْرِجْنِي مُخْرَجَ صِدْقٍ",
      {
        en: "Enter and leave with honesty.",
        hi: "सच्चाई से प्रवेश करें और निकलें।",
        ur: "سچائی سے داخل ہوں اور نکلیں۔",
      },
      {
        en: "My Lord, cause me to enter a truthful entrance and to leave a truthful exit. May every doorway of your journey be sincere.",
        hi: "ऐ मेरे रब, मुझे सच्चे प्रवेश से दाख़िल कर और सच्चे निकास से निकाल। आपकी यात्रा का हर द्वार सच्चा हो।",
        ur: "اے میرے رب، مجھے سچے داخلے سے داخل کر اور سچے خروج سے نکال۔ آپ کے سفر کا ہر دروازہ سچا ہو۔",
      },
    ),
  ],
  [
    m(
      "Qur’an 3:159",
      "فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى اللَّهِ",
      {
        en: "Decide, then rest in trust.",
        hi: "फ़ैसला करें, फिर भरोसे में आराम करें।",
        ur: "فیصلہ کریں، پھر بھروسے میں آرام کریں۔",
      },
      {
        en: "When you have resolved, place your trust in Allah. Courage is not rushing — it is choosing, then leaving the outcome with Him.",
        hi: "जब तुम निश्चय कर लो, तो अल्लाह पर भरोसा रखो। हिम्मत जल्दबाज़ी नहीं — चुनना है, फिर नतीजा उसी के पास छोड़ना।",
        ur: "جب تم پختہ ارادہ کر لو تو اللہ پر بھروسہ رکھو۔ ہمت جلدی نہیں — چننا ہے، پھر انجام اُسی کے سپرد کرنا۔",
      },
    ),
    m(
      "Qur’an 8:46",
      "وَاصْبِرُوا ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
      {
        en: "Patience is never a lonely road.",
        hi: "सब्र कभी अकेला रास्ता नहीं होता।",
        ur: "صبر کبھی اکیلا راستہ نہیں ہوتا۔",
      },
      {
        en: "Be patient. Indeed, Allah is with those who are patient. Your waiting is witnessed, and you are accompanied.",
        hi: "सब्र करो। निश्चय अल्लाह सब्र करने वालों के साथ है। आपका इंतज़ार देखा जा रहा है, और आप अकेले नहीं।",
        ur: "صبر کرو۔ یقیناً اللہ صبر کرنے والوں کے ساتھ ہے۔ آپ کا انتظار دیکھا جا رہا ہے، اور آپ اکیلے نہیں۔",
      },
    ),
  ],
  [
    m(
      "Qur’an 55:13",
      "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ",
      {
        en: "Pause and notice what remains.",
        hi: "रुकें और देखें क्या बचा है।",
        ur: "رکیں اور دیکھیں کیا باقی ہے۔",
      },
      {
        en: "Which of the favors of your Lord will you deny? Even a small mercy — a safe step, a kind word — is worth thanking.",
        hi: "तुम दोनों अपने रब की किस नेमत को झुठलाओगे? एक सुरक्षित क़दम, एक भली बात — शुक्र के योग्य है।",
        ur: "تم دونوں اپنے رب کی کس نعمت کو جھٹلاؤ گے؟ ایک محفوظ قدم، ایک اچھی بات — شکر کے لائق ہے۔",
      },
    ),
    m(
      "Qur’an 108:1",
      "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
      {
        en: "You have been given abundance.",
        hi: "आपको कौसर दिया गया है।",
        ur: "آپ کو کوثر دیا گیا ہے۔",
      },
      {
        en: "Indeed, We have granted you abundance. Look for the river of good already flowing through your life — then share a drop of it.",
        hi: "निश्चय हमने तुम्हें कौसर दिया। अपने जीवन में बहती नेकी की नदी देखें — फिर उसकी एक बूँद बाँटें।",
        ur: "یقیناً ہم نے تمہیں کوثر عطا کی۔ اپنی زندگی میں بہتی نیکی کی نہر دیکھیں — پھر اس کا ایک قطرہ بانٹیں۔",
      },
    ),
  ],
  [
    m(
      "Qur’an 41:30",
      "أَلَّا تَخَافُوا وَلَا تَحْزَنُوا",
      {
        en: "Fear and grief are spoken to kindly.",
        hi: "डर और ग़म से नरमी से कहा जाता है।",
        ur: "خوف اور غم سے نرمی سے کہا جاتا ہے۔",
      },
      {
        en: "Do not fear, and do not grieve. When the heart trembles, this address is a covering of calm placed over it.",
        hi: "डरो मत, और ग़म न करो। जब दिल काँपे, यह संबोधन उसके ऊपर शांति की चादर है।",
        ur: "خوف نہ کرو، اور غم نہ کرو۔ جب دل کانپے، یہ خطاب اُس پر سکون کی چادر ہے۔",
      },
    ),
    m(
      "Qur’an 9:51",
      "قُل لَّن يُصِيبَنَا إِلَّا مَا كَتَبَ اللَّهُ لَنَا",
      {
        en: "What reaches you was already written in mercy.",
        hi: "जो पहुँचता है, रहमत में पहले लिखा था।",
        ur: "جو پہنچتا ہے رحمت میں پہلے لکھا تھا۔",
      },
      {
        en: "Say: nothing will befall us except what Allah has written for us. Walk with care, then rest — the pen has already been lifted with wisdom.",
        hi: "कहो: हमें वही पहुँचेगा जो अल्लाह ने हमारे लिए लिख दिया। सावधानी से चलें, फिर आराम करें — क़लम हिकमत से उठ चुकी है।",
        ur: "کہو: ہمیں وہی پہنچے گا جو اللہ نے ہمارے لیے لکھ دیا۔ احتیاط سے چلیں، پھر آرام کریں — قلم حکمت سے اٹھ چکی ہے۔",
      },
    ),
  ],
  [
    m(
      "Qur’an 25:74",
      "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ",
      {
        en: "A prayer for those you love.",
        hi: "अपने प्रियजनों के लिए एक दुआ।",
        ur: "اپنے پیاروں کے لیے ایک دعا۔",
      },
      {
        en: "Our Lord, grant us from our spouses and children the coolness of our eyes. May your household be a place of light and gentleness.",
        hi: "ऐ हमारे रब, हमें अपनी बीवी-बच्चों से आँखों की ठंडक दे। आपका घर रोशनी और नरमी का स्थान हो।",
        ur: "اے ہمارے رب، ہمیں اپنی بیویوں اور اولاد سے آنکھوں کی ٹھنڈک عطا فرما۔ آپ کا گھر روشنی اور نرمی کی جگہ ہو۔",
      },
    ),
    m(
      "Qur’an 3:8",
      "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا",
      {
        en: "Ask for a heart that stays guided.",
        hi: "ऐसे दिल की दुआ करें जो हिदायत पर रहे।",
        ur: "ایسے دل کی دعا کریں جو ہدایت پر رہے۔",
      },
      {
        en: "Our Lord, do not let our hearts swerve after You have guided us. Guidance is a gift — ask that it remain, day after day.",
        hi: "ऐ हमारे रब, हिदायत के बाद हमारे दिल न बहकने पाएँ। हिदायत एक नेमत है — माँगें कि वह रोज़ बनी रहे।",
        ur: "اے ہمارے رب، ہدایت کے بعد ہمارے دل نہ بہکیں۔ ہدایت ایک نعمت ہے — مانگیں کہ وہ روز قائم رہے۔",
      },
    ),
  ],
  [
    m(
      "Qur’an 103:1–3",
      "وَالْعَصْرِ ۝ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ ۝ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ",
      {
        en: "Time is precious — and so is a good deed.",
        hi: "वक्त क़ीमती है — और नेक अमल भी।",
        ur: "وقت قیمتی ہے — اور نیک عمل بھی۔",
      },
      {
        en: "By time, mankind is in loss — except those who believe, do good, and remind one another of truth and patience. A kind word today is not small.",
        hi: "ज़माने की कसम, इंसान घाटे में है — सिवाय जो ईमान लाए, नेकी करे, और एक दूसरे को हक़ और सब्र की नसीहत दे।",
        ur: "زمانے کی قسم، انسان خسارے میں ہے — سوائے جو ایمان لائے، نیکی کرے، اور ایک دوسرے کو حق اور صبر کی نصیحت دے۔",
      },
    ),
    m(
      "Qur’an 21:87",
      "لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
      {
        en: "A prayer for tight places.",
        hi: "तंग जगहों के लिए एक दुआ।",
        ur: "تنگ جگہوں کے لیے ایک دعا۔",
      },
      {
        en: "There is no god but You; glory be to You. I have been among the wrongdoers. In difficulty, this remembrance opens a way as it did for Yunus, peace be upon him.",
        hi: "तेरे सिवा कोई माबूद नहीं; तू पाक है। मैं ज़ालिमों में से था। तंगी में यह ज़िक्र रास्ता खोलता है, जैसा यूनुस अलैहिस्सलाम के लिए हुआ।",
        ur: "تیرے سوا کوئی معبود نہیں؛ تو پاک ہے۔ میں ظالموں میں سے تھا۔ تنگی میں یہ ذکر راستہ کھولتا ہے، جیسا یونس علیہ السلام کے لیے ہوا۔",
      },
    ),
  ],
  [
    m(
      "Qur’an 1:5",
      "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      {
        en: "Begin the day by turning fully.",
        hi: "दिन की शुरुआत पूरे रुख से करें।",
        ur: "دن کی شروعات پورے رخ سے کریں۔",
      },
      {
        en: "You alone we worship, and You alone we ask for help. Keep this sentence near when plans feel crowded — worship first, then assistance.",
        hi: "हम केवल तेरी इबादत करते हैं और केवल तुझी से मदद माँगते हैं। जब योजनाएँ घेर लें, पहले इबादत, फिर मदद।",
        ur: "ہم صرف تیری عبادت کرتے ہیں اور صرف تجھی سے مدد مانگتے ہیں۔ جب منصوبے گھیر لیں، پہلے عبادت، پھر مدد۔",
      },
    ),
    m(
      "Qur’an 2:45",
      "وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ",
      {
        en: "Prayer grows lighter with a softened heart.",
        hi: "नर्म दिल के साथ नमाज़ हलकी पड़ती है।",
        ur: "نرم دل کے ساتھ نماز ہلکی پڑتی ہے۔",
      },
      {
        en: "It is surely difficult, except for the humble. If the prayer feels heavy, ask for khushu — humility makes the path kind.",
        hi: "यह कठिन है, सिवाय झुकने वालों के लिए। यदि नमाज़ भारी लगे, ख़ुशू माँगें — विनम्रता रास्ते को नरम करती है।",
        ur: "یہ دشوار ہے، سوائے جھکنے والوں کے۔ اگر نماز بھاری لگے، خشوع مانگیں — انکساری راستے کو نرم کرتی ہے۔",
      },
    ),
  ],
  [
    m(
      "Qur’an 48:1",
      "إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا",
      {
        en: "A clear opening may already be near.",
        hi: "एक स्पष्ट राहत पास हो सकती है।",
        ur: "ایک واضح کشادگی قریب ہو سکتی ہے۔",
      },
      {
        en: "Indeed, We have given you a clear opening. Not every victory looks loud; some arrive as peace after a long, patient walk.",
        hi: "निश्चय हमने तुम्हें स्पष्ट विजय दी। हर फ़तह शोर नहीं मचाती; कुछ लंबी सब्र की चाल के बाद सुकून बनकर आती हैं।",
        ur: "یقیناً ہم نے تمہیں کھلی فتح دی۔ ہر فتح شور نہیں مچاتی؛ کچھ لمبے صبر کی چال کے بعد سکون بن کر آتی ہیں۔",
      },
    ),
    m(
      "Qur’an 94:7",
      "فَإِذَا فَرَغْتَ فَانصَبْ",
      {
        en: "When one duty ends, rise again with purpose.",
        hi: "जब एक काम पूरा हो, फिर मक़सद से उठें।",
        ur: "جب ایک کام پورا ہو، پھر مقصد سے اٹھیں۔",
      },
      {
        en: "So when you have finished, still stand. Rest is allowed — then return to what is next with a heart turned toward your Lord.",
        hi: "जब तुम फ़ारिग़ हो जाओ, फिर मेहनत करो। आराम जायज़ है — फिर अगले काम की ओर दिल रब की तरफ़ रखकर लौटें।",
        ur: "جب تم فارغ ہو جاؤ تو پھر محنت کرو۔ آرام جائز ہے — پھر اگلے کام کی طرف دل رب کی طرف رکھ کر لوٹیں۔",
      },
    ),
  ],
];

export function dayOfYearUtc(date = new Date()) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 1);
  const today = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((today - start) / 86_400_000);
}

export function getDailyPair(date = new Date()): DailyPair {
  return dailyPairs[dayOfYearUtc(date) % dailyPairs.length];
}
