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
        setNotification({ type: "error", message: "This mobile number has already been registered" });
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
        message: "Your application has been received. We will verify and inform you via email after successful verification. Thank you!",
      });
      setFormData({ name: "", email: "", mobile: "", paymentId: "", gender: "", accommodation: "", collegeName: "" });
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
    <main className="min-h-screen bg-[#09090f] text-white pb-16 sm:pb-24">
      <Navbar />

      {/* ── Notification Modal ──────────────────────── */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setNotification(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`rounded-2xl p-6 shadow-2xl ${
                notification.type === "success"
                  ? "bg-white border border-green-200"
                  : "bg-white border border-red-200"
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    notification.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}>
                    {notification.type === "success" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-base font-bold mb-1 ${
                      notification.type === "success" ? "text-green-700" : "text-red-700"
                    }`}>
                      {notification.type === "success" ? "Registration Received!" : "Error"}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{notification.message}</p>
                  </div>
                  <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
                    <X className="w-4 h-4" />
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm"
            >
              <div className="bg-[#131318] rounded-2xl p-8 text-center shadow-2xl">
                <div className="relative w-14 h-14 mx-auto mb-5">
                  <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-spin" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">Processing Registration</h3>
                <p className="text-sm text-white/50">Please wait while we submit your details…</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page Content ────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28">

        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-1 h-5 bg-white rounded-full" />
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Cynosure 2026
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">Register</h1>
          <p className="text-sm sm:text-base text-white/50">
            Secure your pass for Cynosure 2026. Fill in the details below after completing payment.
          </p>
        </div>

        {/* Fee Card */}
        <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white/[0.04] mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/35 font-medium mb-0.5">Registration Fee</p>
            <p className="text-sm text-white/60">Base fee — includes all events access</p>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">₹{DEFAULT_AMOUNT}</p>
        </div>

        {/* Pass Benefits */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] mb-6">
          <p className="text-xs uppercase tracking-widest text-white/35 font-medium mb-4">What's Included</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              "Full access to all technical & non-technical events",
              "Access to keynote sessions & guest lectures",
              "Participation in hackathons & ideathons",
              "Networking with industry experts",
            ].map((b) => (
              <div key={b} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                <p className="text-xs sm:text-sm text-white/55 leading-snug">{b}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03]">
          <p className="text-xs uppercase tracking-widest text-white/35 font-medium mb-5">Your Details</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name + College */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <div className={`text-center py-2.5 rounded-xl text-sm font-medium transition-all capitalize ${
                        formData.gender === g
                          ? "bg-white text-black"
                          : "bg-white/[0.05] text-white/50 hover:bg-white/10"
                      }`}>
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
                      <div className={`text-center py-2.5 rounded-xl text-sm font-medium transition-all capitalize ${
                        formData.accommodation === opt
                          ? "bg-white text-black"
                          : "bg-white/[0.05] text-white/50 hover:bg-white/10"
                      }`}>
                        {opt}
                      </div>
                    </label>
                  ))}
                </div>
                {formData.accommodation === "yes" && (
                  <p className="text-[11px] text-white/35 mt-1.5">* Accommodation fee collected during check-in</p>
                )}
              </FormField>
            </div>

            {/* Payment Section */}
            <div className="p-4 sm:p-5 rounded-xl bg-white/[0.03]">
              <p className="text-xs uppercase tracking-widest text-white/35 font-medium mb-4">Payment</p>
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                {/* QR */}
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-xl overflow-hidden bg-white p-2 shrink-0 mx-auto sm:mx-0">
                  <Image
                    src="/pay_qr.jpeg"
                    alt="Payment QR Code"
                    width={200}
                    height={200}
                    className="w-full h-full object-contain"
                  />
                </div>
                {/* Instructions */}
                <div className="flex-1 space-y-3">
                  <p className="text-sm font-semibold text-white">₹{DEFAULT_AMOUNT} — Payment Instructions</p>
                  <div className="space-y-2">
                    {[
                      "Scan the QR code using any UPI app",
                      <>Or pay via PhonePe: <span className="text-white font-semibold">7981269983</span></>,
                      "Save the payment UTR/ID after paying",
                      <>For failures, WhatsApp: <span className="text-white font-semibold">9441005225</span></>,
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-white/[0.08] text-[10px] font-bold text-white/50 flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-xs sm:text-sm text-white/50 leading-snug">{step}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-white/35 pt-1">
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
              className="w-full py-3.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Processing…" : "Complete Registration →"}
            </button>
          </form>
        </div>

        {/* Contact Footer */}
        <div className="mt-8 p-4 sm:p-5 rounded-2xl text-center">
          <p className="text-sm text-white/40">
            For registration inquiries: <a href="mailto:svucyno@gmail.com" className="text-white/70 hover:text-white transition-colors">svucyno@gmail.com</a>
          </p>
        </div>
      </div>

      <style jsx global>{`
        .form-input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border-radius: 0.75rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: white;
          font-size: 0.875rem;
          transition: border-color 0.2s;
          outline: none;
        }
        .form-input::placeholder { color: rgba(255,255,255,0.25); }
        .form-input:focus { border-color: rgba(255,255,255,0.3); }
      `}</style>
    </main>
  );
};

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-white/40 mb-1.5 font-medium">{label}</label>
      {children}
    </div>
  );
}

export default PassesPage;
