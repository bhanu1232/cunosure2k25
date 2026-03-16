"use client";

import React, { useState, useEffect, useCallback } from "react";
import Section from "@/components/layout/section";
import Heading from "../../atoms/heading";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: 1,
    image: "/assets/gallery/web.avif",
    title: "Web Development",
    description: "Showcasing innovation and technical excellence",
    tag: "Technical",
  },
  {
    id: 2,
    image: "/assets/gallery/her.jpeg",
    title: "Query Cracker",
    description: "A competitive tech knowledge competition",
    tag: "Cultural",
  },
  {
    id: 3,
    image: "/assets/gallery/her1.jpeg",
    title: "Flash Mob",
    description: "A dance performance by the students",
    tag: "Cultural",
  },
];

const AUTOPLAY_DURATION = 5000;

const Services = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [progress, setProgress] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
      setProgress(0);
    },
    [current]
  );

  const next = useCallback(() => {
    const next = (current + 1) % slides.length;
    setDirection(1);
    setCurrent(next);
    setProgress(0);
  }, [current]);

  const prev = useCallback(() => {
    const prev = (current - 1 + slides.length) % slides.length;
    setDirection(-1);
    setCurrent(prev);
    setProgress(0);
  }, [current]);

  // Autoplay with progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          next();
          return 0;
        }
        return p + 100 / (AUTOPLAY_DURATION / 100);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [next]);

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  return (
    <Section id="how-to-use" className="overflow-hidden">
      <div className="container">
        {/* Heading */}
        <div className="mb-12 text-center">
          <Heading
            title="Relive the Moments"
            text="A glimpse into the energy, innovation, and passion that defines Cynosure."
          />
        </div>

        {/* Main slider */}
        <div className="relative mx-auto max-w-[1100px]">
          {/* Slider frame */}
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/[0.07] bg-black shadow-[0_32px_80px_rgba(0,0,0,0.6)] sm:aspect-[2/1] lg:aspect-[2.2/1]">
            {/* Slides */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={slides[current].image}
                  alt={slides[current].title}
                  fill
                  className="object-cover"
                  priority={current === 0}
                />

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Ambient glows */}
            <div className="pointer-events-none absolute -left-1/4 -top-1/4 aspect-square w-1/2 rounded-full bg-[#4A00E0]/15 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-1/4 -right-1/4 aspect-square w-1/2 rounded-full bg-[#1BC7FB]/10 blur-[100px]" />
            {/* Tag badge top-left */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`tag-${current}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="absolute left-5 top-5 z-10"
              >
                <span className="rounded-full border border-[#4A00E0]/40 bg-[#4A00E0]/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80 backdrop-blur-md">
                  {slides[current].tag}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Content overlay bottom */}
            <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-6 sm:p-8 lg:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`content-${current}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                ></motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Progress indicators below */}
          <div className="mt-5 flex items-center gap-3">
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className="group relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/10"
                aria-label={`Go to slide ${index + 1}`}
              >
                {/* Fill bar */}
                {index === current ? (
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#4A00E0] to-[#1BC7FB]"
                    style={{ width: `${progress}%` }}
                  />
                ) : index < current ? (
                  <div className="absolute inset-0 rounded-full bg-white/30" />
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Services;
