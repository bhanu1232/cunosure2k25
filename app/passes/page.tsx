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
  uid?: string;
  participationCount?: number;
}

interface Notification {
  type: "success" | "error";
  message: string;
}

const DEFAULT_AMOUNT = 350;

const PassesPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    mobile: "",
    paymentId: "",
    gender: "",
    accommodation: "",
    collegeName: "",
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
        uid,
        participationCount: 1,
        totalAmount: DEFAULT_AMOUNT,
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
      });
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
            Register
          </h1>
          <p className="text-sm text-white/50 sm:text-base">
            Secure your pass for Cynosure 2026. Fill in the details below after completing payment.
          </p>
        </div>

        {/* Fee Card */}
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-800/90 p-4 shadow-lg sm:p-5">
          <div>
            <p className="mb-0.5 text-xs font-medium uppercase tracking-widest text-slate-300">
              Registration Fee
            </p>
            <p className="text-sm text-slate-300">Base fee — includes all events access</p>
          </div>
          <p className="text-2xl font-black text-cyan-300 sm:text-3xl">₹{DEFAULT_AMOUNT}</p>
        </div>

        {/* Pass Benefits */}
        <div className="mb-6 rounded-2xl border border-slate-700 bg-slate-800/90 p-5 sm:p-6">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-slate-300">
            What Included
          </p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {[
              "Full access to all technical & non-technical events",
              "Access to keynote sessions & guest lectures",
              "Participation in hackathons & ideathons",
              "Networking with industry experts",
            ].map((b) => (
              <div key={b} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-white/40" />
                <p className="text-xs leading-snug text-white/55 sm:text-sm">{b}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-slate-700 bg-slate-900/95 p-5 shadow-xl sm:p-6">
          <p className="mb-5 text-xs font-medium uppercase tracking-widest text-slate-300">
            Your Details
          </p>

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
            <div className="rounded-xl bg-white/[0.03] p-4 sm:p-5">
              <p className="mb-4 text-xs font-medium uppercase tracking-widest text-white/35">
                Payment
              </p>
              <div className="flex flex-col items-start gap-5 sm:flex-row">
                {/* QR */}
                <div className="mx-auto size-36 shrink-0 overflow-hidden rounded-xl bg-white p-2 sm:mx-0 sm:size-44">
                  <Image
                    src="/cyno2026.jpeg"
                    alt="Payment QR Code"
                    width={200}
                    height={200}
                    className="size-full object-contain"
                  />
                </div>
                {/* Instructions */}
                <div className="flex-1 space-y-3">
                  <p className="text-sm font-semibold text-white">
                    ₹{DEFAULT_AMOUNT} — Payment Instructions
                  </p>
                  <div className="space-y-2">
                    {[
                      "Scan the QR code using any UPI app",
                      <>
                        Or pay via PhonePe:{" "}
                        <span className="font-semibold text-white">8978227231</span>
                      </>,
                      "Save the payment UTR/ID after paying",
                      <>
                        For failures, WhatsApp: <span className="font-semibold text-white"></span>
                      </>,
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-[10px] font-bold text-white/50">
                          {i + 1}
                        </span>
                        <p className="text-xs leading-snug text-white/50 sm:text-sm">{step}</p>
                      </div>
                    ))}
                  </div>
                  <p className="pt-1 text-[11px] text-white/35">
                    Enter the UTR/Payment ID below after completing payment
                  </p>
                </div>
              </div>
            </div>

            {/* UTR Input */}
            <FormField label="Payment ID (UTR Number)">
              <input
                type="text"
                name="paymentId"
                value={formData.paymentId}
                onChange={handleInputChange}
                required
                placeholder="Enter the UTR number from your payment"
                className="form-input"
              />
            </FormField>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-white py-3.5 text-sm font-bold text-black transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Processing…" : "Complete Registration →"}
            </button>
          </form>
        </div>

        {/* Contact Footer */}
        <div className="mt-8 rounded-2xl p-4 text-center sm:p-5">
          <p className="text-sm text-white/40">
            For registration inquiries:{" "}
            <a
              href="mailto:svucyno@gmail.com"
              className="text-white/70 transition-colors hover:text-white"
            >
              svucyno@gmail.com
            </a>
          </p>
        </div>
      </div>

      <style jsx global>{`
        .form-input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border-radius: 0.75rem;
          background: #fff;
          border: 1px solid #cbd5e1;
          color: #0f172a;
          font-size: 0.875rem;
          transition:
            border-color 0.2s,
            box-shadow 0.2s;
          outline: none;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
        }
        .form-input::placeholder {
          color: #94a3b8;
        }
        .form-input:focus {
          border-color: #7dd3fc;
          box-shadow: 0 0 0 3px rgba(125, 211, 252, 0.2);
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
