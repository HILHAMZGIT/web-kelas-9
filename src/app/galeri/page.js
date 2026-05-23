"use client";

import { useState, useEffect } from "react";

// ============================================================
// LANGKAH 2: Generate array 35 gambar (1-20 .jpeg, 21-35 .jpg)
// Murni JS — tanpa fs, aman untuk Vercel / Next.js client
// ============================================================
const galleryImages = Array.from({ length: 35 }, (_, i) => {
  const num = i + 1;
  return {
    id: num,
    src: `/Gallery/${num}${num <= 20 ? ".jpeg" : ".jpg"}`,
  };
});

// ============================================================
// LANGKAH 4: Custom Lightbox — anti-bug z-index & scroll lock
// ============================================================
function Lightbox({ src, onClose }) {
  // Disable body scroll saat lightbox terbuka
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Tutup dengan tombol Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    // Container Modal: z-[999] — paling atas, mengalahkan navbar apapun
    <div
      className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose} // Klik background → tutup modal
    >
      {/* Tombol Close (X) — z-[1000] di atas modal, pasti bisa diklik */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[1000] flex items-center justify-center w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white cursor-pointer transition-all duration-300 hover:scale-110 hover:rotate-90"
        aria-label="Tutup lightbox"
      >
        {/* Icon X manual — tidak bergantung library eksternal */}
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

      {/* Gambar Modal — stopPropagation agar klik gambar tidak menutup modal */}
      {/* object-contain + max-h-[90vh] → portrait maupun landscape tidak terpotong */}
      <img
        src={src}
        alt="Galeri zoom"
        className="max-w-full max-h-[90vh] object-contain rounded-lg relative z-[999] select-none shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />
    </div>
  );
}

// ============================================================
// Halaman Utama Galeri
// ============================================================
export default function GaleriPage() {
  const [selectedImage, setSelectedImage] = useState(null); // Simpan src string, bukan index

  const openLightbox = (src) => setSelectedImage(src);
  const closeLightbox = () => setSelectedImage(null);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#faf8f5] to-[#f5f2ed] pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── Header ── */}
        <div className="text-center mb-12">
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
            {galleryImages.length} foto kenangan
          </p>
        </div>

        {/* ── LANGKAH 3: Masonry Grid — CSS Columns Pure Tailwind ── */}
        {/* columns-* membuat foto mengikuti aspect ratio aslinya (tidak dipaksakan kotak) */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {galleryImages.map((img) => (
            // break-inside-avoid: cegah foto terpotong antar kolom
            <div
              key={img.id}
              className="break-inside-avoid mb-4 cursor-pointer hover:scale-[1.02] transition-transform duration-300 rounded-xl overflow-hidden shadow-sm hover:shadow-xl group"
              onClick={() => openLightbox(img.src)}
            >
              {/* w-full h-auto → aspect ratio asli terjaga 100% */}
              <img
                src={img.src}
                alt={`Kenangan 9B foto ${img.id}`}
                className="w-full h-auto rounded-xl block group-hover:brightness-90 transition-all duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Lightbox — render hanya jika ada gambar dipilih ── */}
      {selectedImage && (
        <Lightbox src={selectedImage} onClose={closeLightbox} />
      )}
    </div>
  );
}