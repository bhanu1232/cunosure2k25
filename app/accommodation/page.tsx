"use client";

import React, { Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Users2,
  Utensils,
  Info,
  CheckCircle2,
  PhoneCall,
  Calendar,
  MapPin,
  AlertCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Navbar = dynamic(() => import("@/components/layout/navbar"), { ssr: false });

const importantPoints = [
  "Separate hostel rooms for boys and girls",
  "Bring your own bedsheets & personal items",
  "Pre-registration is mandatory for accommodation",
  "Collect your accommodation pass on April 5 morning",
  "Only for registered Cynosure participants",
  "You are responsible for your own belongings",
  "Maintain discipline and adhere to campus rules",
];

const ACCOMMODATION_OPTIONS = [
  {
    id: "accom",
    label: "Accommodation: ₹350 / Night (with food) - Sunday",
    price: 350,
    gender: "Both",
    day: "Sunday",
  },
];

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

const AccommodationPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    mobile: "",
    paymentId: "",
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const selectedPackage = ACCOMMODATION_OPTIONS[0];

  const totalPrice = selectedPackage ? selectedPackage.price : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    try {
      const q = query(
        collection(db, "accommodations"),
        where("paymentId", "==", formData.paymentId)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setNotification({ type: "error", message: "This Payment ID has already been used." });
        setLoading(false);
        return;
      }

      await addDoc(collection(db, "accommodations"), {
        name: formData.name,
        email: formData.email,
        gender: formData.gender,
        mobile: formData.mobile,
        packageId: selectedPackage.id,
        packageLabel: selectedPackage.label,
        price: totalPrice,
        paymentId: formData.paymentId,
        timestamp: new Date().toISOString(),
      });

      setNotification({
        type: "success",
        message:
          "Accommodation request submitted successfully. We will verify your payment and confirm.",
      });
      setFormData({ name: "", email: "", gender: "", mobile: "", paymentId: "" });
    } catch (err) {
      setNotification({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to submit request. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#09090f] pb-16 text-white sm:pb-24">
      <Suspense fallback={<div className="h-20 bg-[#09090f]" />}>
        <Navbar />
      </Suspense>

      {/* ── Notification ── */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
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
                      {notification.type === "success" ? "Success!" : "Error"}
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
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.783-1.472-1.751-1.645-2.049-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
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
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <div className="rounded-2xl bg-[#131318] p-8 text-center shadow-2xl">
              <div className="relative mx-auto mb-5 size-14">
                <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-white" />
              </div>
              <h3 className="mb-1 text-base font-semibold text-white">Processing</h3>
              <p className="text-sm text-white/50">Please wait…</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Content wrapper ──────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12">
        {/* Back link */}
        <Link
          href="/"
          className="group mb-6 mt-16 inline-flex items-center gap-1.5 text-[12px] text-white/40 transition-colors hover:text-white/70 sm:mb-8 sm:mt-20 sm:text-[13px]"
        >
          ← Back to Events
        </Link>

        {/* ── Page Header ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 sm:mb-14"
        >
          <div className="mb-3 flex items-center gap-2.5">
            <div className="h-5 w-1 rounded-full bg-white" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 sm:text-xs">
              Cynosure 2026
            </span>
          </div>
          <h1 className="mb-3 text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
            Accommodation
          </h1>
          <p className="max-w-xl text-sm text-white/50 sm:text-base">
            Secure, comfortable on-campus housing curated for Cynosure participants.
          </p>
        </motion.div>

        {/* ── Registration Form ──────────────────────── */}
        <motion.div
          id="accommodation-form"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mb-12 rounded-[2.5rem] border border-white/5 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl sm:p-10"
        >
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white sm:text-2xl">Accommodation Form</h2>
              <p className="text-xs text-white/30">Fill in your details to secure a room</p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-white/5 text-white/20">
              <CheckCircle2 className="size-6" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Full Name">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Your full name"
                  className="form-input"
                />
              </FormField>
              <FormField label="Email Address">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="Your email address"
                  className="form-input"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Mobile Number">
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  required
                  pattern="[0-9]{10}"
                  placeholder="10-digit number"
                  className="form-input"
                />
              </FormField>

              <FormField label="Gender">
                <select
                  value={formData.gender}
                  onChange={(e) => {
                    setFormData({ ...formData, gender: e.target.value });
                  }}
                  required
                  className="form-input text-white [&>option]:text-black"
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </FormField>
            </div>

            {/* Payment Section */}
            {selectedPackage && (
              <div className="relative mt-6 overflow-hidden rounded-3xl bg-white/[0.03] p-6 sm:p-8">
                <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                  Secure Payment — ₹{totalPrice}
                </p>
                <div className="flex flex-col items-center gap-7 sm:flex-row sm:items-start">
                  {/* QR */}
                  <div className="group relative">
                    <div className="absolute inset-0 rounded-2xl bg-white/20 blur-xl transition-all duration-500 group-hover:bg-white/40" />
                    <div className="relative size-44 overflow-hidden rounded-2xl bg-white p-3 shadow-2xl sm:size-48">
                      <Image
                        src="/vivek_sir.png"
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
                      <span className="text-sm font-black text-white">₹{totalPrice}</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        "Scan the QR code using any UPI app",
                        <>
                          Or pay via upi:{" "}
                          <span className="font-bold text-white">svuvivek1@ybl</span>
                        </>,
                        "Save the UTR/Payment ID after paying",
                      ].map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white/40">
                            {i + 1}
                          </span>
                          <p className="text-xs leading-relaxed text-white/50 sm:text-sm">{step}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-white/20">
                      * Enter UTR below. Verified within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* UTR Input */}
            <FormField label="Payment ID (UTR Number)">
              <div className="group relative">
                <input
                  type="text"
                  value={formData.paymentId}
                  onChange={(e) => setFormData({ ...formData, paymentId: e.target.value })}
                  required
                  placeholder="Enter the 12-digit UTR number"
                  className="form-input !py-4"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-cyan-400">
                  <AlertCircle className="size-5" />
                </div>
              </div>
            </FormField>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-2xl bg-white py-4 text-sm font-black text-black shadow-xl transition-all hover:scale-[1.02] hover:bg-cyan-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="size-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                  <span>Submitting...</span>
                </div>
              ) : (
                `Complete Registration →`
              )}
            </button>
          </form>
        </motion.div>

        {/* ── Info grid ────────────────────────────────── */}
        {/* Row 1: Availability + Fee */}
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Availability */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl bg-white/[0.03] p-6 transition-colors hover:bg-white/[0.05] sm:p-7"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
                <Users2 className="w-4.5 h-4.5 text-white/70" />
              </div>
              <h2 className="text-base font-bold text-white sm:text-lg">Availability</h2>
            </div>
            <div className="space-y-3">
              {["Limited rooms available", "First come, first serve basis"].map((d) => (
                <div key={d} className="flex items-center gap-2.5">
                  <div className="size-1.5 shrink-0 rounded-full bg-white/30" />
                  <p className="text-sm text-white/60 sm:text-base">{d}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-[11px] font-medium uppercase tracking-widest text-white/30">
              Book early to secure your spot
            </p>
          </motion.div>

          {/* Fee Structure */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="rounded-2xl bg-white/[0.03] p-6 transition-colors hover:bg-white/[0.05] sm:p-7"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
                <Utensils className="w-4.5 h-4.5 text-white/70" />
              </div>
              <h2 className="text-base font-bold text-white sm:text-lg">Fee Structure</h2>
            </div>
            <div className="space-y-3">
              {["Accommodation: ₹350 / Night (with food) - Sunday"].map((d) => (
                <div key={d} className="flex items-center gap-2.5">
                  <div className="size-1.5 shrink-0 rounded-full bg-white/30" />
                  <p className="text-sm text-white/60 sm:text-base">{d}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-[11px] font-medium uppercase tracking-widest text-white/30">
              Select your package
            </p>
          </motion.div>
        </div>

        {/* Row 2: Guidelines + Contacts */}
        <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Guidelines – takes 2 cols on lg */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl bg-white/[0.03] p-6 transition-colors hover:bg-white/[0.05] sm:p-7 lg:col-span-2"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
                <Info className="w-4.5 h-4.5 text-white/70" />
              </div>
              <h2 className="text-base font-bold text-white sm:text-lg">Important Guidelines</h2>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 sm:gap-y-4">
              {importantPoints.map((point, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-white/40" />
                  <p className="text-sm leading-snug text-white/55">{point}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contacts – stacked in 1 col on lg */}
          <div className="flex flex-col gap-4">
            {/* Boys Hostel */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="flex-1 rounded-2xl bg-white/[0.03] p-6 transition-colors hover:bg-white/[0.05]"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
                  <PhoneCall className="size-4 text-white/70" />
                </div>
                <h3 className="text-sm font-bold text-white sm:text-base">Boys Hostel</h3>
              </div>
              <p className="mb-1 text-[11px] uppercase tracking-wider text-white/35">
                Primary Coordinator
              </p>
              <p className="mb-3 text-sm font-semibold text-white/80 sm:text-base">
                K. Rohit Kumar
              </p>
              <a
                href="tel:9666233912"
                className="inline-flex items-center gap-2 font-mono text-sm text-white/60 transition-colors hover:text-white"
              >
                <PhoneCall className="size-3.5" /> 9666233912
              </a>
            </motion.div>

            {/* Girls Hostel */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex-1 rounded-2xl bg-white/[0.03] p-6 transition-colors hover:bg-white/[0.05]"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
                  <PhoneCall className="size-4 text-white/70" />
                </div>
                <h3 className="text-sm font-bold text-white sm:text-base">Girls Hostel</h3>
              </div>
              <p className="mb-1 text-[11px] uppercase tracking-wider text-white/35">
                Primary Coordinator
              </p>
              <p className="mb-3 text-sm font-semibold text-white/80 sm:text-base">
                P. Naga Jyothi
              </p>
              <a
                href="tel:"
                className="inline-flex items-center gap-2 font-mono text-sm text-white/60 transition-colors hover:text-white"
              >
                <PhoneCall className="size-3.5" />
                NA
              </a>
            </motion.div>
          </div>
        </div>

        {/* ── Date Banner ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-white/[0.03] p-5 transition-colors hover:bg-white/[0.05] sm:flex-row sm:items-center sm:gap-6 sm:p-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
              <Calendar className="size-4 text-white/70" />
            </div>
            <div>
              <p className="mb-0.5 text-[11px] font-medium uppercase tracking-widest text-white/35">
                Event Date
              </p>
              <p className="text-sm font-bold text-white sm:text-base">April 5-6, 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
              <MapPin className="size-4 text-white/70" />
            </div>
            <div>
              <p className="mb-0.5 text-[11px] font-medium uppercase tracking-widest text-white/35">
                Venue
              </p>
              <p className="text-sm font-bold text-white sm:text-base">On-Campus Hostels</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Need Help?</p>
        <a
          href="mailto:svucyno@gmail.com"
          className="mt-2 inline-block text-sm text-white/40 transition-colors hover:text-white"
        >
          svucyno@gmail.com
        </a>
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

export default AccommodationPage;
