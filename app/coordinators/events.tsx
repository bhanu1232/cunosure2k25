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
    <div className="min-h-screen bg-[#09090f] pt-[4.75rem] text-white">
      {/* ── Page Header ────────────────────────────────── */}
      <header className="bg-[#09090f]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
          {/* Title row */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2.5">
                <div className="h-5 w-1 rounded-full bg-white" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 sm:text-xs">
                  Cynosure 2026
                </span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
                Our Team
              </h1>
              <p className="mt-2 max-w-md text-sm text-white/50 sm:mt-3 sm:text-base">
                Meet the faculty coordinator and student organizers who make Cynosure happen.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────── */}
      <main className="mx-auto max-w-6xl space-y-14 px-4 py-10 sm:space-y-20 sm:px-6 sm:py-16">
        {/* ── Faculty Coordinator ─────────────────────── */}
        <section>
          {/* Section label */}
          <div className="mb-6 flex items-center gap-3 sm:mb-8">
            <Award className="size-4 shrink-0 text-white/50" />
            <h2 className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 sm:text-xs">
              Coordinator
            </h2>
            <div className="h-px flex-1 bg-white/[0.04]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center gap-6 rounded-2xl bg-white/[0.03] p-6 text-center transition-all duration-300 hover:bg-white/[0.05] sm:flex-row sm:items-start sm:gap-8 sm:p-8 sm:text-left">
              {/* Photo */}
              <div className="size-24 shrink-0 overflow-hidden rounded-2xl sm:size-32">
                <Image
                  src={facultyCoord.coordinatorImage}
                  alt={facultyCoord.coordinatorName}
                  width={128}
                  height={128}
                  className="size-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="mb-3 inline-flex items-center rounded-md bg-white/[0.06] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/50 sm:text-[11px]">
                  HOD
                </div>
                <h3 className="break-words text-xl font-bold text-white sm:text-2xl">
                  {facultyCoord.coordinatorName}
                </h3>
                <p className="mt-1 text-xs text-white/40 sm:text-sm">
                  Department of Computer Science &amp; Engineering
                </p>

                {facultyCoord.mail && (
                  <a
                    href={`mailto:${facultyCoord.mail}`}
                    className="mt-4 inline-flex items-center gap-2 break-all rounded-lg bg-white/[0.06] px-3 py-2 text-xs text-white/60 transition-all hover:bg-white/10 hover:text-white sm:mt-5 sm:px-4 sm:py-2.5 sm:text-sm"
                  >
                    <Mail className="size-3.5 shrink-0 sm:size-4" />
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
          <div className="mb-6 flex items-center gap-3 sm:mb-8">
            <Users className="size-4 shrink-0 text-white/50" />
            <h2 className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 sm:text-xs">
              faculty coordinators
            </h2>
            <div className="h-px flex-1 bg-white/[0.04]" />
          </div>

          {/* Responsive grid: 1 col → 2 col → 3 col */}
          <div className="xs:grid-cols-2 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {allStudentCoords.map((item, index) => (
              <motion.div
                key={item.id + index}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="group relative flex flex-col rounded-2xl bg-white/[0.03] p-4 transition-all duration-300 hover:bg-white/[0.05] sm:p-6"
              >
                {/* Index */}
                <span className="absolute right-4 top-4 font-mono text-[10px] tabular-nums text-white/20 sm:right-5 sm:top-5 sm:text-xs">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Photo */}
                <div className="mb-4 sm:mb-5">
                  <div className="size-16 overflow-hidden rounded-xl sm:size-20">
                    <Image
                      src={item.coordinatorImage}
                      alt={item.coordinatorName}
                      width={80}
                      height={80}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="break-words pr-6 text-sm font-bold leading-tight text-white sm:text-base">
                    {item.coordinatorName}
                  </h3>
                </div>

                {/* Divider */}
                <div className="my-3 h-px bg-white/[0.04] sm:my-4" />

                {/* Contact buttons */}
                <div className="flex flex-wrap gap-2">
                  {item.title && (
                    <a
                      href={`https://instagram.com/${item.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg bg-white/[0.05] px-2.5 py-1.5 text-[11px] text-white/50 transition-all hover:bg-white/10 hover:text-white sm:text-xs"
                    >
                      <Instagram className="size-3 shrink-0 sm:size-3.5" />
                      <span className="font-medium">Instagram</span>
                    </a>
                  )}
                  {item.mail && (
                    <a
                      href={`mailto:${item.mail}`}
                      className="flex items-center gap-1.5 rounded-lg bg-white/[0.05] px-2.5 py-1.5 text-[11px] text-white/50 transition-all hover:bg-white/10 hover:text-white sm:text-xs"
                    >
                      <Mail className="size-3 shrink-0 sm:size-3.5" />
                      <span className="font-medium">Email</span>
                    </a>
                  )}
                  {item.contactInfo && !item.contactInfo.includes("@") && (
                    <a
                      href={`tel:${item.contactInfo}`}
                      className="flex items-center gap-1.5 rounded-lg bg-white/[0.05] px-2.5 py-1.5 text-[11px] text-white/50 transition-all hover:bg-white/10 hover:text-white sm:text-xs"
                    >
                      <Phone className="size-3 shrink-0 sm:size-3.5" />
                      <span className="max-w-[80px] truncate font-medium">{item.contactInfo}</span>
                    </a>
                  )}
                  {!item.title && !item.mail && !item.contactInfo && (
                    <span className="text-[10px] italic text-white/20 sm:text-xs">
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
