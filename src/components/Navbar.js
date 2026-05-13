"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Images, MessageSquare, Users, UserCircle, Info, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const navItems = [
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

      {/* Mobile Navbar — bottom */}
      <nav className="fixed inset-x-0 bottom-0 z-50 md:hidden">
        <div className="mx-auto px-3 pb-3">
          <div className="glass-strong flex items-center gap-1 overflow-x-auto flex-nowrap rounded-2xl px-2 py-2 shadow-[0_-4px_32px_rgba(0,0,0,0.08)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  id={`nav-mobile-${item.label.toLowerCase()}`}
                  className={`relative flex flex-col items-center gap-1 rounded-xl px-4 py-2.5 text-[10px] font-medium transition-all duration-300 flex-shrink-0 ${
                    isActive ? "text-emerald-700" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill-mobile"
                      className="absolute inset-0 rounded-xl bg-emerald-50 ring-1 ring-emerald-200/50"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <Icon
                    className={`h-5 w-5 relative z-10 transition-all duration-300 ${isActive ? "text-emerald-600" : ""}`}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
            {/* Extra padding at the end for scroll space */}
            <div className="w-4 flex-shrink-0" />
          </div>
        </div>
      </nav>
    </>
  );
}
