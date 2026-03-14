"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import { X } from "lucide-react";

const Navbar = dynamic(() => import("@/components/layout/navbar"), { ssr: false });

const images = [
  {
    id: "inauguration",
    src: "/assets/gallery/one.avif",
    title: "Opening Ceremony",
    day: "Day 1",
    span: "col-span-1 sm:col-span-2",
    aspect: "aspect-[16/9]",
  },
  {
    id: "cultural-night",
    src: "/assets/gallery/two.avif",
    title: "Cultural Night",
    day: "Day 2",
    span: "col-span-1",
    aspect: "aspect-square",
  },
  {
    id: "all-members",
    src: "/assets/gallery/three.avif",
    title: "Core Team Assembly",
    day: "Day 1",
    span: "col-span-1",
    aspect: "aspect-square",
  },
  {
    id: "flash-mob",
    src: "/assets/gallery/four.avif",
    title: "Flash Mob",
    day: "Day 2",
    span: "col-span-1",
    aspect: "aspect-[4/3]",
  },
  {
    id: "food",
    src: "/assets/gallery/five.avif",
    title: "Food Festival",
    day: "Day 2",
    span: "col-span-1",
    aspect: "aspect-[4/3]",
  },
  {
    id: "vr-room",
    src: "/assets/gallery/six.avif",
    title: "VR Experience Zone",
    day: "Day 1",
    span: "col-span-1 sm:col-span-2",
    aspect: "aspect-[16/9]",
  },
];

const GalleryPage = () => {
  const [selected, setSelected] = useState<{ src: string; title: string } | null>(null);

  return (
    <main className="min-h-screen bg-[#09090f] text-white pb-16 sm:pb-24">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        {/* ── Page Header ──────────────────────────────── */}
        <div className="pt-16 sm:pt-20 mb-8 sm:mb-10">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-1 h-5 bg-white rounded-full" />
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Cynosure 2026 Gallery
            </span>
          </div>
        </div>

        {/* ── Photo Grid ───────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              // Only apply col-span on sm+ so mobile is always 1-col
              className={`group relative rounded-2xl overflow-hidden cursor-pointer bg-white/[0.03] ${
                image.span
              }`}
              onClick={() => setSelected({ src: image.src, title: image.title })}
            >
              <div className={`relative w-full ${image.aspect}`}>
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={index < 3}
                />
                {/* Dark gradient overlay for caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-sm text-white/70 text-[10px] font-semibold uppercase tracking-wider">
                      {image.day}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-sm sm:text-base leading-tight">
                    {image.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Lightbox ─────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-[95vw] sm:max-w-[88vw] max-h-[90vh] rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-[90vw] sm:w-[80vw] h-[70vh] sm:h-[80vh]">
                <Image
                  src={selected.src}
                  alt={selected.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Title bar */}
              <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-black/60 backdrop-blur-sm">
                <p className="text-sm font-semibold text-white">{selected.title}</p>
              </div>

              {/* Close button */}
              <button
                className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
                onClick={() => setSelected(null)}
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default GalleryPage;
