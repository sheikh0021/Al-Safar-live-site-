"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { login, type LoginState } from "@/app/login/actions";

const initial: LoginState = {};
export function LoginForm({ initialRole="traveler", next }:{initialRole?:"traveler"|"guide";next?:string}){
 const [role,setRole]=useState(initialRole); const [state,action,pending]=useActionState(login,initial);
 return <form action={action} className="auth-form"><span className="eyebrow">Welcome to AlSafar</span><h2>Peace be upon you.</h2><p className="muted">Sign in to manage your sacred journey.</p>
 <div className="role-tabs"><button type="button" onClick={()=>setRole("traveler")} className={`role-tab ${role==="traveler"?"active":""}`}>I’m a traveler</button><button type="button" onClick={()=>setRole("guide")} className={`role-tab ${role==="guide"?"active":""}`}>I’m a local guide</button></div>
 <input type="hidden" name="role" value={role}/>
 {next&&<input type="hidden" name="next" value={next}/>}
 {state.error&&<p className="error">{state.error}</p>}<label className="field">Email address<input name="email" type="email" placeholder={role==="traveler"?"traveler@alsafar.com":"guide@alsafar.com"} required/></label><label className="field">Password<input name="password" type="password" placeholder="At least 6 characters" required minLength={6}/></label><button disabled={pending} className="btn btn-primary" style={{width:"100%"}}>{pending?"Signing in…":"Continue to dashboard"}<ArrowRight size={17}/></button>
 <p className="auth-switch">New to AlSafar? <Link href={`/signup?role=${role}${next ? `&next=${encodeURIComponent(next)}` : ""}`}>Create an account</Link></p>
 <div className="demo"><strong>Demo {role} account</strong><br/>{role==="traveler"?"traveler@alsafar.com / pilgrim123":"guide@alsafar.com / guide123"}</div></form>
}
