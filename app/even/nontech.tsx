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

                    {/* CTA Button */}
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/even/fun/${item.id}`}
                        className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-gradient-to-r from-[#8F46FF] to-[#FF6B6B] hover:shadow-xl hover:shadow-n-1/10 text-white font-medium transition-all duration-200 group-hover:px-10"
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
