"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Users, Link2, Quote, X } from "lucide-react";
import { supabase } from "../../lib/supabase";

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

/* Generate consistent gradient for each student based on their index */
const gradients = [
  "from-emerald-700 to-teal-900",
  "from-blue-700 to-indigo-900",
  "from-violet-700 to-purple-900",
  "from-rose-700 to-pink-900",
  "from-amber-700 to-orange-900",
  "from-sky-700 to-cyan-900",
  "from-red-700 to-rose-900",
  "from-lime-700 to-green-900",
];

/* ─── Student Avatar ─────────────────────────────────────────── */
function SiswaAvatar({ nama, fotoUrl, index }) {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(nama);
  const gradient = gradients[index % gradients.length];

  if (!fotoUrl || imageError) {
    return (
      <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}>
        <span className="text-xl font-bold text-white/90">{initials}</span>
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
      <div className="mx-auto max-w-7xl px-4 pb-32 pt-24 sm:px-6 md:pt-28 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/5 px-4 py-1.5 text-xs font-medium text-orange-300">
            <Users className="h-3.5 w-3.5" />
            Angkatan 9B · SPENSAKA 2026
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Daftar Siswa <span className="gradient-text">9B</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {loading ? "Memuat data..." : `${siswaList.length} siswa terdaftar`} — data dari Supabase.
          </p>
        </div>

        {/* Search */}
        <div className="glass mb-6 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/5">
          <Search className="h-4 w-4 flex-shrink-0 text-slate-400" />
          <input
            id="search-siswa"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama siswa..."
            className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-slate-500 hover:text-slate-300 transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* States */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bento-card animate-pulse">
                <div className="aspect-square rounded-2xl bg-white/5" />
                <div className="p-3 space-y-2">
                  <div className="h-3 w-3/4 rounded-full bg-white/5" />
                  <div className="h-2 w-full rounded-full bg-white/5" />
                  <div className="h-2 w-2/3 rounded-full bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : errorMessage ? (
          <div className="bento-card p-6 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/8 via-transparent to-transparent pointer-events-none" />
            <p className="relative z-10 text-sm text-red-400">{errorMessage}</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="bento-card p-8 text-center">
            <Users className="mx-auto mb-3 h-8 w-8 text-slate-600" />
            <p className="text-sm text-slate-500">Tidak ada siswa dengan nama "{query}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredMembers.map((siswa, i) => {
              const igUsername = getInstagramUsername(siswa.ig);
              return (
                <article
                  key={siswa.id ?? siswa.nama}
                  id={`siswa-${i}`}
                  className="bento-card group cursor-pointer p-0 overflow-hidden"
                  onClick={() => setSelected({ ...siswa, index: i })}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent transition-opacity duration-300 pointer-events-none" />

                  {/* Photo */}
                  <div className="relative aspect-square overflow-hidden">
                    <SiswaAvatar nama={siswa.nama} fotoUrl={siswa.foto_url} index={i} />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* IG on hover */}
                    {igUsername && (
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg">
                          <Link2 className="h-3 w-3" />
                          @{igUsername}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="relative z-10 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400">Siswa</p>
                    <h2 className="mt-0.5 text-sm font-bold text-white leading-tight line-clamp-1">
                      {siswa.nama || "Tanpa Nama"}
                    </h2>
                    {siswa.quotes && (
                      <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-slate-400">
                        "{siswa.quotes}"
                      </p>
                    )}
                    {igUsername && (
                      <a
                        href={`https://instagram.com/${igUsername}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-2 inline-flex items-center gap-1 rounded-full border border-pink-400/20 bg-pink-400/8 px-2 py-0.5 text-[10px] font-medium text-pink-300 transition-all hover:bg-pink-400/15"
                      >
                        <Link2 className="h-2.5 w-2.5" />
                        @{igUsername}
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
          <div
            className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-[0_0_80px_rgba(0,0,0,0.6)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top photo */}
            <div className="relative h-48 overflow-hidden">
              <SiswaAvatar nama={selected.nama} fotoUrl={selected.foto_url} index={selected.index} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
              <button
                onClick={() => setSelected(null)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition-all hover:bg-black/70"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Content */}
            <div className="p-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400">Siswa Kelas 9B</p>
              <h2 className="mt-1 text-xl font-bold text-white">{selected.nama || "Tanpa Nama"}</h2>
              {selected.quotes && (
                <div className="mt-4 flex gap-3 rounded-2xl border border-white/8 bg-white/4 p-4">
                  <Quote className="h-4 w-4 flex-shrink-0 text-amber-400 mt-0.5" />
                  <p className="text-sm italic leading-relaxed text-slate-300">
                    "{selected.quotes}"
                  </p>
                </div>
              )}
              {getInstagramUsername(selected.ig) && (
                <a
                  href={`https://instagram.com/${getInstagramUsername(selected.ig)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                >
                  <Link2 className="h-4 w-4" />
                  @{getInstagramUsername(selected.ig)}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
