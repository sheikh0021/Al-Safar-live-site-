"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { ArrowRight } from "lucide-react";
import { signup, type SignupState } from "@/app/signup/actions";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import type { Role } from "@/lib/types";

const initialState: SignupState = {};

export function SignupForm({ initialRole = "traveler", next, googleError }: { initialRole?: Role; next?: string; googleError?: string }) {
  const [role, setRole] = useState<Role>(initialRole);
  const [state, action, pending] = useActionState(signup, initialState);

  return <form action={action} className="auth-form">
    <span className="eyebrow">Join AlSafar</span>
    <h2>Create your account.</h2>
    <p className="muted">Choose how you will use AlSafar, then enter your details.</p>

    <div className="role-tabs">
      <button type="button" onClick={() => setRole("traveler")} className={`role-tab ${role === "traveler" ? "active" : ""}`}>I’m a traveler</button>
      <button type="button" onClick={() => setRole("guide")} className={`role-tab ${role === "guide" ? "active" : ""}`}>I’m a local guide</button>
    </div>
    <input type="hidden" name="role" value={role}/>
    {next && <input type="hidden" name="next" value={next}/>}

    {(state.error || googleError) && <p className="error" role="alert">{state.error || googleError}</p>}
    <GoogleAuthButton role={role} next={next} mode="signup"/>

    <label className="field">Full name
      <input name="name" type="text" placeholder="Your full name" autoComplete="name" required minLength={2} maxLength={120}/>
    </label>
    <label className="field">Email address
      <input name="email" type="email" placeholder="you@example.com" autoComplete="email" required/>
    </label>
    <label className="field">Password
      <input name="password" type="password" placeholder="8+ characters, with a letter and number" autoComplete="new-password" required minLength={8} maxLength={72}/>
    </label>
    <label className="field">Confirm password
      <input name="confirmPassword" type="password" placeholder="Enter the same password again" autoComplete="new-password" required minLength={8} maxLength={72}/>
    </label>

    {role === "guide" && <p className="role-note">You are registering as a local guide. Your dashboard and account permissions will be set to the guide role.</p>}

    <button disabled={pending} className="btn btn-primary auth-submit">
      {pending ? "Creating account…" : "Create account"}<ArrowRight size={17}/>
    </button>
    <p className="auth-switch">Already have an account? <Link href={`/login?role=${role}${next ? `&next=${encodeURIComponent(next)}` : ""}`}>Sign in</Link></p>
  </form>;
}
