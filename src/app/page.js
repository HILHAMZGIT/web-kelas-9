"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Users, Images, MessageSquare, Sparkles, ArrowRight,
  Quote, Star, Heart, Camera, Trophy, ChevronRight,
  Loader2, Play, LayoutGrid, MessageCircle, Video,
  Calendar, Clock, MapPin, Code, Heart as HeartIcon
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
    const { count, error } = await supabase
      .from(table)
      .select("id", { count: "exact", head: true });
    return error ? 0 : (count ?? 0);
  } catch { return 0; }
}

/* ─── Professional Framer Variants ───────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.8, ease: [0.23, 1, 0.32, 1] }
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.0, ease: [0.23, 1, 0.32, 1] } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.23, 1, 0.32, 1] } }
};

/* ─── Professional Hero Section ─────────────────────────────────── */
function ProfessionalHeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-pattern-warm">
      {/* Professional Image Background */}
      <div className="absolute inset-0">
        <Image 
          src="/bg-kelas.jpg" 
          alt="Website Kelas 9B" 
          fill 
          className="object-cover object-center" 
          priority 
          sizes="100vw"
        />
        {/* Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/15 via-transparent to-tosca-900/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#faf8f5] via-transparent to-[#faf8f5]/60" />
        <div className="absolute inset-0 bg-noise opacity-15" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 left-12 w-28 h-28 bg-emerald-400/8 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-24 right-12 w-36 h-36 bg-tosca-400/8 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Content */}
      <motion.div 
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* Professional Badge */}
        <motion.div variants={fadeUp} custom={0} className="mb-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-emerald-200/40 bg-emerald-50/25 backdrop-blur-xl px-7 py-2.5 text-xs font-semibold text-emerald-700 shadow-lg transition-all hover:bg-emerald-50/35">
            <Sparkles className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
            <span className="tracking-[0.25em] uppercase">SMPN 1 KARANGLEWAS · ANGKATAN 2026</span>
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </motion.div>

        {/* Professional Logo */}
        <motion.div variants={scaleIn} custom={1} className="mb-10">
          <div className="mx-auto relative h-36 w-36">
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-emerald-400/25 to-tosca-400/25 blur-3xl animate-pulse-emerald" />
            <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] glass-premium p-5 border border-white/25 shadow-xl">
              <Image src="/logo.png" alt="Logo 9B" fill className="object-contain" priority sizes="144px" />
            </div>
          </div>
        </motion.div>

        {/* Hero Title */}
        <motion.div variants={fadeUp} custom={2} className="mb-6">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-prestige tracking-tight text-[#1a1a1a] mb-5">
            <span className="gradient-text-warm">Website Kelas 9B</span>
          </h1>
          
          {/* Professional Quote */}
          <div className="relative">
            <Quote className="absolute -top-6 left-1/2 -translate-x-1/2 h-7 w-7 text-emerald-500/25" />
            <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#4a5568] italic leading-relaxed text-shadow-premium max-w-4xl mx-auto">
              "Setiap tawa punya cerita, 
              <span className="gradient-text"> setiap sudut punya memori."</span>
            </p>
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.div variants={fadeUp} custom={3} className="mb-10">
          <p className="text-base sm:text-lg font-medium text-[#718096] max-w-2xl mx-auto leading-relaxed">
            Portal kenangan untuk keluarga besar 9B SMPN 1 Karanglewas
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={fadeUp} custom={4} className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <SignInButton mode="modal" fallbackRedirectUrl="/">
            <button className="btn-primary group">
              <Video className="h-5 w-5" />
              <span>Mulai Jelajah</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </SignInButton>
          
          <Link href="#gallery" className="btn-ghost">
            <Play className="h-5 w-5" />
            <span>Lihat Kenangan</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 border-2 border-emerald-400/40 rounded-full flex justify-center"
        >
          <div className="w-1 h-2 bg-emerald-400/40 rounded-full mt-1.5 animate-pulse" />
        </motion.div>
      </motion.div>
    </section>
  );
}
/* ─── Video Hero Section (Placeholder) ───────────────────────── */
function VideoHeroSection() {
  return (
    <section id="gallery" className="relative py-20 px-6 bg-gradient-to-b from-[#faf8f5] to-[#f5f2ed]">
      <div className="container-premium max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/35 bg-emerald-50/20 backdrop-blur-xl px-6 py-2 text-xs font-semibold text-emerald-700 mb-6">
            <Video className="h-4 w-4" />
            <span className="tracking-[0.2em] uppercase">Video Kenangan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-prestige text-[#1a1a1a] mb-6">
            <span className="gradient-text-warm">Video Utama Kelas</span>
          </h2>
          <p className="text-base text-[#718096] max-w-2xl mx-auto">
            Video perjalanan kita bersama di 9B SMPN 1 Karanglewas
          </p>
        </motion.div>

        {/* Professional Video Placeholder */}
        <motion.div 
          className="relative aspect-video rounded-2xl overflow-hidden glass-premium border border-white/25 shadow-xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideUp}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/8 to-tosca-900/8" />
          <div className="absolute inset-0 bg-dots opacity-25" />
          
          {/* Video Placeholder Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
            {/* Play Button */}
            <motion.div 
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-tosca-500 flex items-center justify-center shadow-xl mb-8 cursor-pointer group"
            >
              <Play className="h-9 w-9 text-white ml-1 group-hover:scale-110 transition-transform" fill="white" />
              <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse" />
            </motion.div>
            
            {/* Video Info */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">
                Video Kenangan Kelas 9B
              </h3>
              <p className="text-[#718096] mb-4">
                Tempat video kenangan terindah kita bersama
              </p>
              <div className="flex items-center gap-4 text-sm text-[#a0aec0]">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Coming Soon</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>2024-2026</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-4 left-4 w-14 h-14 bg-emerald-400/15 rounded-2xl blur-xl" />
          <div className="absolute bottom-4 right-4 w-18 h-18 bg-tosca-400/15 rounded-2xl blur-xl" />
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Keluarga Besar 9B Section ───────────────────────────────── */
function Keluarga9BSection() {
  return (
    <section className="relative py-20 px-6 bg-gradient-to-b from-[#f5f2ed] to-[#faf8f5]">
      <div className="container-premium max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/35 bg-emerald-50/20 backdrop-blur-xl px-6 py-2 text-xs font-semibold text-emerald-700 mb-6">
            <Users className="h-4 w-4" />
            <span className="tracking-[0.2em] uppercase">Keluarga Besar</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-prestige text-[#1a1a1a] mb-6">
            <span className="gradient-text-warm">Keluarga Besar 9B</span>
          </h2>
          <p className="text-base text-[#718096] max-w-2xl mx-auto">
            34 jiwa, 1 keluarga, kenangan yang tak terlupakan
          </p>
        </motion.div>

        {/* Professional Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-auto">
          {/* Main Class Photo - Large */}
          <motion.div 
            className="md:col-span-8 md:row-span-2 group relative overflow-hidden rounded-2xl glass-premium border border-white/25 shadow-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideUp}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative h-full min-h-[350px]">
              {/* Background Image */}
              <Image 
                src="/foto-kelas.jpeg" 
                alt="Foto Bersama Kelas 9B" 
                fill 
                className="object-cover" 
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 66vw"
              />
              
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Content - Bottom Left */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white mb-2 text-shadow-hero">Foto Bersama Kelas</h3>
                <p className="text-white/90 mb-4 text-sm">Momen paling ikonik kita bersama</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/80 backdrop-blur-sm text-white text-xs font-medium">
                  <Users className="h-4 w-4" />
                  <span>34 Anggota</span>
                </div>
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>

          {/* Study Tour Card */}
          <motion.div 
            className="md:col-span-4 group relative overflow-hidden rounded-2xl glass-premium border border-white/25 shadow-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideUp}
            custom={1}
            whileHover={{ scale: 1.03 }}
          >
            <div className="h-full min-h-[180px]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/35 to-indigo-50/25" />
              <div className="absolute inset-0 bg-dots opacity-20" />
              
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
                <MapPin className="h-7 w-7 text-blue-500 mb-2 group-hover:scale-105 transition-transform" />
                <h3 className="text-base font-bold text-[#1a1a1a] mb-1">Study Tour</h3>
                <p className="text-xs text-[#718096]">Petualangan seru</p>
              </div>
            </div>
          </motion.div>

          {/* Daily Fun Card */}
          <motion.div 
            className="md:col-span-4 group relative overflow-hidden rounded-2xl glass-premium border border-white/25 shadow-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideUp}
            custom={2}
            whileHover={{ scale: 1.03 }}
          >
            <div className="h-full min-h-[180px]">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100/35 to-orange-50/25" />
              <div className="absolute inset-0 bg-dots opacity-20" />
              
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
                <Heart className="h-7 w-7 text-amber-500 mb-2 group-hover:scale-105 transition-transform fill-amber-500" />
                <h3 className="text-base font-bold text-[#1a1a1a] mb-1">Keseruan Harian</h3>
                <p className="text-xs text-[#718096]">Tawa dan canda</p>
              </div>
            </div>
          </motion.div>

          {/* Achievement Card */}
          <motion.div 
            className="md:col-span-4 group relative overflow-hidden rounded-2xl glass-premium border border-white/25 shadow-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideUp}
            custom={3}
            whileHover={{ scale: 1.03 }}
          >
            <div className="h-full min-h-[180px]">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100/35 to-pink-50/25" />
              <div className="absolute inset-0 bg-dots opacity-20" />
              
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
                <Trophy className="h-7 w-7 text-purple-500 mb-2 group-hover:scale-105 transition-transform" />
                <h3 className="text-base font-bold text-[#1a1a1a] mb-1">Prestasi</h3>
                <p className="text-xs text-[#718096]">Bangga bersama</p>
              </div>
            </div>
          </motion.div>

          {/* Quote Card - Full Width */}
          <motion.div 
            className="md:col-span-12 group relative overflow-hidden rounded-2xl glass-premium border border-white/25 shadow-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideUp}
            custom={4}
          >
            <div className="p-10 text-center">
              <Quote className="h-10 w-10 text-emerald-500/25 mx-auto mb-5" />
              <blockquote className="text-xl sm:text-2xl lg:text-3xl font-black text-prestige text-[#1a1a1a] leading-relaxed mb-6">
                "Bersama kita tumbuh, 
                <span className="gradient-text-warm">bersama kita dikenang.</span> 
                9B bukan sekadar angkatan — kami adalah keluarga."
              </blockquote>
              <div className="flex items-center justify-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
/* ─── Professional Footer ───────────────────────────────────── */
function FooterCredit() {
  return (
    <footer className="footer-credit py-12 px-6 border-t border-white/20">
      <div className="container-premium max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Bagian Kiri - Brand Info */}
          <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-tosca-600 flex items-center justify-center shadow-lg">
                <span className="text-lg font-black text-white">9B</span>
              </div>
              <div>
                <h3 className="text-lg font-black text-[#1a1a1a] tracking-tight">SPENSAKA 9B</h3>
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">Website Kelas 9B</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-[#718096] font-medium">
                SMPN 1 Karanglewas
              </p>
              <p className="text-xs text-[#a0aec0] font-semibold uppercase tracking-wider">
                Angkatan 2026
              </p>
            </div>
          </div>

          {/* Bagian Kanan - Team Info */}
          <div className="flex flex-col items-center md:items-end gap-3 text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100/50 border border-slate-200/50">
              <Code className="h-4 w-4 text-slate-600" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Engineering Team</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 bg-emerald-500 rounded-full" />
                <p className="text-sm font-bold text-[#1a1a1a]">
                  Jazmi Hilmi Hamizan
                  <span className="text-xs font-semibold text-emerald-600 ml-2">Lead Developer</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 bg-slate-400 rounded-full" />
                <p className="text-sm font-medium text-[#718096]">
                  Rama Indra Pratama
                  <span className="text-xs text-slate-500 ml-2">Helper</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Landing Page (Professional Redesign) ─────────────────────── */
function LandingPage() {
  return (
    <div className="min-h-screen">
      <ProfessionalHeroSection />
      <VideoHeroSection />
      <Keluarga9BSection />
      
      {/* Final CTA Section */}
      <section className="relative py-20 px-6 bg-gradient-to-b from-[#faf8f5] to-[#f5f2ed]">
        <div className="container-premium max-w-4xl mx-auto text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-prestige text-[#1a1a1a] mb-6">
              Siap <span className="gradient-text-warm">Bernostalgia</span>?
            </h2>
            <p className="text-base text-[#718096] mb-8">
              Bergabunglah dengan keluarga besar 9B dan jelajahi semua kenangan indah kita
            </p>
            <SignInButton mode="modal" fallbackRedirectUrl="/">
              <button className="btn-primary text-base px-8 py-3">
                <Sparkles className="h-5 w-5" />
                <span>Mulai Sekarang</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </SignInButton>
          </motion.div>
        </div>
      </section>
      
      {/* Footer Credit */}
      <FooterCredit />
    </div>
  );
}

/* ─── Dashboard (Sudah Login) ────────────────────────────────── */
function Dashboard({ user, profile, stats }) {
  const displayName = profile?.username || user?.user_metadata?.full_name?.split(" ")[0] || "Siswa 9B";
  const avatarUrl = profile?.foto_profil || user?.user_metadata?.avatar_url;

  return (
    <div className="relative min-h-screen bg-pattern-warm page-shell">
      <div className="container-premium max-w-7xl mx-auto px-6 pb-32 pt-28 sm:px-8 md:pt-32">
        
        {/* Professional Header */}
        <motion.section
          className="mb-16"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp} custom={0} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-emerald-200/45 bg-emerald-50/25 backdrop-blur-xl px-6 py-2.5 text-xs font-semibold text-emerald-700 shadow-lg">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="tracking-widest uppercase">Portal Kenangan Aktif</span>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-prestige tracking-tight text-[#1a1a1a]">
                Main <span className="gradient-text-warm">Memory</span>
              </h1>
              <p className="mt-5 text-lg font-medium text-[#718096] sm:text-xl leading-relaxed">
                Selamat datang kembali, <span className="text-[#1a1a1a] font-bold">{displayName}</span>. 
                <span className="block text-[#a0aec0] italic mt-1">Teruslah menulis sejarah.</span>
              </p>
            </div>
            
            {/* Quick Profile Summary */}
            <div className="flex items-center gap-4 glass-premium p-4 rounded-2xl border border-white/25 shadow-lg transition-all hover:shadow-xl">
              <div className="h-14 w-14 overflow-hidden rounded-xl ring-2 ring-emerald-200/45 shadow-md">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="Avatar" width={56} height={56} className="object-cover h-full w-full" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-200 to-teal-300">
                    <Users className="h-7 w-7 text-emerald-700" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-[#1a1a1a] text-base truncate">{user?.user_metadata?.full_name || displayName}</p>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Siswa 9B</p>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Hero Visual Section */}
        <motion.section variants={fadeUp} custom={1} className="mb-16">
          <div className="group relative w-full aspect-[21/9] overflow-hidden rounded-2xl glass-premium border border-white/25 shadow-xl">
            <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
              {/* Background Video */}
              <video
                src="/video-utama.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-55 transition-transform duration-600 group-hover:scale-105"
              />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent flex flex-col items-center justify-center text-center px-6">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/8 backdrop-blur-xl px-6 py-2.5"
                >
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-black text-white uppercase tracking-[0.35em]">Family Forever</span>
                </motion.div>
                
                <h2 className="text-3xl sm:text-5xl font-black text-prestige text-white tracking-tight text-shadow-hero mb-3">
                  Selamat Datang di <span className="text-emerald-400">Website Kelas 9B</span>
                </h2>
                <p className="text-base font-bold text-white/75 max-w-3xl italic leading-relaxed">
                  Portal kenangan angkatan 2026 SMPN 1 Karanglewas. Abadikan setiap detik perjalanan kita.
                </p>
                
                <div className="mt-8 flex items-center gap-5">
                  <div className="h-[1px] w-12 bg-white/25" />
                  <Heart className="h-5 w-5 text-rose-500 fill-rose-500 animate-pulse" />
                  <div className="h-[1px] w-12 bg-white/25" />
                </div>
              </div>

              {/* Caption Overlay */}
              <div className="absolute bottom-6 right-6">
                <div className="glass-premium px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg">
                  <p className="text-xs font-black text-white/55 uppercase tracking-widest flex items-center gap-2">
                    <Users className="h-3.5 w-3.5" /> 34 Anggota Keluarga
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Professional Stats Section */}
        <motion.section variants={fadeUp} custom={2} className="mb-16">
          <div className="bento-card p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Siswa", value: stats.siswa || 34, icon: Users, color: "text-[#1a1a1a]", bg: "bg-slate-100/45" },
                { label: "Foto", value: stats.galeri, icon: Camera, color: "text-emerald-600", bg: "bg-emerald-100/45" },
                { label: "Pesan", value: stats.pesan, icon: MessageCircle, color: "text-blue-600", bg: "bg-blue-100/45" },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="text-center">
                  <div className={`mx-auto w-14 h-14 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                    <Icon className={`h-7 w-7 ${color}`} />
                  </div>
                  <p className={`text-3xl font-black ${color} tracking-tight mb-1`}>
                    <AnimatedCounter target={value} active={stats.ready || label === "Siswa"} />
                  </p>
                  <p className="text-xs font-bold text-[#a0aec0] uppercase tracking-widest">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section variants={fadeUp} custom={3} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bento-card p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-11 w-11 rounded-xl bg-blue-100/45 flex items-center justify-center">
                <MessageSquare className="h-5.5 w-5.5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#1a1a1a]">Grup Chat</h3>
                <p className="text-sm text-[#718096]">Obrolan real-time dengan teman</p>
              </div>
            </div>
            <Link href="/pesan" className="btn-primary w-full justify-center">
              <MessageCircle className="h-5 w-5" />
              <span>Buka Grup Chat</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="bento-card p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-11 w-11 rounded-xl bg-slate-100/45 flex items-center justify-center">
                <Images className="h-5.5 w-5.5 text-[#1a1a1a]" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#1a1a1a]">Arsip Galeri</h3>
                <p className="text-sm text-[#718096]">Ribuan momen terabadikan</p>
              </div>
            </div>
            <Link href="/galeri" className="btn-ghost w-full justify-center">
              <LayoutGrid className="h-5 w-5" />
              <span>Lihat Galeri</span>
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.section>
      </div>
      
      {/* Footer Credit */}
      <FooterCredit />
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

  // Fetch stats when logged in with Real-time
  useEffect(() => {
    if (!user) { setStats({ siswa: 0, galeri: 0, pesan: 0, ready: false }); return; }

    const updateStats = async () => {
      const [siswa, galeri, pesan] = await Promise.all([
        fetchCount("siswa"),
        fetchCount("galeri"),
        fetchCount("obrolan_kelas"),
      ]);
      setStats({ siswa, galeri, pesan, ready: true });
    };

    updateStats();

    // Subscribe to changes
    const chatChannel = supabase
      .channel("stats-chat")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "obrolan_kelas" }, updateStats)
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "obrolan_kelas" }, updateStats)
      .subscribe();

    const galeriChannel = supabase
      .channel("stats-galeri")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "galeri" }, updateStats)
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "galeri" }, updateStats)
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
      supabase.removeChannel(galeriChannel);
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pattern-warm">
        <div className="relative">
          <div className="h-20 w-20 rounded-3xl border-4 border-emerald-100 border-t-emerald-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-black text-emerald-600 uppercase tracking-tighter">9B</span>
          </div>
        </div>
        <p className="mt-8 text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Initializing Portal...</p>
      </div>
    );
  }

  if (user && !needsProfileSetup) {
    return (
      <Dashboard 
        user={user} 
        profile={profile} 
        stats={stats} 
      />
    );
  }

  return <LandingPage />;
}