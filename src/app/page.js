"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Users, Images, MessageSquare, Sparkles, ArrowRight,
  Quote, Star, Heart, Camera, Trophy, ChevronRight,
  Loader2, Play, LayoutGrid, MessageCircle, Video,
  Calendar, Clock, MapPin, GraduationCap, Award, 
  PenTool, Wallet, UserCheck, Leaf, School
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
        className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* Professional Badge */}
        <motion.div variants={fadeUp} custom={0} className="mb-6">
          <div className="inline-flex items-center gap-2 sm:gap-3 rounded-full border border-emerald-200/40 bg-emerald-50/25 backdrop-blur-xl px-4 sm:px-7 py-2 text-[10px] sm:text-xs font-semibold text-emerald-700 shadow-lg transition-all hover:bg-emerald-50/35">
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500 animate-pulse" />
            <span className="tracking-[0.2em] sm:tracking-[0.25em] uppercase">SMPN 1 KARANGLEWAS · ANGKATAN 2026</span>
            <div className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </motion.div>

        {/* Professional Logo */}
        <motion.div variants={scaleIn} custom={1} className="mb-8">
          <div className="mx-auto relative h-28 w-28 sm:h-36 sm:w-36">
            <div className="absolute inset-0 rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-emerald-400/25 to-tosca-400/25 blur-3xl animate-pulse-emerald" />
            <div className="relative h-full w-full overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] glass-premium p-4 sm:p-5 border border-white/25 shadow-xl">
              <Image src="/logo.png" alt="Logo 9B" fill className="object-contain" priority sizes="112px" />
            </div>
          </div>
        </motion.div>

        {/* Hero Title */}
        <motion.div variants={fadeUp} custom={2} className="mb-5">
          <h1 className="text-3xl sm:text-5xl lg:text-8xl font-black text-prestige tracking-tight text-[#1a1a1a] mb-4 sm:mb-5 text-balance">
            <span className="gradient-text-warm">Website Kelas 9B</span>
          </h1>
          
          {/* Professional Quote */}
          <div className="relative">
            <Quote className="absolute -top-4 sm:-top-6 left-1/2 -translate-x-1/2 h-5 w-5 sm:h-7 sm:w-7 text-emerald-500/25" />
            <p className="text-base sm:text-xl lg:text-3xl font-semibold text-[#4a5568] italic leading-relaxed text-shadow-premium max-w-4xl mx-auto text-balance">
              "Setiap tawa punya cerita, 
              <span className="gradient-text"> setiap sudut punya memori."</span>
            </p>
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.div variants={fadeUp} custom={3} className="mb-8">
          <p className="text-sm sm:text-base lg:text-lg font-medium text-[#718096] max-w-2xl mx-auto leading-relaxed text-balance">
            Portal kenangan untuk keluarga besar 9B SMPN 1 Karanglewas
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={fadeUp} custom={4} className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
          <SignInButton mode="modal" fallbackRedirectUrl="/">
            <button className="btn-primary group w-full sm:w-auto py-3 sm:py-2.5 px-6">
              <Video className="h-5 w-5" />
              <span>Mulai Jelajah</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </SignInButton>
          
          <Link href="#gallery" className="btn-ghost w-full sm:w-auto py-3 sm:py-2.5 px-6">
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

/* ─── Section: Tentang 9B ───────────────────────────────────────── */
function AboutSection() {
  return (
    <section id="about" className="relative py-24 px-6 bg-gradient-to-b from-[#faf8f5] to-[#f5f2ed] overflow-hidden">
      <div className="container-premium max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/50 bg-emerald-50/30 backdrop-blur-xl px-5 py-2 text-xs font-semibold text-emerald-700 mb-6">
                <School className="h-3.5 w-3.5" />
                <span className="tracking-[0.2em] uppercase">Profil Kelas 9B</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-prestige tracking-tight text-[#1a1a1a] mb-6">
                Membangun <span className="gradient-text-warm">Karakter</span> & <span className="gradient-text">Kenangan</span>
              </h2>
              <p className="text-base sm:text-lg text-[#718096] leading-relaxed mb-8">
                Kelas 9B <strong className="text-[#1a1a1a]">SMP Negeri 1 Karanglewas</strong> adalah wadah kreativitas dan persaudaraan. Sebagai bagian dari sekolah <strong className="text-emerald-600">Adiwiyata</strong>, kami berkomitmen pada kelestarian lingkungan dan prestasi akademik yang gemilang.
              </p>
              
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="flex items-center gap-3 glass-premium p-4 rounded-2xl border border-emerald-100/50">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Leaf className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Adiwiyata</p>
                    <p className="text-sm font-bold text-[#1a1a1a]">Eco School</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 glass-premium p-4 rounded-2xl border border-emerald-100/50">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Star className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Prestasi</p>
                    <p className="text-sm font-bold text-[#1a1a1a]">Unggul & Inovatif</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Stats Infographic */}
          <motion.div 
            className="grid grid-cols-2 gap-4 sm:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="bento-card p-6 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-[#1a1a1a]" />
              </div>
              <h3 className="text-4xl font-black text-[#1a1a1a] tracking-tight mb-1">34</h3>
              <p className="text-xs font-black text-[#a0aec0] uppercase tracking-widest">Total Siswa</p>
            </motion.div>
            
            <motion.div variants={fadeUp} className="bento-card p-6 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center mb-4">
                <Heart className="h-7 w-7 text-pink-500 fill-pink-500" />
              </div>
              <h3 className="text-4xl font-black text-pink-500 tracking-tight mb-1">18</h3>
              <p className="text-xs font-black text-[#a0aec0] uppercase tracking-widest">Perempuan</p>
            </motion.div>
            
            <motion.div variants={fadeUp} className="bento-card p-6 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-blue-500" />
              </div>
              <h3 className="text-4xl font-black text-blue-500 tracking-tight mb-1">16</h3>
              <p className="text-xs font-black text-[#a0aec0] uppercase tracking-widest">Laki-laki</p>
            </motion.div>
            
            <motion.div variants={fadeUp} className="bento-card p-6 text-center flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500 to-tosca-600">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                <Trophy className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-4xl font-black text-white tracking-tight mb-1">2026</h3>
              <p className="text-xs font-black text-white/70 uppercase tracking-widest">Angkatan</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Struktur Pengurus Kelas ─────────────────────────── */
function OrganizationalSection() {
  const pengurus = [
    { role: "Ketua", name: "Aghis Awalia Wayangsari", icon: Crown, color: "from-amber-400 to-orange-500", shadow: "shadow-amber-200/50" },
    { role: "Wakil", name: "Rama Indra Pratama", icon: UserCheck, color: "from-emerald-400 to-tosca-500", shadow: "shadow-emerald-200/50" },
    { role: "Sekretaris 1", name: "Nadira Rafelina", icon: PenTool, color: "from-blue-400 to-indigo-500", shadow: "shadow-blue-200/50" },
    { role: "Sekretaris 2", name: "Jazmi Hilmi Hamizan", icon: PenTool, color: "from-blue-400 to-indigo-500", shadow: "shadow-blue-200/50" },
    { role: "Bendahara 1", name: "Nesa Novisa", icon: Wallet, color: "from-purple-400 to-pink-500", shadow: "shadow-purple-200/50" },
    { role: "Bendahara 2", name: "Aida Novitasari", icon: Wallet, color: "from-purple-400 to-pink-500", shadow: "shadow-purple-200/50" },
  ];

  return (
    <section id="structure" className="relative py-24 px-6 bg-[#fdfcfb]">
      <div className="container-premium max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/35 bg-emerald-50/20 backdrop-blur-xl px-6 py-2 text-xs font-semibold text-emerald-700 mb-6">
            <Trophy className="h-4 w-4" />
            <span className="tracking-[0.2em] uppercase">Organisasi</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-prestige text-[#1a1a1a] mb-6">
            Struktur <span className="gradient-text-warm">Pengurus Kelas</span>
          </h2>
          <p className="text-base text-[#718096] max-w-2xl mx-auto">
            Dikelola dengan profesionalisme dan tanggung jawab untuk kenyamanan bersama
          </p>
        </motion.div>

        {/* Hierarchical Layout */}
        <div className="flex flex-col items-center gap-12">
          {/* Ketua */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="w-full max-w-sm"
          >
            <div className="bento-card p-1 overflow-hidden group">
              <div className={`h-full bg-gradient-to-br ${pengurus[0].color} p-6 flex flex-col items-center justify-center text-center`}>
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-4 shadow-xl group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <p className="text-xs font-black text-white/80 uppercase tracking-[0.3em] mb-1">{pengurus[0].role}</p>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{pengurus[0].name}</h3>
              </div>
            </div>
          </motion.div>

          {/* Connect Line */}
          <div className="h-12 w-1 bg-gradient-to-b from-slate-200 to-emerald-200 hidden md:block" />

          {/* Wakil */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="w-full max-w-xs"
          >
            <div className="bento-card p-6 flex flex-col items-center justify-center text-center group border-emerald-200 shadow-xl shadow-emerald-100/50">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <UserCheck className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.25em] mb-1">{pengurus[1].role}</p>
              <h3 className="text-lg font-bold text-[#1a1a1a]">{pengurus[1].name}</h3>
            </div>
          </motion.div>

          {/* Grid for Secretaries and Treasurers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-4">
            {pengurus.slice(2).map((item, i) => (
              <motion.div 
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <div className="bento-card p-6 flex flex-col items-center justify-center text-center group h-full">
                  <div className={`w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                    <item.icon className="h-5 w-5 text-slate-600" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{item.role}</p>
                  <h3 className="text-base font-bold text-[#1a1a1a] leading-tight">{item.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Section: Jadwal Piket ────────────────────────────────────── */
function PiketSection() {
  const jadwal = [
    { 
      day: "Senin", 
      color: "border-l-emerald-500",
      bg: "bg-emerald-50/30",
      iconColor: "text-emerald-500",
      members: ["Ade Vanes Syahputra", "Adnan fathurrohman", "Aghis Awalia Wayangsari", "Aida Novitasari", "Anggit Slamet Syahputra", "Anton Maulidan", "Aulia Shintya Megarani", "Azmi cheryl ardelia"]
    },
    { 
      day: "Selasa", 
      color: "border-l-blue-500",
      bg: "bg-blue-50/30",
      iconColor: "text-blue-500",
      members: ["Barra Abdillah", "Dwi lestari sulistiyaning tyas", "Farel Juniansyah", "Feliza Nuril Anggraeni", "Fitriyani", "Haikal Fahmi Setya Aji"]
    },
    { 
      day: "Rabu", 
      color: "border-l-violet-500",
      bg: "bg-violet-50/30",
      iconColor: "text-violet-500",
      members: ["Ikbal Anugrah", "Itmam nur Rohman", "Jazmi Hilmi Hamizan", "Keiya Khairunisa Putri", "Maritza Salsabil Az Zahra", "Nadira Rafelina"]
    },
    { 
      day: "Kamis", 
      color: "border-l-amber-500",
      bg: "bg-amber-50/30",
      iconColor: "text-amber-500",
      members: ["M.zaki nurehan", "Nela Oktaviana", "Nesa Novisa", "Nova Erlani", "Nurrizky Ita Dwi Alyana", "Rama Indra P.", "Revan Septian Budiono"]
    },
    { 
      day: "Jumat", 
      color: "border-l-rose-500",
      bg: "bg-rose-50/30",
      iconColor: "text-rose-500",
      members: ["Rena Setyawati", "Rifda Amelia", "Ringga Yazid khoeri", "Rival Catur Widiono", "Shayla ayu saputri", "Tri wahyudiono", "Zahrotus Sita"]
    },
  ];

  return (
    <section id="piket" className="relative py-24 px-6 bg-pattern-warm">
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
            <Calendar className="h-4 w-4" />
            <span className="tracking-[0.2em] uppercase">Kebersihan</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-prestige text-[#1a1a1a] mb-6">
            Jadwal <span className="gradient-text-warm">Piket Harian</span>
          </h2>
          <p className="text-base text-[#718096] max-w-2xl mx-auto">
            Kebersihan adalah sebagian dari iman. Mari kita jaga kelas kita bersama!
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jadwal.map((item, i) => (
            <motion.div 
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className={`bento-card p-0 overflow-hidden border-l-4 ${item.color} h-full`}
            >
              <div className={`p-6 ${item.bg} h-full flex flex-col`}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className={`text-xl font-black ${item.iconColor} tracking-tight`}>{item.day}</h3>
                  <div className={`h-8 w-8 rounded-lg bg-white/50 flex items-center justify-center ${item.iconColor}`}>
                    <Users className="h-4 w-4" />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {item.members.map((name, idx) => (
                    <span key={idx} className="text-xs font-semibold bg-white/60 text-[#4a5568] px-3 py-1.5 rounded-lg border border-white/50 shadow-sm">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Decorative Card */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={5}
            className="bento-card p-6 flex flex-col items-center justify-center text-center bg-gradient-to-br from-emerald-500 to-tosca-600 lg:col-span-1"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">Kelas Bersih, Belajar Nyaman</h3>
            <p className="text-sm text-white/80 italic">"Lingkungan yang bersih menciptakan pikiran yang jernih."</p>
          </motion.div>
        </div>
      </div>
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

/* ─── Landing Page (Long-Scrolling Redesign) ─────────────────────── */
function LandingPage() {
  return (
    <div className="min-h-screen">
      <ProfessionalHeroSection />
      <AboutSection />
      <OrganizationalSection />
      <PiketSection />
      <VideoHeroSection />
      
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
          <div className="group relative w-full min-h-[180px] sm:min-h-[260px] overflow-hidden rounded-2xl border border-white/25 shadow-xl">
            {/* Static Background Image */}
            <Image
              src="/bg-dashboard.jpg"
              alt="Background Dashboard"
              fill
              className="object-cover object-bottom transition-transform duration-700 group-hover:scale-105"
              priority
              sizes="100vw"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Overlay Content */}
            <div className="relative z-10 h-full min-h-[180px] sm:min-h-[260px] flex flex-col items-center justify-center text-center px-6 py-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl px-6 py-2.5"
              >
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-black text-white uppercase tracking-[0.35em]">Family Forever</span>
              </motion.div>
              
              <h2 className="text-3xl sm:text-5xl font-black text-prestige text-white tracking-tight text-shadow-hero mb-3">
                Selamat Datang di <span className="text-emerald-400">Website Kelas 9B</span>
              </h2>
              <p className="text-base font-bold text-white/80 max-w-3xl italic leading-relaxed">
                Portal kenangan angkatan 2026 SMPN 1 Karanglewas. Abadikan setiap detik perjalanan kita.
              </p>
              
              <div className="mt-8 flex items-center gap-5">
                <div className="h-[1px] w-12 bg-white/30" />
                <Heart className="h-5 w-5 text-rose-500 fill-rose-500 animate-pulse" />
                <div className="h-[1px] w-12 bg-white/30" />
              </div>
            </div>

            {/* Caption Overlay */}
            <div className="absolute bottom-6 right-6 z-10">
              <div className="glass-premium px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg">
                <p className="text-xs font-black text-white/70 uppercase tracking-widest flex items-center gap-2">
                  <Users className="h-3.5 w-3.5" /> 34 Anggota Keluarga
                </p>
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