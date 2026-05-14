"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/navbar";
import { CheckCircle2, X, AlertCircle, Plus, Trash2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import Image from "next/image";

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Event definitions
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const EVENTS = [
  {
    id: "hackathon",
    name: "Hackathon",
    fee: 350,
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
    note: "Team of 2â€“4 members. One registration per team.",
    closed: true,
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

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Types
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Page
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

  /* â”€â”€ Helpers â”€â”€ */
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

  /* â”€â”€ Submit â”€â”€ */
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

  /* â”€â”€ Participant helpers (Hackathon) â”€â”€ */
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

  /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
     Render
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  return (
    <main className="min-h-screen bg-slate-950 pb-20 text-slate-100">
      <Navbar />

      {/* Registrations Closed */}
      <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-4 pt-24 sm:px-6">
        <div className="w-full rounded-3xl border border-red-500/15 bg-red-500/[0.06] p-10 text-center shadow-2xl backdrop-blur-xl sm:p-14">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
            <svg className="size-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-5 py-1.5">
            <span className="size-2 rounded-full bg-red-400" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-red-400">Event Concluded</span>
          </div>
          <h1 className="mb-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Registrations Closed
          </h1>
          <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-white/50 sm:text-base">
            Cynosure 2026 concluded on April 5-6, 2026. Special event registrations are no longer being accepted.
            Thank you to everyone who participated!
          </p>
          <div className="mx-auto mb-8 h-px max-w-xs bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-white/20">Questions?</p>
          <a href="mailto:svucyno@gmail.com" className="text-sm text-white/40 underline transition-colors hover:text-white">
            svucyno@gmail.com
          </a>
        </div>
      </div>
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
