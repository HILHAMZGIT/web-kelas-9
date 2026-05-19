"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cake, PartyPopper, Sparkles } from "lucide-react";
import {
  getTodaysBirthdays,
  getUpcomingBirthdays,
} from "@/lib/birthdayHelper";

export default function BirthdayWidget() {
  const [todaysBirthdays, setTodaysBirthdays] = useState([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTodaysBirthdays(getTodaysBirthdays());
    setUpcomingBirthdays(getUpcomingBirthdays(3));
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) return null;

  // ─── STATE 1: Ada yang ulang tahun hari ini ─────────────────
  if (todaysBirthdays.length > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 p-4 sm:p-6 shadow-2xl shadow-pink-300/40"
      >
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/10 blur-xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 sm:gap-3 mb-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm shrink-0">
              <PartyPopper className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <span className="rounded-full bg-white/20 px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              🎂 Ulang Tahun
            </span>
          </div>

          <div className="space-y-2">
            {todaysBirthdays.map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15 + 0.2 }}
                className="flex items-start sm:items-center gap-2 sm:gap-3"
              >
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5 sm:mt-0 text-yellow-200" />
                <p className="text-base sm:text-xl md:text-2xl font-black text-white tracking-tight leading-tight break-words">
                  🎉 HBD {name}! 🎉
                </p>
              </motion.div>
            ))}
          </div>

          <p className="mt-3 text-xs sm:text-sm font-medium text-white/70">
            Selamat ulang tahun, semoga sehat selalu dan sukses! 🎂✨
          </p>
        </div>

        {/* Animated confetti dots */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white/30"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -8, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  // ─── STATE 2: Tidak ada yang ulang tahun hari ini ───────────
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="rounded-2xl border border-white/30 bg-white/40 p-4 sm:p-6 shadow-xl backdrop-blur-xl"
    >
      <div className="mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
        <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 shadow-lg shrink-0">
          <Cake className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xs sm:text-sm font-black text-slate-800 truncate">Ulang Tahun Terdekat</h3>
          <p className="text-[9px] sm:text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Segera hadir 🎂
          </p>
        </div>
      </div>

      {upcomingBirthdays.length > 0 ? (
        <div className="space-y-2 sm:space-y-3">
          {upcomingBirthdays.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
              className="flex items-center justify-between rounded-xl bg-white/60 px-3 sm:px-4 py-2.5 sm:py-3 shadow-sm backdrop-blur-sm transition-all hover:bg-white/80 gap-2"
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-300 to-orange-400 text-xs sm:text-sm shadow-sm shrink-0">
                  🎂
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-700 truncate">
                  {item.name}
                </span>
              </div>
              <span className="whitespace-nowrap rounded-full bg-gradient-to-r from-purple-50 to-pink-50 px-2 sm:px-3 py-1 text-[10px] sm:text-[11px] font-bold text-purple-600 shadow-sm shrink-0">
                {item.daysUntil === 0
                  ? "Hari ini!"
                  : item.daysUntil === 1
                    ? "Besok!"
                    : `${item.daysUntil} hari lagi`}
              </span>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="py-3 sm:py-4 text-center text-xs sm:text-sm font-medium text-slate-400">
          Tidak ada data ulang tahun 🎈
        </p>
      )}
    </motion.div>
  );
}
