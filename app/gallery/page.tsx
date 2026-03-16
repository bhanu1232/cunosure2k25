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
    src: "/assets/gallery/her1.jpeg",
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
    <main className="min-h-screen bg-[#09090f] pb-16 text-white sm:pb-24">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12">
        {/* ── Page Header ──────────────────────────────── */}
        <div className="mb-8 pt-16 sm:mb-10 sm:pt-20">
          <div className="mb-3 flex items-center gap-2.5">
            <div className="h-5 w-1 rounded-full bg-white" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 sm:text-xs">
              Cynosure 2026 Gallery
            </span>
          </div>
        </div>

        {/* ── Photo Grid ───────────────────────────────── */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              // Only apply col-span on sm+ so mobile is always 1-col
              className={`group relative cursor-pointer overflow-hidden rounded-2xl bg-white/[0.03] ${
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Caption */}
                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:p-5">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/70 backdrop-blur-sm">
                      {image.day}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold leading-tight text-white sm:text-base">
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl sm:p-6"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[90vh] max-w-[95vw] overflow-hidden rounded-xl shadow-2xl sm:max-w-[88vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-[70vh] w-[90vw] sm:h-[80vh] sm:w-[80vw]">
                <Image
                  src={selected.src}
                  alt={selected.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Title bar */}
              <div className="absolute inset-x-0 bottom-0 bg-black/60 px-4 py-3 backdrop-blur-sm">
                <p className="text-sm font-semibold text-white">{selected.title}</p>
              </div>

              {/* Close button */}
              <button
                className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
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
