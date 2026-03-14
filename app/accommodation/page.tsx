"use client";

import React, { Suspense } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Building2,
  Users2,
  Utensils,
  Info,
  CheckCircle2,
  PhoneCall,
  ChevronLeft,
  Calendar,
  MapPin,
} from "lucide-react";
import Link from "next/link";

const Navbar = dynamic(() => import("@/components/layout/navbar"), { ssr: false });

const importantPoints = [
  "Separate hostel rooms for boys and girls",
  "Bring your own bedsheets & personal items",
  "Available strictly on March 27, 2026 night",
  "Pre-registration is mandatory for accommodation",
  "Collect your accommodation pass on March 27 morning",
  "Only for registered Cynosure participants",
  "You are responsible for your own belongings",
  "Maintain discipline and adhere to campus rules",
];

const AccommodationPage = () => {
  return (
    <main className="relative min-h-screen bg-[#09090f] text-white pb-16 sm:pb-24">
      <Suspense fallback={<div className="h-20 bg-[#09090f]" />}>
        <Navbar />
      </Suspense>

      {/* ── Content wrapper ──────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] sm:text-[13px] text-white/40 hover:text-white/70 transition-colors mb-6 sm:mb-8 mt-16 sm:mt-20 group"
        ></Link>

        {/* ── Page Header ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 sm:mb-14"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-1 h-5 bg-white rounded-full" />
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Cynosure 2026
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
            Accommodation
          </h1>
          <p className="text-sm sm:text-base text-white/50 max-w-xl">
            Secure, comfortable on-campus housing curated for Cynosure participants.
          </p>
        </motion.div>

        {/* ── Info grid ────────────────────────────────── */}
        {/* Row 1: Availability + Fee */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Availability */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="p-6 sm:p-7 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0">
                <Users2 className="w-4.5 h-4.5 text-white/70" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">Availability</h2>
            </div>
            <div className="space-y-3">
              {["Limited rooms available", "First come, first serve basis"].map((d) => (
                <div key={d} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/30 shrink-0" />
                  <p className="text-sm sm:text-base text-white/60">{d}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-[11px] uppercase tracking-widest text-white/30 font-medium">
              Book early to secure your spot
            </p>
          </motion.div>

          {/* Fee Structure */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="p-6 sm:p-7 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0">
                <Utensils className="w-4.5 h-4.5 text-white/70" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">Fee Structure</h2>
            </div>
            <div className="space-y-3">
              {[
                "Girls: ₹250 / Night",
                "Boys: ₹200 / Night",
                "Includes 27th Night Dinner",
                "Includes 28th Morning Breakfast",
              ].map((d) => (
                <div key={d} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/30 shrink-0" />
                  <p className="text-sm sm:text-base text-white/60">{d}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-[11px] uppercase tracking-widest text-white/30 font-medium">
              All-inclusive package
            </p>
          </motion.div>
        </div>

        {/* Row 2: Guidelines + Contacts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Guidelines – takes 2 cols on lg */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-2 p-6 sm:p-7 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0">
                <Info className="w-4.5 h-4.5 text-white/70" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">Important Guidelines</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 sm:gap-y-4">
              {importantPoints.map((point, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                  <p className="text-sm text-white/55 leading-snug">{point}</p>
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
              className="flex-1 p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0">
                  <PhoneCall className="w-4 h-4 text-white/70" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">Boys Hostel</h3>
              </div>
              <p className="text-[11px] text-white/35 uppercase tracking-wider mb-1">
                Primary Coordinator
              </p>
              <p className="text-sm sm:text-base font-semibold text-white/80 mb-3">
                M. Suresh Reddy
              </p>
              <a
                href="tel:6300441669"
                className="inline-flex items-center gap-2 text-sm font-mono text-white/60 hover:text-white transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                +91 6300441669
              </a>
            </motion.div>

            {/* Girls Hostel */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex-1 p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0">
                  <PhoneCall className="w-4 h-4 text-white/70" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">Girls Hostel</h3>
              </div>
              <p className="text-[11px] text-white/35 uppercase tracking-wider mb-1">
                Primary Coordinator
              </p>
              <p className="text-sm sm:text-base font-semibold text-white/80 mb-3">
                L. Lakshmi Sivani
              </p>
              <a
                href="tel:8074345332"
                className="inline-flex items-center gap-2 text-sm font-mono text-white/60 hover:text-white transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                +91 8074345332
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
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-white/70" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-white/35 font-medium mb-0.5">
                Event Date
              </p>
              <p className="text-sm sm:text-base font-bold text-white">March 27–28, 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-white/70" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-white/35 font-medium mb-0.5">
                Venue
              </p>
              <p className="text-sm sm:text-base font-bold text-white">On-Campus Hostels</p>
            </div>
          </div>
          <Link
            href="/passes"
            className="px-5 py-2.5 rounded-lg bg-white text-black text-sm font-bold hover:bg-white/90 transition-colors w-full sm:w-auto text-center shrink-0"
          >
            Register Now
          </Link>
        </motion.div>
      </div>
    </main>
  );
};

export default AccommodationPage;
