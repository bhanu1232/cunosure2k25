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
      <div className="pointer-events-none absolute inset-0 select-none">
        {/* Grid texture */}
        <Image
          src="/assets/grid.svg"
          alt=""
          fill
          className="object-cover opacity-[0.035]"
          priority
        />

        {/* Radial glow: top-center */}
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#4A00E0] opacity-[0.12] blur-[140px]" />

        {/* Secondary accent: bottom-right */}
        <div className="absolute bottom-0 right-0 h-[400px] w-[600px] rounded-full bg-[#1BC7FB] opacity-[0.07] blur-[120px]" />

        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07050F]/60 via-transparent to-[#07050F]" />
      </div>

      {/* ── Noise grain ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container relative z-10" ref={parallaxRef}>
        {/* ── Hero text block ── */}
        <div className="mx-auto mb-12 max-w-[58rem] text-center md:mb-16 lg:mb-20">
          {/* Event badge */}
          <motion.div {...FADE_UP(0)} className="mb-8 inline-flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#1BC7FB] opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-[#1BC7FB]" />
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#1BC7FB] backdrop-blur-sm md:text-sm">
              Technical Fest 2026
            </span>
          </motion.div>

          {/* Title */}
          <div className="relative mb-6">
            <motion.h1 {...FADE_UP(0.1)} className="font-black leading-none tracking-tighter">
              <span className="block bg-gradient-to-br from-white via-white/90 to-white/40 bg-clip-text text-[clamp(3.5rem,12vw,8rem)] text-transparent">
                CYNOSURE
              </span>
              <span className="mt-1 block bg-gradient-to-r from-[#1BC7FB] to-[#8E2DE2] bg-clip-text text-[clamp(2rem,7vw,5rem)] text-transparent">
                2026
              </span>
            </motion.h1>

            {/* Decorative underline */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-4 h-px w-48 origin-center bg-gradient-to-r from-transparent via-[#4A00E0] to-transparent"
            />
          </div>

          {/* Tagline */}
          <motion.p
            {...FADE_UP(0.25)}
            className="mx-auto mb-10 max-w-xl text-sm font-light leading-relaxed tracking-wide text-white/50 md:text-base"
          >
            Experience the future of innovation. Elite competitions, breakthrough tech, and
            boundless opportunities await.
          </motion.p>

          {/* ── Countdown ── */}
          <motion.div
            {...FADE_UP(0.35)}
            className="mb-10 inline-flex items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3 backdrop-blur-md sm:gap-3 md:gap-4"
          >
            {countdownItems.map((item, index) => (
              <React.Fragment key={item.label}>
                <div className="sm:w-18 flex w-14 flex-col items-center md:w-24">
                  <div className="relative w-full">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#4A00E0]/20 to-transparent blur-sm" />
                    <div className="relative flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.05] px-2 py-3 sm:py-4">
                      <motion.span
                        key={mounted ? item.value : "init"}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="text-2xl font-black tabular-nums tracking-tighter text-white sm:text-3xl md:text-4xl"
                      >
                        {item.value.toString().padStart(2, "0")}
                      </motion.span>
                    </div>
                  </div>
                  <span className="mt-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 sm:text-[10px]">
                    {item.label}
                  </span>
                </div>

                {index < countdownItems.length - 1 && (
                  <span className="select-none pb-4 text-xl font-thin text-white/20">:</span>
                )}
              </React.Fragment>
            ))}
          </motion.div>

          {/* ── CTA buttons ── */}
          <motion.div
            {...FADE_UP(0.45)}
            className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            {/* Primary */}
            <Link
              href="/passes"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl border border-white/20 px-10 py-5 text-sm font-black uppercase tracking-[0.2em] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(249,115,22,0.8)] active:scale-95"
            >
              {/* Rotating cracker thread border */}
              <span className="pointer-events-none absolute inset-0 rounded-xl border border-white/20" />
              <span
                className="pointer-events-none absolute inset-0 animate-spin rounded-xl border border-dashed border-white/40 opacity-70"
                style={{ animationDuration: "6s" }}
              />
              {/* Fiery animated background base */}
              <div className="absolute inset-0 animate-[pulse_2s_ease-in-out_infinite] bg-gradient-to-r from-blue-500 via-blue-500 to-yellow-500 bg-[length:200%_auto]" />
              {/* Overlay hover effect */}

              <Image
                src="/assets/crown.png"
                alt="Crown"
                width={20}
                height={20}
                className="relative z-10 drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]"
              />
              <span className="relative z-10 text-white drop-shadow-md">
                Register Now
                <br /> <p className="text-[10px] text-white">few slots left</p>
              </span>
              <svg
                className="relative z-10 size-4 text-white drop-shadow-md transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            {/* Secondary */}
            <Link
              href="/events"
              className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            >
              Explore Events
              <svg
                className="size-4 opacity-50 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
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
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-medium uppercase tracking-wider text-white/30"
          >
            <span className="flex items-center gap-2">
              <svg
                className="size-3.5 text-[#1BC7FB]/60"
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
              April 5-6, 2026
            </span>
            <span className="h-3 w-px bg-white/10" />
            <span className="flex items-center gap-2">
              <svg
                className="size-3.5 text-[#1BC7FB]/60"
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
            <span className="h-3 w-px bg-white/10" />
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
          <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-white/10 to-white/0" />

          {/* Glass frame */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] shadow-[0_32px_80px_rgba(0,0,0,0.6)] backdrop-blur-sm">
            {/* Top bar with faux browser chrome */}
            <div className="flex items-center gap-1.5 border-b border-white/[0.05] bg-white/[0.02] px-4 py-3">
              <span className="size-2.5 rounded-full bg-white/10" />
              <span className="size-2.5 rounded-full bg-white/10" />
              <span className="size-2.5 rounded-full bg-white/10" />
              <div className="mx-auto flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.04] px-4 py-1">
                <span className="size-1.5 rounded-full bg-[#1BC7FB]/60" />
                <span className="font-mono text-[10px] tracking-wider text-white/25">
                  cynosure2026.tech
                </span>
              </div>
            </div>

            {/* Image */}
            <div className="group relative aspect-[16/7] overflow-hidden sm:aspect-[2.2/1]">
              <Image
                src={images.banner}
                fill
                className="scale-105 object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                alt="Cynosure 2026"
                priority
              />
              {/* Subtle gradient overlay at bottom */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#07050F]/80 to-transparent" />
            </div>
          </div>

          {/* Floating stat badges */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="absolute -left-3 bottom-8 hidden items-center gap-2.5 rounded-xl border border-white/[0.08] bg-[#0D0A1E]/90 px-4 py-3 shadow-xl backdrop-blur-md lg:flex"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#4A00E0]/30">
              <svg
                className="size-4 text-[#8E2DE2]"
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
              <div className="text-sm font-bold text-white">30+ Events</div>
              <div className="text-[10px] text-white/40">Competitions</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="absolute -right-3 bottom-8 hidden items-center gap-2.5 rounded-xl border border-white/[0.08] bg-[#0D0A1E]/90 px-4 py-3 shadow-xl backdrop-blur-md lg:flex"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#1BC7FB]/10">
              <svg
                className="size-4 text-[#1BC7FB]"
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
              <div className="text-sm font-bold text-white">₹5L+ Prizes</div>
              <div className="text-[10px] text-white/40">Prize Pool</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <BottomLine />
    </Section>
  );
};

export default Hero;
