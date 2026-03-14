"use client";

import React from "react";
import { coord, coord1 } from "@/constants";
import Image from "next/image";
import { Instagram, Mail, Phone, ChevronLeft, Award, Users } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const CoordinatorsContent = () => {
  const facultyCoord = coord[0];
  const allStudentCoords = [...coord.slice(1), ...coord1];

  return (
    <div className="min-h-screen bg-[#09090f] text-white pt-[4.75rem]">
      {/* ── Page Header ────────────────────────────────── */}
      <header className="bg-[#09090f]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Title row */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-1 h-5 bg-white rounded-full" />
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                  Cynosure 2026
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
                Our Team
              </h1>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-white/50 max-w-md">
                Meet the faculty coordinator and student organizers who make Cynosure happen.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-14 sm:space-y-20">
        {/* ── Faculty Coordinator ─────────────────────── */}
        <section>
          {/* Section label */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <Award className="w-4 h-4 text-white/50 shrink-0" />
            <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white/40 whitespace-nowrap">
              Faculty Coordinator
            </h2>
            <div className="flex-1 h-px bg-white/[0.04]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-6 sm:gap-8 p-6 sm:p-8 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] transition-all duration-300">
              {/* Photo */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0">
                <Image
                  src={facultyCoord.coordinatorImage}
                  alt={facultyCoord.coordinatorName}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/[0.06] text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-white/50 mb-3">
                  Faculty Lead
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white break-words">
                  {facultyCoord.coordinatorName}
                </h3>
                <p className="text-white/40 text-xs sm:text-sm mt-1">
                  Department of Computer Science &amp; Engineering
                </p>

                {facultyCoord.mail && (
                  <a
                    href={`mailto:${facultyCoord.mail}`}
                    className="inline-flex items-center gap-2 mt-4 sm:mt-5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-white/[0.06] text-xs sm:text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all break-all"
                  >
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span className="truncate">{facultyCoord.mail}</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── Student Organizers ──────────────────────── */}
        <section>
          {/* Section label */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <Users className="w-4 h-4 text-white/50 shrink-0" />
            <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white/40 whitespace-nowrap">
              Student Organizers
            </h2>
            <div className="flex-1 h-px bg-white/[0.04]" />
          </div>

          {/* Responsive grid: 1 col → 2 col → 3 col */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {allStudentCoords.map((item, index) => (
              <motion.div
                key={item.id + index}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="group relative flex flex-col p-4 sm:p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] transition-all duration-300"
              >
                {/* Index */}
                <span className="absolute top-4 right-4 sm:top-5 sm:right-5 text-[10px] sm:text-xs font-mono text-white/20 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Photo */}
                <div className="mb-4 sm:mb-5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden">
                    <Image
                      src={item.coordinatorImage}
                      alt={item.coordinatorName}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-white leading-tight break-words pr-6">
                    {item.coordinatorName}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-white/35 mt-1">
                    Student Organizer
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/[0.04] my-3 sm:my-4" />

                {/* Contact buttons */}
                <div className="flex flex-wrap gap-2">
                  {item.title && (
                    <a
                      href={`https://instagram.com/${item.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.05] text-white/50 hover:text-white hover:bg-white/10 transition-all text-[11px] sm:text-xs"
                    >
                      <Instagram className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                      <span className="font-medium">Instagram</span>
                    </a>
                  )}
                  {item.mail && (
                    <a
                      href={`mailto:${item.mail}`}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.05] text-white/50 hover:text-white hover:bg-white/10 transition-all text-[11px] sm:text-xs"
                    >
                      <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                      <span className="font-medium">Email</span>
                    </a>
                  )}
                  {item.contactInfo && !item.contactInfo.includes("@") && (
                    <a
                      href={`tel:${item.contactInfo}`}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.05] text-white/50 hover:text-white hover:bg-white/10 transition-all text-[11px] sm:text-xs"
                    >
                      <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                      <span className="font-medium truncate max-w-[80px]">{item.contactInfo}</span>
                    </a>
                  )}
                  {!item.title && !item.mail && !item.contactInfo && (
                    <span className="text-[10px] sm:text-xs text-white/20 italic">
                      No contact listed
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CoordinatorsContent;
