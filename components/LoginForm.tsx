"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { login, type LoginState } from "@/app/login/actions";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import type { Locale } from "@/lib/i18n";

const initial: LoginState = {};
export function LoginForm({ initialRole="traveler", next, googleError, locale="en" }:{initialRole?:"traveler"|"guide";next?:string;googleError?:string;locale?:Locale}){
 const h=(en:string,hi:string)=>locale==="hi"?hi:en;
 const [role,setRole]=useState(initialRole); const [state,action,pending]=useActionState(login,initial);
 return <form action={action} className="auth-form"><span className="eyebrow">{h("Welcome to AlSafar","अलसफ़र में आपका स्वागत है")}</span><h2>{h("Peace be upon you.","अस्सलामु अलैकुम।")}</h2><p className="muted">{h("Sign in to manage your sacred journey.","अपनी पवित्र यात्रा सँभालने के लिए साइन इन करें।")}</p>
 <div className="role-tabs"><button type="button" onClick={()=>setRole("traveler")} className={`role-tab ${role==="traveler"?"active":""}`}>{h("I’m a traveler","मैं यात्री हूँ")}</button><button type="button" onClick={()=>setRole("guide")} className={`role-tab ${role==="guide"?"active":""}`}>{h("I’m a local guide","मैं स्थानीय गाइड हूँ")}</button></div>
 <input type="hidden" name="role" value={role}/>
 <input type="hidden" name="locale" value={locale}/>
 {next&&<input type="hidden" name="next" value={next}/>}
 {(state.error||googleError)&&<p className="error">{state.error||googleError}</p>}<GoogleAuthButton role={role} next={next} mode="login" locale={locale}/><label className="field">{h("Email address","ईमेल पता")}<input name="email" type="email" placeholder={role==="traveler"?"traveler@alsafar.com":"guide@alsafar.com"} required/></label><label className="field">{h("Password","पासवर्ड")}<input name="password" type="password" placeholder={h("At least 6 characters","कम से कम 6 अक्षर")} required minLength={6}/></label><button disabled={pending} className="btn btn-primary" style={{width:"100%"}}>{pending?h("Signing in…","साइन इन हो रहा है…"):h("Continue to dashboard","डैशबोर्ड पर जाएँ")}<ArrowRight size={17}/></button>
 <p className="auth-switch">{h("New to AlSafar?","अलसफ़र पर नए हैं?")} <Link href={`/signup?role=${role}${next ? `&next=${encodeURIComponent(next)}` : ""}`}>{h("Create an account","खाता बनाएँ")}</Link></p>
 <div className="demo"><strong>{h(`Demo ${role} account`,role==="traveler"?"डेमो यात्री खाता":"डेमो गाइड खाता")}</strong><br/>{role==="traveler"?"traveler@alsafar.com / pilgrim123":"guide@alsafar.com / guide123"}</div></form>
}
