"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { User, FileText, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import InstagramIcon from "@/components/InstagramIcon";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }),
};

export default function SetupProfilePage() {
  const { user, loading, refreshProfile, needsProfileSetup } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [igUsername, setIgUsername] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const pathname = usePathname();

  // Jika belum login, redirect ke home
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
    // Jika sudah punya username, tak perlu di sini, tapi pastikan hanya redirect kalau bukan loop
    if (!loading && !needsProfileSetup && user) {
      router.replace("/");
    }
  }, [loading, user, needsProfileSetup, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-emerald-500" />
      </div>
    );
  }

  const avatarUrl = user?.user_metadata?.avatar_url;
  const fullName = user?.user_metadata?.full_name || "";
  const email = user?.email || "";

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const u = username.trim();
    if (!u) { setError("Username wajib diisi."); return; }
    if (u.length < 3) { setError("Username minimal 3 karakter."); return; }
    if (!/^[a-zA-Z0-9_.-]+$/.test(u)) { setError("Username hanya boleh huruf, angka, titik, strip, dan underscore."); return; }

    setBusy(true);
    try {
      // Cek apakah username sudah dipakai
      const { data: existing } = await supabase
        .from("profil_user")
        .select("id")
        .eq("username", u)
        .neq("id", user.id)
        .maybeSingle();

      if (existing) {
        setError("Username sudah dipakai. Coba username lain.");
        setBusy(false);
        return;
      }

      // Upsert profil_user
      const { error: upsertErr } = await supabase
        .from("profil_user")
        .upsert({
          id: user.id,
          email: email,
          username: u,
          bio: bio.trim() || null,
          instagram_username: igUsername.trim().replace("@", "") || null,
        }, { onConflict: "id" });

      if (upsertErr) throw upsertErr;

      await refreshProfile();
      window.location.href = "/";
    } catch (err) {
      setError(err?.message || "Terjadi kesalahan. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-screen page-shell flex items-center justify-center px-4 pb-32 pt-24">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-emerald-200/20 blur-[150px] pointer-events-none" />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        {/* Header */}
        <motion.div variants={fadeUp} custom={0} className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-1.5 text-xs font-medium text-emerald-600 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Satu langkah lagi!
          </div>

          {/* Google Avatar */}
          <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-2xl ring-2 ring-emerald-200/50 shadow-md">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={fullName} width={80} height={80} className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-300 to-teal-400">
                <User className="h-10 w-10 text-white" />
              </div>
            )}
          </div>

          <h1 className="text-2xl font-black text-slate-800 sm:text-3xl">
            Halo, <span className="gradient-text">{fullName.split(" ")[0] || "Teman"}!</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Lengkapi profil kamu sebelum bergabung ke portal 9B.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div variants={fadeUp} custom={1} className="bento-card p-6 sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 via-transparent to-blue-50/20 pointer-events-none" />
          <form onSubmit={handleSubmit} className="relative z-10 space-y-5">

            {/* Username */}
            <div>
              <label htmlFor="setup-username" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Username <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <span className="text-slate-400 text-sm font-medium">@</span>
                </div>
                <input
                  id="setup-username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
                  required
                  maxLength={48}
                  className="input-glass pl-8"
                  placeholder="misal: jazmi9b"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-300">Huruf kecil, angka, titik, strip. Min 3 karakter.</p>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="setup-bio" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Bio <span className="text-slate-300">(opsional)</span>
              </label>
              <textarea
                id="setup-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={150}
                className="input-glass resize-none"
                placeholder="Ceritakan sedikit tentang dirimu... (maks. 150 karakter)"
              />
              <p className="mt-1 text-right text-[11px] text-slate-300">{bio.length}/150</p>
            </div>

            {/* Instagram */}
            <div>
              <label htmlFor="setup-ig" className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <InstagramIcon className="h-3 w-3 text-pink-400" /> Instagram <span className="text-slate-300">(opsional)</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <span className="text-slate-400 text-sm font-medium">@</span>
                </div>
                <input
                  id="setup-ig"
                  type="text"
                  value={igUsername}
                  onChange={(e) => setIgUsername(e.target.value.replace(/\s/g, "").replace("@", ""))}
                  maxLength={48}
                  className="input-glass pl-8"
                  placeholder="username_instagram"
                />
              </div>
            </div>

            {/* Google info (read-only) */}
            <div className="rounded-xl border border-black/5 bg-white/60 px-4 py-3 flex items-center gap-3">
              <div className="h-8 w-8 overflow-hidden rounded-lg flex-shrink-0">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="" width={32} height={32} className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-100">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-slate-600">{fullName}</p>
                <p className="truncate text-[11px] text-slate-400">{email}</p>
              </div>
              <div className="ml-auto flex-shrink-0">
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600" role="alert">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              id="btn-setup-submit"
              disabled={busy}
              className="btn-primary w-full justify-center text-sm"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              {busy ? "Menyimpan..." : "Simpan & Masuk ke Portal 9B"}
            </button>

          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
