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
      {/* Glassmorphism Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-emerald-300/10 blur-[150px]" />
        <div className="absolute top-1/2 -right-40 h-[500px] w-[500px] rounded-full bg-teal-200/10 blur-[150px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-amber-200/8 blur-[120px]" />
      </div>

      <motion.div
        className="relative z-10 mx-auto max-w-4xl px-4 pb-32 pt-24 sm:px-6 md:pt-28"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
        variants={stagger}
      >
        {/* Page Header */}
        <motion.div variants={fadeUp} custom={0} className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass-strong px-6 py-2 text-sm font-medium text-emerald-700 mb-6">
            <User className="h-4 w-4" />
            Portal Siswa 9B
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-800 mb-4">
            Profil <span className="gradient-text-warm">Eksklusif</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Identitas digitalmu sebagai bagian dari keluarga besar SPENSAKA 9B Angkatan 2026
          </p>
        </motion.div>

        {/* Success toast */}
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl glass-strong p-4 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-emerald-700">
              <Check className="h-5 w-5" />
              <span className="font-medium">Profil berhasil diperbarui!</span>
            </div>
          </motion.div>
        )}

        {/* Main Profile Card */}
        <motion.div variants={fadeUp} custom={1} className="glass-premium mb-8 p-8 md:p-12 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="h-32 w-32 md:h-40 md:w-40 overflow-hidden rounded-3xl ring-4 ring-emerald-200/50 shadow-2xl mx-auto">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt={fullName || "Avatar"} width={160} height={160} className="h-full w-full object-cover" unoptimized />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600">
                    <User className="h-16 w-16 md:h-20 md:w-20 text-white" />
                  </div>
                )}
              </div>
              {/* Upload photo button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-3 -right-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white ring-4 ring-white shadow-xl text-emerald-600 hover:bg-emerald-50 transition-all disabled:opacity-50"
                title="Ganti foto profil"
              >
                {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <div className="absolute -bottom-3 -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-white">
                <span className="h-3 w-3 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">
              {fullName ?? <span className="text-slate-400 italic font-normal">Nama belum tersedia</span>}
            </h2>
            {username && (
              <p className="text-lg font-semibold text-emerald-600 mb-4">@{username}</p>
            )}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 rounded-2xl glass-strong px-4 py-2 text-sm font-semibold text-emerald-700">
                <Star className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                Siswa Kelas 9B
              </span>
              <span className="inline-flex items-center gap-2 rounded-2xl glass-strong px-4 py-2 text-sm font-medium text-slate-600">
                <Shield className="h-4 w-4 text-blue-500" />
                Google Verified
              </span>
            </div>
            {uploadError && (
              <p className="text-sm text-red-500 bg-red-50/80 rounded-xl px-4 py-2 inline-block">{uploadError}</p>
            )}
          </div>
        </motion.div>

        {/* Editable Info Section */}
        <motion.div variants={fadeUp} custom={2} className="glass-premium mb-8 p-8 rounded-3xl shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800">Informasi Pribadi</h3>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-600 hover:shadow-xl transition-all hover:scale-105"
              >
                <Edit3 className="h-4 w-4" /> Edit Profil
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => { setEditing(false); setEditBio(profile?.bio || ""); setEditIg(profile?.instagram_username || ""); }}
                  className="flex items-center gap-2 rounded-2xl glass-strong px-6 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-all"
                >
                  <X className="h-4 w-4" /> Batal
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-600 disabled:opacity-50 transition-all hover:scale-105"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Simpan
                </button>
              </div>
            )}
          </div>

          {saveError && (
            <div className="mb-6 rounded-2xl bg-red-50/80 border border-red-200 p-4">
              <p className="text-sm text-red-600">{saveError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bio */}
            <div className="space-y-3">
              <label className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-500" /> Bio
              </label>
              {editing ? (
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  maxLength={150}
                  rows={4}
                  className="w-full rounded-2xl glass-strong p-4 text-sm resize-none focus:ring-2 focus:ring-emerald-300 transition-all"
                  placeholder="Ceritakan sedikit tentang dirimu..."
                />
              ) : (
                <div className="rounded-2xl glass-strong p-4 min-h-[100px] flex items-center">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {bio || <span className="italic text-slate-400">Belum diisi</span>}
                  </p>
                </div>
              )}
            </div>

            {/* Instagram */}
            <div className="space-y-3">
              <label className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <InstagramIcon className="h-4 w-4 text-pink-500" /> Instagram
              </label>
              {editing ? (
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 text-sm">@</span>
                  <input
                    type="text"
                    value={editIg}
                    onChange={(e) => setEditIg(e.target.value.replace(/\s/g, "").replace("@", ""))}
                    className="w-full rounded-2xl glass-strong pl-8 pr-4 py-4 text-sm focus:ring-2 focus:ring-emerald-300 transition-all"
                    placeholder="username_instagram"
                    maxLength={48}
                  />
                </div>
              ) : (
                <div className="rounded-2xl glass-strong p-4 flex items-center justify-between">
                  <p className="text-sm text-slate-600">
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
                      <span className="italic text-slate-400">Belum diisi</span>
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
        </motion.div>

        {/* Account Details */}
        <motion.div variants={fadeUp} custom={3} className="glass-premium mb-8 p-8 rounded-3xl shadow-xl divide-y divide-slate-200/50">
          <div className="pb-6">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Detail Akun</h3>
          </div>

          {/* Nama Lengkap */}
          <div className="py-6 flex items-center gap-6">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-50">
              <User className="h-5 w-5 text-blue-500" strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Nama Lengkap</p>
              <p className="mt-1 text-base font-semibold text-slate-700">
                {fullName ?? <span className="italic text-slate-400">Belum diisi</span>}
              </p>
            </div>
          </div>

          {/* Username */}
          <div className="py-6 flex items-center gap-6">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-50">
              <span className="text-sm font-black text-emerald-600">@</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Username</p>
              <p className="mt-1 text-base font-semibold text-slate-700">
                {username ?? <span className="italic text-slate-400">Belum diisi</span>}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="py-6 flex items-center gap-6">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-violet-50">
              <Mail className="h-5 w-5 text-violet-500" strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email</p>
              <p className="mt-1 text-base font-semibold text-slate-700">
                {email ?? <span className="italic text-slate-400">Tidak tersedia</span>}
              </p>
            </div>
          </div>
        </motion.div>

        {/* School Info */}
        <motion.div variants={fadeUp} custom={4} className="glass-premium mb-12 p-8 rounded-3xl shadow-xl">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl ring-2 ring-emerald-200/50 shadow-lg">
              <Image src="/logo.png" alt="Logo SPENSAKA" width={64} height={64} className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Sekolah</p>
              <p className="mt-1 text-xl font-bold text-slate-800">SMPN 1 Karanglewas</p>
              <p className="text-base text-emerald-600 font-medium">SPENSAKA · Kelas 9B · Angkatan 2026</p>
            </div>
          </div>
        </motion.div>

        {/* Logout Section */}
        <motion.div variants={fadeUp} custom={5} className="text-center">
          <button
            id="btn-logout"
            onClick={async () => {
              await signOut();
              router.push("/");
            }}
            className="inline-flex items-center gap-3 rounded-2xl border-2 border-red-200 bg-red-50/80 px-8 py-4 text-base font-semibold text-red-600 shadow-lg hover:bg-red-100 hover:shadow-xl transition-all hover:scale-105"
          >
            <LogOut className="h-5 w-5" />
            Keluar dari Akun
          </button>
          <p className="mt-4 text-sm text-slate-400">
            Powered by <span className="text-slate-500 font-medium">Clerk Auth · Google OAuth</span>
          </p>
        </motion.div>

      </motion.div>
    </div>
  );
}
