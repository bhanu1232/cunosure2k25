"use client";

import React, { useRef, useEffect, useState } from "react";
import Section from "../../layout/section";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { images } from "@/constants";
import { BottomLine } from "../../design/hero";
import { motion } from "framer-motion";

const FADE_UP = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
});

const Hero = () => {
  const parallaxRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const eventDate = new Date("2026-04-05T07:00:00");

    const calculateTimeLeft = () => {
      const difference = +eventDate - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const countdownItems = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <Section
      className={cn("pt-[8rem] md:pt-[11rem] -mt-[5.25rem] relative overflow-hidden bg-[#07050F]")}
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      {/* ── Background layers ── */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Grid texture */}
        <Image
          src="/assets/grid.svg"
          alt=""
          fill
          className="object-cover opacity-[0.035]"
          priority
        />

        {/* Radial glow: top-center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-[#4A00E0] opacity-[0.12] blur-[140px]" />

        {/* Secondary accent: bottom-right */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full bg-[#1BC7FB] opacity-[0.07] blur-[120px]" />

        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07050F]/60 via-transparent to-[#07050F]" />
      </div>

      {/* ── Noise grain ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container relative z-10" ref={parallaxRef}>
        {/* ── Hero text block ── */}
        <div className="mx-auto mb-12 max-w-[58rem] text-center md:mb-16 lg:mb-20">
          {/* Event badge */}
          <motion.div {...FADE_UP(0)} className="inline-flex items-center gap-2 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1BC7FB] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1BC7FB]" />
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold tracking-[0.18em] uppercase border border-white/10 bg-white/5 text-[#1BC7FB] backdrop-blur-sm">
              Technical Fest 2026
            </span>
          </motion.div>

          {/* Title */}
          <div className="relative mb-6">
            <motion.h1 {...FADE_UP(0.1)} className="font-black tracking-tighter leading-none">
              <span className="block text-[clamp(3.5rem,12vw,8rem)] bg-gradient-to-br from-white via-white/90 to-white/40 bg-clip-text text-transparent">
                CYNOSURE
              </span>
              <span className="block text-[clamp(2rem,7vw,5rem)] bg-gradient-to-r from-[#1BC7FB] to-[#8E2DE2] bg-clip-text text-transparent mt-1">
                2026
              </span>
            </motion.h1>

            {/* Decorative underline */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-4 h-px w-48 bg-gradient-to-r from-transparent via-[#4A00E0] to-transparent origin-center"
            />
          </div>

          {/* Tagline */}
          <motion.p
            {...FADE_UP(0.25)}
            className="mx-auto max-w-xl text-sm md:text-base text-white/50 leading-relaxed tracking-wide font-light mb-10"
          >
            Experience the future of innovation. Elite competitions, breakthrough tech, and
            boundless opportunities await.
          </motion.p>

          {/* ── Countdown ── */}
          <motion.div
            {...FADE_UP(0.35)}
            className="inline-flex items-center gap-2 sm:gap-3 md:gap-4 mb-10 p-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-md"
          >
            {countdownItems.map((item, index) => (
              <React.Fragment key={item.label}>
                <div className="flex flex-col items-center w-14 sm:w-18 md:w-24">
                  <div className="relative w-full">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#4A00E0]/20 to-transparent blur-sm" />
                    <div className="relative rounded-xl bg-white/[0.05] border border-white/[0.08] px-2 py-3 sm:py-4 flex items-center justify-center">
                      <motion.span
                        key={mounted ? item.value : "init"}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="text-2xl sm:text-3xl md:text-4xl font-black text-white tabular-nums tracking-tighter"
                      >
                        {item.value.toString().padStart(2, "0")}
                      </motion.span>
                    </div>
                  </div>
                  <span className="mt-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                    {item.label}
                  </span>
                </div>

                {index < countdownItems.length - 1 && (
                  <span className="text-white/20 text-xl font-thin pb-4 select-none">:</span>
                )}
              </React.Fragment>
            ))}
          </motion.div>

          {/* ── CTA buttons ── */}
          <motion.div
            {...FADE_UP(0.45)}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            {/* Primary */}
            <Link
              href="/passes"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-sm tracking-widest uppercase overflow-hidden transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] transition-opacity duration-300 group-hover:opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1BC7FB] to-[#4A00E0] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Image
                src="/assets/crown.png"
                alt="Crown"
                width={18}
                height={18}
                className="relative z-10"
              />
              <span className="relative z-10 text-white">Register Now</span>
              <svg
                className="relative z-10 w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform duration-200"
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
            </Link>

            {/* Secondary */}
            <Link
              href="/events"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm tracking-widest uppercase border border-white/10 bg-white/[0.03] text-white/70 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 backdrop-blur-sm"
            >
              Explore Events
              <svg
                className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </motion.div>

          {/* Date + venue strip */}
          <motion.div
            {...FADE_UP(0.55)}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-white/30 font-medium tracking-wider uppercase"
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-3.5 h-3.5 text-[#1BC7FB]/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              March 27, 2026
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span className="flex items-center gap-2">
              <svg
                className="w-3.5 h-3.5 text-[#1BC7FB]/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              On Campus
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span className="flex items-center gap-2">
              <svg
                className="w-3.5 h-3.5 text-[#1BC7FB]/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              2000+ Participants
            </span>
          </motion.div>
        </div>

        {/* ── Banner image ── */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-[1300px]"
        >
          {/* Outer glow ring */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/10 to-white/0 pointer-events-none" />

          {/* Glass frame */}
          <div className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
            {/* Top bar with faux browser chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.05] bg-white/[0.02]">
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="mx-auto flex items-center gap-2 px-4 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1BC7FB]/60" />
                <span className="text-[10px] text-white/25 font-mono tracking-wider">
                  cynosure2026.tech
                </span>
              </div>
            </div>

            {/* Image */}
            <div className="relative aspect-[16/7] sm:aspect-[2.2/1] overflow-hidden group">
              <Image
                src={images.banner}
                fill
                className="object-cover object-center scale-105 group-hover:scale-[1.07] transition-transform duration-700 ease-out"
                alt="Cynosure 2026"
                priority
              />
              {/* Subtle gradient overlay at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#07050F]/80 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Floating stat badges */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="absolute -left-3 bottom-8 hidden lg:flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#0D0A1E]/90 border border-white/[0.08] backdrop-blur-md shadow-xl"
          >
            <div className="w-8 h-8 rounded-lg bg-[#4A00E0]/30 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-[#8E2DE2]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <div>
              <div className="text-white text-sm font-bold">30+ Events</div>
              <div className="text-white/40 text-[10px]">Competitions</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="absolute -right-3 bottom-8 hidden lg:flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#0D0A1E]/90 border border-white/[0.08] backdrop-blur-md shadow-xl"
          >
            <div className="w-8 h-8 rounded-lg bg-[#1BC7FB]/10 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-[#1BC7FB]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <div className="text-white text-sm font-bold">₹5L+ Prizes</div>
              <div className="text-white/40 text-[10px]">Prize Pool</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <BottomLine />
    </Section>
  );
};

export default Hero;
