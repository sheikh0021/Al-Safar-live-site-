import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import type { Role, SessionUser } from "@/lib/types";

const COOKIE_NAME = "alsafar_session";
const secret = () => new TextEncoder().encode(process.env.SESSION_SECRET || "alsafar-development-secret-change-me");

export async function createSession(user: SessionUser) {
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt().setExpirationTime("7d").sign(secret());
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const role = payload.role;
    if (role !== "traveler" && role !== "guide" && role !== "admin") return null;
    return { id: Number(payload.id), name: String(payload.name), email: String(payload.email), role };
  } catch { return null; }
}

export async function getAdminSession(): Promise<SessionUser | null> {
  const user = await getSession();
  return user?.role === "admin" ? user : null;
}

export async function clearSession() { (await cookies()).delete(COOKIE_NAME); }
