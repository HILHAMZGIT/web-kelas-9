"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Users, Images, MessageSquare, Sparkles, ArrowRight,
  Quote, Star, Heart, Zap, Camera, Trophy, ChevronRight,
  Loader2, Play,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";
import { SignInButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Animated Counter ─────────────────────────────────────── */
function AnimatedCounter({ target, duration = 1500, active, suffix = "" }) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (!active || target === 0) return;
    const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) { setCount(target); return; }
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(target * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, active, duration]);
  return <span className="tabular-nums">{count}{suffix}</span>;
}

async function fetchCount(table) {
  try {
    const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
    return error ? 0 : (count ?? 0);
  } catch { return 0; }
}

/* ─── Framer variants ───────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ─── Landing Page (belum login) ───────────────────────────── */
function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full border border-emerald-200/30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full border border-emerald-100/20 pointer-events-none" />

      <motion.div
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center pt-24 pb-32"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* Badge */}
        <motion.div variants={fadeUp} custom={0}>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-5 py-2 text-xs font-medium text-emerald-700 shadow-sm backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            SMPN 1 Karanglewas · Angkatan 2026
            <Sparkles className="h-3.5 w-3.5" />
          </div>
        </motion.div>

        {/* Logo + Title */}
        <motion.div variants={fadeUp} custom={1} className="mt-8">
          <div className="mx-auto mb-6 relative h-24 w-24">
            <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-xl animate-pulse-glow" />
            <div className="relative h-full w-full overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-lg">
              <Image src="/logo.png" alt="Logo SMPN 1 Karanglewas" fill className="object-cover" priority sizes="96px" />
            </div>
          </div>
          <h1 className="text-6xl font-black tracking-tight sm:text-7xl lg:text-8xl">
            <span className="gradient-text-hero text-5xl sm:text-6xl lg:text-7xl">Website</span>
            <br />
            <span className="gradient-text-hero">Kelas 9B</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div variants={fadeUp} custom={2} className="mt-6 max-w-lg">
          <p className="text-base font-semibold text-slate-700 sm:text-lg">
            Selamat datang di Portal Kenangan Kelas 9B SPENSAKA.
          </p>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed italic">
            &ldquo;Setiap tawa punya cerita, setiap sudut punya memori.&rdquo;
          </p>
        </motion.div>

        {/* Google Login Button */}
        <motion.div variants={fadeUp} custom={3} className="mt-10">
          <SignInButton mode="modal" fallbackRedirectUrl="/">
            <button
              id="btn-login-google"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-white px-8 py-4 text-slate-900 font-bold text-base shadow-[0_4px_24px_rgba(0,0,0,0.08)] ring-1 ring-black/5 transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <svg className="relative z-10 h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="relative z-10">Login with Google</span>
            </button>
          </SignInButton>
          <p className="mt-4 text-xs text-slate-400">
            Hanya untuk siswa & alumni SMPN 1 Karanglewas
          </p>
        </motion.div>

        {/* Feature badges */}
        <motion.div variants={fadeUp} custom={4} className="mt-8 flex flex-wrap justify-center gap-2">
          {[
            { icon: Camera, label: "Galeri Foto" },
            { icon: MessageSquare, label: "Chat 9B" },
            { icon: Users, label: "34 Siswa" },
            { icon: Heart, label: "Website Kelas 9B" },
          ].map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/60 px-3 py-1.5 text-[11px] text-slate-500 backdrop-blur-sm">
              <Icon className="h-3 w-3 text-emerald-500" strokeWidth={2} />
              {label}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─── Beranda (sudah login) ─────────────────────────────────── */
function Dashboard({ user, profile, stats }) {
  const displayName = profile?.username || user?.user_metadata?.full_name?.split(" ")[0] || "Siswa 9B";
  const avatarUrl = profile?.foto_profil || user?.user_metadata?.avatar_url;

  return (
    <div className="relative min-h-screen page-shell">
      <div className="mx-auto max-w-6xl px-4 pb-32 pt-24 sm:px-6 md:pt-28 lg:px-8">

        {/* ═══ HERO SECTION: Main Memory ═══ */}
        <motion.section
          className="mb-10"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {/* Badge + Welcome */}
          <motion.div variants={fadeUp} custom={0} className="text-center mb-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-1.5 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Portal Kenangan Aktif — Kelas 9B
            </div>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              <span className="gradient-text-hero">Main Memory</span>
            </h1>
            <p className="mt-3 text-sm text-slate-500 sm:text-base">
              Selamat datang kembali,{" "}
              <span className="font-semibold text-emerald-600">{displayName}</span>!
            </p>
          </motion.div>

          {/* ═══ VIDEO PLACEHOLDER ═══ */}
          <motion.div variants={fadeUp} custom={1} className="mb-6">
            <div className="bento-card overflow-hidden p-0">
              <div className="relative w-full aspect-video bg-gradient-to-br from-emerald-100/60 via-teal-50/40 to-amber-50/30 flex items-center justify-center">
                {/* Shimmer overlay */}
                <div className="absolute inset-0 shimmer opacity-40" />
                {/* Decorative circles */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 rounded-full border-2 border-emerald-200/40 animate-pulse-glow" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full border border-emerald-100/30" />
                {/* Play button placeholder */}
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm ring-1 ring-black/5 shadow-lg transition-transform hover:scale-110 cursor-pointer">
                    <Play className="h-8 w-8 text-emerald-600 ml-1" fill="currentColor" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-600">Video Utama Kelas 9B</p>
                    <p className="text-xs text-slate-400 mt-1">Placeholder — tambahkan video di sini</p>
                  </div>
                </div>
                {/* Bottom caption bar */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-white/80 to-transparent backdrop-blur-sm p-4 sm:p-6">
                  <p className="text-center text-sm sm:text-base font-medium text-slate-600 italic">
                    &ldquo;Setiap tawa punya cerita, setiap sudut punya memori.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ═══ BENTO GRID ═══ */}
          <motion.div
            variants={fadeUp}
            custom={2}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {/* Card: Statistik */}
            <div className="bento-card lg:col-span-2 p-6 sm:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 via-transparent to-transparent pointer-events-none" />
              <div className="relative z-10">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 ring-1 ring-emerald-200/60">
                    <Trophy className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Statistik Kelas</p>
                    <p className="text-[11px] text-slate-400">Data real-time dari database</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Siswa", value: stats.siswa || 34, icon: Users, color: "text-blue-600", bg: "bg-blue-50", ring: "ring-blue-200/60" },
                    { label: "Foto", value: stats.galeri, icon: Camera, color: "text-violet-600", bg: "bg-violet-50", ring: "ring-violet-200/60" },
                    { label: "Pesan", value: stats.pesan, icon: MessageSquare, color: "text-emerald-600", bg: "bg-emerald-50", ring: "ring-emerald-200/60" },
                  ].map(({ label, value, icon: Icon, color, bg, ring }) => (
                    <div key={label} className="flex flex-col items-center gap-3 rounded-2xl border border-black/5 bg-white/50 p-4 transition-all hover:border-emerald-200/50 hover:bg-white/80">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${bg} ${ring}`}>
                        <Icon className={`h-5 w-5 ${color}`} strokeWidth={1.8} />
                      </div>
                      <p className={`text-3xl font-black leading-none ${color}`}>
                        <AnimatedCounter target={value} active={stats.ready || label === "Siswa"} duration={1200} />
                      </p>
                      <p className="text-center text-xs text-slate-400">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card: User */}
            <div className="bento-card p-5">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100/40 via-transparent to-transparent pointer-events-none" />
              <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 text-center">
                <div className="h-16 w-16 overflow-hidden rounded-2xl ring-2 ring-emerald-200/50 shadow-md">
                  {avatarUrl ? (
                    <Image src={avatarUrl} alt="Avatar" width={64} height={64} className="object-cover h-full w-full" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-200 to-teal-300">
                      <Users className="h-6 w-6 text-emerald-700" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{user?.user_metadata?.full_name || displayName}</p>
                  {profile?.username && (
                    <p className="mt-0.5 text-xs text-emerald-600 font-medium">@{profile.username}</p>
                  )}
                  <p className="mt-0.5 text-xs text-slate-400">Siswa Kelas 9B · SPENSAKA</p>
                </div>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700">● Online</span>
              </div>
            </div>

            {/* Card: Chat */}
            <div className="bento-card p-6 group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent pointer-events-none" />
              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 ring-1 ring-blue-200/60">
                    <MessageSquare className="h-4 w-4 text-blue-600" strokeWidth={1.8} />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Chat Kelas</p>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">
                  Tulis pesan & kesan untuk teman, guru, atau momen spesial yang akan dikenang selamanya.
                </p>
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/50 px-3 py-2">
                  <Zap className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                  <span className="text-[11px] text-blue-600">Real-time messaging</span>
                </div>
                <Link href="/pesan" id="bento-tembok-link" className="mt-4 flex items-center justify-between rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 ring-1 ring-blue-200/50 transition-all hover:bg-blue-100/80 group-hover:ring-blue-300/60">
                  Buka Chat <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Card: Galeri */}
            <div className="bento-card p-6 group">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-transparent pointer-events-none" />
              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50 ring-1 ring-violet-200/60">
                    <Images className="h-4 w-4 text-violet-600" strokeWidth={1.8} />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-violet-600">Galeri Foto</p>
                </div>
                <div className="grid grid-cols-3 gap-1.5 flex-1">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-square rounded-lg ring-1 ring-black/5"
                      style={{ background: `linear-gradient(135deg, hsl(${150 + i * 25}, 40%, 85%), hsl(${170 + i * 20}, 35%, 90%))` }} />
                  ))}
                </div>
                <Link href="/galeri" id="bento-galeri-link" className="mt-4 flex items-center justify-between rounded-xl bg-violet-50 px-4 py-2.5 text-sm font-medium text-violet-700 ring-1 ring-violet-200/50 transition-all hover:bg-violet-100/80 group-hover:ring-violet-300/60">
                  Lihat Galeri <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Card: Daftar Siswa */}
            <div className="bento-card p-6 group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/40 via-transparent to-transparent pointer-events-none" />
              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 ring-1 ring-orange-200/60">
                    <Users className="h-4 w-4 text-orange-600" strokeWidth={1.8} />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">Daftar Siswa</p>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">
                  Lihat profil foto, quotes, dan Instagram semua 34 siswa Kelas 9B SPENSAKA.
                </p>
                <Link href="/siswa" id="bento-siswa-link" className="mt-4 flex items-center justify-between rounded-xl bg-orange-50 px-4 py-2.5 text-sm font-medium text-orange-700 ring-1 ring-orange-200/50 transition-all hover:bg-orange-100/80 group-hover:ring-orange-300/60">
                  Lihat Semua Siswa <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Card: Quote */}
            <div className="bento-card lg:col-span-3 p-6 sm:p-8">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-50/40 via-transparent to-emerald-50/40 pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:gap-8">
                <div className="flex-1">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 ring-1 ring-amber-200/60">
                      <Quote className="h-4 w-4 text-amber-600" strokeWidth={1.8} />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">Motto Kelas 9B</p>
                  </div>
                  <blockquote className="text-lg font-semibold leading-relaxed text-slate-700 sm:text-xl">
                    &ldquo;Bersama kita tumbuh, bersama kita dikenang.{" "}
                    <span className="gradient-text">Kelas 9B bukan sekadar angkatan</span>
                    {" "}— kami adalah keluarga.&rdquo;
                  </blockquote>
                </div>
                <div className="mt-5 sm:mt-0 flex flex-col items-start sm:items-end gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">34 siswa, satu semangat</p>
                  <p className="text-xs text-slate-300">SMPN 1 Karanglewas · 2026</p>
                </div>
              </div>
            </div>

          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const { user, profile, loading, needsProfileSetup } = useAuth();
  const [stats, setStats] = useState({ siswa: 0, galeri: 0, pesan: 0, ready: false });
  const router = useRouter();

  // Redirect to setup-profile if needed
  useEffect(() => {
    if (!loading && needsProfileSetup) {
      router.push("/setup-profile");
    }
  }, [loading, needsProfileSetup, router]);

  // Fetch stats when logged in
  useEffect(() => {
    if (!user) { setStats({ siswa: 0, galeri: 0, pesan: 0, ready: false }); return; }
    let cancelled = false;
    (async () => {
      const [siswa, galeri, pesan] = await Promise.all([
        fetchCount("siswa"), fetchCount("galeri"), fetchCount("pesan_kesan"),
      ]);
      if (!cancelled) setStats({ siswa, galeri, pesan, ready: true });
    })();
    return () => { cancelled = true; };
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (user && !needsProfileSetup) {
    return <Dashboard user={user} profile={profile} stats={stats} />;
  }

  return <LandingPage />;
}