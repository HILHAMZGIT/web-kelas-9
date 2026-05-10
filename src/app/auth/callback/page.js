"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const { user, loading, needsProfileSetup } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if the auth process has finished loading
    if (!loading) {
      if (user) {
        if (needsProfileSetup) {
          router.replace("/setup-profile");
        } else {
          router.replace("/");
        }
      } else {
        // If no user is found after loading, go back home
        router.replace("/");
      }
    }
  }, [user, loading, needsProfileSetup, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-slate-200">
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse-glow" />
        <Loader2 className="relative z-10 h-12 w-12 animate-spin text-emerald-400" />
      </div>
      <p className="text-sm font-semibold tracking-wide text-slate-300">Memverifikasi sesi aman...</p>
      <p className="mt-2 text-xs text-slate-500">Tunggu sebentar, kamu sedang diarahkan.</p>
    </div>
  );
}
