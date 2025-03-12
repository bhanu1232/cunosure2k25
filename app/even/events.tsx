"use client";
import React from "react";
import Section from "@/components/layout/section";
import Heading from "../../components/atoms/heading";
import { events } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const Benefits = () => {
  return (
    <Section className="overflow-hidden max-sm:p-0 bg-transparent">
      <div className="container relative z-2 max-sm:px-0">
        <div className="relative max-sm:py-0">
          <div className="mt-1 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-[1200px] mx-auto px-4 max-sm:px-0">
            {events.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="p-[1px] rounded-[20px] bg-gradient-to-r from-[#1F4AF6] to-[#1BC7FB] hover:p-[2px] transition-all duration-300">
                  <div className="relative bg-n-8 rounded-[20px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col">
                      {/* Image Container */}
                      <div className="relative h-[160px] overflow-hidden">
                        <Image
                          src={item.backgroundUrl || "/assets/placeholder.jpg"}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-110"
                        />
                        {/* Image Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-n-8/90 to-transparent" />

                        {/* Prize Badge - Positioned over image */}
                        <div className="absolute bottom-4 left-4 inline-flex items-center px-3 py-1 rounded-full bg-n-1/10 backdrop-blur-sm text-n-1 text-sm font-medium">
                          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M12 6v12m-8-8h16"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                          ₹{item.prize}
                        </div>
                      </div>

                      {/* Content Container */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          {/* Title */}
                          <h3 className="text-lg font-semibold group-hover:text-white/90 transition-colors line-clamp-1">
                            {item.title}
                          </h3>
                        </div>

                        {/* Event Details Grid */}
                        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                          <div className="flex items-center text-n-1/80">
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M8 2v3M16 2v3M3.5 9.09h17M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeMiterlimit="10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            {item.date || "Date TBA"}
                          </div>
                          <div className="flex items-center text-n-1/80">
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M12 13.43a3.12 3.12 0 1 0 0-6.24 3.12 3.12 0 0 0 0 6.24Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                              <path
                                d="M3.62 8.49c1.97-8.66 14.8-8.65 16.76.01 1.15 5.08-2.01 9.38-4.78 12.04a5.193 5.193 0 0 1-7.21 0c-2.76-2.66-5.92-6.97-4.77-12.05Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                            </svg>
                            {item.venue || "Venue TBA"}
                          </div>
                          <div className="flex items-center text-n-1/80 col-span-2">
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M18 7.16a.605.605 0 0 0-.19 0 2.573 2.573 0 0 1-2.48-2.58c0-1.42 1.16-2.58 2.58-2.58 1.42 0 2.58 1.16 2.58 2.58 0 1.4-1.12 2.54-2.49 2.58Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            {item.teamSize || "Individual"}
                          </div>
                          <div className="flex items-center text-n-1/80 col-span-2">
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M18 7.16a.605.605 0 0 0-.19 0 2.573 2.573 0 0 1-2.48-2.58c0-1.42 1.16-2.58 2.58-2.58 1.42 0 2.58 1.16 2.58 2.58 0 1.4-1.12 2.54-2.49 2.58Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            {item.spot || "Spot Registration Available"}
                          </div>
                        </div>

                        {/* CTA Button */}
                        <Link
                          href={`/even/${item.id}`}
                          className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-full bg-gradient-to-r from-[#1F4AF6] to-[#1BC7FB] hover:shadow-lg hover:shadow-n-1/10 text-white font-medium transition-all duration-200 text-sm group-hover:scale-[1.02]"
                        >
                          View Details
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
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Benefits;
