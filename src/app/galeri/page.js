"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

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

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#faf8f5] to-[#f5f2ed] page-shell pt-24 pb-32">
      <div className="container-premium max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header Estetik Emerald/Tosca */}
        <motion.div 
          className="text-center mb-16"
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
              {/* 
                Menggunakan width=0 & height=0 dengan style={{ width: '100%', height: 'auto' }}
                adalah trik Next.js Image terbaik untuk menjaga Aspect Ratio asli gambar dalam layout Masonry.
              */}
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
