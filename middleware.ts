import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Allow public routes (login, api)
  if (req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (err) {
    // Clear invalid cookie and redirect
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("token", { path: "/" });
    return res;
  }
}

// Protect dashboard and any subpaths
export const config = {
  matcher: ["/dashboard/:path*"],
};
