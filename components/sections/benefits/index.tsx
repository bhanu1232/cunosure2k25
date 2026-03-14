"use client";

import React from "react";
import Section from "@/components/layout/section";
import Heading from "../../atoms/heading";
import Link from "next/link";
import { motion } from "framer-motion";

const FADE_UP = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
});

const eventCards = [
  {
    id: "tech",
    title: "Technical Events",
    subTitle: "Competitions & Workshops",
    description:
      "Coding challenges, hackathons, and technical competitions that test your limits and reward innovation.",
    accentFrom: "#4A00E0",
    accentTo: "#1BC7FB",
    gradientClass: "from-[#4A00E0] via-[#6B1FD6] to-[#1BC7FB]",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
    stats: [
      { label: "Events", value: "15+" },
      { label: "Prize Pool", value: "₹3L" },
    ],
    overlayText: "TECH",
  },
  {
    id: "nontech",
    title: "Non-Tech Events",
    subTitle: "Arts & Entertainment",
    description:
      "Art, music, dance, and creative competitions that let your personality and artistic talent shine.",
    accentFrom: "#147CE5",
    accentTo: "#8E2DE2",
    gradientClass: "from-[#1BC7FB] via-[#147CE5] to-[#4A00E0]",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
        />
      </svg>
    ),
    stats: [
      { label: "Events", value: "18+" },
      { label: "Prize Pool", value: "₹2L" },
    ],
    overlayText: "CULTURE",
  },
];

const Benefits = () => {
  return (
    <Section className="overflow-hidden">
      <div className="container relative z-2">
        {/* Heading */}
        <motion.div {...FADE_UP(0)} className="text-center mb-14">
          <p className="mt-4 text-sm text-white/40 max-w-md mx-auto leading-relaxed">
            Two tracks. Endless possibilities. Find your arena.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[1100px] mx-auto">
          {eventCards.map((card, index) => (
            <motion.div key={card.id} {...FADE_UP(0.1 + index * 0.12)}>
              <Link
                href="/events"
                className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/[0.07] bg-white/[0.03] hover:border-white/[0.14] transition-all duration-500 hover:shadow-[0_24px_60px_rgba(0,0,0,0.4)]"
              >
                {/* Gradient visual block */}
                <div className="relative h-[220px] overflow-hidden">
                  {/* Base gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${card.gradientClass} opacity-80 group-hover:opacity-95 transition-opacity duration-500`}
                  />

                  {/* Mesh overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_60%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.3),transparent_60%)]" />

                  {/* Grid texture */}
                  <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                    }}
                  />

                  {/* Large ghost text */}
                  <div className="absolute inset-0 flex items-center justify-center select-none">
                    <span className="text-[5.5rem] sm:text-[7rem] font-black text-white/[0.07] tracking-tighter leading-none group-hover:text-white/[0.11] transition-all duration-500 group-hover:scale-105 inline-block">
                      {card.overlayText}
                    </span>
                  </div>

                  {/* Subtitle row */}
                  <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/15 text-white backdrop-blur-sm border border-white/10">
                        {card.icon}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">
                        {card.subTitle}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content block */}
                <div className="flex flex-col flex-grow p-6 gap-5">
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold text-white leading-snug">{card.title}</h3>
                    <span className="shrink-0 mt-0.5 flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-white/[0.04] text-white/40 group-hover:text-white group-hover:border-white/20 group-hover:bg-white/[0.08] transition-all duration-300">
                      <svg
                        className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 17L17 7M17 7H7M17 7v10"
                        />
                      </svg>
                    </span>
                  </div>

                  <p className="text-sm text-white/50 leading-relaxed">{card.description}</p>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3 mt-auto">
                    {card.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="flex flex-col items-center rounded-xl py-3 px-2 bg-white/[0.04] border border-white/[0.06]"
                      >
                        <span className="text-base font-black text-white tracking-tight">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-sm font-semibold text-white/40 group-hover:text-white transition-colors duration-300 mt-1">
                    <span>Browse {card.title}</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          {...FADE_UP(0.4)}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 text-center"
        >
          <span className="text-sm text-white/30">Want to see everything?</span>
          <Link
            href="/events"
            className="text-sm font-semibold text-white/70 hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/50 transition-all duration-200"
          >
            View all events
          </Link>
        </motion.div>
      </div>
    </Section>
  );
};

export default Benefits;
