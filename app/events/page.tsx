"use client";
import { useState } from "react";
import ButtonGradient from "@/components/svg/button-gradient";
import { cn } from "@/lib/utils";
import Benefits from "./events";
import Benefits1 from "./nontech";
import Esports from "./esports";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/navbar";

export default function Even() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filterButtons = [
    { id: "all", label: "All" },
    { id: "tech", label: "Tech" },
    { id: "nontech", label: "Non-Tech" },
    { id: "esports", label: "Esports" },
  ];

  return (
    <main className="min-h-screen bg-[#09090f] text-white">
      <Navbar />

      <div className="relative pt-[4.75rem] lg:pt-[5.25rem]">
        {/* Subtle background grid */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-[0.025] bg-repeat" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <ButtonGradient />

          {/* ── Page Header ─────────────────────────────── */}
          <div className="pt-10 sm:pt-14 pb-8 sm:pb-10">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-1 h-5 bg-white rounded-full" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                Cynosure 2026 EVENTS
              </span>
            </div>
          </div>

          {/* ── Filter Tabs ─────────────────────────────── */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-8 sm:mb-10 overflow-x-auto pb-1 scrollbar-hide">
            {filterButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => setActiveFilter(btn.id)}
                className={cn(
                  "relative px-4 sm:px-5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0",
                  activeFilter === btn.id
                    ? "bg-white text-black"
                    : "bg-white/[0.05] text-white/50 hover:text-white hover:bg-white/10"
                )}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* ── Event Grids ─────────────────────────────── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-10 sm:space-y-14 pb-16 sm:pb-24"
            >
              {(activeFilter === "all" || activeFilter === "tech") && (
                <div>
                  {activeFilter === "all" && <SectionLabel label="Technical Events" />}
                  <Benefits />
                </div>
              )}
              {(activeFilter === "all" || activeFilter === "nontech") && (
                <div>
                  {activeFilter === "all" && <SectionLabel label="Non-Technical Events" />}
                  <Benefits1 />
                </div>
              )}
              {(activeFilter === "all" || activeFilter === "esports") && (
                <div>
                  {activeFilter === "all" && <SectionLabel label="Esports" />}
                  <Esports />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5 sm:mb-6">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 whitespace-nowrap">
        {label}
      </h2>
      <div className="flex-1 h-px bg-white/[0.05]" />
    </div>
  );
}
