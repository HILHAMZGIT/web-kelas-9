"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Lock, Clock } from "lucide-react";

// ============================================================
// LANGKAH 2: Generate array 35 foto (1-20 .jpeg, 21-35 .jpg)
// Tanpa fs — murni logic JS client-side
// ============================================================
const images = Array.from({ length: 35 }, (_, i) => {
  const num = i + 1;
  return {
    id: num,
    src: `/Gallery/${num}${num <= 20 ? ".jpeg" : ".jpg"}`,
  };
});

// Animasi fade-up untuk grid
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.7, ease: [0.23, 1, 0.32, 1] },
  }),
};

// ============================================================
// LANGKAH 3B: Lightbox Modal — PERBAIKI BUG total
// ============================================================
function Lightbox({ src, onClose }) {
  // Tutup pakai tombol Esc
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Background gelap + blur — z-index dibawah konten */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

      {/* Tombol Close — z-[110] supaya PASTI bisa diklik */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-[110] bg-white/20 hover:bg-white/40 text-white rounded-full p-3 cursor-pointer transition-all duration-300 hover:scale-110 hover:rotate-90"
        aria-label="Tutup"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Gambar di tengah — flex + object-contain solves semuanya */}
      <motion.div
        className="relative z-[101] w-full h-full flex items-center justify-center"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        onClick={(e) => e.stopPropagation()} // Klik gambar ≠ tutup modal
      >
        <div className="relative w-full h-full max-w-[90vw] max-h-[85vh]">
          <Image
            src={src}
            alt="Galeri Zoom"
            fill
            className="object-contain rounded-lg"
            sizes="100vw"
            priority
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// LANGKAH 3A + 4: Halaman Utama Gallery
// ============================================================
export default function GaleriPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("foto");

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#faf8f5] to-[#f5f2ed] page-shell pt-24 pb-32">
      <div className="container-premium max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header Estetik */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/50 bg-emerald-50/50 backdrop-blur-xl px-5 py-2 text-[10px] font-black text-emerald-700 uppercase tracking-[0.3em] mb-4">
            Memori Kelas
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-prestige tracking-tight text-[#1a1a1a]">
            Galeri <span className="gradient-text-warm">Kenangan 9B</span>
          </h1>
        </motion.div>

        {/* Tab Menu */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="inline-flex bg-white/80 backdrop-blur-xl rounded-2xl p-1.5 border border-emerald-200/50 shadow-lg">
            <button
              onClick={() => setActiveTab("foto")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === "foto"
                  ? "bg-emerald-500 text-white shadow-md"
                  : "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
              }`}
            >
              Foto
            </button>
            <button
              onClick={() => setActiveTab("video")}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === "video"
                  ? "bg-emerald-500 text-white shadow-md"
                  : "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
              }`}
            >
              Video
            </button>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "foto" ? (
            <motion.div
              key="foto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* GRID RESPONSIF: 2 kolom mobile, 3 tablet, 4 desktop */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <motion.div
                    key={img.id}
                    className="aspect-square overflow-hidden rounded-xl cursor-pointer group shadow-sm hover:shadow-2xl transition-all duration-500 border border-emerald-900/5"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    onClick={() => setSelectedImage(img.src)}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={img.src}
                        alt={`Kenangan 9B ${img.id}`}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    {/* Overlay emerald saat hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-emerald-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Ikon Zoom di tengah */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-2xl text-emerald-600">
                        <ZoomIn className="h-6 w-6 sm:h-7 sm:w-7" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="video"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center"
            >
              {/* Video Coming Soon Placeholder */}
              <div className="relative w-full max-w-2xl mx-auto">
                <div className="relative rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200/50 p-12 sm:p-16 text-center shadow-xl overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-40 h-40 bg-emerald-500 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-tosca-500 rounded-full blur-3xl" />
                  </div>
                  
                  {/* Lock Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
                    className="relative z-10 mx-auto mb-6"
                  >
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-tosca-600 flex items-center justify-center shadow-lg">
                      <Lock className="h-10 w-10 text-white" />
                    </div>
                  </motion.div>
                  
                  {/* Text */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="relative z-10"
                  >
                    <h2 className="text-2xl sm:text-3xl font-black text-[#1a1a1a] mb-3">
                      Video <span className="gradient-text-warm">Coming Soon</span>
                    </h2>
                    <p className="text-sm sm:text-base text-[#718096] max-w-md mx-auto leading-relaxed">
                      Kami sedang menyiapkan video kenangan spesial untuk kelas 9B. 
                      Stay tuned untuk update terbaru!
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-2">
                      <Clock className="h-4 w-4 text-emerald-500" />
                      <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                        Segera Hadir
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox — hanya muncul jika ada gambar dipilih */}
      <AnimatePresence>
        {selectedImage && (
          <Lightbox src={selectedImage} onClose={() => setSelectedImage(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}