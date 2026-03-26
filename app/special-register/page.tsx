"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/navbar";
import { CheckCircle2, X, AlertCircle, Plus, Trash2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import Image from "next/image";

/* ─────────────────────────────────────────────
   Event definitions
───────────────────────────────────────────── */
const EVENTS = [
  {
    id: "hackathon",
    name: "Hackathon",
    fee: 200,
    type: "team",
    tagline: "Build. Innovate. Win.",
    color: "text-orange-400",
    borderHex: "#f97316",
    cardBg: "from-orange-400 via-amber-300 to-orange-500",
    textColor: "text-orange-900",
    badgeBg: "bg-orange-800",
    badgeText: "text-orange-50",
    shineBg: "from-white/60 via-white/10 to-transparent",
    shadowColor: "shadow-orange-400/40",
    btnBg: "bg-orange-900",
    btnText: "text-orange-50",
    description: "Team-based. Build a solution, pitch it, win.",
    note: "Team of 2–4 members. One registration per team.",
  },
  {
    id: "ideathon",
    name: "Ideathon",
    fee: 100,
    type: "individual",
    tagline: "Ideate. Present. Inspire.",
    color: "text-sky-400",
    borderHex: "#38bdf8",
    cardBg: "from-sky-300 via-blue-200 to-sky-400",
    textColor: "text-sky-900",
    badgeBg: "bg-sky-800",
    badgeText: "text-sky-50",
    shineBg: "from-white/60 via-white/10 to-transparent",
    shadowColor: "shadow-sky-400/40",
    btnBg: "bg-sky-900",
    btnText: "text-sky-50",
    description: "Present your idea to industry experts.",
    note: "Individual registration.",
  },
  {
    id: "paper",
    name: "Paper Presentation",
    fee: 100,
    type: "individual",
    tagline: "Research. Write. Showcase.",
    color: "text-emerald-400",
    borderHex: "#34d399",
    cardBg: "from-emerald-300 via-green-200 to-emerald-400",
    textColor: "text-emerald-900",
    badgeBg: "bg-emerald-800",
    badgeText: "text-emerald-50",
    shineBg: "from-white/60 via-white/10 to-transparent",
    shadowColor: "shadow-emerald-400/40",
    btnBg: "bg-emerald-900",
    btnText: "text-emerald-50",
    description: "Present your research paper to an academic panel.",
    note: "Individual registration.",
  },
];

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface HackathonForm {
  teamName: string;
  leaderName: string;
  collegeName: string;
  leaderEmail: string;
  leaderPhone: string;
  participants: string[];
  paymentId: string;
}

interface IndividualForm {
  name: string;
  email: string;
  phone: string;
  collegeName: string;
  paymentId: string;
}

interface Notification {
  type: "success" | "error";
  message: string;
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
const SpecialRegisterPage = () => {
  const [selectedEvent, setSelectedEvent] = useState<(typeof EVENTS)[0] | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(false);

  /* Hackathon state */
  const [hackForm, setHackForm] = useState<HackathonForm>({
    teamName: "",
    leaderName: "",
    collegeName: "",
    leaderEmail: "",
    leaderPhone: "",
    participants: [""],
    paymentId: "",
  });

  /* Individual state */
  const [indForm, setIndForm] = useState<IndividualForm>({
    name: "",
    email: "",
    phone: "",
    collegeName: "",
    paymentId: "",
  });

  /* ── Helpers ── */
  const resetForms = () => {
    setHackForm({
      teamName: "",
      leaderName: "",
      collegeName: "",
      leaderEmail: "",
      leaderPhone: "",
      participants: [""],
      paymentId: "",
    });
    setIndForm({ name: "", email: "", phone: "", collegeName: "", paymentId: "" });
  };

  const checkPaymentId = async (paymentId: string) => {
    for (const col of ["separateRegistrations", "registrations"]) {
      const q = query(collection(db, col), where("paymentId", "==", paymentId));
      if (!(await getDocs(q)).empty) return true;
    }
    return false;
  };

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    setLoading(true);
    setNotification(null);

    try {
      const paymentExists = await checkPaymentId(
        selectedEvent.type === "team" ? hackForm.paymentId : indForm.paymentId
      );
      if (paymentExists) {
        setNotification({ type: "error", message: "This Payment ID has already been used." });
        setLoading(false);
        return;
      }

      const base = {
        event: selectedEvent.name,
        eventId: selectedEvent.id,
        fee: selectedEvent.fee,
        registrationType: selectedEvent.type,
        date: new Date().toISOString(),
      };

      if (selectedEvent.type === "team") {
        const cleanParticipants = hackForm.participants.filter((p) => p.trim() !== "");
        if (cleanParticipants.length > 3) {
          setNotification({
            type: "error",
            message: "Hackathon teams can have max 4 members total (leader + 3 participants).",
          });
          setLoading(false);
          return;
        }
        await addDoc(collection(db, "separateRegistrations"), {
          ...base,
          teamName: hackForm.teamName,
          leaderName: hackForm.leaderName,
          collegeName: hackForm.collegeName,
          leaderEmail: hackForm.leaderEmail,
          leaderPhone: hackForm.leaderPhone,
          participants: cleanParticipants,
          paymentId: hackForm.paymentId,
        });
      } else {
        await addDoc(collection(db, "separateRegistrations"), {
          ...base,
          name: indForm.name,
          email: indForm.email,
          phone: indForm.phone,
          collegeName: indForm.collegeName,
          paymentId: indForm.paymentId,
        });
      }

      setNotification({
        type: "success",
        message:
          "Registration received! We will verify your payment and confirm via email. Thank you!",
      });
      resetForms();
      setSelectedEvent(null);
    } catch (err) {
      setNotification({
        type: "error",
        message: err instanceof Error ? err.message : "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ── Participant helpers (Hackathon) ── */
  const addParticipant = () => {
    if (hackForm.participants.length < 3)
      setHackForm((p) => ({ ...p, participants: [...p.participants, ""] }));
  };
  const removeParticipant = (i: number) =>
    setHackForm((p) => ({
      ...p,
      participants: p.participants.filter((_, idx) => idx !== i),
    }));
  const updateParticipant = (i: number, val: string) =>
    setHackForm((p) => {
      const arr = [...p.participants];
      arr[i] = val;
      return { ...p, participants: arr };
    });

  /* ─────────────────────────────────────────
     Render
  ───────────────────────────────────────── */
  return (
    <main className="min-h-screen bg-slate-950 pb-20 text-slate-100">
      <Navbar />

      {/* ── Notification ── */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setNotification(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`rounded-2xl p-6 shadow-2xl ${
                  notification.type === "success"
                    ? "border border-green-200 bg-white"
                    : "border border-red-200 bg-white"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`shrink-0 rounded-xl p-2.5 ${
                      notification.type === "success"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {notification.type === "success" ? (
                      <CheckCircle2 className="size-5" />
                    ) : (
                      <AlertCircle className="size-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3
                      className={`mb-1 text-base font-bold ${
                        notification.type === "success" ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {notification.type === "success" ? "Registration Received!" : "Error"}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600">{notification.message}</p>
                    {notification.type === "success" && (
                      <a
                        href="https://chat.whatsapp.com/E2RU5DxY04O4WFZynZITIQ?mode=gi_t"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#25D366]/20 transition-all hover:scale-[1.02] active:scale-95"
                      >
                        <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.783-1.472-1.751-1.645-2.049-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                        </svg>
                        Join WhatsApp Group
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => setNotification(null)}
                    className="shrink-0 text-gray-400 hover:text-gray-600"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Loading ── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <div className="rounded-2xl bg-[#131318] p-8 text-center shadow-2xl">
              <div className="relative mx-auto mb-5 size-14">
                <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-white" />
              </div>
              <h3 className="mb-1 text-base font-semibold text-white">Processing Registration</h3>
              <p className="text-sm text-white/50">Please wait…</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Content ── */}
      <div className="mx-auto max-w-2xl px-4 pt-24 sm:px-6 sm:pt-28">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2.5">
            <div className="h-5 w-1 rounded-full bg-white" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 sm:text-xs">
              Cynosure 2026
            </span>
          </div>
          <h1 className="mb-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
            {selectedEvent ? `Register — ${selectedEvent.name}` : "Special Events"}
          </h1>
          <p className="text-sm text-white/50">
            {selectedEvent
              ? "Complete the form below after making your payment."
              : "Choose an event to register separately. A Cynosure base pass is required."}
          </p>
        </div>

        {/* Base Pass Note — always visible */}
        <div className="mb-8 rounded-2xl border border-amber-400/10 bg-amber-400/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-400" />
            <div>
              <p className="text-xs font-bold text-amber-300">Base Pass Required</p>
              <p className="mt-0.5 text-xs text-white/50">
                Every participant in these events must hold at least a{" "}
                <span className="font-semibold text-white/80">Cynosure Silver (Base) Pass</span>.
                Get your pass at{" "}
                <a href="/passes" className="text-amber-300 underline">
                  /passes
                </a>{" "}
                before registering here.
              </p>
            </div>
          </div>
        </div>

        {!selectedEvent ? (
          /* ── Event Selection Cards ── */
          <div className="grid grid-cols-1 gap-6">
            {EVENTS.map((ev, index) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group"
              >
                <div
                  className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${ev.cardBg} shadow-2xl ${ev.shadowColor}`}
                  style={{
                    border: `2.5px solid ${ev.borderHex}`,
                    boxShadow: `0 8px 32px 0 ${ev.borderHex}33`,
                  }}
                >
                  {/* Shine */}
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${ev.shineBg} opacity-60`}
                  />
                  <div className="absolute -bottom-8 -right-8 size-40 rounded-full bg-white/10" />
                  <div className="absolute -bottom-2 -right-2 size-20 rounded-full bg-white/15" />

                  <div className="relative z-10 flex flex-col p-6 sm:flex-row sm:items-center sm:gap-6">
                    {/* Left: info */}
                    <div className="flex-1">
                      <div className="mb-3 flex items-center gap-3">
                        {/* Chip */}
                        <div
                          className="h-7 w-9 shrink-0 rounded-md"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 100%)",
                            border: "1px solid rgba(255,255,255,0.3)",
                          }}
                        />
                        <span
                          className={`rounded-full ${ev.badgeBg} px-3 py-1 text-[10px] font-black uppercase tracking-widest ${ev.badgeText}`}
                        >
                          {ev.type === "team" ? "Team Event" : "Individual"}
                        </span>
                      </div>
                      <h2 className={`text-2xl font-black ${ev.textColor}`}>{ev.name}</h2>
                      <p className={`mt-1 text-xs font-semibold ${ev.textColor} opacity-60`}>
                        {ev.tagline}
                      </p>
                      <p className={`mt-2 text-sm ${ev.textColor} opacity-75`}>{ev.description}</p>
                      <p className={`mt-1 text-[11px] ${ev.textColor} opacity-50`}>{ev.note}</p>
                    </div>

                    {/* Right: price + button */}
                    <div className="mt-5 flex flex-col items-start gap-3 sm:mt-0 sm:items-end">
                      <div>
                        <p
                          className={`text-[10px] font-bold uppercase tracking-widest ${ev.textColor} opacity-50`}
                        >
                          Registration Fee
                        </p>
                        <p className={`text-4xl font-black leading-none ${ev.textColor}`}>
                          ₹{ev.fee}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedEvent(ev)}
                        className={`w-full rounded-2xl ${ev.btnBg} px-6 py-3.5 text-xs font-black uppercase tracking-[0.15em] ${ev.btnText} transition-all duration-300 active:scale-95 sm:w-auto`}
                        style={{ boxShadow: `0 4px 16px 0 ${ev.borderHex}55` }}
                      >
                        Register Now →
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* ── Registration Form ── */
          <>
            {/* Selected event banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="mb-8"
            >
              <div
                className={`relative flex items-center justify-between overflow-hidden rounded-3xl bg-gradient-to-br ${selectedEvent.cardBg} p-6 shadow-2xl`}
                style={{ border: `2.5px solid ${selectedEvent.borderHex}` }}
              >
                <div className="absolute -bottom-8 -right-8 size-36 rounded-full bg-white/10" />
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${selectedEvent.shineBg} opacity-50`}
                />
                <div className="relative z-10">
                  <p
                    className={`text-[10px] font-bold uppercase tracking-widest ${selectedEvent.textColor} opacity-50`}
                  >
                    Selected Event
                  </p>
                  <h3 className={`mt-0.5 text-2xl font-black ${selectedEvent.textColor}`}>
                    {selectedEvent.name}
                  </h3>
                  <p className={`mt-0.5 text-[11px] ${selectedEvent.textColor} opacity-60`}>
                    {selectedEvent.note}
                  </p>
                </div>
                <div className="relative z-10 text-right">
                  <p className={`text-3xl font-black ${selectedEvent.textColor}`}>
                    ₹{selectedEvent.fee}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedEvent(null);
                      resetForms();
                    }}
                    className="mt-2 rounded-full bg-black/10 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-black/50 hover:bg-black/20"
                  >
                    Change
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-[2.5rem] border border-white/5 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl sm:p-10"
            >
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white sm:text-2xl">
                    {selectedEvent.type === "team" ? "Team Details" : "Your Details"}
                  </h2>
                  <p className="text-xs text-white/30">Fill all required fields</p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-white/5 text-white/20">
                  <CheckCircle2 className="size-6" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {selectedEvent.type === "team" ? (
                  /* ── Hackathon Team Form ── */
                  <>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <FormField label="Team Name">
                        <input
                          type="text"
                          value={hackForm.teamName}
                          onChange={(e) => setHackForm((p) => ({ ...p, teamName: e.target.value }))}
                          required
                          placeholder="e.g. Team Nexus"
                          className="form-input"
                        />
                      </FormField>
                      <FormField label="College Name">
                        <input
                          type="text"
                          value={hackForm.collegeName}
                          onChange={(e) =>
                            setHackForm((p) => ({ ...p, collegeName: e.target.value }))
                          }
                          required
                          placeholder="Institution name"
                          className="form-input"
                        />
                      </FormField>
                    </div>

                    <FormField label="Team Leader Name">
                      <input
                        type="text"
                        value={hackForm.leaderName}
                        onChange={(e) => setHackForm((p) => ({ ...p, leaderName: e.target.value }))}
                        required
                        placeholder="Full name of team leader"
                        className="form-input"
                      />
                    </FormField>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <FormField label="Team Leader Email">
                        <input
                          type="email"
                          value={hackForm.leaderEmail}
                          onChange={(e) =>
                            setHackForm((p) => ({ ...p, leaderEmail: e.target.value }))
                          }
                          required
                          placeholder="leader@email.com"
                          className="form-input"
                        />
                      </FormField>
                      <FormField label="Team Leader Phone">
                        <input
                          type="tel"
                          value={hackForm.leaderPhone}
                          onChange={(e) =>
                            setHackForm((p) => ({ ...p, leaderPhone: e.target.value }))
                          }
                          required
                          pattern="[0-9]{10}"
                          placeholder="10-digit number"
                          className="form-input"
                        />
                      </FormField>
                    </div>

                    {/* Participant Names */}
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-widest text-white/40">
                          Participant Names ({hackForm.participants.length}/3)
                        </label>
                        {hackForm.participants.length < 3 && (
                          <button
                            type="button"
                            onClick={addParticipant}
                            className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/50 transition-all hover:bg-white/10 hover:text-white"
                          >
                            <Plus className="size-3" /> Add Member
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        {hackForm.participants.map((p, i) => (
                          <div key={i} className="flex gap-2">
                            <input
                              type="text"
                              value={p}
                              onChange={(e) => updateParticipant(i, e.target.value)}
                              placeholder={`Member ${i + 1} full name`}
                              className="form-input flex-1"
                            />
                            {hackForm.participants.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeParticipant(i)}
                                className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-white/30 transition-all hover:bg-red-500/10 hover:text-red-400"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="mt-2 text-[10px] text-white/25">
                        Add up to 3 additional members (max 4 total including leader).
                      </p>
                    </div>
                  </>
                ) : (
                  /* ── Individual Form (Ideathon / Paper Presentation) ── */
                  <>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <FormField label="Full Name">
                        <input
                          type="text"
                          value={indForm.name}
                          onChange={(e) => setIndForm((p) => ({ ...p, name: e.target.value }))}
                          required
                          placeholder="Your full name"
                          className="form-input"
                        />
                      </FormField>
                      <FormField label="College Name">
                        <input
                          type="text"
                          value={indForm.collegeName}
                          onChange={(e) =>
                            setIndForm((p) => ({ ...p, collegeName: e.target.value }))
                          }
                          required
                          placeholder="Your institution"
                          className="form-input"
                        />
                      </FormField>
                    </div>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <FormField label="Email">
                        <input
                          type="email"
                          value={indForm.email}
                          onChange={(e) => setIndForm((p) => ({ ...p, email: e.target.value }))}
                          required
                          placeholder="your@email.com"
                          className="form-input"
                        />
                      </FormField>
                      <FormField label="Phone Number">
                        <input
                          type="tel"
                          value={indForm.phone}
                          onChange={(e) => setIndForm((p) => ({ ...p, phone: e.target.value }))}
                          required
                          pattern="[0-9]{10}"
                          placeholder="10-digit number"
                          className="form-input"
                        />
                      </FormField>
                    </div>
                  </>
                )}

                {/* Payment Section */}
                <div className="relative overflow-hidden rounded-3xl bg-white/[0.03] p-6 sm:p-8">
                  <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                    Secure Payment — ₹{selectedEvent.fee}
                  </p>
                  <div className="flex flex-col items-center gap-7 sm:flex-row sm:items-start">
                    {/* QR */}
                    <div className="group relative">
                      <div className="absolute inset-0 rounded-2xl bg-white/20 blur-xl transition-all duration-500 group-hover:bg-white/40" />
                      <div className="relative size-44 overflow-hidden rounded-2xl bg-white p-3 shadow-2xl sm:size-48">
                        <Image
                          src="/cyno2026.jpeg"
                          alt="Payment QR"
                          width={200}
                          height={200}
                          className="size-full object-contain"
                        />
                      </div>
                    </div>
                    {/* Steps */}
                    <div className="flex-1 space-y-4">
                      <div className="inline-flex rounded-full bg-white/5 px-4 py-1.5">
                        <span className="text-sm font-black text-white">₹{selectedEvent.fee}</span>
                      </div>
                      <div className="space-y-3">
                        {[
                          "Scan the QR code using any UPI app",
                          <>
                            Or pay via PhonePe:{" "}
                            <span className="font-bold text-white">8978227231</span>
                          </>,
                          "Save the UTR/Payment ID after paying",
                        ].map((step, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white/40">
                              {i + 1}
                            </span>
                            <p className="text-xs leading-relaxed text-white/50 sm:text-sm">
                              {step}
                            </p>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-white/20">
                        * Enter UTR below. Verified within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>

                {/* UTR Input */}
                <FormField label="Payment ID (UTR Number)">
                  <div className="group relative">
                    <input
                      type="text"
                      value={selectedEvent.type === "team" ? hackForm.paymentId : indForm.paymentId}
                      onChange={(e) => {
                        if (selectedEvent.type === "team")
                          setHackForm((p) => ({ ...p, paymentId: e.target.value }));
                        else setIndForm((p) => ({ ...p, paymentId: e.target.value }));
                      }}
                      required
                      placeholder="Enter the 12-digit UTR number"
                      className="form-input !py-4"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-cyan-400">
                      <AlertCircle className="size-5" />
                    </div>
                  </div>
                </FormField>

                {/* Submit */}
                <div className="flex flex-col gap-4 pt-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedEvent(null);
                      resetForms();
                    }}
                    className="order-2 flex-1 rounded-2xl border border-white/5 bg-white/5 py-4 text-sm font-bold text-white transition-all hover:bg-white/10 sm:order-1"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="order-1 flex-[2] rounded-2xl bg-white py-4 text-sm font-black text-black shadow-xl transition-all hover:scale-[1.02] hover:bg-cyan-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:order-2"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="size-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      `Complete Registration →`
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">
            Need Help?
          </p>
          <a
            href="mailto:svucyno@gmail.com"
            className="mt-2 inline-block text-sm text-white/40 transition-colors hover:text-white"
          >
            svucyno@gmail.com
          </a>
        </div>
      </div>

      <style jsx global>{`
        .form-input {
          width: 100%;
          padding: 0.875rem 1.25rem;
          border-radius: 1.25rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: white;
          font-size: 0.875rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
        }
        .form-input:focus {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.03);
        }
        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </main>
  );
};

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-white/40">
        {label}
      </label>
      {children}
    </div>
  );
}

export default SpecialRegisterPage;
