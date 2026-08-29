import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") === "hi" ? "hi" : "en";
  const requestedNext = request.nextUrl.searchParams.get("next");
  const next = requestedNext?.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/";
  const response = NextResponse.redirect(new URL(next, request.url));
  response.cookies.set("alsafar_locale", locale, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 365 });
  return response;
}
