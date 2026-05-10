import { Inter } from "next/font/google";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { AuthProvider } from "@/lib/AuthContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "WEBSITE 9B — SPENSAKA",
  description:
    "Portal kenangan kelas 9B SMPN 1 Karanglewas. Abadikan momen, jelajahi galeri, dan temukan teman seangkatan.",
  keywords: ["SMPN 1 Karanglewas", "9B", "SPENSAKA", "kenangan", "galeri"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="font-sans antialiased bg-slate-950 text-slate-100 overflow-x-hidden">
        <ClerkProvider>
          <AuthProvider>
            {/* Background ambient glows */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
              <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[120px]" />
              <div className="absolute top-1/2 -right-40 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px]" />
              <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-violet-500/4 blur-[100px]" />
            </div>

            {/* Grid texture overlay */}
            <div className="fixed inset-0 pointer-events-none z-0 grid-bg opacity-50" />

            {/* Navbar */}
            <Navbar />

            {/* Main content */}
            <main className="relative z-10">
              {children}
            </main>

            {/* Footer */}
            <Footer />
          </AuthProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}