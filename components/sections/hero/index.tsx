"use client";

import React, { useRef } from "react";
import Section from "../../layout/section";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { images } from "@/constants";
import Button from "../../atoms/button";
import { BackgroundCircles, BottomLine, Gradient } from "../../design/hero";
type Props = {};

const Hero = (props: Props) => {
  const parallaxRef = useRef(null);
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
          <Button href="#pricing" white className="animate-fade-up">
            Register Now
          </Button>
        </div>

        <div className={cn("relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24")}>
          <div className={cn("relative z-1 rounded-2xl p-0.5 bg-conic-gradient")}>
            <div className={cn("relative bg-n-8 rounded-[1rem]")}>
              <div className={cn("h-[1.4rem] bg-n-10 rounded-t-[0.9rem]")} />
              <div
                className={cn(
                  " rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490]"
                )}
              >
                <Image
                  src={images.robot}
                  width={1024}
                  height={490}
                  className="w-full translate-y-[8%] scale-[1.7] transition-transform duration-700 hover:scale-[1.8] md:translate-y-[-10%] md:scale-100 md:hover:scale-105 lg:translate-y-[-23%]"
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
