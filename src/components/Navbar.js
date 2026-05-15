"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Images, MessageSquare, Users, UserCircle, Info, Lock, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";

const publicNavItems = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/tentang", label: "Tentang", icon: Info },
  { href: "/galeri", label: "Galeri", icon: Images },
  { href: "/pesan", label: "Grup Chat", icon: MessageSquare },
  { href: "/siswa", label: "Siswa", icon: Users },
  { href: "/ruang-rahasia", label: "Rahasia", icon: Lock },
];

const authenticatedNavItems = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/tentang", label: "Tentang", icon: Info },
  { href: "/galeri", label: "Galeri", icon: Images },
  { href: "/pesan", label: "Grup Chat", icon: MessageSquare },
  { href: "/siswa", label: "Siswa", icon: Users },
  { href: "/ruang-rahasia", label: "Rahasia", icon: Lock },
  { href: "/profil", label: "Profil", icon: UserCircle },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { user, loading } = useAuth();

  const navItems = user ? authenticatedNavItems : publicNavItems;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Desktop + Tablet Navbar */}
      <nav
        className={`fixed inset-x-0 top-0 z-50 hidden md:flex transition-all duration-500 ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        <div className={`mx-auto w-full max-w-6xl px-4 transition-all duration-500 ${scrolled ? "max-w-5xl" : ""}`}>
          <div
            className={`flex items-center justify-between rounded-2xl px-5 transition-all duration-500 ${
              scrolled
                ? "glass-strong shadow-[0_8px_32px_rgba(0,0,0,0.06)] h-14"
                : "bg-transparent h-16"
            }`}
          >
            {/* Brand */}
            <Link href="/" id="nav-brand" className="flex items-center gap-3 group">
              <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-xl ring-1 ring-black/5 transition-all duration-300 group-hover:ring-emerald-500/40 group-hover:shadow-[0_0_16px_rgba(16,185,129,0.2)]">
                <Image src="/logo.png" alt="Logo SPENSAKA" fill className="object-cover" sizes="36px" priority />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold tracking-wide text-slate-800">SPENSAKA</span>
                <span className="text-[10px] text-slate-400 tracking-widest uppercase">Website Kelas 9B</span>
              </div>
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    id={`nav-${item.label.toLowerCase()}`}
                    className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      isActive ? "text-emerald-700" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-xl bg-emerald-50 ring-1 ring-emerald-200/60"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <Icon className="h-3.5 w-3.5 flex-shrink-0 relative z-10" strokeWidth={2} />
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile App-Style Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-[9999] md:hidden bg-white/90 backdrop-blur-md border-t border-slate-200/50 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.04)] pointer-events-auto">
        <div className="w-full flex overflow-x-auto overflow-y-hidden whitespace-nowrap overscroll-x-contain no-scrollbar touch-pan-x pointer-events-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-shrink-0 min-w-[70px] flex flex-col items-center gap-1 px-3 py-2 transition-all duration-300 pointer-events-auto"
              >
                <div className={`relative flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-300 ${
                  isActive ? "bg-emerald-50 shadow-sm" : ""
                }`}>
                  <Icon className={`h-5 w-5 relative z-10 transition-all duration-300 ${
                    isActive ? "text-emerald-600" : "text-slate-400"
                  }`} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] font-bold whitespace-nowrap transition-all duration-300 ${
                  isActive ? "text-emerald-600 opacity-100" : "text-slate-400 opacity-70"
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
