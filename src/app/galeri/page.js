"use client";

import { useState, useEffect } from "react";

// ============================================================
// DATA: 35 foto (1–20 .jpeg, 21–35 .jpg) — tanpa fs, aman Vercel
// ============================================================
const galleryImages = Array.from({ length: 35 }, (_, i) => {
  const num = i + 1;
  return {
    id: num,
    src: `/Gallery/${num}${num <= 20 ? ".jpeg" : ".jpg"}`,
  };
});

// ============================================================
// DATA: Video Google Drive — URL diubah ke /preview agar iframe
// ============================================================
const videoData = [
  {
    id: 1,
    title: "Video Angkatan Ke-39 - Part 1",
    embedUrl:
      "https://drive.google.com/file/d/150Xk8hLd0PAtmRSoLNOmUI1hXLjOoh3d/preview",
  },
  {
    id: 2,
    title: "Video Angkatan Ke-39 - Part 2",
    embedUrl:
      "https://drive.google.com/file/d/1vJOEFozNcKV14PVn0lNNEuScUQss-q7W/preview",
  },
];

// ============================================================
// LIGHTBOX — Fix total: close button hitbox luas, ESC listener
// ============================================================
function Lightbox({ src, onClose }) {
  // Lock body scroll saat lightbox terbuka
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // ESC key → tutup lightbox
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    // Overlay: z-[999] > navbar manapun, klik area luar → tutup
    <div
      className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Tombol Close — z-[1001], hitbox luas (p-4), pasti bisa diklik di HP & desktop */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-[1001] bg-white/10 hover:bg-white/20 text-white rounded-full p-4 cursor-pointer transition-all duration-300 hover:scale-110 hover:rotate-90 hover:bg-red-500/40"
        aria-label="Tutup lightbox"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Hint ESC */}
      <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest uppercase select-none">
        Tekan ESC atau klik area luar untuk menutup
      </span>

      {/* Gambar — stopPropagation agar klik gambar tidak tutup modal */}
      {/* object-contain + max-h-[90vh] → portrait & landscape tidak terpotong */}
      <img
        src={src}
        alt="Galeri zoom"
        className="max-w-full max-h-[90vh] object-contain rounded-xl relative z-[1000] select-none shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />
    </div>
  );
}

// ============================================================
// HALAMAN UTAMA GALERI
// ============================================================
export default function GaleriPage() {
  const [activeTab, setActiveTab] = useState("foto"); // "foto" | "video"
  const [selectedImage, setSelectedImage] = useState(null); // src string

  const openLightbox = (src) => setSelectedImage(src);
  const closeLightbox = () => setSelectedImage(null);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#faf8f5] to-[#f5f2ed] pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── Header ── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/50 bg-emerald-50/50 backdrop-blur-xl px-5 py-2 text-[10px] font-black text-emerald-700 uppercase tracking-[0.3em] mb-4">
            Memori Kelas
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1a1a1a]">
            Galeri{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Kenangan 9B
            </span>
          </h1>
          <p className="mt-3 text-sm md:text-base text-[#718096]">
            {galleryImages.length} foto &amp; {videoData.length} video kenangan
          </p>
        </div>

        {/* ── LANGKAH 2: Tab Toggle Elegan ── */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white/70 backdrop-blur-xl rounded-2xl p-1.5 border border-emerald-200/40 shadow-lg gap-1">
            {/* Tab Foto */}
            <button
              id="tab-foto"
              onClick={() => setActiveTab("foto")}
              className={`relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === "foto"
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                  : "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/60"
              }`}
            >
              {/* Icon Foto */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              Foto
              {activeTab === "foto" && (
                <span className="ml-1 bg-white/25 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {galleryImages.length}
                </span>
              )}
            </button>

            {/* Tab Video */}
            <button
              id="tab-video"
              onClick={() => setActiveTab("video")}
              className={`relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === "video"
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                  : "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/60"
              }`}
            >
              {/* Icon Video */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="m22 8-6 4 6 4V8z" />
                <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
              </svg>
              Video
              {activeTab === "video" && (
                <span className="ml-1 bg-white/25 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {videoData.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── TAB CONTENT ── */}

        {/* === Tab Foto: Masonry Grid === */}
        {activeTab === "foto" && (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {galleryImages.map((img) => (
              <div
                key={img.id}
                className="break-inside-avoid mb-4 cursor-pointer hover:scale-[1.02] transition-transform duration-300 rounded-xl overflow-hidden shadow-sm hover:shadow-xl group"
                onClick={() => openLightbox(img.src)}
              >
                <img
                  src={img.src}
                  alt={`Kenangan 9B foto ${img.id}`}
                  className="w-full h-auto rounded-xl block group-hover:brightness-90 transition-all duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        {/* === LANGKAH 3: Tab Video: Google Drive Embed Grid === */}
        {activeTab === "video" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videoData.map((video) => (
              <div
                key={video.id}
                className="bg-white/60 backdrop-blur-xl border border-emerald-100/60 rounded-2xl shadow-lg p-4 sm:p-5 flex flex-col gap-3 hover:shadow-xl transition-shadow duration-300"
              >
                {/* Badge nomor video */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white text-xs font-black shadow-sm">
                    {video.id}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">
                    Video Kenangan
                  </span>
                </div>

                {/* iframe Google Drive — /preview → bisa autoplay di browser */}
                <div className="w-full overflow-hidden rounded-xl shadow-sm border border-emerald-100/40">
                  <iframe
                    src={video.embedUrl}
                    className="w-full aspect-video rounded-xl border-0 shadow-sm"
                    allow="autoplay"
                    allowFullScreen
                    title={video.title}
                    loading="lazy"
                  />
                </div>

                {/* Title di bawah video */}
                <h2 className="text-base font-black text-[#1a1a1a] tracking-tight">
                  {video.title}
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Klik tombol play untuk memutar video kenangan kelas 9B.
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox Foto ── */}
      {selectedImage && (
        <Lightbox src={selectedImage} onClose={closeLightbox} />
      )}
    </div>
  );
}