"use client";

import React, { useRef, useEffect, useState } from "react";
import Section from "../../layout/section";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { images } from "@/constants";
import Button from "../../atoms/button";
import { BackgroundCircles, BottomLine, Gradient } from "../../design/hero";
import { motion } from "framer-motion";

const Hero = () => {
  const parallaxRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set your event date here
    const eventDate = new Date("2025-03-27T00:00:00");

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

  return (
    <Section
      className={cn("pt-[12rem] -mt-[5.25rem] relative overflow-hidden bg-[#100C1B]")}
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/assets/grid.png"
          alt="Grid Background"
          fill
          className="object-cover opacity-[0.04] bg-repeat"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#100C1B]/50 via-[#100C1B]/80 to-[#100C1B] pointer-events-none"></div>
      </div>

      <div className="container relative" ref={parallaxRef}>
        <div className="relative z-1 mx-auto mb-16 max-w-[62rem] text-center md:mb-20 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative inline-block mb-6"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] rounded-full opacity-20 blur-xl" />
            <div className="px-6 py-2 rounded-full border border-n-1/10 bg-n-1/5 backdrop-blur-sm">
              <span className="text-base md:text-lg font-medium bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] bg-clip-text text-transparent">
                Technical Fest 2025
              </span>
            </div>
          </motion.div>

          <h1 className="relative mb-6 text-center font-bold">
            <div className="relative inline-block">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="animate-typing inline-block bg-gradient-to-r from-[#8E2DE2] via-[#4A00E0] to-[#8E2DE2] bg-clip-text text-5xl text-transparent md:text-7xl"
              >
                CYNOSURE
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="animate-typing-delayed inline-block bg-gradient-to-r from-[#FF512F] to-[#DD2476] bg-clip-text text-4xl text-transparent md:text-6xl"
              >
                2025
              </motion.span>
              <Image
                src={images.curve}
                className="absolute left-0 top-full w-full animate-fade-up xl:-mt-2"
                width={624}
                height={28}
                alt="curve"
              />
            </div>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={cn("body-1 mx-auto mb-6 max-w-3xl animate-fade-up text-n-2 lg:mb-8")}
          >
            Unleash the power of AI within Brainwave. Upgrade your productivity with Brainwave, the
            open AI chat app.
          </motion.p>

          {/* Countdown Timer with Enhanced Design */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#8E2DE2]/20 to-[#4A00E0]/20 blur-3xl" />
            <div className="flex justify-center gap-4 md:gap-8 relative">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-n-8/80 backdrop-blur-sm border border-n-1/10 flex flex-col items-center justify-center p-2 relative">
                    <div className="relative">
                      <motion.span
                        key={item.value}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        className="block text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] bg-clip-text text-transparent"
                      >
                        {item.value.toString().padStart(2, "0")}
                      </motion.span>
                    </div>
                    <span className="text-xs md:text-sm text-n-4 mt-1">{item.label}</span>
                  </div>
                  {index < 3 && (
                    <div className="absolute top-1/2 -right-2 md:-right-4 transform -translate-y-1/2">
                      <span className="block w-1 h-1 rounded-full bg-n-1/50 mb-1" />
                      <span className="block w-1 h-1 rounded-full bg-n-1/50" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Updated Register Now Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative inline-block"
          >
            <a
              href="/passes"
              className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white rounded-xl"
            >
              <button className="group relative px-10 py-5 rounded-lg bg-gradient-to-br from-[#e8675f] via-amber-500 to-[#e89b46] text-black font-bold tracking-wider uppercase text-sm hover:from-yellow-500 hover:via-amber-600 hover:to-yellow-700  duration-300 ease-out  active:scale-90 overflow-hidden before:absolute before:inset-0 before:rounded-lg ">
                <span className="flex text-white items-center gap-2 relative z-10">
                  <Image
                    src={"assets/crown.png"}
                    alt="Arrow Right"
                    width={20}
                    height={20}
                    className="animate-bounce scale-110 mr-4"
                  />
                  Register Now
                </span>
                <div className="absolute inset-0 rounded-lg opacity-50 group-hover:opacity-80 transition-opacity duration-300 bg-gradient-to-tl from-amber-200/40 via-transparent to-transparent"></div>
                <div className="absolute -left-full top-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-[200%] transition-transform duration-700 ease-out"></div>
              </button>
            </a>
          </motion.div>
        </div>

        <div className="relative mx-auto max-w-[1400px]">
          {/* Main Image Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative z-1 group"
          >
            {/* Glass Container */}
            <div className="relative rounded-2xl bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm border border-white/10 p-2">
              {/* Image Wrapper */}
              <div className="relative rounded-xl overflow-hidden">
                {/* Image */}
                <div className="relative aspect-[2/1] sm:aspect-[2.2/1] md:aspect-[2.5/1] lg:aspect-[3/1] overflow-hidden group">
                  <Image
                    src={images.banner}
                    fill
                    className="w-full h-full object-cover object-center transform scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
                    alt="Cynosure 2025"
                    priority
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <style jsx>{`
          @keyframes gradient-shift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          .animate-gradient-shift {
            animation: gradient-shift 8s ease infinite;
            background-size: 200% 200%;
          }
        `}</style>

        <BottomLine />
      </div>
    </Section>
  );
};

export default Hero;
