"use client";
import React from "react";
import Section from "@/components/layout/section";
import Heading from "../../components/atoms/heading";
import { fun } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const Benefits1 = () => {
  return (
    <Section className="overflow-hidden">
      <div className="container relative z-2 max-sm:px-0">
        <div className="relative">
          {/* Background Glow Effects */}

          <div className="mt-1 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-[1200px] mx-auto px-4 max-sm:px-0">
            {fun.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative bg-n-8 rounded-[20px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Subtle Border Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-n-1/5 to-transparent pointer-events-none" />

                  {/* Image Container */}
                  <div className="relative h-[240px] overflow-hidden">
                    <Image
                      src={item.imageUrl || "/assets/placeholder.jpg"}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
                    />
                    {/* Image Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-n-8/80 to-transparent" />
                  </div>

                  {/* Content Container */}
                  <div className="p-8">
                    {/* Prize Badge */}
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-n-1/10 backdrop-blur-sm text-n-1 text-sm font-medium mb-6">
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 6v12m-8-8h16"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      Prize Pool: ₹{item.prize}
                    </div>

                    {/* Title and Description */}
                    <h3 className="h4 mb-4 text-start group-hover:text-white/90 transition-colors">
                      {item.title}
                    </h3>
                    <p className="body-2 text-n-4/80 mb-8 line-clamp-3 text-start group-hover:text-n-4/90 transition-colors">
                      {item.text}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-3 mb-8">
                      {/* Date & Time */}
                      <div className="flex items-center text-n-1/80">
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M8 2v3M16 2v3M3.5 9.09h17M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-sm">{item.date || "Date TBA"}</span>
                      </div>
                      {/* Location */}
                      <div className="flex items-center text-n-1/80">
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none">
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
                        <span className="text-sm">{item.venue || "Venue TBA"}</span>
                      </div>
                      {/* Team Size */}
                      <div className="flex items-center text-n-1/80">
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M18 7.16a.605.605 0 0 0-.19 0 2.573 2.573 0 0 1-2.48-2.58c0-1.42 1.16-2.58 2.58-2.58 1.42 0 2.58 1.16 2.58 2.58 0 1.4-1.12 2.54-2.49 2.58ZM16.97 14.44c1.37.23 2.88.11 3.98-.37 1.39-.62 1.39-1.64 0-2.26-1.11-.48-2.63-.6-4.01-.36M5.97 7.16c.06-.01.13-.01.19 0a2.573 2.573 0 0 0 2.48-2.58C8.64 3.16 7.48 2 6.06 2 4.64 2 3.48 3.16 3.48 4.58c0 1.4 1.12 2.54 2.49 2.58ZM7 14.44c-1.37.23-2.88.11-3.98-.37-1.39-.62-1.39-1.64 0-2.26 1.11-.48 2.63-.6 4.01-.36M12 14.63a.605.605 0 0 0-.19 0 2.573 2.573 0 0 1-2.48-2.58c0-1.42 1.16-2.58 2.58-2.58 1.42 0 2.58 1.16 2.58 2.58-.01 1.4-1.13 2.54-2.49 2.58ZM9.09 17.78c-1.39.62-1.39 1.64 0 2.26 1.56.69 4.11.69 5.67 0 1.39-.62 1.39-1.64 0-2.26-1.56-.69-4.11-.69-5.67 0Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-sm">{item.teamSize || "Individual"}</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/even/fun/${item.id}`}
                        className="inline-flex items-center justify-center w-full px-8 py-3 rounded-full bg-gradient-to-r from-[#8F46FF] to-[#FF6B6B] hover:shadow-xl hover:shadow-n-1/10 text-white font-medium transition-all duration-200 group-hover:scale-[1.02]"
                      >
                        View Details
                        <svg
                          className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
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
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Benefits1;
