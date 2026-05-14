"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Users, Crown, UserCheck, PenTool, Wallet, Calendar, MapPin } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.8, ease: [0.23, 1, 0.32, 1] }
  })
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
  visible: { transition: { staggerChildren: 0.15 } }
};

const slideUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.23, 1, 0.32, 1] } }
};

export default function DashboardPage() {
  const { user, loading, needsProfileSetup } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/");
    if (!loading && needsProfileSetup) router.replace("/setup-profile");
  }, [loading, user, needsProfileSetup, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-slate-400">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  const fullName = user?.user_metadata?.full_name || "Siswa 9B";

  return (
    <div className="relative min-h-screen page-shell">
      {/* Welcome Banner Section */}
      <section className="relative py-32 px-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/bg-dashboard.jpg"
            alt="Background Dashboard"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 via-teal-800/30 to-cyan-900/40"></div>
        </div>

        <motion.div
          className="container-premium max-w-7xl mx-auto relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeIn} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2 text-sm font-medium text-white mb-6">
              <Crown className="h-4 w-4" />
              Selamat Datang di Portal Kenangan 9B
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              Halo, <span className="gradient-text-warm">{fullName.split(' ')[0]}</span>!
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Selamat bergabung kembali dengan keluarga besar SPENSAKA 9B. Mari jelajahi kenangan dan temukan teman seangkatanmu.
            </p>
          </motion.div>

          <motion.div variants={scaleIn} className="text-center">
            <div className="inline-flex items-center gap-3 rounded-2xl glass-strong px-8 py-4 text-white">
              <MapPin className="h-5 w-5" />
              <span className="font-medium">SMPN 1 Karanglewas · Angkatan 2026</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Statistics Section */}
      <section className="relative py-24 px-6 bg-white">
        <div className="container-premium max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp} custom={0}>
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
                Statistik <span className="gradient-text-warm">Kelas 9B</span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Data terbaru kelas kita yang penuh semangat dan solidaritas
              </p>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Total Siswa", value: "34", icon: Users, color: "from-emerald-400 to-teal-500" },
              { label: "Perempuan", value: "18", icon: UserCheck, color: "from-blue-400 to-indigo-500" },
              { label: "Laki-laki", value: "16", icon: UserCheck, color: "from-purple-400 to-pink-500" }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                custom={i + 1}
                className="glass-premium p-8 text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-black text-slate-800 mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizational Structure Section */}
      <section className="relative py-24 px-6 bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="container-premium max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp} custom={0}>
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
                Struktur <span className="gradient-text-warm">Pengurus Kelas</span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Tim pengurus yang memimpin kelas 9B dengan dedikasi dan semangat
              </p>
            </motion.div>
          </motion.div>

          <div className="flex flex-col items-center space-y-8">
            {/* Ketua */}
            <motion.div variants={fadeUp} custom={1} className="text-center">
              <div className="glass-premium p-8 rounded-3xl max-w-sm mx-auto">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 mb-4">
                  <Crown className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">Aghis Awalia Wayangsari</h3>
                <p className="text-sm text-amber-600 font-medium">Ketua Kelas 9B</p>
              </div>
            </motion.div>

            {/* Connection Line */}
            <motion.div variants={slideUp} className="w-px h-8 bg-gradient-to-b from-amber-400 to-emerald-400"></motion.div>

            {/* Wakil */}
            <motion.div variants={fadeUp} custom={2} className="text-center">
              <div className="glass-premium p-8 rounded-3xl max-w-sm mx-auto">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 mb-4">
                  <UserCheck className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">Rama Indra Pratama</h3>
                <p className="text-sm text-emerald-600 font-medium">Wakil Ketua Kelas 9B</p>
              </div>
            </motion.div>

            {/* Connection Line */}
            <motion.div variants={slideUp} className="w-px h-8 bg-gradient-to-b from-emerald-400 to-blue-400"></motion.div>

            {/* Sekretaris & Bendahara */}
            <motion.div variants={fadeUp} custom={3} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
              <div className="glass-premium p-6 rounded-3xl text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 mb-4">
                  <PenTool className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-1">Sekretaris</h4>
                <p className="text-sm text-blue-600 mb-2">Nadira Rafelina</p>
                <p className="text-sm text-blue-600">Jazmi Hilmi Hamizan</p>
              </div>

              <div className="glass-premium p-6 rounded-3xl text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 mb-4">
                  <Wallet className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-1">Bendahara</h4>
                <p className="text-sm text-purple-600 mb-2">Nesa Novisa</p>
                <p className="text-sm text-purple-600">Aida Novitasari</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Piket Schedule Section */}
      <section className="relative py-24 px-6 bg-white">
        <div className="container-premium max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp} custom={0}>
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
                Jadwal <span className="gradient-text-warm">Piket Harian</span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Sistem piket untuk menjaga kebersihan dan kenyamanan kelas
              </p>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { hari: "Senin", members: ["Ahmad", "Budi", "Citra", "Dina", "Eka", "Fani", "Gina", "Hana"], color: "emerald" },
              { hari: "Selasa", members: ["Ika", "Joko", "Kiki", "Lina", "Mira", "Nina"], color: "blue" },
              { hari: "Rabu", members: ["Oka", "Pandu", "Qori", "Rina", "Sari", "Tina"], color: "violet" },
              { hari: "Kamis", members: ["Uci", "Vino", "Wati", "Xena", "Yudi", "Zara", "Alya"], color: "amber" },
              { hari: "Jumat", members: ["Bunga", "Candra", "Dika", "Elsa", "Fira", "Gita", "Hadi"], color: "rose" },
              { hari: "Bonus", members: ["Kelas Bersih, Belajar Nyaman"], color: "slate", isQuote: true }
            ].map((piket, i) => (
              <motion.div
                key={piket.hari}
                variants={fadeUp}
                custom={i + 1}
                className={`glass-premium p-6 rounded-2xl border-l-4 border-l-${piket.color}-400`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className={`h-5 w-5 text-${piket.color}-500`} />
                  <h3 className="font-bold text-slate-800">{piket.hari}</h3>
                </div>

                {piket.isQuote ? (
                  <p className="text-sm text-slate-600 italic">"{piket.members[0]}"</p>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {piket.members.map((member, idx) => {
                      const colorClasses = {
                        emerald: "bg-emerald-100 text-emerald-700",
                        blue: "bg-blue-100 text-blue-700",
                        violet: "bg-violet-100 text-violet-700",
                        amber: "bg-amber-100 text-amber-700",
                        rose: "bg-rose-100 text-rose-700",
                        slate: "bg-slate-100 text-slate-700"
                      };
                      return (
                        <span
                          key={idx}
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${colorClasses[piket.color]}`}
                        >
                          {member}
                        </span>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
