import { NextResponse } from "next/server";

// Auth protection now handled client-side via AuthContext.
// Supabase Auth with Google OAuth doesn't require server middleware for basic protection.
export function middleware(request) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
