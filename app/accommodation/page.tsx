"use client";

import React, { Suspense } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Users2, Utensils, Info, CheckCircle2, PhoneCall, Calendar, MapPin } from "lucide-react";
import Link from "next/link";

const Navbar = dynamic(() => import("@/components/layout/navbar"), { ssr: false });

const importantPoints = [
  "Separate hostel rooms for boys and girls",
  "Bring your own bedsheets & personal items",
  "Available strictly on April 5, 2026 night",
  "Pre-registration is mandatory for accommodation",
  "Collect your accommodation pass on April 5 morning",
  "Only for registered Cynosure participants",
  "You are responsible for your own belongings",
  "Maintain discipline and adhere to campus rules",
];

const AccommodationPage = () => {
  return (
    <main className="relative min-h-screen bg-[#09090f] pb-16 text-white sm:pb-24">
      <Suspense fallback={<div className="h-20 bg-[#09090f]" />}>
        <Navbar />
      </Suspense>

      {/* ── Content wrapper ──────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12">
        {/* Back link */}
        <Link
          href="/"
          className="group mb-6 mt-16 inline-flex items-center gap-1.5 text-[12px] text-white/40 transition-colors hover:text-white/70 sm:mb-8 sm:mt-20 sm:text-[13px]"
        ></Link>

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
              {[
                "Girls: ₹350 / Night ( with food )",
                "Girls: ₹250 / Night ( with out food )",
                "Boys: ₹350 / Night ( with food )",
                "Boys: ₹250 / Night ( with out food )",
                "Includes 5th Night Dinner",
                "Includes 6th Morning Breakfast",
              ].map((d) => (
                <div key={d} className="flex items-center gap-2.5">
                  <div className="size-1.5 shrink-0 rounded-full bg-white/30" />
                  <p className="text-sm text-white/60 sm:text-base">{d}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-[11px] font-medium uppercase tracking-widest text-white/30">
              All-inclusive package
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
              <p className="mb-3 text-sm font-semibold text-white/80 sm:text-base">TBA</p>
              <a
                href="tel:6300441669"
                className="inline-flex items-center gap-2 font-mono text-sm text-white/60 transition-colors hover:text-white"
              >
                <PhoneCall className="size-3.5" /> TBA
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
              <p className="mb-3 text-sm font-semibold text-white/80 sm:text-base">TBA</p>
              <a
                href="tel:8074345332"
                className="inline-flex items-center gap-2 font-mono text-sm text-white/60 transition-colors hover:text-white"
              >
                <PhoneCall className="size-3.5" />
                TBA
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
              <p className="text-sm font-bold text-white sm:text-base">April 5–6, 2026</p>
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
          <Link
            href="/passes"
            className="w-full shrink-0 rounded-lg bg-white px-5 py-2.5 text-center text-sm font-bold text-black transition-colors hover:bg-white/90 sm:w-auto"
          >
            Register Now
          </Link>
        </motion.div>
      </div>
    </main>
  );
};

export default AccommodationPage;
