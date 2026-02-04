import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  const signatureLevel = req.cookies.get("signature_level")?.value;

  const pathname = req.nextUrl.pathname;

  const publicRoutes = ["/login", "/register"];

  if (!accessToken && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (
    pathname.startsWith("/dashboard") &&
    signatureLevel !== "Super" &&
    signatureLevel !== "System"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (accessToken && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
