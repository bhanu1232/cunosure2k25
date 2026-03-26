"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/navbar";
import { CheckCircle2, X, AlertCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import Image from "next/image";

interface ParticipantData {
  name: string;
  email: string;
  mobile: string;
  gender: "male" | "female" | "";
  accommodation: "yes" | "no" | "";
  collegeName: string;
}

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
    id: "platinum",
    name: "Combo Pass",
    price: 1200,
    pricePerPerson: 400,
    tagline: "Combo Pass — 3 Members",
    isCombo: true,
    comboCount: 3,
    isFlash: true,
    color: "#C084FC",
    textColor: "text-purple-900",
    cardBg: "from-purple-400 via-violet-300 to-fuchsia-500",
    chipBg: "bg-purple-600/30",
    shineBg: "from-white/70 via-white/20 to-transparent",
    shadowColor: "shadow-purple-400/50",
    hoverShadow: "hover:shadow-purple-400/70",
    borderColor: "border-purple-300/30",
    badgeBg: "bg-purple-800",
    badgeText: "text-purple-50",
    btnBg: "bg-purple-900",
    btnText: "text-purple-50",
    borderHex: "#a855f7",
    benefits: [
      "3 Members Participate Together",
      "All Technical Events (per member)",
      "All Non-Technical Events (per member)",
      "Excludes Hackathon, Ideathon & Paper Presentation",
      "Participation Certificates (All 3)",
      "Complimentary Lunch and Refreshments",
      "Free ROBOTRAC 3.0 Registration",
      "Complimentary SV Zoo Park Ticket",
    ],
  },
  {
    id: "silver",
    name: "Silver",
    price: 350,
    pricePerPerson: 350,
    tagline: "Base Pass",
    isCombo: false,
    comboCount: 1,
    isFlash: false,
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
      "1 Technical Event (Your Choice)",
      "1 Non-Technical Event (Your Choice)",
      "Participation Certificate",
      "Complimentary Lunch and Refreshments",
      "Free ROBOTRAC 3.0 Registration",
      "Complimentary SV Zoo Park Ticket",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    price: 550,
    pricePerPerson: 550,
    tagline: "Standard Pass",
    isCombo: false,
    comboCount: 1,
    isFlash: false,
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
      "Participation Certificate",
      "Complimentary Lunch and Refreshments",
      "Free ROBOTRAC 3.0 Registration",
      "Complimentary SV Zoo Park Ticket",
    ],
  },
  {
    id: "diamond",
    name: "Diamond",
    price: 850,
    pricePerPerson: 850,
    tagline: "Premium Pass",
    isCombo: false,
    comboCount: 1,
    isFlash: false,
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
      "Participation Certificate",
      "Complimentary Lunch and Refreshments",
      "Free ROBOTRAC 3.0 Registration",
      "Complimentary SV Zoo Park Ticket",
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

  const emptyParticipant = (): ParticipantData => ({
    name: "",
    email: "",
    mobile: "",
    gender: "",
    accommodation: "",
    collegeName: "",
  });

  const [comboParticipants, setComboParticipants] = useState<ParticipantData[]>([
    emptyParticipant(),
    emptyParticipant(),
    emptyParticipant(),
  ]);
  const [comboPaymentId, setComboPaymentId] = useState("");

  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateComboParticipant = (index: number, field: keyof ParticipantData, value: string) => {
    setComboParticipants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
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

  const checkEmail = async (email: string) => {
    try {
      for (const col of ["registrations", "successRegistrations"]) {
        const q = query(collection(db, col), where("email", "==", email));
        if (!(await getDocs(q)).empty) return col;
      }
      return null;
    } catch (error) {
      console.error("Error checking email:", error);
      throw error;
    }
  };

  const generateUID = (mobile: string) => `CS${mobile}`;

  const handleComboSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    // Validate all 3 participants
    for (let i = 0; i < 3; i++) {
      const p = comboParticipants[i];
      if (!p.gender) {
        setNotification({
          type: "error",
          message: `Please select gender for Participant ${i + 1}`,
        });
        setLoading(false);
        return;
      }
      if (!p.accommodation) {
        setNotification({
          type: "error",
          message: `Please select accommodation for Participant ${i + 1}`,
        });
        setLoading(false);
        return;
      }
    }

    try {
      // Check duplicate mobiles among the 3
      const mobiles = comboParticipants.map((p) => p.mobile);
      const uniqueMobiles = new Set(mobiles);
      if (uniqueMobiles.size !== 3) {
        setNotification({
          type: "error",
          message: "All 3 participants must have different mobile numbers",
        });
        setLoading(false);
        return;
      }

      const emails = comboParticipants.map((p) => p.email.toLowerCase().trim());
      const uniqueEmails = new Set(emails);
      if (uniqueEmails.size !== 3) {
        setNotification({
          type: "error",
          message: "All 3 participants must have different email addresses",
        });
        setLoading(false);
        return;
      }

      for (const mobile of mobiles) {
        const existingCol = await checkMobileNumber(mobile);
        if (existingCol) {
          setNotification({
            type: "error",
            message: `Mobile ${mobile} has already been registered`,
          });
          setLoading(false);
          return;
        }
      }

      for (const email of emails) {
        const existingCol = await checkEmail(email);
        if (existingCol) {
          setNotification({
            type: "error",
            message: `Email ${email} has already been registered`,
          });
          setLoading(false);
          return;
        }
      }

      const paymentExists = await checkPaymentId(comboPaymentId);
      if (paymentExists) {
        setNotification({ type: "error", message: "This payment ID has already been used" });
        setLoading(false);
        return;
      }

      // Save 3 separate records
      for (let i = 0; i < 3; i++) {
        const p = comboParticipants[i];
        const uid = generateUID(p.mobile);
        await addDoc(collection(db, "registrations"), {
          ...p,
          passType: "Platinum",
          amount: 400,
          totalAmount: 1200,
          paymentId: comboPaymentId,
          participantNumber: i + 1,
          comboGroup: comboPaymentId,
          uid,
          date: new Date().toISOString(),
        });
      }

      setNotification({
        type: "success",
        message:
          "Your Platinum Combo registration has been received for all 3 members. We will verify and inform you via email after successful verification. Thank you!",
      });
      setComboParticipants([emptyParticipant(), emptyParticipant(), emptyParticipant()]);
      setComboPaymentId("");
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
          /* ── Dark Glass Card Selection ── */
          <div className="space-y-8">
            {/* ── Platinum Combo — hero card ── */}
            {PASSES.filter((p) => p.isCombo).map((pass) => (
              <motion.div
                key={pass.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{ y: -6, scale: 1.012 }}
                className="group relative mx-auto w-full"
              >
                {/* Ambient glow behind card */}
                <div
                  className="absolute -inset-3 rounded-[2.5rem] opacity-50 blur-2xl"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 80%, #f97316 0%, #a855f7 45%, transparent 70%)",
                  }}
                />
                {/* Animated fire border */}
                <div className="fire-border-wrap relative rounded-[2rem] p-[2px]">
                  <div
                    className="relative flex w-full flex-col overflow-hidden rounded-[calc(2rem-2px)] sm:flex-row"
                    style={{
                      background:
                        "linear-gradient(160deg, rgba(30,20,50,0.97) 0%, rgba(12,8,25,0.99) 100%)",
                      backdropFilter: "blur(24px)",
                    }}
                  >
                    {/* Top edge highlight */}
                    <div
                      className="pointer-events-none absolute inset-x-0 top-0 h-px"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(168,85,247,0.7), rgba(249,115,22,0.7), transparent)",
                      }}
                    />

                    {/* Card body */}
                    <div className="relative z-10 flex w-full flex-col gap-5 p-5 sm:gap-8 sm:p-10 lg:flex-row lg:items-center xl:p-12">
                      <div className="flex-1">
                        {/* Top Badges */}
                        <div className="mb-4 flex flex-wrap gap-2 sm:mb-6 sm:gap-2.5">
                          <span className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-white shadow-[0_0_16px_rgba(249,115,22,0.5)] sm:px-3.5 sm:py-1.5 sm:text-[10px]">
                            ⚡Limited Offer
                          </span>
                          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-white backdrop-blur-md sm:px-3 sm:py-1.5 sm:text-[10px]">
                            👥 3 Members
                          </span>
                        </div>

                        {/* Title & Tagline */}
                        <h3 className="mb-1.5 text-2xl font-black text-white sm:mb-2 sm:text-4xl">
                          {pass.name}
                        </h3>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 sm:text-xs">
                          {pass.tagline}
                        </p>

                        {/* Price */}
                        <div className="mt-5 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:items-end sm:gap-4">
                          <p className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-500 bg-clip-text text-5xl font-black leading-none tracking-tight text-transparent sm:text-7xl">
                            ₹1200
                          </p>
                          <div className="flex flex-col pb-0 sm:pb-1">
                            <span className="text-xs font-bold text-white/80 sm:text-sm">
                              for 3 persons
                            </span>
                            <span className="text-[10px] font-medium text-white/40 sm:text-[11px]">
                              Equivalent to ₹400/person
                            </span>
                          </div>
                        </div>

                        {/* Divider */}
                        <div
                          className="my-5 h-px w-full sm:my-8"
                          style={{
                            background:
                              "linear-gradient(90deg, rgba(255,255,255,0.08), transparent)",
                          }}
                        />

                        {/* Benefits */}
                        <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-4">
                          {pass.benefits.map((b, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <div className="mt-0.5 flex size-4 w-4 shrink-0 items-center justify-center rounded-full bg-orange-500/20">
                                <svg viewBox="0 0 14 14" fill="none" className="size-2.5">
                                  <path
                                    d="M4.5 7l2 2 3-3"
                                    stroke="#fba94c"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <span className="text-[11px] font-medium leading-normal text-white/70 sm:text-[13px] sm:leading-relaxed">
                                {b}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Right CTA Area */}
                      <div className="mt-2 flex flex-col items-stretch gap-3 sm:items-center sm:gap-4 lg:mt-0 lg:w-[280px] lg:shrink-0">
                        <button
                          onClick={() => setSelectedPass(pass)}
                          className="group relative w-full overflow-hidden rounded-2xl px-6 py-4 transition-all duration-300 hover:scale-[1.02] active:scale-95 sm:rounded-[1.25rem] sm:px-8 sm:py-5"
                          style={{
                            background: "linear-gradient(135deg, #ea580c 0%, #d97706 100%)",
                            boxShadow:
                              "0 8px 32px -4px rgba(234,88,12,0.5), inset 0 1px 1px rgba(255,255,255,0.2)",
                          }}
                        >
                          <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 group-hover:translate-y-0" />
                          <span className="relative z-10 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-white sm:text-[13px]">
                            Register Now
                            <svg
                              className="size-3.5 transition-transform duration-300 group-hover:translate-x-1 sm:size-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              />
                            </svg>
                          </span>
                        </button>
                        <p className="text-center text-[9px] font-semibold uppercase tracking-widest text-white/30 sm:text-[10px]">
                          3 spots · 1 payment
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* ── Other passes — dark glass 3-col grid ── */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {PASSES.filter((p) => !p.isCombo).map((pass, index) => (
                <motion.div
                  key={pass.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.09, ease: "easeOut" }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative"
                >
                  {/* Bottom glow */}
                  <div
                    className="pointer-events-none absolute -bottom-4 left-1/2 h-24 w-2/3 -translate-x-1/2 rounded-full blur-2xl"
                    style={{
                      background: `radial-gradient(ellipse,${pass.borderHex}44 0%,transparent 70%)`,
                      opacity: 0.6,
                    }}
                  />
                  {/* Dark glass card */}
                  <div
                    className="relative flex h-full flex-col overflow-hidden rounded-3xl p-6 transition-all duration-500 group-hover:shadow-2xl"
                    style={{
                      background:
                        "linear-gradient(160deg,rgba(20,20,35,0.96) 0%,rgba(10,10,22,0.99) 100%)",
                      border: `1px solid ${pass.borderHex}25`,
                      boxShadow: `0 0 0 1px ${pass.borderHex}08, 0 8px 40px rgba(0,0,0,0.55)`,
                    }}
                  >
                    {/* Top accent line */}
                    <div
                      className="absolute inset-x-0 top-0 h-[2px] rounded-t-3xl"
                      style={{
                        background: `linear-gradient(90deg,transparent,${pass.borderHex},transparent)`,
                      }}
                    />

                    {/* Name badge + dot */}
                    <div className="mb-6 flex items-center justify-between">
                      <span
                        className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest"
                        style={{
                          background: `${pass.borderHex}15`,
                          border: `1px solid ${pass.borderHex}35`,
                          color: pass.borderHex,
                        }}
                      >
                        {pass.name}
                      </span>
                      <span
                        className="size-2 rounded-full"
                        style={{
                          background: pass.borderHex,
                          boxShadow: `0 0 8px 3px ${pass.borderHex}70`,
                        }}
                      />
                    </div>

                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
                      {pass.tagline}
                    </p>
                    <p
                      className="text-5xl font-black leading-none tracking-tight"
                      style={{ color: pass.borderHex }}
                    >
                      ₹{pass.price}
                    </p>

                    <div
                      className="my-5 h-px"
                      style={{
                        background: `linear-gradient(90deg,${pass.borderHex}30,transparent)`,
                      }}
                    />

                    <ul className="mb-6 flex-1 space-y-2.5">
                      {pass.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <svg className="mt-0.5 size-3.5 shrink-0" viewBox="0 0 14 14" fill="none">
                            <circle cx="7" cy="7" r="6" fill={`${pass.borderHex}15`} />
                            <path
                              d="M4.5 7l2 2 3-3"
                              stroke={pass.borderHex}
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="text-[11px] leading-snug text-white/50">{b}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => setSelectedPass(pass)}
                      className="mt-auto w-full rounded-2xl py-3.5 text-xs font-black uppercase tracking-[0.15em] transition-all duration-300 hover:scale-[1.03] active:scale-95"
                      style={{
                        background: `${pass.borderHex}12`,
                        border: `1px solid ${pass.borderHex}35`,
                        color: pass.borderHex,
                        boxShadow: `0 0 16px ${pass.borderHex}18`,
                      }}
                    >
                      Register Now →
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="pt-2 text-center text-sm font-semibold text-white/25">
              ✨ Compete · Learn · Showcase Skills · Enjoy the Fest
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
                  <p className="text-xs text-white/30">
                    {selectedPass.isCombo
                      ? "Fill details for all 3 participants below"
                      : "Complete the information below"}
                  </p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-white/5 text-white/20">
                  <CheckCircle2 className="size-6" />
                </div>
              </div>

              {selectedPass.isCombo ? (
                /* ── Combo Form (3 participants) ── */
                <form onSubmit={handleComboSubmit} className="space-y-8">
                  {/* 3 Participant sections */}
                  {([0, 1, 2] as const).map((idx) => (
                    <div
                      key={idx}
                      className="rounded-3xl border border-purple-500/20 bg-purple-900/10 p-5 sm:p-6"
                    >
                      <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-purple-400">
                        Participant {idx + 1}
                      </p>
                      <div className="space-y-4">
                        {/* Name + College */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <FormField label="Full Name">
                            <input
                              type="text"
                              value={comboParticipants[idx].name}
                              onChange={(e) => updateComboParticipant(idx, "name", e.target.value)}
                              required
                              placeholder="Enter full name"
                              className="form-input"
                            />
                          </FormField>
                          <FormField label="College Name">
                            <input
                              type="text"
                              value={comboParticipants[idx].collegeName}
                              onChange={(e) =>
                                updateComboParticipant(idx, "collegeName", e.target.value)
                              }
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
                              value={comboParticipants[idx].email}
                              onChange={(e) => updateComboParticipant(idx, "email", e.target.value)}
                              required
                              placeholder="email@example.com"
                              className="form-input"
                            />
                          </FormField>
                          <FormField label="Mobile">
                            <input
                              type="tel"
                              value={comboParticipants[idx].mobile}
                              onChange={(e) =>
                                updateComboParticipant(idx, "mobile", e.target.value)
                              }
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
                                    value={g}
                                    checked={comboParticipants[idx].gender === g}
                                    onChange={() => updateComboParticipant(idx, "gender", g)}
                                    className="hidden"
                                  />
                                  <div
                                    className={`rounded-xl py-2.5 text-center text-sm font-medium capitalize transition-all ${
                                      comboParticipants[idx].gender === g
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
                                    value={opt}
                                    checked={comboParticipants[idx].accommodation === opt}
                                    onChange={() =>
                                      updateComboParticipant(idx, "accommodation", opt)
                                    }
                                    className="hidden"
                                  />
                                  <div
                                    className={`rounded-xl py-2.5 text-center text-sm font-medium capitalize transition-all ${
                                      comboParticipants[idx].accommodation === opt
                                        ? "bg-white text-black"
                                        : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                                    }`}
                                  >
                                    {opt}
                                  </div>
                                </label>
                              ))}
                            </div>
                            {comboParticipants[idx].accommodation === "yes" && (
                              <p className="mt-1.5 text-[11px] text-white/35">
                                * Accommodation fee collected during check-in
                              </p>
                            )}
                          </FormField>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Payment Section */}
                  <div className="relative overflow-hidden rounded-3xl bg-white/[0.03] p-6 sm:p-8">
                    <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                      Secure Payment — ₹1200 Total (₹400/person)
                    </p>
                    <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
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
                      <div className="flex-1 space-y-5 text-center sm:text-left">
                        <div className="inline-flex rounded-full bg-purple-500/10 px-4 py-1.5 align-middle">
                          <span className="text-sm font-black text-purple-300">
                            ₹1200 for 3 members (₹400 each)
                          </span>
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
                  <FormField label="Payment ID (UTR Number) — shared for all 3">
                    <div className="group relative">
                      <input
                        type="text"
                        value={comboPaymentId}
                        onChange={(e) => setComboPaymentId(e.target.value)}
                        required
                        placeholder="Enter the 12-digit UTR number"
                        className="form-input !py-4"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-purple-400">
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
                      className="order-1 flex-[2] rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 py-4 text-sm font-black text-white shadow-xl transition-all hover:scale-[1.02] hover:from-purple-500 hover:to-fuchsia-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:order-2"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="size-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                          <span>Registering All 3...</span>
                        </div>
                      ) : (
                        "Register All 3 Members →"
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* ── Single Participant Form ── */
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
                      <div className="flex-1 space-y-5 text-center sm:text-left">
                        <div className="inline-flex rounded-full bg-white/5 px-4 py-1.5 align-middle">
                          <span className="text-sm font-black text-white">
                            ₹{selectedPass.price}
                          </span>
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
              )}
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
        @keyframes fire-spin {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .fire-border-wrap {
          background: linear-gradient(
            270deg,
            #ff6a00,
            #ee0979,
            #ff6a00,
            #fbbf24,
            #f97316,
            #ee0979,
            #ff6a00
          );
          background-size: 400% 400%;
          animation: fire-spin 2.5s ease infinite;
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
