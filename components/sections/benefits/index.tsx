"use client";

import React, { useState } from "react";
import Section from "@/components/layout/section";
import Heading from "../../atoms/heading";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/atoms/button";

const Benefits = () => {
  const eventCards = [
    {
      id: "tech",
      title: "Technical Events",
      subTitle: "Competitions & Workshops",
      description:
        "Dive into coding challenges, hackathons, and innovative technical competitions that push your limits",
      duration: "2 Days",
      gradient: "from-[#1F4AF6] via-[#147CE5] to-[#1BC7FB]",
      overlayText: "TECH",
    },
    {
      id: "nontech",
      title: "Non-Tech Events",
      subTitle: "Arts & Entertainment",
      description:
        "Experience art, music, dance, and creative competitions that showcase your artistic talents",
      duration: "3 Days",
      gradient: "from-[#FF6B6B] via-[#FF8E53] to-[#FFB547]",
      overlayText: "NON-TECH",
    },
  ];

  return (
    <Section className="overflow-hidden">
      <div className="container relative z-2">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <Heading
              className="md:max-w-md lg:max-w-2xl mx-auto mb-6"
              title="Explore Events"
              tag="Discover Events"
            />
          </motion.div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 max-w-[1200px] mx-auto px-4 max-sm:px-0">
            {eventCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="group cursor-pointer"
              >
                <div className="relative rounded-[20px] p-1 overflow-hidden bg-n-8/50">
                  {/* Gradient Border */}
                  <div className={`absolute inset-0 bg-gradient-to-r  border-2  opacity-40`} />

                  <div className="relative rounded-[18px] bg-n-8 overflow-hidden">
                    {/* Main Content Area */}
                    <div className="flex flex-col h-full">
                      {/* Gradient Background with Text */}
                      <div className="relative h-[200px] overflow-hidden">
                        {/* Animated Gradient Background */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-90`}
                        >
                          <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-20 mix-blend-overlay"></div>
                        </div>

                        {/* Floating Elements - Always Visible */}
                        <div className="absolute inset-0">
                          <div className="absolute w-32 h-32 rounded-full bg-white/10 blur-2xl -top-16 -right-16 animate-pulse"></div>
                          <div
                            className="absolute w-32 h-32 rounded-full bg-white/10 blur-2xl -bottom-16 -left-16 animate-pulse"
                            style={{ animationDelay: "1s" }}
                          ></div>
                        </div>

                        {/* Center Text */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <h2 className="text-5xl max-sm:text-3xl font-bold text-white tracking-wider mb-4">
                              {card.overlayText}
                            </h2>
                            <div className="flex items-center justify-center gap-2">
                              <span className="h-[2px] w-10 bg-white/30"></span>
                              <p className="text-white/90 text-sm font-medium uppercase tracking-wider">
                                {card.subTitle}
                              </p>
                              <span className="h-[2px] w-10 bg-white/30"></span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                        </div>

                        <p className="text-white/80 text-sm leading-relaxed mb-6">
                          {card.description}
                        </p>

                        {/* Button */}
                        <div className="relative">
                          <Button href="/even" white className="animate-fade-up w-full">
                            Explore Events
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Benefits;
