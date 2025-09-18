// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Convert the secret into a Uint8Array for Web Crypto
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      // Will throw if invalid
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (error) {
      console.error("JWT verification failed:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// ✅ DO NOT use runtime: "nodejs" in middleware
export const config = {
  matcher: ["/dashboard/:path*"],
};
