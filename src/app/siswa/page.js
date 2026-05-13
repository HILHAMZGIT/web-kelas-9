"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Users, Quote, X } from "lucide-react";
import InstagramIcon from "@/components/InstagramIcon";
import { supabase } from "../../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Helpers ───────────────────────────────────────────────── */
function getInitials(name) {
  if (!name) return "??";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function getInstagramUsername(value) {
  const normalized = (value || "").trim();
  if (!normalized || normalized === "@") return "";
  return normalized.replace("@", "").trim();
}

/* Soft pastel gradients */
const gradients = [
  "from-emerald-300 to-teal-200",
  "from-blue-300 to-indigo-200",
  "from-violet-300 to-purple-200",
  "from-rose-300 to-pink-200",
  "from-amber-300 to-orange-200",
  "from-sky-300 to-cyan-200",
  "from-red-300 to-rose-200",
  "from-lime-300 to-green-200",
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.55, ease: [0.23, 1, 0.32, 1] }
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.75, ease: [0.23, 1, 0.32, 1] } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } }
};

/* ─── Student Avatar ─────────────────────────────────────────── */
function SiswaAvatar({ nama, fotoUrl, index }) {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(nama);
  const gradient = gradients[index % gradients.length];

  if (!fotoUrl || imageError) {
    return (
      <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}>
        <span className="text-xl font-bold text-white/90 drop-shadow-sm">{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={fotoUrl}
      alt={nama}
      className="h-full w-full object-cover"
      onError={() => setImageError(true)}
    />
  );
}

/* ════════════════════════════════════════════════════════════ */
export default function SiswaPage() {
  const [query, setQuery] = useState("");
  const [siswaList, setSiswaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function fetchSiswa() {
      setLoading(true);
      setErrorMessage("");
      const { data, error } = await supabase
        .from("siswa")
        .select("*")
        .order("id", { ascending: true });
      if (error) {
        setErrorMessage(error.message || "Gagal mengambil data siswa.");
        setSiswaList([]);
      } else {
        setSiswaList(data || []);
      }
      setLoading(false);
    }
    fetchSiswa();
  }, []);

  const filteredMembers = useMemo(
    () =>
      siswaList.filter((s) =>
        (s.nama || "").toLowerCase().includes(query.trim().toLowerCase())
      ),
    [query, siswaList]
  );

  return (
    <div className="relative min-h-screen page-shell">
      <motion.div
        className="mx-auto max-w-7xl px-4 pb-32 pt-24 sm:px-6 md:pt-28 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={stagger}
      >
        {/* Header */}
        <motion.div variants={fadeUp} custom={0} className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/80 px-4 py-1.5 text-xs font-medium text-orange-600">
            <Users className="h-3.5 w-3.5" />
            Angkatan 9B · SPENSAKA 2026
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
            Daftar Siswa <span className="gradient-text">9B</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {loading ? "Memuat data..." : `${siswaList.length} siswa terdaftar`} — data dari Supabase.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div variants={fadeUp} custom={1}>
          <div className="glass-strong mb-6 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-sm ring-1 ring-black/5">
            <Search className="h-4 w-4 flex-shrink-0 text-slate-300" />
            <input
              id="search-siswa"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama siswa..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-300"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-slate-300 hover:text-slate-500 transition-colors">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>

        {/* States */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bento-card animate-pulse">
                <div className="aspect-square rounded-t-2xl bg-gradient-to-br from-slate-100 to-slate-50" />
                <div className="p-3 space-y-2">
                  <div className="h-3 w-3/4 rounded-full bg-slate-100" />
                  <div className="h-2 w-full rounded-full bg-slate-100" />
                  <div className="h-2 w-2/3 rounded-full bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : errorMessage ? (
          <div className="bento-card p-6 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-transparent to-transparent pointer-events-none" />
            <p className="relative z-10 text-sm text-red-500">{errorMessage}</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="bento-card p-8 text-center">
            <Users className="mx-auto mb-3 h-8 w-8 text-slate-300" />
            <p className="text-sm text-slate-400">Tidak ada siswa dengan nama &ldquo;{query}&rdquo;</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredMembers.map((siswa, i) => {
              const igUsername = getInstagramUsername(siswa.ig);
              return (
                <motion.article
                  key={siswa.id ?? siswa.nama}
                  id={`siswa-${i}`}
                  className="bento-card group cursor-pointer p-0 overflow-hidden"
                  onClick={() => setSelected({ ...siswa, index: i })}
                  variants={fadeUp}
                  custom={i + 2}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-emerald-100/30 via-transparent to-transparent transition-opacity duration-300 pointer-events-none" />

                  {/* Photo */}
                  <div className="relative aspect-square overflow-hidden">
                    <SiswaAvatar nama={siswa.nama} fotoUrl={siswa.foto_url} index={i} />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* IG on hover */}
                    {igUsername && (
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg">
                          <InstagramIcon className="h-3 w-3" />
                          @{igUsername}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="relative z-10 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-600">Siswa</p>
                    <h2 className="mt-0.5 text-sm font-bold text-slate-800 leading-tight line-clamp-1">
                      {siswa.nama || "Tanpa Nama"}
                    </h2>
                    {siswa.quotes && (
                      <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-slate-400">
                        &ldquo;{siswa.quotes}&rdquo;
                      </p>
                    )}
                    {igUsername && (
                      <a
                        href={`https://instagram.com/${igUsername}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-2 inline-flex items-center gap-1 rounded-full border border-pink-200 bg-pink-50 px-2 py-0.5 text-[10px] font-medium text-pink-500 transition-all hover:bg-pink-100"
                      >
                        <InstagramIcon className="h-2.5 w-2.5" />
                        @{igUsername}
                      </a>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />
            <motion.div
              className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl bento-card shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top photo */}
              <div className="relative h-48 overflow-hidden">
                <SiswaAvatar nama={selected.nama} fotoUrl={selected.foto_url} index={selected.index} />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent" />
                <button
                  onClick={() => setSelected(null)}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-slate-600 backdrop-blur-sm transition-all hover:bg-white/90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {/* Content */}
              <div className="p-5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-600">Siswa Kelas 9B</p>
                <h2 className="mt-1 text-xl font-bold text-slate-800">{selected.nama || "Tanpa Nama"}</h2>
                {selected.quotes && (
                  <div className="mt-4 flex gap-3 rounded-2xl border border-black/5 bg-amber-50/50 p-4">
                    <Quote className="h-4 w-4 flex-shrink-0 text-amber-500 mt-0.5" />
                    <p className="text-sm italic leading-relaxed text-slate-600">
                      &ldquo;{selected.quotes}&rdquo;
                    </p>
                  </div>
                )}
                {getInstagramUsername(selected.ig) && (
                  <a
                    href={`https://instagram.com/${getInstagramUsername(selected.ig)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 shadow-md"
                  >
                    <InstagramIcon className="h-4 w-4" />
                    @{getInstagramUsername(selected.ig)}
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
