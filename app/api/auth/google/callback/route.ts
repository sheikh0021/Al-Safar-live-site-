import bcrypt from "bcryptjs";
import { createRemoteJWKSet, jwtVerify } from "jose";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { GOOGLE_OAUTH_COOKIE, safeNext, verifyGoogleOAuthState } from "@/lib/google-oauth";
import type { Role, SessionUser } from "@/lib/types";

const googleKeys = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

function oauthFailure(request: NextRequest, reason: string, role: Role = "traveler") {
  const response = NextResponse.redirect(new URL(`/login?role=${role}&googleError=${reason}`, request.url));
  response.cookies.delete(GOOGLE_OAUTH_COOKIE);
  return response;
}

export async function GET(request: NextRequest) {
  const stateCookie = request.cookies.get(GOOGLE_OAUTH_COOKIE)?.value;
  const returnedState = request.nextUrl.searchParams.get("state");
  const code = request.nextUrl.searchParams.get("code");
  if (!stateCookie || !returnedState || !code || request.nextUrl.searchParams.has("error")) return oauthFailure(request, "cancelled");

  let oauthState;
  try { oauthState = await verifyGoogleOAuthState(stateCookie); }
  catch { return oauthFailure(request, "expired"); }
  if (oauthState.state !== returnedState) return oauthFailure(request, "invalid_state", oauthState.role);

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const db = getDb();
  if (!clientId || !clientSecret || !db) return oauthFailure(request, "not_configured", oauthState.role);

  try {
    const redirectUri = new URL("/api/auth/google/callback", request.nextUrl.origin).toString();
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code", code_verifier: oauthState.verifier }),
      cache: "no-store"
    });
    if (!tokenResponse.ok) return oauthFailure(request, "token_exchange", oauthState.role);
    const tokens = await tokenResponse.json() as { id_token?: string };
    if (!tokens.id_token) return oauthFailure(request, "token_exchange", oauthState.role);
    const { payload } = await jwtVerify(tokens.id_token, googleKeys, {
      issuer: ["https://accounts.google.com", "accounts.google.com"], audience: clientId
    });
    if (payload.nonce !== oauthState.nonce || payload.email_verified !== true || !payload.sub || !payload.email) {
      return oauthFailure(request, "unverified", oauthState.role);
    }

    const email = String(payload.email).toLowerCase();
    const name = String(payload.name || email.split("@")[0]).slice(0, 120);
    const googleSub = String(payload.sub);
    const connection = await db.getConnection();
    let user: SessionUser;
    try {
      await connection.execute(`CREATE TABLE IF NOT EXISTS oauth_accounts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id INT UNSIGNED NOT NULL,
        provider VARCHAR(30) NOT NULL, provider_account_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_oauth_provider_account (provider, provider_account_id),
        CONSTRAINT fk_oauth_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`);
      await connection.beginTransaction();
      const [linked] = await connection.execute<RowDataPacket[]>(
        `SELECT u.id, u.name, u.email, u.role FROM oauth_accounts oa JOIN users u ON u.id = oa.user_id
         WHERE oa.provider = 'google' AND oa.provider_account_id = ? LIMIT 1`, [googleSub]
      );
      if (linked[0]) {
        user = { id: linked[0].id, name: linked[0].name, email: linked[0].email, role: linked[0].role };
      } else {
        const [sameEmail] = await connection.execute<RowDataPacket[]>("SELECT id, name, email, role FROM users WHERE email = ? LIMIT 1", [email]);
        if (sameEmail[0]) {
          user = { id: sameEmail[0].id, name: sameEmail[0].name, email: sameEmail[0].email, role: sameEmail[0].role };
        } else {
          const unusablePassword = await bcrypt.hash(randomOAuthPassword(), 12);
          const [created] = await connection.execute<ResultSetHeader>(
            "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)", [name, email, unusablePassword, oauthState.role]
          );
          user = { id: created.insertId, name, email, role: oauthState.role };
        }
        await connection.execute("INSERT INTO oauth_accounts (user_id, provider, provider_account_id) VALUES (?, 'google', ?)", [user.id, googleSub]);
      }
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally { connection.release(); }

    await createSession(user);
    const response = NextResponse.redirect(new URL(safeNext(oauthState.next), request.url));
    response.cookies.delete(GOOGLE_OAUTH_COOKIE);
    return response;
  } catch (error) {
    console.error("Google authentication failed:", error);
    return oauthFailure(request, "server_error", oauthState.role);
  }
}

function randomOAuthPassword() {
  return `${crypto.randomUUID()}-${crypto.randomUUID()}`;
}
