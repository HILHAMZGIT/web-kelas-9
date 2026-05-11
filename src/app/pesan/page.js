"use client";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";
import {
  Hash, Loader2, MessageCircle, Send, Users, X, User,
  FileText, Trash2, Smile,
} from "lucide-react";
import InstagramIcon from "@/components/InstagramIcon";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SignInButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

/* â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function formatChatTime(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  } catch { return ""; }
}

/* â”€â”€â”€ Profile Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function ProfileModal({ userId, onClose }) {
  const [profileData, setProfileData] = useState(null);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from("profil_user")
      .select("id, username, bio, email, instagram_username, foto_profil")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        setProfileData(data);
        setBusy(false);
      });
  }, [userId]);

  const igUser = (profileData?.instagram_username || "").trim();

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

        <motion.div
          className="relative w-full max-w-sm bento-card p-6 shadow-[0_12px_48px_rgba(0,0,0,0.12)]"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 via-transparent to-blue-50/20 pointer-events-none rounded-3xl" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative z-10">
            {busy ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-7 w-7 animate-spin text-emerald-500" />
              </div>
            ) : !profileData ? (
              <p className="text-center text-sm text-slate-400 py-8">Profil tidak ditemukan.</p>
            ) : (
              <>
                {/* Avatar */}
                <div className="mb-4 flex flex-col items-center gap-3">
                  <div className="h-18 w-18 overflow-hidden rounded-2xl ring-2 ring-emerald-200/50 shadow-md">
                    {profileData.foto_profil ? (
                      <Image src={profileData.foto_profil} alt={profileData.username || "Avatar"} width={72} height={72} className="h-full w-full object-cover" unoptimized />
                    ) : (
                      <div className="flex h-[72px] w-[72px] items-center justify-center bg-gradient-to-br from-emerald-300 to-teal-400">
                        <span className="text-2xl font-black text-white">
                          {(profileData.username?.[0] || "?").toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-slate-800 text-lg">@{profileData.username || "â€”"}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Anggota Kelas 9B</p>
                  </div>
                </div>

                {/* Bio */}
                {profileData.bio && (
                  <div className="mb-4 rounded-xl border border-black/5 bg-white/60 px-4 py-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <FileText className="h-3 w-3 text-emerald-500" />
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-600">Bio</p>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{profileData.bio}</p>
                  </div>
                )}

                {/* Info rows */}
                <div className="space-y-2">
                  {profileData.email && (
                    <div className="flex items-center gap-3 rounded-xl border border-black/5 bg-white/60 px-3 py-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
                        <User className="h-3.5 w-3.5 text-blue-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Email</p>
                        <p className="truncate text-xs text-slate-600">{profileData.email}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 rounded-xl border border-black/5 bg-white/60 px-3 py-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">
                      <span className="text-[10px] font-black text-emerald-600">9B</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest">Kelas</p>
                      <p className="text-xs text-slate-600">9B Â· SMPN 1 Karanglewas</p>
                    </div>
                  </div>
                </div>

                {/* InstagramIcon Button */}
                {igUser && (
                  <a
                    href={`https://instagram.com/${igUser}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 shadow-md"
                  >
                    <InstagramIcon className="h-4 w-4" />
                    @{igUser}
                  </a>
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export default function PesanPage() {
  const { user, profile, loading: authLoading, needsProfileSetup, signOut } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [sendBusy, setSendBusy] = useState(false);
  const [chatError, setChatError] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Profile modal
  const [modalUserId, setModalUserId] = useState(null);

  const scrollAnchorRef = useRef(null);
  const emojiRef = useRef(null);

  // Close emoji picker on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    }
    if (showEmoji) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmoji]);

  const scrollToBottom = useCallback(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fetchMessages = useCallback(async () => {
    setMessagesLoading(true);
    setChatError(null);
    const { data, error } = await supabase
      .from("obrolan_kelas")
      .select("*, profil_user(id, username, bio, instagram_username, foto_profil)")
      .order("created_at", { ascending: true });
    if (error) { setChatError(error.message); setMessages([]); }
    else { setMessages(data ?? []); queueMicrotask(() => scrollToBottom()); }
    setMessagesLoading(false);
  }, [scrollToBottom]);

  const appendMessageRow = useCallback(async (rowId) => {
    const { data, error } = await supabase
      .from("obrolan_kelas")
      .select("*, profil_user(id, username, bio, instagram_username, foto_profil)")
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
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "obrolan_kelas" },
        (payload) => {
          const deletedId = payload.old?.id;
          if (deletedId) setMessages((prev) => prev.filter((m) => m.id !== deletedId));
        })
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
      .select("*, profil_user(id, username, bio, instagram_username, foto_profil)")
      .single();
    setSendBusy(false);
    if (error) { setChatError(error.message); return; }
    setDraft("");
    setShowEmoji(false);
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

  async function deleteMessage(messageId) {
    if (deletingId) return;
    setDeletingId(messageId);
    const { error } = await supabase
      .from("obrolan_kelas")
      .delete()
      .eq("id", messageId)
      .eq("user_id", user.id); // Safety: only delete own messages
    if (!error) {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    }
    setDeletingId(null);
  }

  function onEmojiClick(emojiData) {
    setDraft((prev) => prev + emojiData.emoji);
  }

  /* â”€â”€ Loading â”€â”€ */
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-emerald-500" />
      </div>
    );
  }

  /* â”€â”€ Auth Gate â”€â”€ */
  if (!user) {
    return (
      <main className="page-shell flex min-h-screen items-center justify-center p-4 sm:p-6">
        <motion.div
          className="w-full max-w-sm text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-200">
            <Hash className="h-8 w-8 text-white" strokeWidth={2.2} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Grup Chat 9B</h1>
          <p className="mt-2 text-sm text-slate-400">Login dengan Google untuk bergabung ke obrolan real-time kelas.</p>
          <SignInButton mode="modal" fallbackRedirectUrl="/pesan">
            <button
              id="chat-login-google"
              className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-slate-900 font-bold text-sm shadow-md ring-1 ring-black/5 transition-all hover:scale-105"
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
        </motion.div>
      </main>
    );
  }

  const userId = user.id;
  const myUsername = profile?.username || user?.user_metadata?.full_name?.split(" ")[0] || "Aku";

  /* â”€â”€ Chat View â”€â”€ */
  return (
    <>
      {/* Profile Modal */}
      {modalUserId && (
        <ProfileModal userId={modalUserId} onClose={() => setModalUserId(null)} />
      )}

      <main className="page-shell flex min-h-[100dvh] flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 shrink-0 glass-strong border-b border-black/5 px-4 py-3 shadow-sm sm:px-6">
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl ring-2 ring-emerald-200/50 shadow-sm">
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-bold text-slate-800 sm:text-xl">Tembok Kenangan Â· 9B</h1>
              <p className="truncate text-xs text-slate-400">
                {myUsername} <span className="hidden sm:inline">Â· online</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setMessages([]); signOut(); }}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 sm:text-sm"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </header>

        {/* Chat body */}
        <div className="relative flex flex-1 flex-col overflow-hidden bg-gradient-to-b from-emerald-50/30 via-white/40 to-amber-50/20">
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-2 pb-2 pt-3 sm:px-4">
            {chatError && (
              <div className="mb-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-center text-xs text-red-700" role="alert">
                {chatError}
              </div>
            )}

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-black/5 bg-white/40 backdrop-blur-sm shadow-inner">
              <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 py-3 sm:px-4 sm:py-4">
                {messagesLoading ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-slate-400">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                    <p className="text-sm">Memuat obrolanâ€¦</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
                    <MessageCircle className="mb-3 h-12 w-12 text-slate-300" />
                    <p className="text-sm font-medium text-slate-500">Belum ada pesan</p>
                    <p className="mt-1 max-w-xs text-xs text-slate-400">Mulai percakapan â€” pesan tampil ke semua anggota grup secara real-time.</p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const mine = m.user_id === userId;
                    const joined = Array.isArray(m.profil_user) ? m.profil_user[0] : m.profil_user;
                    const senderUsername = (joined?.username || "").trim() || (mine ? myUsername : "Anonim");
                    const senderUserId = joined?.id || m.user_id;
                    const senderAvatar = joined?.foto_profil;
                    const senderIg = (joined?.instagram_username || "").trim();

                    return (
                      <motion.div
                        key={m.id}
                        className={`flex w-full gap-2 ${mine ? "justify-end" : "justify-start"}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Avatar for others */}
                        {!mine && (
                          <button
                            type="button"
                            onClick={() => setModalUserId(senderUserId)}
                            className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden ring-1 ring-black/5 mt-1 transition-transform hover:scale-110"
                          >
                            {senderAvatar ? (
                              <Image src={senderAvatar} alt="" width={32} height={32} className="h-full w-full object-cover" unoptimized />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-300 to-teal-400 text-xs font-bold text-white">
                                {senderUsername[0]?.toUpperCase()}
                              </div>
                            )}
                          </button>
                        )}

                        <div className={`group relative max-w-[80%] rounded-2xl px-3.5 py-2.5 shadow-sm sm:max-w-[70%] ${
                          mine
                            ? "rounded-br-md bg-emerald-50 text-slate-800 ring-1 ring-emerald-100"
                            : "rounded-bl-md bg-white text-slate-800 ring-1 ring-black/5"
                        }`}>
                          {/* Sender name â€” clickable for others */}
                          {!mine ? (
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <button
                                type="button"
                                onClick={() => setModalUserId(senderUserId)}
                                className="text-xs font-semibold text-emerald-600 hover:underline transition-colors text-left"
                              >
                                @{senderUsername}
                              </button>
                              {senderIg && (
                                <a href={`https://instagram.com/${senderIg}`} target="_blank" rel="noreferrer" className="text-pink-400 hover:text-pink-500 transition-colors" onClick={(e) => e.stopPropagation()}>
                                  <InstagramIcon className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                          ) : (
                            <p className="mb-0.5 text-xs font-semibold text-emerald-600/70">Kamu</p>
                          )}
                          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{m.pesan ?? m.isi ?? ""}</p>
                          <div className="mt-1 flex items-center justify-end gap-2">
                            <p className={`text-[10px] tabular-nums ${mine ? "text-emerald-500/60" : "text-slate-300"}`}>
                              {formatChatTime(m.created_at)}
                            </p>
                          </div>

                          {/* Delete button â€” only for own messages */}
                          {mine && (
                            <button
                              type="button"
                              onClick={() => deleteMessage(m.id)}
                              disabled={deletingId === m.id}
                              className="absolute -left-8 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-100 hover:text-red-500 disabled:opacity-50"
                              title="Hapus pesan"
                            >
                              {deletingId === m.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3" />
                              )}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
                <div ref={scrollAnchorRef} />
              </div>

              {/* Composer */}
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                className="flex shrink-0 items-end gap-2 border-t border-black/5 bg-white/60 backdrop-blur-sm p-2 sm:p-3"
              >
                {/* Emoji Picker Toggle */}
                <div className="relative" ref={emojiRef}>
                  <button
                    type="button"
                    onClick={() => setShowEmoji(!showEmoji)}
                    className={`flex h-11 w-11 items-center justify-center rounded-full transition-all ${
                      showEmoji ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-500"
                    }`}
                  >
                    <Smile className="h-5 w-5" />
                  </button>
                  {showEmoji && (
                    <div className="absolute bottom-14 left-0 z-50">
                      <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        width={300}
                        height={380}
                        searchDisabled={false}
                        skinTonesDisabled
                        previewConfig={{ showPreview: false }}
                      />
                    </div>
                  )}
                </div>

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
                    placeholder="Ketik pesanâ€¦"
                    className="max-h-32 min-h-[44px] w-full resize-none rounded-2xl border border-black/8 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none transition focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sendBusy || !draft.trim()}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-200 transition hover:shadow-lg hover:shadow-emerald-300 disabled:opacity-50 sm:h-12 sm:w-12"
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

