"use client";

import React from "react";
import Section from "@/components/layout/section";
import Heading from "../../atoms/heading";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const Benefits = () => {
  const eventCards = [
    {
      id: "tech",
      title: "Technical Events",
      subTitle: "Competitions & Workshops",
      description:
        "Dive into coding challenges, hackathons, and innovative technical competitions that push your limits",
      image: "/assets/gradient.png",
      duration: "Day 1",
      gradient: "from-[#1F4AF6] to-[#1BC7FB]",
    },
    {
      id: "nontech",
      title: "Non-Tech Events",
      subTitle: "Arts & Entertainment",
      description:
        "Experience art, music, dance, and creative competitions that showcase your artistic talents",
      image: "/assets/gradient.png",
      duration: "Day 2",
      gradient: "from-[#8F46FF] to-[#FF6B6B]",
    },
  ];

  return (
    <Section className="overflow-hidden">
      <div className="container relative z-2">
        <div className="relative">
          {/* Background Glow Effects */}
          <div className="absolute top-0 -left-[40%] w-[80%] aspect-square rounded-full bg-[#110c1d]/20 blur-[120px]" />
          <div className="absolute top-0 -right-[40%] w-[80%] aspect-square rounded-full bg-[#110c1d]/20 blur-[120px]" />

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
                className="group"
              >
                <div
                  className={`p-[1px] rounded-[20px] bg-gradient-to-r ${card.gradient} hover:p-[2px] transition-all duration-300`}
                >
                  <div className="relative bg-n-8 rounded-[20px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                    {/* Subtle Border Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-n-1/5 to-transparent pointer-events-none" />

                    {/* Content Container with Flex Layout */}
                    <div className="flex flex-col sm:flex-row sm:items-center p-5">
                      {/* Image Container */}
                      <div className="relative w-full sm:w-[120px] h-[140px] sm:h-[120px] rounded-2xl overflow-hidden mb-4 sm:mb-0">
                        <Image
                          src={card.image}
                          alt={card.title}
                          fill
                          className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-110"
                        />
                        {/* Image Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-n-8/80 to-transparent" />
                      </div>

                      {/* Text Content */}
                      <div className="flex-1 sm:ml-5 flex flex-col justify-between min-h-[120px]">
                        <div>
                          {/* Duration Badge */}
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-n-1/10 backdrop-blur-sm text-n-1 text-xs font-medium mb-2">
                            <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M12 8V12L15 15"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            {card.duration}
                          </div>

                          {/* Title and Subtitle */}
                          <h3 className="text-xl font-semibold mb-1 text-start group-hover:text-white/90 transition-colors">
                            {card.title}
                          </h3>
                          <p className="text-sm text-n-4 mb-2">{card.subTitle}</p>
                        </div>

                        <div>
                          {/* Description */}
                          <p className="text-sm text-n-4/80 mb-3 line-clamp-1 group-hover:text-n-4/90 transition-colors">
                            {card.description}
                          </p>

                          {/* CTA Button */}
                          <Link
                            href={`/even`}
                            className={`inline-flex items-center justify-center w-full sm:w-auto px-6 py-2 rounded-full bg-gradient-to-r ${card.gradient} hover:shadow-lg hover:shadow-n-1/10 text-white font-medium transition-all duration-200 text-sm group-hover:scale-[1.02]`}
                          >
                            Explore
                            <svg
                              className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M4 12h16m-4-4l4 4-4 4"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Link>
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
