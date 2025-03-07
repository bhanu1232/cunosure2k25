"use client";

import React, { useState, useEffect } from "react";
import Section from "@/components/layout/section";
import Heading from "../../atoms/heading";
import { brainwaveServices, images } from "@/constants";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const Services = () => {
  const slides = [
    {
      id: 1,
      image: "/assets/gallery/web.avif",
      title: "Web Development",
      description: "Showcasing innovation and technical excellence",
    },
    {
      id: 2,
      image: "/assets/gallery/query.avif",
      title: "Query Cracker",
      description: "A compative tech knowledge competition",
    },
    {
      id: 3,
      image: "/assets/gallery/four.avif",
      title: "Flash Mob",
      description: "A dance performance by the students",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <Section id="how-to-use" className="overflow-hidden">
      <div className="container">
        <Heading
          title="Cynosure Past Highlights"
          text="Relive the excitement and unforgettable moments of Cynosure's past events!"
          tag="Gallery"
        />

        <div className="relative mt-10">
          <div className="relative z-1 mb-5 h-[39rem] max-sm:h-[70vh] overflow-hidden rounded-3xl border border-n-1/10 lg:h-[46rem]">
            {/* Background Glow Effects */}
            <div className="absolute top-0 -left-[40%] w-[80%] aspect-square rounded-full bg-[#1F4AF6]/20 blur-[120px] pointer-events-none" />
            <div className="absolute top-0 -right-[40%] w-[80%] aspect-square rounded-full bg-[#8F46FF]/20 blur-[120px] pointer-events-none" />

            {/* Slider Container */}
            <div className="relative h-full max-sm:h-[70vh]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={slides[currentSlide].image}
                      alt={slides[currentSlide].title}
                      fill
                      className="object-cover"
                      onLoadingComplete={() => setLoading(false)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-n-8/80 via-n-8/20 to-transparent" />

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 max-sm:mb-10">
                      <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="h3 text-white mb-4"
                      >
                        {slides[currentSlide].title}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="body-2 text-n-3"
                      >
                        {slides[currentSlide].description}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="absolute right-8 bottom-8 flex items-center gap-3 z-10">
                <button
                  onClick={prevSlide}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-n-1/10 backdrop-blur-sm hover:bg-n-1/20 transition-colors"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-n-1/10 backdrop-blur-sm hover:bg-n-1/20 transition-colors"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 6L15 12L9 18"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Slide Indicators */}
              <div className="absolute bottom-8 left-8 flex items-center gap-2 z-10">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index ? "w-8 bg-white" : "bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Services;
