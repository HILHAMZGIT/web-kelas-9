"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Images, Film, Users, Sparkles, Grid3x3, X, Upload,
  Loader2, ZoomIn, ChevronLeft, ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["Semua", "Class Moment", "Random", "Video"];

/* Placeholder items for initial grid structure */
const placeholderItems = [
  { id: "p1", title: "Morning Assembly", type: "Class Moment", color: "from-emerald-200/60 to-teal-100/40" },
  { id: "p2", title: "Bestie Selfie", type: "Random", color: "from-pink-200/60 to-rose-100/40" },
  { id: "p3", title: "Farewell Stage", type: "Video", color: "from-violet-200/60 to-purple-100/40" },
  { id: "p4", title: "Class Laugh", type: "Class Moment", color: "from-blue-200/60 to-sky-100/40" },
  { id: "p5", title: "Break Time", type: "Random", color: "from-amber-200/60 to-yellow-100/40" },
  { id: "p6", title: "After School", type: "Class Moment", color: "from-cyan-200/60 to-teal-100/40" },
  { id: "p7", title: "BTS Event", type: "Video", color: "from-red-200/60 to-orange-100/40" },
  { id: "p8", title: "School Yard", type: "Random", color: "from-lime-200/60 to-green-100/40" },
  { id: "p9", title: "Closing Day", type: "Class Moment", color: "from-indigo-200/60 to-blue-100/40" },
  { id: "p10", title: "Vlog Team", type: "Video", color: "from-rose-200/60 to-pink-100/40" },
  { id: "p11", title: "Lunch Break", type: "Random", color: "from-teal-200/60 to-emerald-100/40" },
  { id: "p12", title: "Class Photo", type: "Class Moment", color: "from-sky-200/60 to-blue-100/40" },
];

const categoryIcons = {
  "Semua": Grid3x3,
  "Class Moment": Users,
  "Random": Sparkles,
  "Video": Film,
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }),
};

/* ─── Lightbox Component ─────────────────────────────────── */
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

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Navigation */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Image */}
      <motion.div
        className="relative z-40 max-w-4xl w-full"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
      >
        {item.image_url ? (
          item.type === "Video" || item.image_url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
            <video
              src={item.image_url}
              controls
              autoPlay
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
          ) : (
            <img
              src={item.image_url}
              alt={item.title || "Foto"}
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
          )
        ) : (
          <div className={`w-full aspect-video rounded-2xl bg-gradient-to-br ${item.color || "from-slate-200 to-slate-100"} flex items-center justify-center`}>
            <div className="text-center">
              <Images className="h-12 w-12 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-500 font-medium">{item.title}</p>
              <p className="text-xs text-slate-400 mt-1">Placeholder</p>
            </div>
          </div>
        )}
        {/* Caption bar */}
        <div className="mt-3 glass-strong rounded-xl px-4 py-3 text-center">
          <p className="text-sm font-semibold text-slate-700">{item.title || "Tanpa Judul"}</p>
          {item.type && <p className="text-xs text-slate-400 mt-0.5">{item.type}</p>}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════ */
export default function GaleriPage() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState("Semua");
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

    // Real-time subscription
    const channel = supabase
      .channel("public:galeri")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "galeri" },
        () => fetchGallery())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchGallery]);

  // Merge DB items + placeholder items
  const allItems = useMemo(() => {
    const dbMapped = dbItems.map((item) => ({
      id: item.id,
      title: item.judul || item.title || "Momen 9B",
      type: item.kategori || item.type || "Random",
      image_url: item.foto_url || item.image_url,
      color: "from-slate-200/60 to-slate-100/40",
    }));
    // Only show placeholders if no DB items
    return dbMapped.length > 0 ? dbMapped : placeholderItems;
  }, [dbItems]);

  const visibleItems = useMemo(
    () => allItems.filter((item) => activeCategory === "Semua" || item.type === activeCategory),
    [activeCategory, allItems]
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
    if (file.size > 50 * 1024 * 1024) { // Increase limit for video to 50MB
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
      setUploadError(err?.message || "Gagal upload foto.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function openLightbox(index) {
    setLightboxIndex(index);
  }

  function closeLightbox() {
    setLightboxIndex(null);
  }

  function prevLightbox() {
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : visibleItems.length - 1));
  }

  function nextLightbox() {
    setLightboxIndex((prev) => (prev < visibleItems.length - 1 ? prev + 1 : 0));
  }

  // Heights for masonry variation
  const heights = ["h-48", "h-64", "h-56", "h-44", "h-60", "h-52"];

  return (
    <div className="relative min-h-screen page-shell">
      <motion.div
        className="mx-auto max-w-7xl px-4 pb-32 pt-24 sm:px-6 md:pt-28 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      >
        {/* Header */}
        <motion.div variants={fadeUp} custom={0} className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50/80 px-4 py-1.5 text-xs font-medium text-violet-600">
            <Images className="h-3.5 w-3.5" />
            Koleksi Momen 9B
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
            Galeri <span className="gradient-text">Kenangan</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-400">
            Momen portrait & landscape kelas 9B yang tersimpan abadi. Upload foto kenangan terbaikmu di sini.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div variants={fadeUp} custom={1} className="sticky top-20 z-20 mb-6">
          <div className="glass-strong flex flex-wrap gap-2 rounded-2xl p-2 shadow-sm sm:w-fit">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat];
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  id={`filter-${cat.toLowerCase().replace(" ", "-")}`}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-violet-100 text-violet-700 ring-1 ring-violet-200/60 shadow-sm"
                      : "text-slate-400 hover:text-slate-600 hover:bg-white/60"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {cat}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Upload Error */}
        {uploadError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 flex items-center justify-between">
            {uploadError}
            <button onClick={() => setUploadError(null)} className="text-red-400 hover:text-red-500"><X className="h-4 w-4" /></button>
          </div>
        )}

        {/* Masonry Grid */}
        {loadingDb ? (
          <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="mb-3 break-inside-avoid">
                <div className={`bento-card overflow-hidden p-0 animate-pulse ${heights[i % heights.length]}`}>
                  <div className="h-full bg-gradient-to-br from-slate-100 to-slate-50" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
            {visibleItems.map((item, i) => (
              <motion.div
                key={item.id}
                className="mb-3 break-inside-avoid group cursor-pointer"
                variants={fadeUp}
                custom={i}
                onClick={() => openLightbox(i)}
              >
                <div className="bento-card overflow-hidden p-0">
                  <div
                    className={`relative ${heights[i % heights.length]} transition-all duration-500 group-hover:scale-[1.02]`}
                  >
                    {item.image_url ? (
                      item.type === "Video" ? (
                        <div className="relative h-full w-full">
                          <video src={item.image_url} className="h-full w-full object-cover" muted />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                            <Film className="h-8 w-8 text-white/70" />
                          </div>
                        </div>
                      ) : (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      )
                    ) : (
                      <div className={`h-full w-full bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                        <div className="text-center">
                          <Images className="h-8 w-8 text-slate-400/60 mx-auto" />
                          <p className="text-xs text-slate-400 mt-2 font-medium">{item.title}</p>
                        </div>
                      </div>
                    )}

                    {/* Type badge */}
                    <div className="absolute left-2 top-2">
                      <span className="rounded-full border border-white/40 bg-white/70 px-2 py-0.5 text-[10px] text-slate-600 backdrop-blur-sm font-medium">
                        {item.type}
                      </span>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md">
                        <ZoomIn className="h-5 w-5 text-slate-700" />
                      </div>
                    </div>

                    {/* Bottom info */}
                    <div className="absolute bottom-0 left-0 right-0 translate-y-2 bg-gradient-to-t from-black/40 to-transparent p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Upload CTA */}
        <motion.div variants={fadeUp} custom={6} className="mt-8 bento-card p-6 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/40 via-transparent to-emerald-50/40 pointer-events-none" />
          <div className="relative z-10">
            <Upload className="mx-auto mb-3 h-8 w-8 text-violet-400" strokeWidth={1.5} />
            <p className="text-sm font-semibold text-slate-700">Punya foto kenangan?</p>
            <p className="mt-1 text-xs text-slate-400">Upload foto terbaikmu untuk abadikan momen kelas 9B.</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || !user}
              className="mt-4 btn-primary text-sm disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mengupload...
                </>
              ) : (
                <>
                  <Images className="h-4 w-4" />
                  Upload Momen
                </>
              )}
            </button>
            {!user && <p className="mt-2 text-xs text-slate-400">Login terlebih dahulu untuk upload.</p>}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        </motion.div>
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
