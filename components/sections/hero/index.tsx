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
      className={cn("pt-[12rem] -mt-[5.25rem] relative overflow-hidden")}
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      {/* Grid Background */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/assets/grid.png"
          alt="Grid Background"
          fill
          className="object-cover opacity-10"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-n-8 via-n-8/90 to-n-8" />
      </div>

      {/* Animated Background Circles */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#8E2DE2]/20 rounded-full blur-[120px] opacity-20 animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#4A00E0]/20 rounded-full blur-[120px] opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
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

          <Button href="/passes" white className="animate-fade-up relative group overflow-hidden">
            <span className="relative z-10">Register Now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </div>

        <div className="relative mx-auto max-w-[1200px] overflow-hidden">
          {/* Main Image Container */}
          <div className="relative z-1 overflow-hidden">
            {/* Gradient Border */}
            <div className="relative p-1 rounded-[2rem] bg-gradient-to-r from-[#8E2DE2] via-[#4A00E0] to-[#8E2DE2]">
              {/* Image Wrapper */}
              <div className="relative bg-n-8 rounded-[1.9rem] overflow-hidden backdrop-blur-sm border border-white/5">
                {/* Top Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent h-[20%] z-10"></div>

                {/* Bottom Gradient */}
                <div className="absolute bottom-0 inset-x-0 h-[40%] bg-gradient-to-t from-n-8 to-transparent z-10"></div>

                {/* Image */}
                <div className="relative aspect-[16/9] md:aspect-[2/1] lg:aspect-[2.5/1] overflow-hidden group">
                  <Image
                    src={images.banner}
                    width={1920}
                    height={1080}
                    className="w-full h-full object-cover object-center transform scale-110 group-hover:scale-105 transition-transform duration-700 ease-out"
                    alt="Cynosure 2025"
                    priority
                  />

                  {/* Animated Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-[200%] -translate-x-full animate-shine"></div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
                  <div className="w-2 h-2 rounded-full bg-[#8E2DE2] animate-pulse"></div>
                  <div
                    className="w-2 h-2 rounded-full bg-[#4A00E0] animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-[#8E2DE2] animate-pulse"
                    style={{ animationDelay: "1s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <BottomLine />
      </div>
    </Section>
  );
};

export default Hero;
