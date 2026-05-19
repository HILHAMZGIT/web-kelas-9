"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, TrendingUp, Hourglass } from "lucide-react";

const FAREWELL_DATE = new Date("2026-05-21T08:00:00+07:00").getTime();

function calculateDiff(now) {
  const diffMs = Math.abs(now - FAREWELL_DATE);
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

export default function MemoryCounter() {
  const [now, setNow] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setNow(Date.now());
    setMounted(true);

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted || now === null) return null;

  const isPastFarewell = now >= FAREWELL_DATE;
  const { days, hours, minutes, seconds } = calculateDiff(now);

  const timeUnits = [
    { label: "Hari", value: days },
    { label: "Jam", value: hours },
    { label: "Menit", value: minutes },
    { label: "Detik", value: seconds },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="rounded-2xl border border-white/30 bg-white/40 p-4 sm:p-6 shadow-xl backdrop-blur-xl"
    >
      {/* Header — stacked on mobile */}
      <div className="mb-3 sm:mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
        <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shrink-0">
          {isPastFarewell ? (
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          ) : (
            <Hourglass className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-xs sm:text-sm font-black text-slate-800 leading-tight">
            {isPastFarewell
              ? "🎬 Waktu Sejak Perpisahan"
              : "⏳ Menuju Hari Perpisahan 9B"}
          </h3>
          <p className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            21 Mei 2026 · 08:00 WIB
          </p>
        </div>
      </div>

      {/* Timer Units — tighter on mobile */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
        {timeUnits.map((unit) => (
          <div
            key={unit.label}
            className="flex flex-col items-center rounded-xl bg-white/60 px-1 sm:px-2 py-2 sm:py-3 shadow-sm backdrop-blur-sm"
          >
            <span className="text-lg sm:text-2xl md:text-3xl font-black text-slate-800 tabular-nums leading-none">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="mt-0.5 sm:mt-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-slate-400">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
