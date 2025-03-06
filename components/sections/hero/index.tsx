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
      className={cn("pt-[12rem] -mt-[5.25rem]")}
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      <div className="container relative" ref={parallaxRef}>
        <div className="relative z-1 mx-auto mb-16 max-w-[62rem] text-center md:mb-20 lg:mb-24">
          <h1 className="relative mb-6 text-center font-bold">
            <div className="relative inline-block">
              <span className="animate-typing inline-block bg-gradient-to-r from-[#8E2DE2] via-[#4A00E0] to-[#8E2DE2] bg-clip-text text-5xl text-transparent md:text-7xl">
                CYNOSURE
              </span>
              <br />
              <span className="animate-typing-delayed inline-block bg-gradient-to-r from-[#FF512F] to-[#DD2476] bg-clip-text text-4xl text-transparent md:text-6xl">
                2025
              </span>
              <Image
                src={images.curve}
                className="absolute left-0 top-full w-full animate-fade-up xl:-mt-2"
                width={624}
                height={28}
                alt="curve"
              />
            </div>
          </h1>
          <p className={cn("body-1 mx-auto mb-6 max-w-3xl animate-fade-up text-n-2 lg:mb-8")}>
            Unleash the power of AI within Brainwave. Upgrade your productivity with Brainwave, the
            open AI chat app.
          </p>

          {/* Countdown Timer */}
          <div className="mb-8">
            <div className="flex justify-center gap-4 md:gap-8">
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
                  className="relative"
                >
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-n-8/80 backdrop-blur-sm border border-n-1/10 flex flex-col items-center justify-center p-2">
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

          <Button href="#pricing" white className="animate-fade-up">
            Register Now
          </Button>
        </div>

        <div className={cn("relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24 overflow-hidden")}>
          <div className={cn("relative z-1 rounded-2xl p-0.5 bg-conic-gradient")}>
            <div className={cn("relative bg-n-8 rounded-[1rem]")}>
              <div className={cn(" bg-n-10 rounded-t-[0.9rem]")} />
              <div
                className={cn(
                  "max-sm:h-full  rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490]"
                )}
              >
                <Image
                  src={images.robot}
                  width={1024}
                  height={490}
                  className="w-full rounded-md translate-y-[8%] scale-[1.7] transition-transform duration-700 hover:scale-[1.8] md:translate-y-[-10%] md:scale-100 md:hover:scale-105 lg:translate-y-[-23%]"
                  alt="AI"
                />
              </div>
            </div>

            <Gradient />
          </div>
          <div className="absolute overflow-hidden h-[160vh] max-sm:h-[110vh] left-1/2 top-[-54%] w-[234%] -translate-x-1/2 md:top-[-46%] md:w-[138%] lg:top-[-104%] max-sm:top-0">
            <Image
              src={images.heroBackground}
              width={1440}
              height={1080}
              className="w-full"
              alt="hero"
            />
          </div>

          <BackgroundCircles parallaxRef={parallaxRef} />
        </div>
      </div>
      <BottomLine />
    </Section>
  );
};

export default Hero;
