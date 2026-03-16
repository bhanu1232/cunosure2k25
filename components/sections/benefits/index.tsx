"use client";

import React from "react";
import Section from "@/components/layout/section";
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
    image:
      "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3F1dnEwcXJ5bzZwMjlzM3Y4NzNibHp4eGdwZmE1Zm00YTQzeHo2NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/u1WhXLjwgcXpHJBMRM/giphy.gif",
    stats: [
      { label: "Events", value: "8" },
      { label: "Prize Pool", value: "₹1L" },
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
    image:
      "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2FpNDZnZDhpamJudDRuOXBnazNvY3YwOGFuN3hjemlxM2wxYmxsYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qDa4qpPsBbC2IJG88B/giphy.gif",
    stats: [
      { label: "Events", value: "4" },
      { label: "Prize Pool", value: "₹1L" },
    ],
    overlayText: "CULTURE",
  },
  {
    id: "Esports",
    title: "Esports Events",
    subTitle: "Competitions & Tournaments ",
    description:
      "Competitive gaming events featuring popular titles, where strategy, skill, and teamwork lead to victory and prizes.",
    accentFrom: "#147CE5",
    accentTo: "#8E2DE2",
    gradientClass: "from-[#1BC7FB] via-[#147CE5] to-[#4A00E0]",
    image:
      "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjV6aXl5aDU0dHB4aGk3NHlwYW9vdTBka3F3Y2wwNmRmdWViM3dyZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/EXPiY4IWIWV6bQeALe/giphy.gif",
    stats: [
      { label: "Events", value: "2" },
      { label: "Prize Pool", value: "₹10k" },
    ],
    overlayText: "CULTURE",
  },
];

const Benefits = () => {
  return (
    <Section className="overflow-hidden">
      <div className="container relative z-2">
        {/* Cards grid */}
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-5 md:grid-cols-2">
          {eventCards.map((card, index) => (
            <motion.div key={card.id} {...FADE_UP(0.1 + index * 0.12)}>
              <Link
                href={`/events?category=${card.id}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] transition-all duration-500 hover:border-white/[0.14] hover:shadow-[0_24px_60px_rgba(0,0,0,0.4)]"
              >
                {/* Gradient visual block */}
                <div className="relative h-[220px] overflow-hidden">
                  {/* Base gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${card.gradientClass} opacity-80 transition-opacity duration-500 group-hover:opacity-95`}
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

                  {card.image && (
                    <img
                      src={card.image}
                      alt={card.title}
                      className="absolute inset-0 size-full object-cover opacity-60"
                    />
                  )}
                </div>

                {/* Content block */}
                <div className="flex grow flex-col gap-5 p-6">
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold leading-snug text-white">{card.title}</h3>
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/40 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/[0.08] group-hover:text-white">
                      <svg
                        className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
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

                  <p className="text-sm leading-relaxed text-white/50">{card.description}</p>

                  {/* Stats row */}
                  <div className="mt-auto grid grid-cols-3 gap-3">
                    {card.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="flex flex-col items-center rounded-xl border border-white/[0.06] bg-white/[0.04] px-2 py-3"
                      >
                        <span className="text-base font-black tracking-tight text-white">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-white/40 transition-colors duration-300 group-hover:text-white">
                    <span>Browse {card.title}</span>
                    <svg
                      className="size-4 transition-transform duration-200 group-hover:translate-x-1"
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
          className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:flex-row"
        >
          <span className="text-sm text-white/30">Want to see everything?</span>
          <Link
            href="/events"
            className="text-sm font-semibold text-white/70 underline decoration-white/20 underline-offset-4 transition-all duration-200 hover:text-white hover:decoration-white/50"
          >
            View all events
          </Link>
        </motion.div>
      </div>
    </Section>
  );
};

export default Benefits;
