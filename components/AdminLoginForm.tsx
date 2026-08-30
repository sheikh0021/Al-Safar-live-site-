"use client";

import { useActionState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { adminLogin, type AdminLoginState } from "@/app/admin/login/actions";

const initialState: AdminLoginState = {};

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(adminLogin, initialState);
  return <form action={action} className="auth-form admin-login-form">
    <span className="eyebrow"><LockKeyhole size={14}/> Restricted workspace</span>
    <h2>Administrator sign in.</h2>
    <p className="muted">Manage bookings, documents, guides, payments and departure capacity.</p>
    {state.error && <p className="error">{state.error}</p>}
    <label className="field">Administrator email<input name="email" type="email" autoComplete="username" required/></label>
    <label className="field">Password<input name="password" type="password" autoComplete="current-password" required minLength={8}/></label>
    <button className="btn btn-primary auth-submit" disabled={pending}>{pending ? "Signing in…" : "Open admin dashboard"}<ArrowRight size={17}/></button>
    <p className="admin-login-note">Administrator accounts are created only through the secure database migration—not through public signup.</p>
  </form>;
}
