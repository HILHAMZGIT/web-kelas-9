"use client";

import Image from "next/image";
import { Code2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-20 border-t border-white/5">
      <div className="glass">
        <div className="mx-auto max-w-6xl px-6 py-7">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">

            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="relative h-7 w-7 overflow-hidden rounded-lg ring-1 ring-white/10">
                <Image
                  src="/logo.png"
                  alt="Logo SPENSAKA"
                  fill
                  className="object-cover"
                  sizes="28px"
                />
              </div>
              <span className="text-sm font-semibold text-slate-300">
                SPENSAKA <span className="text-emerald-400">9B</span>
              </span>
            </div>

            {/* Copyright */}
            <p className="text-center text-xs text-slate-500 leading-relaxed">
              © 2026 9B Legacy.{" "}
              <span className="text-slate-400">
                Developed by{" "}
                <span className="font-medium text-slate-300">Jazmi Hilmi Hamizan</span>
                {" | Helper: "}
                <span className="font-medium text-slate-300">Rama Indra Pratama</span>
              </span>
            </p>

            {/* Version tag */}
            <div className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/4 px-3 py-1">
              <Code2 className="h-3 w-3 text-emerald-400" />
              <span className="text-[11px] text-slate-400">v1.0.0</span>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
