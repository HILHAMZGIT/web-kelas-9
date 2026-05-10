"use client";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";
import {
  Hash, Loader2, MessageCircle, Send, Users, X, User,
  FileText, Chrome,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SignInButton } from "@clerk/nextjs";

/* ─── Helpers ───────────────────────────────────────────────── */
function formatChatTime(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  } catch { return ""; }
}

/* ─── Profile Modal ─────────────────────────────────────────── */
function ProfileModal({ userId, onClose }) {
  const [profileData, setProfileData] = useState(null);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from("profil_user")
      .select("id, username, bio, email")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        setProfileData(data);
        setBusy(false);
      });
  }, [userId]);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-sm bento-card p-6 shadow-[0_0_60px_rgba(52,211,153,0.1),0_24px_60px_rgba(0,0,0,0.6)]">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/8 via-transparent to-blue-500/5 pointer-events-none rounded-3xl" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/8 text-slate-400 hover:bg-white/15 hover:text-white transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative z-10">
          {busy ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-7 w-7 animate-spin text-emerald-400" />
            </div>
          ) : !profileData ? (
            <p className="text-center text-sm text-slate-500 py-8">Profil tidak ditemukan.</p>
          ) : (
            <>
              {/* Avatar placeholder */}
              <div className="mb-4 flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 ring-2 ring-emerald-400/30 shadow-[0_0_20px_rgba(52,211,153,0.2)]">
                  <span className="text-2xl font-black text-white">
                    {(profileData.username?.[0] || "?").toUpperCase()}
                  </span>
                </div>
                <div className="text-center">
                  <p className="font-bold text-white text-lg">@{profileData.username || "—"}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Anggota Kelas 9B</p>
                </div>
              </div>

              {/* Bio */}
              {profileData.bio && (
                <div className="mb-4 rounded-xl border border-white/8 bg-white/3 px-4 py-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <FileText className="h-3 w-3 text-emerald-400" />
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400">Bio</p>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{profileData.bio}</p>
                </div>
              )}

              {/* Info rows */}
              <div className="space-y-2">
                {profileData.email && (
                  <div className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/3 px-3 py-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-400/10">
                      <User className="h-3.5 w-3.5 text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">Email</p>
                      <p className="truncate text-xs text-slate-300">{profileData.email}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/3 px-3 py-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/10">
                    <span className="text-[10px] font-black text-emerald-400">9B</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Kelas</p>
                    <p className="text-xs text-slate-300">9B · SMPN 1 Karanglewas</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════ */
export default function PesanPage() {
  const { user, profile, loading: authLoading, needsProfileSetup, signOut } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [sendBusy, setSendBusy] = useState(false);
  const [chatError, setChatError] = useState(null);
  const [loginBusy, setLoginBusy] = useState(false);

  // Profile modal
  const [modalUserId, setModalUserId] = useState(null);

  const scrollAnchorRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fetchMessages = useCallback(async () => {
    setMessagesLoading(true);
    setChatError(null);
    const { data, error } = await supabase
      .from("obrolan_kelas")
      .select("*, profil_user(id, username, bio)")
      .order("created_at", { ascending: true });
    if (error) { setChatError(error.message); setMessages([]); }
    else { setMessages(data ?? []); queueMicrotask(() => scrollToBottom()); }
    setMessagesLoading(false);
  }, [scrollToBottom]);

  const appendMessageRow = useCallback(async (rowId) => {
    const { data, error } = await supabase
      .from("obrolan_kelas")
      .select("*, profil_user(id, username, bio)")
      .eq("id", rowId)
      .single();
    if (error || !data) return;
    setMessages((prev) => {
      if (prev.some((m) => m.id === data.id)) return prev;
      const next = [...prev, data].sort((a, b) =>
        new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime()
      );
      return next;
    });
    queueMicrotask(() => scrollToBottom());
  }, [scrollToBottom]);

  useEffect(() => {
    if (!user) return;
    if (needsProfileSetup) { router.replace("/setup-profile"); return; }
    queueMicrotask(() => fetchMessages());
    const channel = supabase
      .channel("public:obrolan_kelas")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "obrolan_kelas" },
        (payload) => { const id = payload.new?.id; if (id) appendMessageRow(id); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, needsProfileSetup, fetchMessages, appendMessageRow, router]);

  useEffect(() => {
    if (messages.length && !messagesLoading) queueMicrotask(() => scrollToBottom());
  }, [messages.length, messagesLoading, scrollToBottom]);

  async function sendMessage() {
    const text = draft.trim();
    if (!text || !user) return;
    setSendBusy(true);
    setChatError(null);
    const { data, error } = await supabase
      .from("obrolan_kelas")
      .insert({ user_id: user.id, pesan: text })
      .select("*, profil_user(id, username, bio)")
      .single();
    setSendBusy(false);
    if (error) { setChatError(error.message); return; }
    setDraft("");
    if (data?.id) {
      setMessages((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev;
        return [...prev, data].sort((a, b) =>
          new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime()
        );
      });
      queueMicrotask(() => scrollToBottom());
    }
  }

  /* ── Loading ── */
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-9 w-9 animate-spin text-emerald-400" />
      </div>
    );
  }

  /* ── Auth Gate ── */
  if (!user) {
    return (
      <main className="page-shell flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-4 sm:p-6">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/25">
            <Hash className="h-8 w-8 text-white" strokeWidth={2.2} />
          </div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Grup Chat 9B</h1>
          <p className="mt-2 text-sm text-slate-400">Login dengan Google untuk bergabung ke obrolan real-time kelas.</p>
          <SignInButton mode="modal" fallbackRedirectUrl="/pesan">
            <button
              id="chat-login-google"
              className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-slate-900 font-bold text-sm shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all hover:scale-105 disabled:opacity-70"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Login with Google
            </button>
          </SignInButton>
        </div>
      </main>
    );
  }

  const userId = user.id;
  const myUsername = profile?.username || user?.user_metadata?.full_name?.split(" ")[0] || "Aku";

  /* ── Chat View ── */
  return (
    <>
      {/* Profile Modal */}
      {modalUserId && (
        <ProfileModal userId={modalUserId} onClose={() => setModalUserId(null)} />
      )}

      <main className="page-shell flex min-h-[100dvh] flex-col bg-slate-200/90">
        {/* Header */}
        <header className="sticky top-0 z-20 shrink-0 border-b border-black/10 bg-[#075e54] px-4 py-3 shadow-md sm:px-6">
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-emerald-400/20 ring-2 ring-white/25">
              <div className="flex h-full w-full items-center justify-center bg-emerald-600/90">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-semibold text-white sm:text-xl">Grup Chat Real-time · 9B</h1>
              <p className="truncate text-xs text-emerald-100/90">
                {myUsername} <span className="hidden opacity-70 sm:inline">· online</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setMessages([]); signOut(); }}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-black/15 px-3 py-2 text-xs font-semibold text-white transition hover:bg-black/25 sm:text-sm"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </header>

        {/* Chat body */}
        <div
          className="relative flex flex-1 flex-col overflow-hidden"
          style={{
            backgroundColor: "#e5ddd5",
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        >
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-2 pb-2 pt-3 sm:px-4">
            {chatError && (
              <div className="mb-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-center text-xs text-red-800" role="alert">
                {chatError}
              </div>
            )}

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-black/5 bg-black/[0.02] shadow-inner">
              <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 py-3 sm:px-4 sm:py-4">
                {messagesLoading ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-slate-500">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                    <p className="text-sm">Memuat obrolan…</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
                    <MessageCircle className="mb-3 h-12 w-12 text-slate-400" />
                    <p className="text-sm font-medium text-slate-600">Belum ada pesan</p>
                    <p className="mt-1 max-w-xs text-xs text-slate-500">Mulai percakapan — pesan tampil ke semua anggota grup secara real-time.</p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const mine = m.user_id === userId;
                    const joined = Array.isArray(m.profil_user) ? m.profil_user[0] : m.profil_user;
                    const senderUsername = (joined?.username || "").trim() || (mine ? myUsername : "Anonim");
                    const senderUserId = joined?.id || m.user_id;

                    return (
                      <div key={m.id} className={`flex w-full ${mine ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] rounded-2xl px-3 py-2 shadow-sm sm:max-w-[75%] ${mine ? "rounded-br-md bg-[#d9fdd3] text-slate-900" : "rounded-bl-md bg-white text-slate-900"}`}>
                          {/* Sender name — clickable for others */}
                          {!mine ? (
                            <button
                              type="button"
                              onClick={() => setModalUserId(senderUserId)}
                              className="mb-0.5 text-xs font-semibold text-emerald-700 hover:underline hover:text-emerald-600 transition-colors text-left"
                            >
                              @{senderUsername}
                            </button>
                          ) : (
                            <p className="mb-0.5 text-xs font-semibold text-emerald-800/80">Kamu</p>
                          )}
                          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{m.pesan ?? m.isi ?? ""}</p>
                          <p className={`mt-1 text-right text-[10px] tabular-nums ${mine ? "text-emerald-900/50" : "text-slate-400"}`}>
                            {formatChatTime(m.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={scrollAnchorRef} />
              </div>

              {/* Composer */}
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                className="flex shrink-0 items-end gap-2 border-t border-black/10 bg-[#f0f0f0] p-2 sm:p-3"
              >
                <div className="relative min-w-0 flex-1">
                  <textarea
                    rows={1}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (!sendBusy && draft.trim()) void sendMessage();
                      }
                    }}
                    placeholder="Ketik pesan…"
                    className="max-h-32 min-h-[44px] w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sendBusy || !draft.trim()}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#075e54] text-white shadow-md transition hover:bg-[#064e46] disabled:opacity-50 sm:h-12 sm:w-12"
                  aria-label="Kirim pesan"
                >
                  {sendBusy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" strokeWidth={2.2} />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
