"use client";

import Image from "next/image";
import { Code2, Heart, Sparkles, Globe, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-12 border-t border-black/[0.03] bg-[#FAF9F6] bg-dots">
      <div className="glass-premium border-x-0 border-b-0 rounded-none bg-white/40 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">

            {/* Brand & Mission */}
            <div className="md:col-span-5 flex flex-col items-center md:items-start gap-6">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-xl transition-transform hover:rotate-3">
                  <Image
                    src="/logo.png"
                    alt="Logo SPENSAKA"
                    fill
                    className="object-contain p-2"
                    sizes="48px"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-slate-900 tracking-tighter text-prestige">
                    9B <span className="gradient-text-hero">LEGACY</span>
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none">
                    BUKU TAHUNAN DIGITAL · 2026
                  </span>
                </div>
              </div>
              <p className="max-w-xs text-center md:text-left text-sm font-medium text-slate-500 leading-relaxed italic">
                "Tempat di mana setiap memori abadi dan setiap tawa tetap bergema. Jejak abadi Angkatan 2026 SMPN 1 Karanglewas."
              </p>
            </div>

            {/* Empty space */}
            <div className="hidden md:block md:col-span-2" />

            {/* Professional Credits */}
            <div className="md:col-span-5 flex flex-col items-center md:items-end gap-8">
              <div className="flex flex-col items-center md:items-end">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-4">Tim Pengembang</p>
                <div className="space-y-4 text-right">
                  <div className="flex items-center justify-end gap-3 group">
                    <div className="flex flex-col items-end leading-tight">
                      <span className="text-base font-black text-slate-800 text-prestige">Jazmi Hilmi Hamizan</span>
                      <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Lead Engineer & UI Designer</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3 group">
                    <div className="flex flex-col items-end leading-tight">
                      <span className="text-base font-black text-slate-600 text-prestige">Rama Indra Pratama</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">System Contributor</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Version & Badge */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-2xl border border-black/[0.03] bg-white/40 px-5 py-2.5 shadow-sm backdrop-blur-md">
                  <Code2 className="h-4 w-4 text-slate-400" />
                  <span className="text-xs text-slate-700 font-black tracking-tight uppercase">v3.0 Legacy Edition</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-10 border-t border-black/[0.04] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                © 2026 9B LEGACY — SPENSAKA
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Handcrafted with <Heart className="h-3 w-3 text-rose-500 fill-rose-500 mx-1 animate-pulse" /> for Class 9B
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
