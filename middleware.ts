import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  const isAuthPage = pathname.startsWith("/auth");
  const isProtectedPage = pathname.startsWith("/dashboard") ||
                         pathname.startsWith("/trades") ||
                         pathname.startsWith("/ideas") ||
                         pathname.startsWith("/explore") ||
                         pathname.startsWith("/settings") ||
                         pathname.startsWith("/exchanges") ||
                         pathname.startsWith("/books_review");

  // Check authentication by calling the me endpoint
  try {
    const meUrl = new URL("/api/auth/me", request.url);
    const meResponse = await fetch(meUrl, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    const userData = await meResponse.json();
    const isAuth = meResponse.ok && !!userData;

    // Redirect authenticated users away from auth pages to dashboard
    if (isAuth && isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Redirect authenticated users from home to dashboard
    if (isAuth && pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Redirect unauthenticated users from protected pages to login
    if (!isAuth && isProtectedPage) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // If session check fails, redirect protected routes to login
    if (isProtectedPage) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
    
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/trades/:path*", 
    "/ideas/:path*",
    "/explore/:path*",
    "/settings/:path*",
    "/exchanges/:path*",
    "/books_review/:path*",
    "/auth/:path*"
  ]
};