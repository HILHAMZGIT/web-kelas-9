"use client";

import Image from "next/image";
import {
  User, Mail, Shield, Star, Loader2, FileText, LogOut,
  Camera, Edit3, Check, X, Upload,
} from "lucide-react";
import InstagramIcon from "@/components/InstagramIcon";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.23, 1, 0.32, 1] }
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } }
};

export default function ProfilPage() {
  const { user, profile, loading, signOut, needsProfileSetup, refreshProfile } = useAuth();
  const router = useRouter();

  // Edit states
  const [editing, setEditing] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [editIg, setEditIg] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Photo upload
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/");
    if (!loading && needsProfileSetup) router.replace("/setup-profile");
  }, [loading, user, needsProfileSetup, router]);

  useEffect(() => {
    if (profile) {
      setEditBio(profile.bio || "");
      setEditIg(profile.instagram_username || "");
    }
  }, [profile]);

  if (loading || !user) {
    return (
      <div className="relative min-h-screen page-shell">
        <div className="mx-auto max-w-2xl px-4 pb-32 pt-24 sm:px-6 md:pt-28">
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            <p className="text-sm">Memuat data profil...</p>
          </div>
        </div>
      </div>
    );
  }

  const fullName = user?.user_metadata?.full_name || null;
  const email = user?.email || null;
  const avatarUrl = profile?.foto_profil || user?.user_metadata?.avatar_url || null;
  const username = profile?.username || null;
  const bio = profile?.bio || null;
  const igUsername = (profile?.instagram_username || "").trim();

  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith("image/")) {
      setUploadError("File harus berupa gambar.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Ukuran file maksimal 5MB.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const ext = file.name.split(".").pop();
      const filePath = `profile/${user.id}.${ext}`;

      // Upload to Supabase Storage
      const { error: uploadErr } = await supabase.storage
        .from("profile")
        .upload(filePath, file, { upsert: true, cacheControl: "3600" });

      if (uploadErr) throw uploadErr;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("profile")
        .getPublicUrl(filePath);

      // Update profile
      const { error: updateErr } = await supabase
        .from("profil_user")
        .update({ foto_profil: publicUrl + "?t=" + Date.now() })
        .eq("id", user.id);

      if (updateErr) throw updateErr;

      await refreshProfile();
    } catch (err) {
      setUploadError(err?.message || "Gagal upload foto.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveProfile() {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const { error } = await supabase
        .from("profil_user")
        .update({
          bio: editBio.trim() || null,
          instagram_username: editIg.trim().replace("@", "") || null,
        })
        .eq("id", user.id);

      if (error) throw error;

      await refreshProfile();
      setSaveSuccess(true);
      setEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err?.message || "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative min-h-screen page-shell">
      <motion.div
        className="mx-auto max-w-2xl px-4 pb-32 pt-24 sm:px-6 md:pt-28"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
        variants={stagger}
      >
        {/* Page Header */}
        <motion.div variants={fadeUp} custom={0} className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Akun Saya</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">Profil Saya</h1>
          <p className="mt-2 text-sm text-slate-400">
            Identitas yang kamu pakai di portal kenangan kelas{" "}
            <span className="text-emerald-600 font-medium">9B</span>.
          </p>
        </motion.div>

        {/* Success toast */}
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2"
          >
            <Check className="h-4 w-4" /> Profil berhasil diperbarui!
          </motion.div>
        )}

        {/* Avatar Card */}
        <motion.div variants={fadeUp} custom={1} className="bento-card mb-4 p-6 sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
            <div className="relative flex-shrink-0">
              <div className="h-20 w-20 overflow-hidden rounded-2xl ring-2 ring-emerald-200/50 shadow-md sm:h-24 sm:w-24">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt={fullName || "Avatar"} width={96} height={96} className="h-full w-full object-cover" unoptimized />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-300 to-teal-400">
                    <User className="h-10 w-10 text-white" />
                  </div>
                )}
              </div>
              {/* Upload photo button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white ring-2 ring-emerald-200 shadow-md text-emerald-600 hover:bg-emerald-50 transition-all disabled:opacity-50"
                title="Ganti foto profil"
              >
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <span className="absolute -bottom-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-white ring-2 ring-white">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
                {fullName ?? <span className="text-slate-400 italic font-normal text-base">Nama belum tersedia</span>}
              </h2>
              {username && (
                <p className="mt-0.5 text-sm font-medium text-emerald-600">@{username}</p>
              )}
              <p className="mt-0.5 text-sm text-slate-400">
                {email ?? <span className="italic text-slate-300">Email tidak tersedia</span>}
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  <Star className="h-3 w-3 fill-emerald-500 text-emerald-500" />
                  Siswa Kelas 9B
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
                  <Shield className="h-3 w-3 text-blue-400" />
                  Google Verified
                </span>
              </div>
            </div>
          </div>
          {uploadError && (
            <p className="relative z-10 mt-3 text-xs text-red-500 text-center">{uploadError}</p>
          )}
        </motion.div>

        {/* Bio & Instagram — Editable */}
        <motion.div variants={fadeUp} custom={2} className="bento-card mb-4 p-5 sm:p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-700">Informasi Profil</h3>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600 ring-1 ring-emerald-200/50 transition-all hover:bg-emerald-100"
                >
                  <Edit3 className="h-3 w-3" /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditing(false); setEditBio(profile?.bio || ""); setEditIg(profile?.instagram_username || ""); }}
                    className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-200"
                  >
                    <X className="h-3 w-3" /> Batal
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-600 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} Simpan
                  </button>
                </div>
              )}
            </div>

            {saveError && (
              <p className="mb-3 text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 border border-red-200">{saveError}</p>
            )}

            <div className="space-y-4">
              {/* Bio */}
              <div>
                <label className="text-[11px] font-medium uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-1.5">
                  <FileText className="h-3 w-3 text-amber-500" /> Bio
                </label>
                {editing ? (
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    maxLength={150}
                    rows={3}
                    className="input-glass resize-none"
                    placeholder="Ceritakan sedikit tentang dirimu..."
                  />
                ) : (
                  <p className="text-sm text-slate-600 leading-relaxed bg-white/50 rounded-xl px-4 py-3 border border-black/5">
                    {bio || <span className="italic text-slate-300">Belum diisi</span>}
                  </p>
                )}
              </div>

              {/* Instagram */}
              <div>
                <label className="text-[11px] font-medium uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-1.5">
                  <InstagramIcon className="h-3 w-3 text-pink-500" /> Instagram
                </label>
                {editing ? (
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 text-sm">@</span>
                    <input
                      type="text"
                      value={editIg}
                      onChange={(e) => setEditIg(e.target.value.replace(/\s/g, "").replace("@", ""))}
                      className="input-glass pl-8"
                      placeholder="username_instagram"
                      maxLength={48}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-slate-600 bg-white/50 rounded-xl px-4 py-3 border border-black/5 flex-1">
                      {igUsername ? (
                        <a
                          href={`https://instagram.com/${igUsername}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-pink-500 hover:text-pink-600 font-medium transition-colors"
                        >
                          @{igUsername}
                        </a>
                      ) : (
                        <span className="italic text-slate-300">Belum diisi</span>
                      )}
                    </p>
                    {igUsername && (
                      <a
                        href={`https://instagram.com/${igUsername}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md transition hover:shadow-lg hover:scale-105"
                      >
                        <InstagramIcon className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info Details (read-only) */}
        <motion.div variants={fadeUp} custom={3} className="bento-card mb-4 divide-y divide-black/5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-transparent pointer-events-none" />

          {/* Nama Lengkap */}
          <div className="relative z-10 flex items-center gap-4 p-5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
              <User className="h-4 w-4 text-blue-500" strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-widest text-slate-400">Nama Lengkap</p>
              <p className="mt-0.5 truncate text-sm font-medium text-slate-700">
                {fullName ?? <span className="italic text-slate-300">Belum diisi</span>}
              </p>
            </div>
          </div>

          {/* Username */}
          <div className="relative z-10 flex items-center gap-4 p-5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50">
              <span className="text-xs font-black text-emerald-600">@</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-widest text-slate-400">Username</p>
              <p className="mt-0.5 truncate text-sm font-medium text-slate-700">
                {username ?? <span className="italic text-slate-300">Belum diisi</span>}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="relative z-10 flex items-center gap-4 p-5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-violet-50">
              <Mail className="h-4 w-4 text-violet-500" strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-widest text-slate-400">Email</p>
              <p className="mt-0.5 truncate text-sm font-medium text-slate-700">
                {email ?? <span className="italic text-slate-300">Tidak tersedia</span>}
              </p>
            </div>
          </div>
        </motion.div>

        {/* School Info */}
        <motion.div variants={fadeUp} custom={4} className="bento-card mb-6 p-5">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/40 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl ring-1 ring-black/5 shadow-sm">
              <Image src="/logo.png" alt="Logo SPENSAKA" width={48} height={48} className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Sekolah</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-700">SMPN 1 Karanglewas</p>
              <p className="text-xs text-amber-600">SPENSAKA · Kelas 9B · 2026</p>
            </div>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div variants={fadeUp} custom={5} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            id="btn-logout"
            onClick={signOut}
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-100 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Keluar dari Akun
          </button>
          <p className="text-xs text-slate-300">
            Powered by <span className="text-slate-400">Clerk Auth · Google OAuth</span>
          </p>
        </motion.div>

      </motion.div>
    </div>
  );
}
