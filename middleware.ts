import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();
  const token = request.cookies.get("alsafar_session")?.value;
  if (!token) {
    const url = new URL(isAdminRoute ? "/admin/login" : "/login", request.url);
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  try {
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET || "alsafar-development-secret-change-me");
    const { payload } = await jwtVerify(token, secret);
    if (isAdminRoute && payload.role !== "admin") return NextResponse.redirect(new URL("/admin/login", request.url));
    if (request.nextUrl.pathname.startsWith("/dashboard") && payload.role === "admin") return NextResponse.redirect(new URL("/admin", request.url));
  } catch {
    const response = NextResponse.redirect(new URL(isAdminRoute ? "/admin/login" : "/login", request.url));
    response.cookies.delete("alsafar_session");
    return response;
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/book/:path*", "/admin/:path*"] };
