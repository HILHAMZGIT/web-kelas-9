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
  title: "Website Kelas 9B — SPENSAKA",
  description:
    "Portal kenangan kelas 9B SMPN 1 Karanglewas. Abadikan momen, jelajahi galeri, dan temukan teman seangkatan.",
  keywords: ["SMPN 1 Karanglewas", "9B", "SPENSAKA", "kenangan", "galeri"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="font-sans antialiased overflow-x-hidden" style={{ background: '#faf8f5', color: '#334155' }}>
        <ClerkProvider>
          <AuthProvider>
            {/* Background ambient glows — soft, warm */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
              <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-emerald-300/10 blur-[150px]" />
              <div className="absolute top-1/2 -right-40 h-[500px] w-[500px] rounded-full bg-teal-200/10 blur-[150px]" />
              <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-amber-200/8 blur-[120px]" />
            </div>

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