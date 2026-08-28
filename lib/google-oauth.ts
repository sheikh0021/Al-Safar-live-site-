import { createHash, randomBytes } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@/lib/types";

export const GOOGLE_OAUTH_COOKIE = "alsafar_google_oauth";

const oauthSecret = () => new TextEncoder().encode(
  process.env.SESSION_SECRET || "alsafar-development-secret-change-me"
);

export type GoogleOAuthState = {
  state: string;
  nonce: string;
  verifier: string;
  role: Role;
  next: string;
};

export function randomOAuthValue(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}

export function pkceChallenge(verifier: string) {
  return createHash("sha256").update(verifier).digest("base64url");
}

export async function signGoogleOAuthState(value: GoogleOAuthState) {
  return new SignJWT(value)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(oauthSecret());
}

export async function verifyGoogleOAuthState(token: string): Promise<GoogleOAuthState> {
  const { payload } = await jwtVerify(token, oauthSecret());
  return {
    state: String(payload.state), nonce: String(payload.nonce), verifier: String(payload.verifier),
    role: payload.role === "guide" ? "guide" : "traveler",
    next: String(payload.next || "/dashboard")
  };
}

export function safeNext(value: string | null | undefined) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}
