"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/navbar";
import { CheckCircle2, X, AlertCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import Image from "next/image";

interface FormData {
  name: string;
  email: string;
  mobile: string;
  paymentId: string;
  gender: "male" | "female" | "";
  accommodation: "yes" | "no" | "";
  collegeName: string;
  passType: string;
  amount: number;
  uid?: string;
  participationCount?: number;
}

interface Notification {
  type: "success" | "error";
  message: string;
}

const PASSES = [
  {
    id: "silver",
    name: "Silver",
    price: 350,
    tagline: "Base Pass",
    color: "#C0C0C0",
    textColor: "text-slate-800",
    cardBg: "from-slate-300 via-slate-200 to-slate-400",
    chipBg: "bg-slate-500/30",
    shineBg: "from-white/60 via-white/10 to-transparent",
    shadowColor: "shadow-slate-400/40",
    hoverShadow: "hover:shadow-slate-400/60",
    borderColor: "border-slate-300/30",
    badgeBg: "bg-slate-700",
    badgeText: "text-slate-100",
    btnBg: "bg-slate-800",
    btnText: "text-slate-100",
    borderHex: "#94a3b8",
    benefits: [
      "1 Non-Technical Event (Your Choice)",
      "Fest Entry",
      "Base Pass Access ✓",
      "Complimentary Lunch and Refreshments",
      "Free ROBOTRAC 3.0 Registration",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    price: 550,
    tagline: "Standard Pass",
    color: "#F59E0B",
    textColor: "text-amber-900",
    cardBg: "from-amber-300 via-yellow-200 to-amber-500",
    chipBg: "bg-amber-600/30",
    shineBg: "from-white/70 via-white/20 to-transparent",
    shadowColor: "shadow-amber-400/50",
    hoverShadow: "hover:shadow-amber-400/70",
    borderColor: "border-amber-300/30",
    badgeBg: "bg-amber-700",
    badgeText: "text-amber-50",
    btnBg: "bg-amber-800",
    btnText: "text-amber-50",
    borderHex: "#F59E0B",
    benefits: [
      "2 Technical Event (Your Choice)",
      "1 Non-Technical Event (Your Choice)",
      "Skill + Fun Experience",
      "Base Pass Access ✓",
      "Complimentary Lunch and Refreshments",
      "Free ROBOTRAC 3.0 Registration",
    ],
  },
  {
    id: "diamond",
    name: "Diamond",
    price: 850,
    tagline: "Premium Pass",
    color: "#67E8F9",
    textColor: "text-cyan-900",
    cardBg: "from-cyan-300 via-sky-200 to-cyan-500",
    chipBg: "bg-cyan-600/30",
    shineBg: "from-white/70 via-white/20 to-transparent",
    shadowColor: "shadow-cyan-400/50",
    hoverShadow: "hover:shadow-cyan-400/70",
    borderColor: "border-cyan-300/30",
    badgeBg: "bg-cyan-700",
    badgeText: "text-cyan-50",
    btnBg: "bg-cyan-800",
    btnText: "text-cyan-50",
    borderHex: "#22d3ee",
    benefits: [
      "4 Technical Events (Your Choice)",
      "2 Non-Technical Events (Your Choice)",
      "More Participation",
      "Base Pass Access ✓",
      "Complimentary Lunch and Refreshments",
      "Free ROBOTRAC 3.0 Registration",
    ],
  },
  {
    id: "platinum",
    name: "Platinum",
    price: 1150,
    tagline: "All Access Pass",
    color: "#C084FC",
    textColor: "text-purple-900",
    cardBg: "from-purple-300 via-violet-200 to-purple-500",
    chipBg: "bg-purple-600/30",
    shineBg: "from-white/70 via-white/20 to-transparent",
    shadowColor: "shadow-purple-400/50",
    hoverShadow: "hover:shadow-purple-400/70",
    borderColor: "border-purple-300/30",
    badgeBg: "bg-purple-700",
    badgeText: "text-purple-50",
    btnBg: "bg-purple-800",
    btnText: "text-purple-50",
    borderHex: "#a855f7",
    benefits: [
      "All Technical Events",
      "All Non-Technical Events",
      "Complete Cynosure Experience",
      "Base Pass Access ✓",
      "Complimentary Lunch and Refreshments",
      "Free ROBOTRAC 3.0 Registration",
    ],
  },
];

const PASS_NOTE = "Ideathon | Hackathon | Paper Presentation → Separate Registration";

const PassesPage = () => {
  const [selectedPass, setSelectedPass] = useState<(typeof PASSES)[0] | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    mobile: "",
    paymentId: "",
    gender: "",
    accommodation: "",
    collegeName: "",
    passType: "",
    amount: 0,
  });
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const checkPaymentId = async (paymentId: string) => {
    try {
      for (const col of ["registrations", "successRegistrations"]) {
        const q = query(collection(db, col), where("paymentId", "==", paymentId));
        if (!(await getDocs(q)).empty) return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking payment ID:", error);
      throw error;
    }
  };

  const checkMobileNumber = async (mobile: string) => {
    try {
      for (const col of ["registrations", "successRegistrations"]) {
        const q = query(collection(db, col), where("mobile", "==", mobile));
        if (!(await getDocs(q)).empty) return col;
      }
      return null;
    } catch (error) {
      console.error("Error checking mobile:", error);
      throw error;
    }
  };

  const generateUID = (mobile: string) => `CS${mobile}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    if (!formData.gender) {
      setNotification({ type: "error", message: "Please select your gender" });
      setLoading(false);
      return;
    }
    if (!formData.accommodation) {
      setNotification({ type: "error", message: "Please select whether you need accommodation" });
      setLoading(false);
      return;
    }

    try {
      const existingMobile = await checkMobileNumber(formData.mobile);
      if (existingMobile) {
        setNotification({
          type: "error",
          message: "This mobile number has already been registered",
        });
        setLoading(false);
        return;
      }

      const paymentExists = await checkPaymentId(formData.paymentId);
      if (paymentExists) {
        setNotification({ type: "error", message: "This payment ID has already been used" });
        setLoading(false);
        return;
      }

      const uid = generateUID(formData.mobile);
      await addDoc(collection(db, "registrations"), {
        ...formData,
        passType: selectedPass?.name,
        amount: selectedPass?.price,
        uid,
        participationCount: 1,
        totalAmount: selectedPass?.price,
        date: new Date().toISOString(),
      });

      setNotification({
        type: "success",
        message:
          "Your application has been received. We will verify and inform you via email after successful verification. Thank you!",
      });
      setFormData({
        name: "",
        email: "",
        mobile: "",
        paymentId: "",
        gender: "",
        accommodation: "",
        collegeName: "",
        passType: "",
        amount: 0,
      });
      setSelectedPass(null);
    } catch (error) {
      setNotification({
        type: "error",
        message: error instanceof Error ? error.message : "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 pb-16 text-slate-100 sm:pb-24">
      <Navbar />

      {/* ── Notification Modal ──────────────────────── */}
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
                  </div>
                  <button
                    onClick={() => setNotification(null)}
                    className="shrink-0 text-gray-400 transition-colors hover:text-gray-600"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Loading Modal ───────────────────────────── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm"
            >
              <div className="rounded-2xl bg-[#131318] p-8 text-center shadow-2xl">
                <div className="relative mx-auto mb-5 size-14">
                  <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                  <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-white" />
                </div>
                <h3 className="mb-1 text-base font-semibold text-white">Processing Registration</h3>
                <p className="text-sm text-white/50">Please wait while we submit your details…</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page Content ────────────────────────────── */}
      <div className="mx-auto max-w-2xl px-4 pt-24 sm:px-6 sm:pt-28">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <div className="mb-3 flex items-center gap-2.5">
            <div className="h-5 w-1 rounded-full bg-white" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 sm:text-xs">
              Cynosure 2026
            </span>
          </div>
          <h1 className="mb-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
            {selectedPass ? `Register for ${selectedPass.name} Pass` : "Choose Your Pass"}
          </h1>
          <p className="text-sm text-white/50 sm:text-base">
            {selectedPass
              ? "Fill in the details below after completing payment for your selected pass."
              : "Select the pass that best fits your experience for Cynosure 2026."}
          </p>
        </div>
        {/* Important Note Banner */}
        <div className="mb-10 rounded-2xl border border-white/5 bg-white/[0.03] p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
              <div className="shrink-0">
                <span className="rounded-0 bg-amber-400/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-400">
                  Important
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-white/70">
                  Ideathon | Hackathon | Paper Presentation →{" "}
                  <span className="text-amber-300">Separate Registration</span>
                </p>
                <p className="text-xs text-white/40">
                  Atleast Base Pass Needed for this registration
                </p>
              </div>
            </div>
            <a
              href="/special-register"
              className="group flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-amber-400/15 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-amber-400 transition-all hover:bg-amber-400/25"
            >
              Register Now
              <svg
                className="size-3 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
        {!selectedPass ? (
          /* ── Physical Card-Style Pass Selection ── */
          <div className="space-y-6">
            {/* 1 column full-width on mobile, 2-col on sm, 4-col on lg */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PASSES.map((pass, index) => (
                <motion.div
                  key={pass.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.09, ease: "easeOut" }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group w-full"
                  style={{ perspective: "800px" }}
                >
                  {/* Physical card with colored border */}
                  <div
                    className={`relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br ${pass.cardBg} shadow-xl transition-all duration-500 ${pass.shadowColor} ${pass.hoverShadow}`}
                    style={{
                      border: `2.5px solid ${pass.borderHex}`,
                      boxShadow: `0 8px 32px 0 ${pass.borderHex}33, 0 2px 8px 0 rgba(0,0,0,0.18)`,
                    }}
                  >
                    {/* Shine layer */}
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${pass.shineBg} opacity-60`}
                    />
                    {/* Decorative circles */}
                    <div className="absolute -bottom-8 -right-8 size-40 rounded-full bg-white/10" />
                    <div className="absolute -bottom-2 -right-2 size-20 rounded-full bg-white/15" />

                    {/* Card body */}
                    <div className="relative z-10 flex flex-col p-6">
                      {/* Top row: chip + badge */}
                      <div className="flex items-center justify-between">
                        {/* Credit card chip */}
                        <div
                          className="h-7 w-9 rounded-md"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 100%)",
                            border: "1px solid rgba(255,255,255,0.3)",
                          }}
                        />
                        <span
                          className={`rounded-full ${pass.badgeBg} px-3 py-1 text-[10px] font-black uppercase tracking-widest ${pass.badgeText}`}
                        >
                          {pass.name}
                        </span>
                      </div>

                      {/* Price section */}
                      <div className="mt-6">
                        <p
                          className={`text-[10px] font-bold uppercase tracking-widest ${pass.textColor} opacity-50`}
                        >
                          {pass.tagline}
                        </p>
                        <p
                          className={`mt-1 text-4xl font-black leading-none tracking-tight ${pass.textColor}`}
                        >
                          ₹{pass.price}
                        </p>
                      </div>

                      {/* Benefits list */}
                      <ul className="mt-5 space-y-2">
                        {pass.benefits.map((b, i) => (
                          <li
                            key={i}
                            className={`flex items-start gap-2 text-[11px] font-semibold leading-snug ${pass.textColor}`}
                            style={{ opacity: 0.75 }}
                          >
                            <span className="mt-px shrink-0 text-[10px]">✦</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Register button inside card */}
                      <button
                        onClick={() => setSelectedPass(pass)}
                        className={`mt-6 w-full rounded-2xl ${pass.btnBg} py-3.5 text-xs font-black uppercase tracking-[0.15em] ${pass.btnText} transition-all duration-300 active:scale-95`}
                        style={{
                          boxShadow: `0 4px 16px 0 ${pass.borderHex}55`,
                        }}
                      >
                        Register Now →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom tagline */}
            <p className="mt-8 text-center text-sm font-semibold text-white/30">
              ✨ Compete &bull; Learn &bull; Showcase Skills &bull; Enjoy the Fest
            </p>
          </div>
        ) : (
          /* Registration Form */
          <>
            {/* Selected Pass Card - physical style */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="mb-8"
            >
              <div
                className={`relative flex h-40 w-full overflow-hidden rounded-3xl bg-gradient-to-br ${selectedPass.cardBg} p-6 shadow-2xl ${selectedPass.shadowColor}`}
              >
                {/* Decorative circles */}
                <div className="absolute -bottom-10 -right-10 size-44 rounded-full bg-white/10" />
                <div className="absolute -bottom-4 -right-4 size-24 rounded-full bg-white/10" />
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${selectedPass.shineBg} opacity-50`}
                />

                <div className="relative z-10 flex w-full items-center justify-between">
                  <div>
                    <p
                      className={`text-[10px] font-bold uppercase tracking-[0.2em] ${selectedPass.textColor} opacity-50`}
                    >
                      Selected Pass
                    </p>
                    <h3 className={`text-2xl font-black ${selectedPass.textColor} mt-0.5`}>
                      {selectedPass.name}
                    </h3>
                    <p
                      className={`mt-1 text-[10px] font-medium ${selectedPass.textColor} opacity-60`}
                    >
                      {selectedPass.tagline}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-black ${selectedPass.textColor}`}>
                      ₹{selectedPass.price}
                    </p>
                    <button
                      onClick={() => setSelectedPass(null)}
                      className="mt-2 rounded-full bg-black/10 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-black/50 transition-all hover:bg-black/20"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Benefits strip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8 overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] p-5"
            >
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                What&apos;s Included
              </p>
              <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {selectedPass.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-white/40" />
                    <span className="text-xs leading-snug text-white/60 sm:text-sm">{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-[2.5rem] border border-white/5 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl sm:p-10"
            >
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white sm:text-2xl">
                    Registration Details
                  </h2>
                  <p className="text-xs text-white/30">Complete the information below</p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-white/5 text-white/20">
                  <CheckCircle2 className="size-6" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name + College */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Full Name">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your name"
                      className="form-input"
                    />
                  </FormField>
                  <FormField label="College Name">
                    <input
                      type="text"
                      name="collegeName"
                      value={formData.collegeName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter college name"
                      className="form-input"
                    />
                  </FormField>
                </div>

                {/* Email + Mobile */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Email">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your@email.com"
                      className="form-input"
                    />
                  </FormField>
                  <FormField label="Mobile">
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      required
                      pattern="[0-9]{10}"
                      placeholder="10-digit number"
                      className="form-input"
                    />
                  </FormField>
                </div>

                {/* Gender + Accommodation */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Gender">
                    <div className="flex gap-2">
                      {(["male", "female"] as const).map((g) => (
                        <label key={g} className="flex-1 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value={g}
                            checked={formData.gender === g}
                            onChange={() => setFormData((p) => ({ ...p, gender: g }))}
                            className="hidden"
                          />
                          <div
                            className={`rounded-xl py-2.5 text-center text-sm font-medium capitalize transition-all ${
                              formData.gender === g
                                ? "bg-white text-black"
                                : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                            }`}
                          >
                            {g}
                          </div>
                        </label>
                      ))}
                    </div>
                  </FormField>

                  <FormField label="Need Accommodation?">
                    <div className="flex gap-2">
                      {(["yes", "no"] as const).map((opt) => (
                        <label key={opt} className="flex-1 cursor-pointer">
                          <input
                            type="radio"
                            name="accommodation"
                            value={opt}
                            checked={formData.accommodation === opt}
                            onChange={() => setFormData((p) => ({ ...p, accommodation: opt }))}
                            className="hidden"
                          />
                          <div
                            className={`rounded-xl py-2.5 text-center text-sm font-medium capitalize transition-all ${
                              formData.accommodation === opt
                                ? "bg-white text-black"
                                : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                            }`}
                          >
                            {opt}
                          </div>
                        </label>
                      ))}
                    </div>
                    {formData.accommodation === "yes" && (
                      <p className="mt-1.5 text-[11px] text-white/35">
                        * Accommodation fee collected during check-in
                      </p>
                    )}
                  </FormField>
                </div>

                {/* Payment Section */}
                <div className="relative overflow-hidden rounded-3xl bg-white/[0.03] p-6 sm:p-8">
                  <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                    Secure Payment
                  </p>
                  <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
                    {/* QR with glow */}
                    <div className="group relative">
                      <div className="absolute inset-0 rounded-2xl bg-white/20 blur-xl transition-all duration-500 group-hover:bg-white/40" />
                      <div className="relative size-44 overflow-hidden rounded-2xl bg-white p-3 shadow-2xl sm:size-48">
                        <Image
                          src="/cyno2026.jpeg"
                          alt="Payment QR Code"
                          width={200}
                          height={200}
                          className="size-full object-contain"
                        />
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="flex-1 space-y-5 text-center sm:text-left">
                      <div className="inline-flex rounded-full bg-white/5 px-4 py-1.5 align-middle">
                        <span className="text-sm font-black text-white">₹{selectedPass.price}</span>
                      </div>
                      <div className="space-y-3">
                        {[
                          "Scan the QR code using any UPI app",
                          <>
                            Or pay via PhonePe:{" "}
                            <span className="font-bold text-white">8978227231</span>
                          </>,
                          "Save the payment UTR/ID after paying",
                        ].map((step, i) => (
                          <div
                            key={i}
                            className="flex items-start justify-center gap-3 sm:justify-start"
                          >
                            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white/40">
                              {i + 1}
                            </span>
                            <p className="text-xs leading-relaxed text-white/50 sm:text-sm">
                              {step}
                            </p>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] font-medium leading-relaxed text-white/20">
                        * Enter the UTR/Payment ID below after completing payment. Our team will
                        verify it within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>

                {/* UTR Input */}
                <FormField label="Payment ID (UTR Number)">
                  <div className="group relative">
                    <input
                      type="text"
                      name="paymentId"
                      value={formData.paymentId}
                      onChange={handleInputChange}
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
                <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setSelectedPass(null)}
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

        {/* Contact Footer */}
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
      <label className="mb-1.5 block text-xs font-medium text-white/40">{label}</label>
      {children}
    </div>
  );
}

export default PassesPage;
