"use client";

import React, { useState } from "react";
import Section from "@/components/layout/section";
import Heading from "../../atoms/heading";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import PaymentModal from "@/components/payment/PaymentModal";

const Benefits = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const eventCards = [
    {
      id: "tech",
      title: "Technical Events",
      subTitle: "Competitions & Workshops",
      description:
        "Dive into coding challenges, hackathons, and innovative technical competitions that push your limits",
      image: "/assets/gradient.png",
      duration: "2 Days",
      gradient: "from-[#1F4AF6] to-[#1BC7FB]",
    },
    {
      id: "nontech",
      title: "Non-Tech Events",
      subTitle: "Arts & Entertainment",
      description:
        "Experience art, music, dance, and creative competitions that showcase your artistic talents",
      image: "/assets/gradient.png",
      duration: "3 Days",
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
                    <div className="flex flex-col">
                      {/* Image Container */}
                      <div className="relative h-[160px] overflow-hidden">
                        <Image
                          src={card.image}
                          alt={card.title}
                          fill
                          className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-110"
                        />
                        {/* Image Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-n-8/90 to-transparent" />
                      </div>

                      {/* Content Container */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          {/* Title */}
                          <h3 className="text-lg font-semibold group-hover:text-white/90 transition-colors line-clamp-1">
                            {card.title}
                          </h3>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-n-4/80 mb-4 line-clamp-2 group-hover:text-n-4/90 transition-colors">
                          {card.description}
                        </p>

                        {/* CTA Button */}
                        <button
                          onClick={() => setIsPaymentModalOpen(true)}
                          className={`inline-flex items-center justify-center w-full px-4 py-2.5 rounded-full bg-gradient-to-r ${card.gradient} hover:shadow-lg hover:shadow-n-1/10 text-white font-medium transition-all duration-200 text-sm group-hover:scale-[1.02]`}
                        >
                          Get Started
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
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} />
    </Section>
  );
};

export default Benefits;
