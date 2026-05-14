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
    price: 1500,
    pricePerPerson: 500,
    tagline: "Combo Pass â€” 3 Members",
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
      "Excludes Hackathon, Ideathon & Paper Presentation & spot events",
      "Participation Certificates (All 3)",
      "Complimentary Lunch and Refreshments",
      "Free ROBOTRAC 3.0 Registration",
      "Complimentary SV Zoo Park Ticket",
    ],
  },
  {
    id: "silver",
    name: "Silver",
    price: 500,
    pricePerPerson: 500,
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
      "2 Technical Event (Your Choice)",
      "1 Non-Technical Event (Your Choice)",
      "Participation Certificate",
      "Complimentary Lunch and Refreshments",
      "Free ROBOTRAC 3.0 Registration",
      "Complimentary SV Zoo Park Ticket",
    ],
  },
  // {
  //   id: "gold",
  //   name: "Gold",
  //   price: 550,
  //   pricePerPerson: 550,
  //   tagline: "Standard Pass",
  //   isCombo: false,
  //   comboCount: 1,
  //   isFlash: false,
  //   color: "#F59E0B",
  //   textColor: "text-amber-900",
  //   cardBg: "from-amber-300 via-yellow-200 to-amber-500",
  //   chipBg: "bg-amber-600/30",
  //   shineBg: "from-white/70 via-white/20 to-transparent",
  //   shadowColor: "shadow-amber-400/50",
  //   hoverShadow: "hover:shadow-amber-400/70",
  //   borderColor: "border-amber-300/30",
  //   badgeBg: "bg-amber-700",
  //   badgeText: "text-amber-50",
  //   btnBg: "bg-amber-800",
  //   btnText: "text-amber-50",
  //   borderHex: "#F59E0B",
  //   benefits: [
  //     "4 Technical Event (Your Choice)",
  //     "2 Non-Technical Event (Your Choice)",
  //     "Participation Certificate",
  //     "Complimentary Lunch and Refreshments",
  //     "Free ROBOTRAC 3.0 Registration",
  //     "Complimentary SV Zoo Park Ticket",
  //   ],
  // },
  // {
  //   id: "diamond",
  //   name: "Diamond",
  //   price: 850,
  //   pricePerPerson: 850,
  //   tagline: "Premium Pass",
  //   isCombo: false,
  //   comboCount: 1,
  //   isFlash: false,
  //   color: "#67E8F9",
  //   textColor: "text-cyan-900",
  //   cardBg: "from-cyan-300 via-sky-200 to-cyan-500",
  //   chipBg: "bg-cyan-600/30",
  //   shineBg: "from-white/70 via-white/20 to-transparent",
  //   shadowColor: "shadow-cyan-400/50",
  //   hoverShadow: "hover:shadow-cyan-400/70",
  //   borderColor: "border-cyan-300/30",
  //   badgeBg: "bg-cyan-700",
  //   badgeText: "text-cyan-50",
  //   btnBg: "bg-cyan-800",
  //   btnText: "text-cyan-50",
  //   borderHex: "#22d3ee",
  //   benefits: [
  //     "4 Technical Events (Your Choice)",
  //     "2 Non-Technical Events (Your Choice)",
  //     "Participation Certificate",
  //     "Complimentary Lunch and Refreshments",
  //     "Free ROBOTRAC 3.0 Registration",
  //     "Complimentary SV Zoo Park Ticket",
  //   ],
  // },
];

const PASS_NOTE = "Ideathon | Hackathon | Paper Presentation â†’ Separate Registration";

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
          amount: 500,
          totalAmount: 1500,
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

      {/* â”€â”€ Registrations Closed â”€â”€ */}
      <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-4 pt-24 sm:px-6">
        <div className="w-full rounded-3xl border border-red-500/15 bg-red-500/[0.06] p-10 text-center shadow-2xl backdrop-blur-xl sm:p-14">
          {/* Icon */}
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
            <svg className="size-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>

          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-5 py-1.5">
            <span className="size-2 rounded-full bg-red-400" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-red-400">Event Concluded</span>
          </div>

          <h1 className="mb-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Registrations Closed
          </h1>
          <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-white/50 sm:text-base">
            Cynosure 2026 concluded on April 5â€“6, 2026. Registrations are no longer being accepted.
            Thank you to everyone who participated!
          </p>

          <div className="mx-auto mb-8 h-px max-w-xs bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-white/20">Questions?</p>
          <a
            href="mailto:svucyno@gmail.com"
            className="text-sm text-white/40 underline transition-colors hover:text-white"
          >
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
      <label className="mb-1.5 block text-xs font-medium text-white/40">{label}</label>
      {children}
    </div>
  );
}

export default PassesPage;
