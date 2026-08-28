import { NextRequest, NextResponse } from "next/server";
import { GOOGLE_OAUTH_COOKIE, pkceChallenge, randomOAuthValue, safeNext, signGoogleOAuthState } from "@/lib/google-oauth";
import type { Role } from "@/lib/types";

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/login?googleError=not_configured", request.url));
  }

  const role: Role = request.nextUrl.searchParams.get("role") === "guide" ? "guide" : "traveler";
  const next = safeNext(request.nextUrl.searchParams.get("next"));
  const state = randomOAuthValue();
  const nonce = randomOAuthValue();
  const verifier = randomOAuthValue(48);
  const redirectUri = new URL("/api/auth/google/callback", request.nextUrl.origin).toString();
  const stateToken = await signGoogleOAuthState({ state, nonce, verifier, role, next });

  const authorizationUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authorizationUrl.search = new URLSearchParams({
    client_id: clientId, redirect_uri: redirectUri, response_type: "code",
    scope: "openid email profile", state, nonce, prompt: "select_account",
    code_challenge: pkceChallenge(verifier), code_challenge_method: "S256"
  }).toString();

  const response = NextResponse.redirect(authorizationUrl);
  response.cookies.set(GOOGLE_OAUTH_COOKIE, stateToken, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: 10 * 60
  });
  return response;
}
