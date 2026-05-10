"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useUser, useAuth as useClerkAuth } from "@clerk/nextjs";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerkAuth();
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) return null;
    try {
      const { data } = await supabase
        .from("profil_user")
        .select("id, username, bio, email")
        .eq("id", userId)
        .maybeSingle();
      return data ?? null;
    } catch {
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!clerkUser?.id) return;
    const data = await fetchProfile(clerkUser.id);
    setProfile(data);
  }, [clerkUser?.id, fetchProfile]);

  useEffect(() => {
    if (!clerkLoaded) return;
    
    let cancelled = false;

    const loadProfile = async () => {
      if (clerkUser?.id) {
        setProfileLoading(true);
        try {
          const p = await fetchProfile(clerkUser.id);
          if (!cancelled) setProfile(p);
        } catch (e) {
          if (!cancelled) setProfile(null);
        } finally {
          if (!cancelled) setProfileLoading(false);
        }
      } else {
        if (!cancelled) {
          setProfile(null);
          setProfileLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [clerkUser?.id, clerkLoaded, fetchProfile]);

  const signOut = async () => {
    await clerkSignOut();
    setProfile(null);
  };

  const loading = !clerkLoaded || profileLoading;
  const user = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress,
    user_metadata: {
      full_name: clerkUser.fullName,
      avatar_url: clerkUser.imageUrl,
    }
  } : null;

  const needsProfileSetup = user && !loading && (!profile?.username || profile.username.trim() === "");

  return (
    <AuthContext.Provider
      value={{
        session: user ? { user } : null,
        user,
        profile,
        loading,
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
