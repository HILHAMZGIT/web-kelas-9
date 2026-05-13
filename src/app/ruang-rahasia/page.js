"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, Send, MessageSquare, Sparkles, Eye, EyeOff,
  Loader2, CheckCircle2, Clock, Ghost,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

/* ─── Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function RuangRahasiaPage() {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfessions, setShowConfessions] = useState(true);
  const textareaRef = useRef(null);

  // Fetch confessions
  useEffect(() => {
    async function fetchConfessions() {
      const { data, error } = await supabase
        .from("confessions")
        .select("id, message, created_at")
        .order("created_at", { ascending: false })
        .limit(50);
      if (!error && data) setConfessions(data);
      setLoading(false);
    }

    fetchConfessions();

    // Real-time
    const channel = supabase
      .channel("confessions-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "confessions" },
        (payload) => {
          setConfessions((prev) => [payload.new, ...prev]);
        })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || sending) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from("confessions")
        .insert({ message: trimmed });

      if (error) throw error;

      setMessage("");
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      console.error("Failed to send confession:", err);
    } finally {
      setSending(false);
    }
  }

  function formatTime(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "Baru saja";
    if (mins < 60) return `${mins} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    if (days < 7) return `${days} hari lalu`;
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <div className="relative min-h-screen page-shell">
      {/* Subtle mysterious ambient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-violet-300/5 blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-slate-400/5 blur-[120px]" />
      </div>

      <motion.div
        className="relative z-10 mx-auto max-w-2xl px-4 pb-32 pt-24 sm:px-6 md:pt-28"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* ─── Header ─── */}
        <motion.section variants={fadeUp} custom={0} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-300/40 bg-slate-100/30 backdrop-blur-xl px-5 py-2 text-xs font-semibold text-slate-500 mb-6">
            <Ghost className="h-3.5 w-3.5" />
            <span className="tracking-[0.2em] uppercase">100% Anonim</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-prestige tracking-tight text-[#1a1a1a] mb-4">
            Ruang <span className="gradient-text">Rahasia</span>
          </h1>

          <p className="max-w-md mx-auto text-sm text-[#718096] leading-relaxed">
            Sampaikan apapun yang ada di pikiran. Uneg-uneg, perasaan, atau pesan untuk teman sekelas.
            <span className="block mt-1 text-[#a0aec0] italic">Tidak ada yang tahu siapa kamu.</span>
          </p>
        </motion.section>

        {/* ─── Confession Form ─── */}
        <motion.section variants={fadeUp} custom={1} className="mb-12">
          <form onSubmit={handleSubmit}>
            <div className="bento-card p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-slate-100/60 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <span className="text-xs font-bold text-[#a0aec0] uppercase tracking-widest">Confess Anonim</span>
              </div>

              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis apapun di sini... identitasmu aman."
                maxLength={500}
                rows={4}
                className="input-glass w-full resize-none text-sm leading-relaxed"
              />

              <div className="flex items-center justify-between mt-4">
                <span className="text-[10px] font-semibold text-[#a0aec0] tracking-wide">
                  {message.length}/500
                </span>

                <button
                  type="submit"
                  disabled={!message.trim() || sending}
                  className="btn-primary text-sm py-2.5 px-6 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Mengirim...</>
                  ) : sent ? (
                    <><CheckCircle2 className="h-4 w-4" /> Terkirim!</>
                  ) : (
                    <><Send className="h-4 w-4" /> Kirim</>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Success animation */}
          <AnimatePresence>
            {sent && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 font-medium flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Pesan rahasia berhasil dikirim secara anonim!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* ─── Confessions Feed ─── */}
        <motion.section variants={fadeUp} custom={2}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#a0aec0]" />
              <h2 className="text-sm font-black text-[#1a1a1a] uppercase tracking-wider">
                Confession Wall
              </h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                {confessions.length}
              </span>
            </div>

            <button
              onClick={() => setShowConfessions(!showConfessions)}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showConfessions ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {showConfessions ? "Sembunyikan" : "Tampilkan"}
            </button>
          </div>

          <AnimatePresence>
            {showConfessions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 overflow-hidden"
              >
                {loading ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-slate-300 mx-auto" />
                    <p className="text-xs text-slate-400 mt-3">Memuat confessions...</p>
                  </div>
                ) : confessions.length === 0 ? (
                  <div className="bento-card p-10 text-center">
                    <Ghost className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-400">Belum ada confession</p>
                    <p className="text-xs text-slate-300 mt-1">Jadilah yang pertama mengungkapkan rahasia!</p>
                  </div>
                ) : (
                  confessions.map((c, idx) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="bento-card p-4 sm:p-5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-slate-100/60 flex items-center justify-center mt-0.5">
                          <Ghost className="h-4 w-4 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-bold text-[#1a1a1a]">Anonim</span>
                            <span className="text-[10px] text-[#a0aec0] flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(c.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-[#4a5568] leading-relaxed whitespace-pre-wrap break-words">
                            {c.message}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </motion.div>
    </div>
  );
}
