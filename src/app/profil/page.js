"use client";

import Image from "next/image";
import { User, Mail, Shield, Star, Loader2, FileText, LogOut } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilPage() {
  const { user, profile, loading, signOut, needsProfileSetup } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/");
    if (!loading && needsProfileSetup) router.replace("/setup-profile");
  }, [loading, user, needsProfileSetup, router]);

  if (loading || !user) {
    return (
      <div className="relative min-h-screen page-shell">
        <div className="mx-auto max-w-2xl px-4 pb-32 pt-24 sm:px-6 md:pt-28">
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
            <p className="text-sm">Memuat data profil...</p>
          </div>
        </div>
      </div>
    );
  }

  const fullName = user?.user_metadata?.full_name || null;
  const email = user?.email || null;
  const avatarUrl = user?.user_metadata?.avatar_url || null;
  const username = profile?.username || null;
  const bio = profile?.bio || null;

  return (
    <div className="relative min-h-screen page-shell">
      <div className="mx-auto max-w-2xl px-4 pb-32 pt-24 sm:px-6 md:pt-28">

        {/* Page Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Akun Saya</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">Profil Saya</h1>
          <p className="mt-2 text-sm text-slate-400">
            Identitas yang kamu pakai di portal kenangan kelas{" "}
            <span className="text-emerald-400 font-medium">9B</span>.
          </p>
        </div>

        {/* Avatar Card */}
        <div className="bento-card mb-4 p-6 sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/8 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
            <div className="relative flex-shrink-0">
              <div className="h-20 w-20 overflow-hidden rounded-2xl ring-2 ring-white/10 sm:h-24 sm:w-24">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt={fullName || "Avatar"} width={96} height={96} className="h-full w-full object-cover" unoptimized />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-700 to-emerald-900">
                    <User className="h-10 w-10 text-emerald-300" />
                  </div>
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 ring-2 ring-slate-900">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                {fullName ?? <span className="text-slate-500 italic font-normal text-base">Nama belum tersedia</span>}
              </h2>
              {username && (
                <p className="mt-0.5 text-sm font-medium text-emerald-400">@{username}</p>
              )}
              <p className="mt-0.5 text-sm text-slate-400">
                {email ?? <span className="italic text-slate-600">Email tidak tersedia</span>}
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  <Star className="h-3 w-3 fill-emerald-400 text-emerald-400" />
                  Siswa Kelas 9B
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs text-slate-400">
                  <Shield className="h-3 w-3 text-blue-400" />
                  Google Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Details */}
        <div className="bento-card mb-4 divide-y divide-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent pointer-events-none" />

          {/* Nama Lengkap */}
          <div className="relative z-10 flex items-center gap-4 p-5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-400/10">
              <User className="h-4 w-4 text-blue-400" strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-widest text-slate-500">Nama Lengkap</p>
              <p className="mt-0.5 truncate text-sm font-medium text-slate-200">
                {fullName ?? <span className="italic text-slate-500">Belum diisi</span>}
              </p>
            </div>
          </div>

          {/* Username */}
          <div className="relative z-10 flex items-center gap-4 p-5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-400/10">
              <span className="text-xs font-black text-emerald-400">@</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-widest text-slate-500">Username</p>
              <p className="mt-0.5 truncate text-sm font-medium text-slate-200">
                {username ?? <span className="italic text-slate-500">Belum diisi</span>}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="relative z-10 flex items-center gap-4 p-5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-violet-400/10">
              <Mail className="h-4 w-4 text-violet-400" strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-widest text-slate-500">Email</p>
              <p className="mt-0.5 truncate text-sm font-medium text-slate-200">
                {email ?? <span className="italic text-slate-500">Tidak tersedia</span>}
              </p>
            </div>
          </div>

          {/* Bio */}
          <div className="relative z-10 flex items-start gap-4 p-5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-amber-400/10">
              <FileText className="h-4 w-4 text-amber-400" strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-widest text-slate-500">Bio</p>
              <p className="mt-0.5 text-sm font-medium text-slate-200 leading-relaxed">
                {bio ?? <span className="italic text-slate-500">Belum diisi</span>}
              </p>
            </div>
          </div>
        </div>

        {/* School Info */}
        <div className="bento-card mb-6 p-5">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10">
              <Image src="/logo.png" alt="Logo SPENSAKA" width={48} height={48} className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">Sekolah</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-200">SMPN 1 Karanglewas</p>
              <p className="text-xs text-amber-400">SPENSAKA · Kelas 9B · 2026</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            id="btn-logout"
            onClick={signOut}
            className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
            Keluar dari Akun
          </button>
          <p className="text-xs text-slate-600">
            Powered by <span className="text-slate-400">Clerk Auth · Google OAuth</span>
          </p>
        </div>

      </div>
    </div>
  );
}
