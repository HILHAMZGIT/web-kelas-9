"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Images, Film, X, Upload, Loader2, ZoomIn,
  ChevronLeft, ChevronRight, Camera,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Categories: Only Foto & Video ─── */
const categories = [
  { key: "Foto", label: "Foto", icon: Camera },
  { key: "Video", label: "Video", icon: Film },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.03, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── Lightbox ─── */
function Lightbox({ item, onClose, onPrev, onNext }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  const isVideo = item.type === "Video" || item.image_url?.match(/\.(mp4|webm|ogg|mov)$/i);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25"
      >
        <X className="h-5 w-5" />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <motion.div
        className="relative z-40 max-w-4xl w-full"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo ? (
          <video
            src={item.image_url}
            controls
            autoPlay
            className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
          />
        ) : (
          <img
            src={item.image_url}
            alt="Galeri 9B"
            className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
          />
        )}
      </motion.div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════ */
export default function GaleriPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Foto");
  const [dbItems, setDbItems] = useState([]);
  const [loadingDb, setLoadingDb] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch gallery from Supabase
  const fetchGallery = useCallback(async () => {
    setLoadingDb(true);
    const { data, error } = await supabase
      .from("galeri")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setDbItems(data);
    setLoadingDb(false);
  }, []);

  useEffect(() => {
    fetchGallery();

    const channel = supabase
      .channel("public:galeri")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "galeri" }, () => fetchGallery())
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "galeri" }, () => fetchGallery())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchGallery]);

  // Map and filter items
  const allItems = useMemo(() => {
    return dbItems.map((item) => {
      const url = item.foto_url || item.image_url || "";
      const isVideo = (item.kategori === "Video") || url.match(/\.(mp4|webm|ogg|mov)$/i);
      return {
        id: item.id,
        type: isVideo ? "Video" : "Foto",
        image_url: url,
      };
    });
  }, [dbItems]);

  const visibleItems = useMemo(
    () => allItems.filter((item) => item.type === activeTab),
    [activeTab, allItems]
  );

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (!isImage && !isVideo) {
      setUploadError("File harus berupa gambar atau video.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setUploadError("Ukuran file maksimal 50MB.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const ext = file.name.split(".").pop();
      const fileName = `${user.id}_${Date.now()}.${ext}`;
      const filePath = `galeri/${fileName}`;

      const { error: uploadErr } = await supabase.storage
        .from("gallery")
        .upload(filePath, file, { cacheControl: "3600" });

      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage
        .from("gallery")
        .getPublicUrl(filePath);

      const { error: insertErr } = await supabase
        .from("galeri")
        .insert({
          user_id: user.id,
          foto_url: publicUrl,
          judul: file.name.replace(/\.[^/.]+$/, ""),
          kategori: isVideo ? "Video" : "Random",
        });

      if (insertErr) throw insertErr;
      await fetchGallery();
    } catch (err) {
      setUploadError(err?.message || "Gagal upload.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function openLightbox(index) { setLightboxIndex(index); }
  function closeLightbox() { setLightboxIndex(null); }
  function prevLightbox() { setLightboxIndex((p) => (p > 0 ? p - 1 : visibleItems.length - 1)); }
  function nextLightbox() { setLightboxIndex((p) => (p < visibleItems.length - 1 ? p + 1 : 0)); }

  const heights = ["h-48", "h-64", "h-56", "h-44", "h-60", "h-52"];

  return (
    <div className="relative min-h-screen page-shell">
      <motion.div
        className="mx-auto max-w-6xl px-3 pb-32 pt-24 sm:px-6 md:pt-28"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
      >
        {/* ─── Header: Minimal ─── */}
        <motion.div variants={fadeUp} custom={0} className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-prestige tracking-tight text-[#1a1a1a]">
              Galeri <span className="gradient-text">9B</span>
            </h1>
          </div>

          {/* Upload button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || !user}
            className="btn-primary text-sm py-2.5 px-5 disabled:opacity-50"
          >
            {uploading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Mengupload...</>
            ) : (
              <><Upload className="h-4 w-4" /> Upload</>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleUpload}
          />
        </motion.div>

        {/* ─── Tab Filter: Foto / Video ─── */}
        <motion.div variants={fadeUp} custom={1} className="sticky top-20 z-20 mb-5">
          <div className="glass-strong inline-flex gap-1 rounded-xl p-1 shadow-sm">
            {categories.map(({ key, label, icon: Icon }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`relative flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "text-emerald-700"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="galeri-tab"
                      className="absolute inset-0 rounded-lg bg-emerald-50 ring-1 ring-emerald-200/60"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <Icon className="h-4 w-4 relative z-10" />
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ─── Upload Error ─── */}
        {uploadError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 flex items-center justify-between">
            {uploadError}
            <button onClick={() => setUploadError(null)} className="text-red-400 hover:text-red-500"><X className="h-4 w-4" /></button>
          </div>
        )}

        {/* ─── Masonry Grid — Pure Visual, No Captions ─── */}
        {loadingDb ? (
          <div className="columns-2 gap-2.5 sm:columns-3 lg:columns-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="mb-2.5 break-inside-avoid">
                <div className={`rounded-xl overflow-hidden animate-pulse ${heights[i % heights.length]}`}>
                  <div className="h-full bg-gradient-to-br from-slate-100 to-slate-50" />
                </div>
              </div>
            ))}
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="bento-card p-16 text-center">
            <Images className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-400">
              Belum ada {activeTab.toLowerCase()} yang diupload
            </p>
            <p className="text-xs text-slate-300 mt-1">Jadilah yang pertama mengabadikan momen!</p>
          </div>
        ) : (
          <div className="columns-2 gap-2.5 sm:columns-3 lg:columns-4">
            {visibleItems.map((item, i) => (
              <motion.div
                key={item.id}
                className="mb-2.5 break-inside-avoid group cursor-pointer"
                variants={fadeUp}
                custom={i}
                onClick={() => openLightbox(i)}
              >
                <div className="relative overflow-hidden rounded-xl">
                  <div className={`relative ${heights[i % heights.length]} transition-transform duration-500 group-hover:scale-[1.03]`}>
                    {item.type === "Video" ? (
                      <div className="relative h-full w-full">
                        <video src={item.image_url} className="h-full w-full object-cover" muted />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/15">
                          <div className="h-10 w-10 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center">
                            <Film className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.image_url}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    )}

                    {/* Hover zoom overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md">
                        <ZoomIn className="h-5 w-5 text-slate-700" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && visibleItems[lightboxIndex] && (
          <Lightbox
            item={visibleItems[lightboxIndex]}
            onClose={closeLightbox}
            onPrev={prevLightbox}
            onNext={nextLightbox}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
