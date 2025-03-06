"use client";

import React, { useState } from "react";
import Section from "@/components/layout/section";
import Heading from "@/components/atoms/heading";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/layout/navbar";

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    {
      src: "/assets/gradient.png",
      title: "Technical Workshop 2024",
      category: "Workshop",
      aspectRatio: "aspect-[4/3]",
      size: "lg",
    },
    {
      src: "/assets/gradient.png",
      title: "Cultural Night Performance",
      category: "Cultural",
      aspectRatio: "aspect-square",
      size: "sm",
    },
    {
      src: "/assets/gradient.png",
      title: "Hackathon Winners",
      category: "Technical",
      aspectRatio: "aspect-[4/3]",
      size: "md",
    },
    {
      src: "/assets/gradient.png",
      title: "Dance Competition",
      category: "Cultural",
      aspectRatio: "aspect-[3/4]",
      size: "lg",
    },
    {
      src: "/assets/gradient.png",
      title: "Robotics Exhibition",
      category: "Technical",
      aspectRatio: "aspect-square",
      size: "md",
    },
    {
      src: "/assets/gradient.png",
      title: "Music Performance",
      category: "Cultural",
      aspectRatio: "aspect-[3/4]",
      size: "sm",
    },
    {
      src: "/assets/gradient.png",
      title: "Coding Competition",
      category: "Technical",
      aspectRatio: "aspect-[4/3]",
      size: "lg",
    },
  ];

  const categories = ["All", "Technical", "Cultural"];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredImages =
    activeCategory === "All" ? images : images.filter((img) => img.category === activeCategory);

  return (
    <>
      <Section className="overflow-hidden pt-24 sm:pt-32">
        <div className="container relative z-2">
          <Navbar />
          <div className="relative lg:mt-9">
            {/* Background Glow Effects */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative text-center mb-8 sm:mb-12 px-4"
            >
              <Heading
                title="Event Gallery"
                text="Relive the memorable moments from Cynosure 2024"
                className="md:max-w-md lg:max-w-2xl mx-auto"
              />
            </motion.div>

            {/* Category Filter - Horizontal Scrollable on Mobile */}
            <div className="overflow-hidden scrollbar-hide mb-8 sm:mb-12 px-4">
              <div className="flex justify-start sm:justify-center gap-3 min-w-max sm:min-w-0 sm:flex-wrap">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-full transition-all duration-300 text-sm font-medium whitespace-nowrap ${
                      activeCategory === category
                        ? "bg-gradient-to-r from-[#1F4AF6] to-[#1BC7FB] text-white shadow-lg scale-105"
                        : "bg-n-7 text-n-1 hover:bg-n-6 hover:scale-105"
                    }`}
                    whileHover={{ scale: activeCategory === category ? 1.05 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Gallery Grid */}
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 px-4 max-w-[1400px] mx-auto"
            >
              <AnimatePresence mode="popLayout">
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={image.src + activeCategory}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`group cursor-pointer ${
                      image.size === "lg" ? "sm:col-span-2 lg:col-span-1" : ""
                    }`}
                    onClick={() => setSelectedImage(image.src)}
                  >
                    <div
                      className={`relative ${image.aspectRatio} rounded-xl sm:rounded-2xl overflow-hidden bg-n-8 shadow-lg transform transition-transform duration-500 hover:scale-[1.02] active:scale-95`}
                    >
                      <Image
                        src={image.src}
                        alt={image.title}
                        fill
                        className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-110"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-n-8/20 to-n-8/90 opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                      {/* Content Overlay */}
                      <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end">
                        <div className="transform translate-y-0 sm:translate-y-8 sm:group-hover:translate-y-0 transition-transform duration-500 delay-100">
                          <h3 className="text-white font-semibold text-lg sm:text-xl mb-2 line-clamp-2">
                            {image.title}
                          </h3>
                          <span className="inline-block px-3 py-1 rounded-full bg-n-1/10 backdrop-blur-sm text-n-1 text-xs sm:text-sm">
                            {image.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-lg"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative max-w-[95vw] sm:max-w-[90vw] max-h-[90vh]"
              >
                <Image
                  src={selectedImage}
                  alt="Selected image"
                  width={1200}
                  height={800}
                  className="object-contain rounded-lg shadow-2xl"
                />
                <motion.button
                  className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 text-white bg-n-8/80 rounded-full p-2 hover:bg-n-7 transition-colors backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(null);
                  }}
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Section>
    </>
  );
};

export default GalleryPage;
