import type { Role } from "@/lib/types";

export function GoogleAuthButton({ role, next, mode }: { role: Role; next?: string; mode: "login" | "signup" }) {
  const params = new URLSearchParams({ role });
  if (next) params.set("next", next);
  return <>
    <div className="auth-divider"><span>or</span></div>
    <a className="google-button" href={`/api/auth/google/start?${params}`}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.5-.2-2.2H12v4.3h5.4a4.6 4.6 0 0 1-2 3v2.8h3.3c1.9-1.8 2.9-4.4 2.9-7.9Z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.8c-.9.6-2.1 1-3.4 1a5.9 5.9 0 0 1-5.5-4.1H3.1v2.8A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.5 13.7a6 6 0 0 1 0-3.8V7.1H3.1a10 10 0 0 0 0 9.4l3.4-2.8Z"/><path fill="#EA4335" d="M12 5.8c1.5 0 2.8.5 3.9 1.5l2.9-2.9A9.8 9.8 0 0 0 3.1 7.1l3.4 2.8A5.9 5.9 0 0 1 12 5.8Z"/></svg>
      {mode === "signup" ? `Sign up with Google as ${role === "guide" ? "a guide" : "a traveler"}` : "Continue with Google"}
    </a>
  </>;
}
