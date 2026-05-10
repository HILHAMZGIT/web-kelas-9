import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Lindungi semua route kecuali beranda (/) dan file statis
const isProtectedRoute = createRouteMatcher([
  "/galeri(.*)",
  "/pesan(.*)",
  "/profil(.*)",
  "/siswa(.*)",
  "/setup-profile(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
