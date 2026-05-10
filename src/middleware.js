import { clerkMiddleware } from "@clerk/nextjs/server";

// Menggunakan clerkMiddleware dasar untuk mengaktifkan Clerk Auth.
// Proteksi halaman (redirect) sudah ditangani di level klien (AuthContext / page).
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
