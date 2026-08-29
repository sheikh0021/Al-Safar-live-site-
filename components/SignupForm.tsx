"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { ArrowRight } from "lucide-react";
import { signup, type SignupState } from "@/app/signup/actions";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import type { Role } from "@/lib/types"; import type { Locale } from "@/lib/i18n";

const initialState: SignupState = {};

export function SignupForm({ initialRole = "traveler", next, googleError, locale="en" }: { initialRole?: Role; next?: string; googleError?: string;locale?:Locale }) {
  const h=(en:string,hi:string)=>locale==="hi"?hi:en;
  const [role, setRole] = useState<Role>(initialRole);
  const [state, action, pending] = useActionState(signup, initialState);

  return <form action={action} className="auth-form">
    <span className="eyebrow">{h("Join AlSafar","अलसफ़र से जुड़ें")}</span><h2>{h("Create your account.","अपना खाता बनाएँ।")}</h2><p className="muted">{h("Choose how you will use AlSafar, then enter your details.","चुनें कि आप अलसफ़र का उपयोग कैसे करेंगे, फिर विवरण भरें।")}</p>

    <div className="role-tabs">
      <button type="button" onClick={() => setRole("traveler")} className={`role-tab ${role === "traveler" ? "active" : ""}`}>{h("I’m a traveler","मैं यात्री हूँ")}</button><button type="button" onClick={() => setRole("guide")} className={`role-tab ${role === "guide" ? "active" : ""}`}>{h("I’m a local guide","मैं स्थानीय गाइड हूँ")}</button>
    </div>
    <input type="hidden" name="role" value={role}/>
    <input type="hidden" name="locale" value={locale}/>
    {next && <input type="hidden" name="next" value={next}/>}

    {(state.error || googleError) && <p className="error" role="alert">{state.error || googleError}</p>}
    <GoogleAuthButton role={role} next={next} mode="signup" locale={locale}/>

    <label className="field">{h("Full name","पूरा नाम")}<input name="name" type="text" placeholder={h("Your full name","आपका पूरा नाम")} autoComplete="name" required minLength={2} maxLength={120}/>
    </label>
    <label className="field">{h("Email address","ईमेल पता")}
      <input name="email" type="email" placeholder="you@example.com" autoComplete="email" required/>
    </label>
    <label className="field">{h("Password","पासवर्ड")}
      <input name="password" type="password" placeholder={h("8+ characters, with a letter and number","8+ अक्षर, एक अक्षर और एक संख्या सहित")} autoComplete="new-password" required minLength={8} maxLength={72}/>
    </label>
    <label className="field">{h("Confirm password","पासवर्ड की पुष्टि करें")}<input name="confirmPassword" type="password" placeholder={h("Enter the same password again","वही पासवर्ड दोबारा लिखें")} autoComplete="new-password" required minLength={8} maxLength={72}/>
    </label>

    {role === "guide" && <p className="role-note">{h("You are registering as a local guide. Your dashboard and account permissions will be set to the guide role.","आप स्थानीय गाइड के रूप में पंजीकरण कर रहे हैं। आपका डैशबोर्ड और अनुमतियाँ गाइड भूमिका के अनुसार होंगी।")}</p>}

    <button disabled={pending} className="btn btn-primary auth-submit">
      {pending ? h("Creating account…","खाता बन रहा है…") : h("Create account","खाता बनाएँ")}<ArrowRight size={17}/>
    </button>
    <p className="auth-switch">{h("Already have an account?","पहले से खाता है?")} <Link href={`/login?role=${role}${next ? `&next=${encodeURIComponent(next)}` : ""}`}>{h("Sign in","साइन इन करें")}</Link></p>
  </form>;
}
