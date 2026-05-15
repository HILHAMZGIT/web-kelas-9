"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Lock, Clock } from "lucide-react";

// Menyiapkan array angka 1 sampai 18 untuk mapping gambar otomatis
const images = Array.from({ length: 18 }, (_, i) => i + 1);

// Animasi masuk untuk grid masonry
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.7, ease: [0.23, 1, 0.32, 1] },
  }),
};

// Komponen Modal/Lightbox untuk Zoom
function Lightbox({ num, onClose }) {
  // Tutup pakai tombol Esc di keyboard
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Background Gelap dengan Blur */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />

      {/* Tombol Close */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 sm:right-8 sm:top-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/25 hover:scale-110 hover:rotate-90"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Gambar Membesar di Tengah */}
      <motion.div
        className="relative z-40 w-full h-[85vh] flex items-center justify-center"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        onClick={(e) => e.stopPropagation()} // Supaya klik gambar tidak ikut menutup modal
      >
        <div className="relative w-full h-full">
          <Image
            src={`/Gallery/${num}.jpeg`}
            alt={`Galeri Zoom ${num}`}
            fill
            className="object-contain drop-shadow-2xl"
            sizes="100vw"
            priority // Gambar yang di-zoom di-load cepat
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function GaleriPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("foto");

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#faf8f5] to-[#f5f2ed] page-shell pt-24 pb-32">
      <div className="container-premium max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header Estetik Emerald/Tosca */}
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
              {/* Responsive Masonry Grid: 2 kolom di HP, 3 di Tablet, 4 di Desktop */}
              <div className="columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-5 space-y-3 sm:space-y-5">
                {images.map((num, i) => (
                  <motion.div
                    key={num}
                    className="break-inside-avoid relative overflow-hidden rounded-[1.25rem] cursor-pointer group shadow-sm hover:shadow-2xl transition-all duration-500 border border-emerald-900/5"
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    onClick={() => setSelectedImage(num)}
                  >
                    <Image
                      src={`/Gallery/${num}.jpeg`}
                      alt={`Kenangan 9B ${num}`}
                      width={0}
                      height={0}
                      sizes="(max-width: 768px) 50vw, 33vw"
                      style={{ width: '100%', height: 'auto' }}
                      className="group-hover:scale-110 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    
                    {/* Overlay Tosca/Emerald saat di-hover */}
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

      {/* Lightbox / Modal Overlay (Hanya muncul jika ada foto yang dipilih) */}
      <AnimatePresence>
        {selectedImage && (
          <Lightbox num={selectedImage} onClose={() => setSelectedImage(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
