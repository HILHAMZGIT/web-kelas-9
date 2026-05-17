"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Users, GraduationCap, Sparkles, Award, Crown,
  UserCheck, BookOpen, PenLine, Wallet, Calendar,
  Leaf, School, Heart,
} from "lucide-react";
import InstagramIcon from "@/components/InstagramIcon";

/* ─── Animation Variants ─────────────────────────────────── */
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
  visible: { transition: { staggerChildren: 0.15 } }
};

/* ─── Data ─────────────────────────────────── */
const pengurus = [
  { role: "Ketua", name: "Aghis Awalia Wayangsari", icon: Crown, color: "from-amber-400 to-orange-500", shadow: "shadow-amber-200/50" },
  { role: "Wakil", name: "Rama Indra Pratama", icon: UserCheck, color: "from-emerald-400 to-tosca-500", shadow: "shadow-emerald-200/50" },
  { role: "Sekretaris 1", name: "Nadira Rafelina", icon: PenLine, color: "from-blue-400 to-indigo-500", shadow: "shadow-blue-200/50" },
  { role: "Sekretaris 2", name: "Jazmi Hilmi Hamizan", icon: PenLine, color: "from-blue-400 to-indigo-500", shadow: "shadow-blue-200/50" },
  { role: "Bendahara 1", name: "Nesa Novisa", icon: Wallet, color: "from-purple-400 to-pink-500", shadow: "shadow-purple-200/50" },
  { role: "Bendahara 2", name: "Aida Novitasari", icon: Wallet, color: "from-purple-400 to-pink-500", shadow: "shadow-purple-200/50" },
];

const strukturKelas = [
  { jabatan: "Ketua", nama: "Aghis Awalia", icon: Crown, color: "text-amber-600", bg: "bg-amber-100" },
  { jabatan: "Wakil", nama: "Rama Indra", icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-100" },
  { jabatan: "Sekretaris 1", nama: "Nadira Rafelina", icon: PenLine, color: "text-blue-600", bg: "bg-blue-100" },
  { jabatan: "Sekretaris 2", nama: "Jazmi Hilmi", icon: PenLine, color: "text-blue-600", bg: "bg-blue-100" },
  { jabatan: "Bendahara 1", nama: "Nesa Novisa", icon: Wallet, color: "text-purple-600", bg: "bg-purple-100" },
  { jabatan: "Bendahara 2", nama: "Aida Novita", icon: Wallet, color: "text-purple-600", bg: "bg-purple-100" },
];

const jadwalPiket = [
  { 
    hari: "Senin", 
    color: "border-l-emerald-500",
    bg: "bg-emerald-50/30",
    iconColor: "text-emerald-500",
    anggota: ["Ade Vanes Syahputra", "Adnan fathurrohman", "Aghis Awalia Wayangsari", "Aida Novitasari", "Anggit Slamet Syahputra", "Anton Maulidan", "Aulia Shintya Megarani", "Azmi cheryl ardelia"]
  },
  { 
    hari: "Selasa", 
    color: "border-l-blue-500",
    bg: "bg-blue-50/30",
    iconColor: "text-blue-500",
    anggota: ["Barra Abdillah", "Dwi lestari sulistiyaning tyas", "Farel Juniansyah", "Feliza Nuril Anggraeni", "Fitriyani", "Haikal Fahmi Setya Aji"]
  },
  { 
    hari: "Rabu", 
    color: "border-l-violet-500",
    bg: "bg-violet-50/30",
    iconColor: "text-violet-500",
    anggota: ["Ikbal Anugrah", "Itmam nur Rohman", "Jazmi Hilmi Hamizan", "Keiya Khairunisa Putri", "Maritza Salsabil Az Zahra", "Nadira Rafelina"]
  },
  { 
    hari: "Kamis", 
    color: "border-l-amber-500",
    bg: "bg-amber-50/30",
    iconColor: "text-amber-500",
    anggota: ["M.zaki nurehan", "Nela Oktaviana", "Nesa Novisa", "Nova Erlani", "Nurrizky Ita Dwi Alyana", "Rama Indra P.", "Revan Septian Budiono"]
  },
  { 
    hari: "Jumat", 
    color: "border-l-rose-500",
    bg: "bg-rose-50/30",
    iconColor: "text-rose-500",
    anggota: ["Rena Setyawati", "Rifda Amelia", "Ringga Yazid khoeri", "Rival Catur Widiono", "Shayla ayu saputri", "Tri wahyudiono", "Zahrotus Sita"]
  },
];

const hariColors = {
  Senin: "bg-emerald-500",
  Selasa: "bg-blue-500",
  Rabu: "bg-violet-500",
  Kamis: "bg-amber-500",
  Jumat: "bg-rose-500",
};

export default function TentangPage() {
  return (
    <div className="relative min-h-screen page-shell">
      <motion.div
        className="mx-auto max-w-5xl px-4 pb-32 pt-24 sm:px-6 md:pt-28"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* ─── Header Section ─── */}
        <motion.section variants={fadeUp} custom={0} className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/50 bg-emerald-50/30 backdrop-blur-xl px-5 py-2 text-xs font-semibold text-emerald-700 mb-6">
            <School className="h-3.5 w-3.5" />
            <span className="tracking-[0.2em] uppercase">Profil Kelas 9B</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-prestige tracking-tight text-[#1a1a1a] mb-6">
            Tentang <span className="gradient-text-warm">Kami</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#718096] leading-relaxed">
            Kelas 9B <strong className="text-[#1a1a1a]">SMP Negeri 1 Karanglewas</strong> — Sekolah Adiwiyata yang
            mencetak generasi peduli lingkungan dan berkarakter. Kami bangga menjadi bagian dari
            keluarga besar SPENSAKA, tempat di mana ilmu, persahabatan, dan kenangan tumbuh bersama.
          </p>

          {/* Adiwiyata Badge */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-emerald-200/40 bg-emerald-50/20 px-5 py-2.5">
            <Leaf className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700">Sekolah Adiwiyata</span>
            <span className="text-xs text-emerald-500">• Peduli Lingkungan</span>
          </div>
        </motion.section>

        {/* ─── Instagram CTA ─── */}
        <motion.section variants={fadeUp} custom={1} className="mb-16">
          <a
            href="https://instagram.com/ofc.ixbest"
            target="_blank"
            rel="noopener noreferrer"
            className="group block bento-card p-6 sm:p-8 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5">
              <div className="flex-shrink-0 h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <InstagramIcon className="h-8 w-8 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs font-bold text-[#a0aec0] uppercase tracking-widest mb-1">Follow Kami di Instagram</p>
                <p className="text-2xl font-black text-[#1a1a1a] tracking-tight">@ofc.ixbest</p>
                <p className="text-sm text-[#718096] mt-1">Update terbaru, momen seru, dan kegiatan kelas 9B</p>
              </div>
              <div className="sm:ml-auto flex-shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 text-white text-sm font-bold px-6 py-2.5 shadow-lg group-hover:shadow-xl transition-all">
                  <InstagramIcon className="h-4 w-4" />
                  Follow
                </span>
              </div>
            </div>
          </a>
        </motion.section>

        {/* ─── Statistik Kelas ─── */}
        <motion.section variants={fadeUp} custom={2} className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-prestige text-[#1a1a1a]">
              Statistik <span className="gradient-text">Kelas</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Siswa", value: "34", icon: Users, color: "text-emerald-600", bg: "bg-emerald-100/50" },
              { label: "Perempuan", value: "18", icon: Heart, color: "text-pink-600", bg: "bg-pink-100/50" },
              { label: "Laki-laki", value: "16", icon: Users, color: "text-blue-600", bg: "bg-blue-100/50" },
            ].map((stat) => (
              <div key={stat.label} className="bento-card p-6 text-center">
                <div className={`mx-auto w-14 h-14 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                  <stat.icon className={`h-7 w-7 ${stat.color}`} />
                </div>
                <p className={`text-4xl font-black ${stat.color} tracking-tight mb-1`}>{stat.value}</p>
                <p className="text-xs font-bold text-[#a0aec0] uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ─── Profil Pendidik ─── */}
        <motion.section variants={fadeUp} custom={3} className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-prestige text-[#1a1a1a]">
              Profil <span className="gradient-text">Pendidik</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Kepala Sekolah */}
            <div className="bento-card p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-amber-100/60 flex items-center justify-center">
                  <Award className="h-7 w-7 text-amber-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] mb-1">Kepala Sekolah</p>
                  <h3 className="text-lg font-black text-[#1a1a1a] tracking-tight leading-snug">
                    Dwi Riyani Darma Setianingsih, S.Pd M.Pd
                  </h3>
                  <p className="text-xs text-[#a0aec0] font-semibold mt-2 tracking-wide">
                    NIP: 19690409 200312 2 003
                  </p>
                </div>
              </div>
            </div>

            {/* Wali Kelas */}
            <div className="bento-card p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-emerald-100/60 flex items-center justify-center">
                  <GraduationCap className="h-7 w-7 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-1">Wali Kelas 9B</p>
                  <h3 className="text-lg font-black text-[#1a1a1a] tracking-tight leading-snug">
                    Taufik Satpa Prasetya S.Pd
                  </h3>
                  <p className="text-xs text-[#a0aec0] font-semibold mt-2 tracking-wide">
                    NIP: 19800902 202321 1 001
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ─── Struktur Kelas ─── */}
        <motion.section variants={fadeUp} custom={4} className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-prestige text-[#1a1a1a]">
              Struktur <span className="gradient-text">Kelas</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {strukturKelas.map((item) => (
              <div key={item.jabatan} className="bento-card p-5 text-center group">
                <div className={`mx-auto w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <p className={`text-[10px] font-black ${item.color} uppercase tracking-[0.2em] mb-1`}>{item.jabatan}</p>
                <p className="text-sm font-bold text-[#1a1a1a] leading-snug">{item.nama}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ─── Jadwal Piket ─── */}
        <motion.section variants={fadeUp} custom={5}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/50 bg-emerald-50/30 px-5 py-2 text-xs font-semibold text-emerald-700 mb-4">
              <Calendar className="h-3.5 w-3.5" />
              <span className="tracking-[0.2em] uppercase">Jadwal Piket</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-prestige text-[#1a1a1a]">
              Piket <span className="gradient-text">Harian</span>
            </h2>
          </div>

          {/* Mobile: Cards */}
          <div className="sm:hidden space-y-3">
            {jadwalPiket.map((row) => (
              <div key={row.hari} className="bento-card p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`h-2.5 w-2.5 rounded-full ${hariColors[row.hari]}`} />
                  <span className="text-sm font-black text-[#1a1a1a] uppercase tracking-wider">{row.hari}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {row.anggota.map((nama) => (
                    <span key={nama} className="rounded-lg bg-slate-100/60 border border-slate-200/40 px-2.5 py-1 text-xs font-medium text-[#4a5568]">
                      {nama}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Table */}
          <div className="hidden sm:block bento-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/[0.04]">
                  <th className="px-6 py-4 text-left text-[10px] font-black text-[#a0aec0] uppercase tracking-[0.3em]">Hari</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-[#a0aec0] uppercase tracking-[0.3em]">Anggota Piket</th>
                </tr>
              </thead>
              <tbody>
                {jadwalPiket.map((row, idx) => (
                  <tr key={row.hari} className={idx < jadwalPiket.length - 1 ? "border-b border-black/[0.03]" : ""}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-2.5 w-2.5 rounded-full ${hariColors[row.hari]}`} />
                        <span className="text-sm font-bold text-[#1a1a1a]">{row.hari}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {row.anggota.map((nama) => (
                          <span key={nama} className="rounded-lg bg-slate-100/50 border border-slate-200/30 px-3 py-1 text-xs font-medium text-[#4a5568]">
                            {nama}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}
