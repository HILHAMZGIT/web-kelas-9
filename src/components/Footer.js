"use client";

import Image from "next/image";
import { Code2, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-20 border-t border-black/5">
      <div className="glass">
        <div className="mx-auto max-w-6xl px-6 py-7">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">

            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="relative h-7 w-7 overflow-hidden rounded-lg ring-1 ring-black/5">
                <Image
                  src="/logo.png"
                  alt="Logo SPENSAKA"
                  fill
                  className="object-cover"
                  sizes="28px"
                />
              </div>
              <span className="text-sm font-semibold text-slate-600">
                SPENSAKA <span className="text-emerald-600">9B</span>
              </span>
            </div>

            {/* Copyright */}
            <p className="text-center text-xs text-slate-400 leading-relaxed flex items-center gap-1 flex-wrap justify-center">
              © 2026 Website Kelas 9B
              <span className="mx-1 text-slate-300">•</span>
              <span className="text-slate-500">
                Developed by{" "}
                <span className="font-semibold text-slate-600">Jazmi Hilmi Hamizan</span>
                {" | Helper: "}
                <span className="font-semibold text-slate-600">Rama Indra Pratama</span>
              </span>
            </p>

            {/* Version tag */}
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50/60 px-3 py-1">
              <Code2 className="h-3 w-3 text-emerald-600" />
              <span className="text-[11px] text-emerald-700 font-medium">v2.0.0</span>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
