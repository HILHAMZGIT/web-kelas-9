"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) return null;
    const { data } = await supabase
      .from("profil_user")
      .select("id, username, bio, email")
      .eq("id", userId)
      .maybeSingle();
    return data ?? null;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!session?.user?.id) return;
    const data = await fetchProfile(session.user.id);
    setProfile(data);
  }, [session?.user?.id, fetchProfile]);

  useEffect(() => {
    let mounted = true;

    // Cek apakah ada hash token atau code di URL (pertanda sedang proses OAuth callback)
    const url = new URL(window.location.href);
    const isAuthCallback = url.hash.includes("access_token") || url.searchParams.has("code");

    const initializeAuth = async () => {
      try {
        const { data: { session: s }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(s);
          if (s?.user?.id) {
            const p = await fetchProfile(s.user.id);
            setProfile(p);
          }
          
          // Jika BUKAN callback URL, kita bisa set loading false sekarang.
          // Jika ini callback URL, kita biarkan onAuthStateChange yang mengatur state loading
          // setelah event SIGNED_IN tertangkap. Ini menghindari race condition.
          if (!isAuthCallback || error) {
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Auth init error:", err);
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // Dengarkan event auth (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, sess) => {
        if (!mounted) return;

        if (event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "USER_UPDATED") {
          setSession(sess);
          if (sess?.user?.id) {
            const p = await fetchProfile(sess.user.id);
            setProfile(p);
          }
          setLoading(false);
        } else if (event === "SIGNED_OUT") {
          setSession(null);
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  const needsProfileSetup = session?.user && (!profile?.username || profile.username.trim() === "");

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        loading,
        signInWithGoogle,
        signOut,
        refreshProfile,
        needsProfileSetup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
