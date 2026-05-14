"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  Users, MessageCircle, Camera, Clock, Calendar, ArrowRight, 
  Sparkles, MessageSquare, ChevronRight, Play, School, Leaf, Star, Trophy, Crown, UserCheck, PenTool, Wallet, Video, Quote, Heart
} from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";
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

/* ─── Framer Variants ───────────────────────────────── */
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

/* ─── LANDING PAGE COMPONENTS ─────────────────────────────────── */

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
    <section id="structure" className="relative py-24 px-6 bg-gradient-to-b from-[#fdfcfb] to-[#faf8f5] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-tosca-400/5 rounded-full blur-3xl" />
      </div>
      <div className="container-premium max-w-7xl mx-auto">
        <motion.div className="text-center mb-20" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
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
        <div className="flex flex-col items-center gap-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="w-full max-w-sm">
            <div className="glass-premium p-8 rounded-3xl border border-white/30 shadow-2xl backdrop-blur-xl group hover:scale-105 transition-all duration-500">
              <div className={`h-full bg-gradient-to-br ${pengurus[0].color} p-8 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10" />
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
                    <Crown className="h-10 w-10 text-white" />
                  </div>
                  <p className="text-sm font-black text-white/80 uppercase tracking-[0.3em] mb-2">{pengurus[0].role}</p>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">{pengurus[0].name}</h3>
                </div>
              </div>
            </div>
          </motion.div>
          <div className="h-16 w-1 bg-gradient-to-b from-amber-300 to-emerald-300 rounded-full hidden md:block" />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="w-full max-w-md">
            <div className="glass-premium p-6 rounded-2xl border border-white/25 shadow-xl backdrop-blur-lg group hover:scale-105 transition-all duration-500">
              <div className={`bg-gradient-to-br ${pengurus[1].color} p-6 rounded-xl flex flex-col items-center justify-center text-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <UserCheck className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black text-white/80 uppercase tracking-[0.25em] mb-1">{pengurus[1].role}</p>
                    <h3 className="text-xl font-black text-white tracking-tight">{pengurus[1].name}</h3>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          <div className="flex items-center gap-8 mt-8">
            <div className="h-12 w-1 bg-gradient-to-b from-emerald-300 to-blue-300 rounded-full hidden md:block" />
            <div className="h-12 w-1 bg-gradient-to-b from-emerald-300 to-purple-300 rounded-full hidden md:block" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="space-y-4">
              <h4 className="text-center text-lg font-black text-[#1a1a1a] uppercase tracking-widest mb-4">Sekretaris</h4>
              {pengurus.slice(2, 4).map((item, i) => (
                <div key={i} className="glass-premium p-5 rounded-xl border border-white/20 shadow-lg backdrop-blur-lg group hover:scale-105 transition-all duration-300">
                  <div className={`bg-gradient-to-br ${item.color} p-4 rounded-lg flex items-center gap-4 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/5" />
                    <div className="relative z-10 w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="relative z-10">
                      <p className="text-xs font-black text-white/80 uppercase tracking-[0.2em] mb-1">{item.role}</p>
                      <h4 className="text-lg font-bold text-white tracking-tight">{item.name}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="space-y-4">
              <h4 className="text-center text-lg font-black text-[#1a1a1a] uppercase tracking-widest mb-4">Bendahara</h4>
              {pengurus.slice(4, 6).map((item, i) => (
                <div key={i} className="glass-premium p-5 rounded-xl border border-white/20 shadow-lg backdrop-blur-lg group hover:scale-105 transition-all duration-300">
                  <div className={`bg-gradient-to-br ${item.color} p-4 rounded-lg flex items-center gap-4 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/5" />
                    <div className="relative z-10 w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="relative z-10">
                      <p className="text-xs font-black text-white/80 uppercase tracking-[0.2em] mb-1">{item.role}</p>
                      <h4 className="text-lg font-bold text-white tracking-tight">{item.name}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PiketSection() {
  const jadwal = [
    { day: "Senin", color: "border-l-emerald-500", bg: "bg-emerald-50/30", iconColor: "text-emerald-500", members: ["Ade Vanes Syahputra", "Adnan fathurrohman", "Aghis Awalia Wayangsari", "Aida Novitasari", "Anggit Slamet Syahputra", "Anton Maulidan", "Aulia Shintya Megarani", "Azmi cheryl ardelia"] },
    { day: "Selasa", color: "border-l-blue-500", bg: "bg-blue-50/30", iconColor: "text-blue-500", members: ["Barra Abdillah", "Dwi lestari sulistiyaning tyas", "Farel Juniansyah", "Feliza Nuril Anggraeni", "Fitriyani", "Haikal Fahmi Setya Aji"] },
    { day: "Rabu", color: "border-l-violet-500", bg: "bg-violet-50/30", iconColor: "text-violet-500", members: ["Ikbal Anugrah", "Itmam nur Rohman", "Jazmi Hilmi Hamizan", "Keiya Khairunisa Putri", "Maritza Salsabil Az Zahra", "Nadira Rafelina"] },
    { day: "Kamis", color: "border-l-amber-500", bg: "bg-amber-50/30", iconColor: "text-amber-500", members: ["M.zaki nurehan", "Nela Oktaviana", "Nesa Novisa", "Nova Erlani", "Nurrizky Ita Dwi Alyana", "Rama Indra P.", "Revan Septian Budiono"] },
    { day: "Jumat", color: "border-l-rose-500", bg: "bg-rose-50/30", iconColor: "text-rose-500", members: ["Rena Setyawati", "Rifda Amelia", "Ringga Yazid khoeri", "Rival Catur Widiono", "Shayla ayu saputri", "Tri wahyudiono", "Zahrotus Sita"] },
  ];

  return (
    <section id="piket" className="relative py-24 px-6 bg-pattern-warm">
      <div className="container-premium max-w-7xl mx-auto">
        <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jadwal.map((item, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className={`bento-card p-0 overflow-hidden border-l-4 ${item.color} h-full`}>
              <div className={`p-6 ${item.bg} h-full flex flex-col`}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className={`text-xl font-black ${item.iconColor} tracking-tight`}>{item.day}</h3>
                  <div className={`h-8 w-8 rounded-lg bg-white/50 flex items-center justify-center ${item.iconColor}`}>
                    <Users className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.members.map((name, idx) => (
                    <span key={idx} className="text-xs font-semibold bg-white/60 text-[#4a5568] px-3 py-1.5 rounded-lg border border-white/50 shadow-sm">{name}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={5} className="bento-card p-6 flex flex-col items-center justify-center text-center bg-gradient-to-br from-emerald-500 to-tosca-600 lg:col-span-1">
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

function VideoHeroSection() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section id="gallery" className="relative py-20 px-6 bg-gradient-to-b from-[#faf8f5] to-[#f5f2ed]">
      <div className="container-premium max-w-7xl mx-auto">
        <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
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
        <motion.div className="relative aspect-video rounded-2xl overflow-hidden glass-premium border border-white/25 shadow-xl bg-black/5" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp}>
          <video 
            ref={videoRef}
            src="/video-utama.mp4" 
            controls={isPlaying}
            className="absolute inset-0 w-full h-full object-cover z-0 rounded-2xl"
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            Maaf, browser Anda tidak mendukung pemutaran video.
          </video>
          
          {!isPlaying && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[2px] cursor-pointer" onClick={handlePlay}>
              <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-tosca-500 flex items-center justify-center shadow-xl mb-4 group">
                <Play className="h-9 w-9 text-white ml-1 group-hover:scale-110 transition-transform" fill="white" />
              </motion.div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white drop-shadow-md">Putar Video Kenangan</h3>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}


function LandingPage() {
  return (
    <div className="page-shell">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-pattern-warm px-4">
        <div className="absolute inset-0">
          <Image src="/bg-kelas.jpg" alt="Website Kelas 9B" fill className="object-cover object-center opacity-40" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#faf8f5] via-transparent to-[#faf8f5]/60" />
        </div>
        
        <motion.div className="relative z-10 text-center max-w-5xl mx-auto" initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeUp} className="mb-6">
             <div className="inline-flex items-center gap-3 rounded-full border border-emerald-200/40 bg-emerald-50/25 backdrop-blur-xl px-5 py-2 text-[10px] sm:text-xs font-semibold text-emerald-700 shadow-lg">
               <Sparkles className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
               <span className="tracking-widest uppercase">SMPN 1 KARANGLEWAS · ANGKATAN 2026</span>
             </div>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-4xl sm:text-7xl lg:text-9xl font-black text-[#1a1a1a] tracking-tight mb-8">
            Ruang <span className="gradient-text-warm">Kenangan</span> 9B
          </motion.h1>

          <motion.div variants={fadeUp} className="mb-12 relative">
             <Quote className="absolute -top-8 left-1/2 -translate-x-1/2 h-10 w-10 text-emerald-500/10" />
             <p className="text-xl sm:text-3xl font-bold text-[#4a5568] italic max-w-3xl mx-auto">
                "Abadi dalam ingatan, <span className="gradient-text">selamanya dalam persaudaraan."</span>
             </p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignInButton mode="modal" fallbackRedirectUrl="/">
              <button className="btn-primary py-4 px-8 text-lg">
                <Video className="h-6 w-6" />
                <span>Mulai Jelajah</span>
                <ArrowRight className="h-6 w-6" />
              </button>
            </SignInButton>
            <Link href="#about" className="btn-ghost py-4 px-8 text-lg">
              <School className="h-6 w-6" />
              <span>Tentang Kelas</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="container-premium max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
               <h2 className="text-3xl sm:text-5xl font-black text-[#1a1a1a] mb-6">Membangun <span className="gradient-text">Karakter</span></h2>
               <p className="text-lg text-slate-500 leading-relaxed mb-8">
                  Kelas 9B SMP Negeri 1 Karanglewas adalah wadah kreativitas dan persaudaraan. Kami bangga menjadi bagian dari sekolah Adiwiyata yang mengedepankan kelestarian lingkungan.
               </p>
               <div className="flex gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex-1">
                     <Leaf className="h-6 w-6 text-emerald-600 mb-2" />
                     <p className="text-sm font-bold text-slate-800">Sekolah Adiwiyata</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex-1">
                     <Star className="h-6 w-6 text-blue-600 mb-2" />
                     <p className="text-sm font-bold text-slate-800">Prestasi Gemilang</p>
                  </div>
               </div>
            </motion.div>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: "Siswa", val: "34", icon: Users, color: "bg-slate-100" },
                 { label: "Angkatan", val: "2026", icon: Trophy, color: "bg-amber-100" },
                 { label: "Perempuan", val: "18", icon: Heart, color: "bg-pink-100" },
                 { label: "Laki-laki", val: "16", icon: UserCheck, color: "bg-blue-100" },
               ].map((s) => (
                 <div key={s.label} className={`p-6 rounded-3xl ${s.color} text-center`}>
                    <s.icon className="h-6 w-6 mx-auto mb-3 opacity-50" />
                    <p className="text-3xl font-black text-slate-800">{s.val}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.label}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recovered Sections */}
      <OrganizationalSection />
      <PiketSection />
      <VideoHeroSection />
      
    </div>
  );
}

/* ─── DASHBOARD (LOGGED IN) ─────────────────────────────────── */

const scheduleData = {
  1: [ // SENIN
    { start: "07:40", end: "09:00", subject: "Matematika" },
    { start: "09:30", end: "10:50", subject: "IPA" },
    { start: "10:50", end: "12:10", subject: "Bahasa Indonesia" },
    { start: "12:10", end: "13:30", subject: "Kokurikuler (Bu Indah)" }
  ],
  2: [ // SELASA
    { start: "07:00", end: "09:00", subject: "Bahasa Indonesia" },
    { start: "09:30", end: "10:50", subject: "PPKN" },
    { start: "10:50", end: "12:50", subject: "IPS" },
    { start: "12:50", end: "14:00", subject: "Kokurikuler (Bu Kristianah)" }
  ],
  3: [ // RABU
    { start: "07:40", end: "09:00", subject: "IPA" },
    { start: "09:30", end: "10:50", subject: "Informatika" },
    { start: "10:50", end: "12:10", subject: "PAI" },
    { start: "12:10", end: "12:50", subject: "Bahasa Jawa" },
    { start: "12:50", end: "14:00", subject: "Kokurikuler (Bu Indah)" }
  ],
  4: [ // KAMIS
    { start: "07:40", end: "09:00", subject: "Prakarya" },
    { start: "09:00", end: "09:40", subject: "Bahasa Jawa" },
    { start: "10:10", end: "12:10", subject: "Bahasa Inggris" },
    { start: "12:10", end: "12:50", subject: "BK" },
    { start: "12:50", end: "14:00", subject: "Kokurikuler (Bu Laila)" }
  ],
  5: [ // JUMAT
    { start: "07:40", end: "09:00", subject: "PJOK" },
    { start: "09:00", end: "09:40", subject: "Matematika" },
    { start: "09:40", end: "11:00", subject: "Kokurikuler (Pak Taufik)" }
  ],
};

const staticSiswaNames = [
  "Ade Vanes", "Adnan Fathurrohman", "Aghis Awalia", "Aida Novita", "Anggit Slamet", "Anton Maulidan", "Aulia Shintya", "Azmi Cheryl", "Barra Abdillah", "Dwi Lestari", "Farel Juniansyah", "Feliza Nuril", "Fitriyani", "Haikal Fahmi", "Ikbal Anugrah", "Itmam Nur", "Jazmi Hilmi", "Keiya Khairunisa", "Maritza Salsabil", "Nadira Rafelina", "M. Zaki", "Nela Oktaviana", "Nesa Novisa", "Nova Erlani", "Nurrizky Ita", "Rama Indra", "Revan Septian", "Rena Setyawati", "Rifda Amelia", "Ringga Yazid", "Rival Catur", "Shayla Ayu", "Tri Wahyudiono", "Zahrotus Sita"
];

function Dashboard({ user, profile, stats }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const displayName = profile?.username || user?.user_metadata?.full_name?.split(" ")[0] || "Siswa 9B";
  const avatarUrl = profile?.foto_profil || user?.user_metadata?.avatar_url;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const spotlightName = useMemo(() => {
    const seed = currentTime.getFullYear() * 10000 + (currentTime.getMonth() + 1) * 100 + currentTime.getDate();
    return staticSiswaNames[seed % staticSiswaNames.length];
  }, [currentTime]);

  return (
    <div className="relative bg-pattern-warm page-shell pt-24 pb-32">
      <div className="container-premium max-w-7xl mx-auto px-4">
        
        {/* Header Widget */}
        <motion.section initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
           <div>
              <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                 Sistem Aktif • SPENSAKA 9B
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-slate-800 tracking-tight leading-tight">
                 Selamat {currentTime.getHours() < 11 ? "Pagi" : currentTime.getHours() < 15 ? "Siang" : currentTime.getHours() < 19 ? "Sore" : "Malam"},<br />
                 <span className="gradient-text">{displayName}!</span>
              </h1>
           </div>

           <div className="flex items-center gap-4 glass-premium px-6 py-4 rounded-3xl border border-white/40 shadow-xl">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                 <Clock className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Waktu Lokal</p>
                 <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-800 tabular-nums">
                       {currentTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">WIB</span>
                 </div>
              </div>
           </div>
        </motion.section>

        {/* Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
           {/* Schedule Board */}
           <div className="lg:col-span-3 bento-card p-6 sm:p-8 bg-white/40">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-black text-slate-800">Jadwal Pelajaran</h2>
                 <Calendar className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                 {Object.entries(scheduleData).map(([day, sessions]) => (
                    <div key={day} className="space-y-3">
                       <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                          {["", "Senin", "Selasa", "Rabu", "Kamis", "Jumat"][day]}
                       </p>
                       {sessions.map((s, i) => (
                          <div key={i} className="p-3 rounded-xl bg-white/60 border border-white/50 shadow-sm">
                             <p className="text-xs font-bold text-slate-800">{s.subject}</p>
                             <p className="text-[9px] text-slate-400">{s.start} - {s.end}</p>
                          </div>
                       ))}
                    </div>
                 ))}
              </div>
           </div>

           {/* Spotlight & Chat Quick Link */}
           <div className="lg:col-span-1 space-y-6">
              <div className="bento-card p-6 bg-amber-50 border-amber-200">
                 <Sparkles className="h-6 w-6 text-amber-500 mb-4" />
                 <p className="text-[10px] font-bold text-amber-600 uppercase mb-2">Siswa Hari Ini</p>
                 <h3 className="text-2xl font-black text-slate-800 mb-4">{spotlightName}</h3>
                 <Link href="/siswa" className="text-[10px] font-bold text-amber-600 flex items-center gap-1 hover:gap-2 transition-all">
                    LIHAT PROFIL <ArrowRight className="h-3 w-3" />
                 </Link>
              </div>

              <div className="bento-card p-6 bg-slate-900 text-white relative overflow-hidden">
                 <MessageSquare className="absolute -right-4 -bottom-4 h-24 w-24 opacity-10" />
                 <h4 className="text-lg font-bold mb-1">Grup Chat</h4>
                 <p className="text-xs text-white/50 mb-6">Ngobrol bareng teman-teman 9B.</p>
                 <Link href="/pesan" className="btn-primary py-2 px-4 text-xs w-full text-center">Buka Chat</Link>
              </div>
           </div>
        </div>

        {/* Stats Section */}
        <section className="mt-12 bento-card p-8 bg-white/50">
           <div className="grid grid-cols-3 gap-8">
              {[
                { label: "Siswa", val: stats.siswa || 34, icon: Users, color: "text-slate-800" },
                { label: "Foto", val: stats.galeri, icon: Camera, color: "text-emerald-600" },
                { label: "Pesan", val: stats.pesan, icon: MessageCircle, color: "text-blue-600" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                   <s.icon className={`h-6 w-6 mx-auto mb-2 ${s.color}`} />
                   <p className={`text-2xl font-black ${s.color}`}><AnimatedCounter target={s.val} active={stats.ready} /></p>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.label}</p>
                </div>
              ))}
           </div>
        </section>

      </div>
    </div>
  );
}

/* ─── MAIN HOME COMPONENT ─────────────────────────────────────── */

export default function HomePage() {
  const { user, profile, loading, needsProfileSetup } = useAuth();
  const [stats, setStats] = useState({ siswa: 0, galeri: 0, pesan: 0, ready: false });
  const router = useRouter();

  useEffect(() => {
    if (!loading && needsProfileSetup) router.push("/setup-profile");
  }, [loading, needsProfileSetup, router]);

  useEffect(() => {
    if (!user) return;
    const updateStats = async () => {
      const [siswa, galeri, pesan] = await Promise.all([
        fetchCount("siswa"),
        fetchCount("galeri"),
        fetchCount("obrolan_kelas"),
      ]);
      setStats({ siswa, galeri, pesan, ready: true });
    };
    updateStats();
    
    const c1 = supabase.channel("c1").on("postgres_changes", { event: "*", schema: "public", table: "obrolan_kelas" }, updateStats).subscribe();
    const c2 = supabase.channel("c2").on("postgres_changes", { event: "*", schema: "public", table: "galeri" }, updateStats).subscribe();
    return () => { supabase.removeChannel(c1); supabase.removeChannel(c2); };
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pattern-warm">
        <div className="relative h-16 w-16 rounded-2xl border-4 border-emerald-100 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  if (user && !needsProfileSetup) return <Dashboard user={user} profile={profile} stats={stats} />;
  return <LandingPage />;
}