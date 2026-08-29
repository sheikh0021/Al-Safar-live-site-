"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { ArrowRight } from "lucide-react";
import { signup, type SignupState } from "@/app/signup/actions";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import type { Role } from "@/lib/types"; import { localize,type Locale } from "@/lib/i18n";

const initialState: SignupState = {};

export function SignupForm({ initialRole = "traveler", next, googleError, locale="en" }: { initialRole?: Role; next?: string; googleError?: string;locale?:Locale }) {
  const h=(en:string,hi:string,ur:string)=>localize(locale,en,hi,ur);
  const [role, setRole] = useState<Role>(initialRole);
  const [state, action, pending] = useActionState(signup, initialState);

  return <form action={action} className="auth-form">
    <span className="eyebrow">{h("Join AlSafar","अलसफ़र से जुड़ें","السفر سے جڑیں")}</span><h2>{h("Create your account.","अपना खाता बनाएँ।","اپنا اکاؤنٹ بنائیں۔")}</h2><p className="muted">{h("Choose how you will use AlSafar, then enter your details.","चुनें कि आप अलसफ़र का उपयोग कैसे करेंगे, फिर विवरण भरें।","منتخب کریں کہ آپ السفر کو کیسے استعمال کریں گے، پھر تفصیلات درج کریں۔")}</p>

    <div className="role-tabs">
      <button type="button" onClick={() => setRole("traveler")} className={`role-tab ${role === "traveler" ? "active" : ""}`}>{h("I’m a traveler","मैं यात्री हूँ","میں زائر ہوں")}</button><button type="button" onClick={() => setRole("guide")} className={`role-tab ${role === "guide" ? "active" : ""}`}>{h("I’m a local guide","मैं स्थानीय गाइड हूँ","میں مقامی گائیڈ ہوں")}</button>
    </div>
    <input type="hidden" name="role" value={role}/>
    <input type="hidden" name="locale" value={locale}/>
    {next && <input type="hidden" name="next" value={next}/>}

    {(state.error || googleError) && <p className="error" role="alert">{state.error || googleError}</p>}
    <GoogleAuthButton role={role} next={next} mode="signup" locale={locale}/>

    <label className="field">{h("Full name","पूरा नाम","پورا نام")}<input name="name" type="text" placeholder={h("Your full name","आपका पूरा नाम","آپ کا پورا نام")} autoComplete="name" required minLength={2} maxLength={120}/>
    </label>
    <label className="field">{h("Email address","ईमेल पता","ای میل پتہ")}
      <input name="email" type="email" placeholder="you@example.com" autoComplete="email" required/>
    </label>
    <label className="field">{h("Password","पासवर्ड","پاس ورڈ")}
      <input name="password" type="password" placeholder={h("8+ characters, with a letter and number","8+ अक्षर, एक अक्षर और एक संख्या सहित","8+ حروف، ایک حرف اور ایک عدد کے ساتھ")} autoComplete="new-password" required minLength={8} maxLength={72}/>
    </label>
    <label className="field">{h("Confirm password","पासवर्ड की पुष्टि करें","پاس ورڈ کی تصدیق")}<input name="confirmPassword" type="password" placeholder={h("Enter the same password again","वही पासवर्ड दोबारा लिखें","وہی پاس ورڈ دوبارہ درج کریں")} autoComplete="new-password" required minLength={8} maxLength={72}/>
    </label>

    {role === "guide" && <p className="role-note">{h("You are registering as a local guide. Your dashboard and account permissions will be set to the guide role.","आप स्थानीय गाइड के रूप में पंजीकरण कर रहे हैं। आपका डैशबोर्ड और अनुमतियाँ गाइड भूमिका के अनुसार होंगी।","آپ مقامی گائیڈ کے طور پر رجسٹر ہو رہے ہیں۔ آپ کا ڈیش بورڈ اور اجازتیں گائیڈ کے کردار کے مطابق ہوں گی۔")}</p>}

    <button disabled={pending} className="btn btn-primary auth-submit">
      {pending ? h("Creating account…","खाता बन रहा है…","اکاؤنٹ بن رہا ہے…") : h("Create account","खाता बनाएँ","اکاؤنٹ بنائیں")}<ArrowRight size={17}/>
    </button>
    <p className="auth-switch">{h("Already have an account?","पहले से खाता है?","پہلے سے اکاؤنٹ ہے؟")} <Link href={`/login?role=${role}${next ? `&next=${encodeURIComponent(next)}` : ""}`}>{h("Sign in","साइन इन करें","سائن اِن کریں")}</Link></p>
  </form>;
}
