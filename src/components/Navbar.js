"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Images, MessageSquare, Users, UserCircle, Info, Lock, LogOut, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@/lib/AuthContext";

const navItems = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/tentang", label: "Tentang", icon: Info },
  { href: "/galeri", label: "Galeri", icon: Images },
  { href: "/pesan", label: "Grup Chat", icon: MessageSquare },
  { href: "/siswa", label: "Siswa", icon: Users },
  { href: "/ruang-rahasia", label: "Rahasia", icon: Lock },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { user: clerkUser } = useUser();
  const { profile } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowUserMenu(false);
    if (showUserMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showUserMenu]);

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

            {/* User Profile Section */}
            {clerkUser && profile ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 transition-all duration-300 hover:bg-slate-100"
                >
                  <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg ring-2 ring-emerald-500/20">
                    {profile?.foto_profil ? (
                      <Image
                        src={profile.foto_profil}
                        alt={profile.username || "User"}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {(profile?.username || "U")[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-semibold text-slate-700">
                      {profile?.username || "User"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {profile?.email || "User"}
                    </span>
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-300 ${showUserMenu ? "rotate-180" : ""}`} />
                </button>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl glass-strong shadow-lg overflow-hidden ring-1 ring-white/20"
                  >
                    <Link
                      href="/profil"
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-white/50 transition-colors border-b border-white/10"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <UserCircle className="h-4 w-4" />
                      Lihat Profil
                    </Link>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        // Trigger Clerk sign out
                        window.location.href = "/auth/signout";
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50/50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <Link
                href="/profil"
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-all duration-300"
              >
                <UserCircle className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={2} />
                <span>Profil</span>
              </Link>
            )}
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

            {/* Mobile User Profile Button */}
            {clerkUser && profile ? (
              <div className="relative flex-shrink-0 ml-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUserMenu(!showUserMenu);
                  }}
                  className="relative flex flex-col items-center gap-1 rounded-xl px-4 py-2.5 text-[10px] font-medium transition-all duration-300 flex-shrink-0"
                >
                  <div className="relative h-5 w-5 flex-shrink-0 overflow-hidden rounded-lg ring-2 ring-emerald-500/20">
                    {profile?.foto_profil ? (
                      <Image
                        src={profile.foto_profil}
                        alt={profile.username || "User"}
                        fill
                        className="object-cover"
                        sizes="20px"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">
                          {(profile?.username || "U")[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="relative z-10 text-emerald-600 font-semibold">Akun</span>
                </button>

                {/* Mobile User Menu Dropdown */}
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-20 right-0 w-48 rounded-xl glass-strong shadow-lg overflow-hidden ring-1 ring-white/20"
                  >
                    <div className="px-4 py-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg ring-2 ring-emerald-500/20">
                          {profile?.foto_profil ? (
                            <Image
                              src={profile.foto_profil}
                              alt={profile.username || "User"}
                              fill
                              className="object-cover"
                              sizes="32px"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                {(profile?.username || "U")[0].toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-700">
                            {profile?.username || "User"}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {profile?.email || "User"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/profil"
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-white/50 transition-colors border-b border-white/10"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <UserCircle className="h-4 w-4" />
                      Lihat Profil
                    </Link>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        window.location.href = "/auth/signout";
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50/50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <Link
                href="/profil"
                className="relative flex flex-col items-center gap-1 rounded-xl px-4 py-2.5 text-[10px] font-medium transition-all duration-300 flex-shrink-0 text-slate-400 hover:text-slate-600"
              >
                <UserCircle className="h-5 w-5" strokeWidth={1.8} />
                <span>Profil</span>
              </Link>
            )}

            {/* Extra padding at the end for scroll space */}
            <div className="w-4 flex-shrink-0" />
          </div>
        </div>
      </nav>
    </>
  );
}
