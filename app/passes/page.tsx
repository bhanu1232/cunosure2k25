"use client";

import React from "react";
import Section from "@/components/layout/section";
import Heading from "@/components/atoms/heading";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/navbar";
const PassesPage = () => {
  const passes = [
    {
      id: "tech",
      name: "Technical Pass",
      price: "299",
      imageUrl: "/images/tech.jpg",
      description: "Access to all technical events and workshops",
      features: [
        "All Technical Competitions",
        "Workshop Access",
        "Certificate of Participation",
        "Tech Swag Kit",
      ],
      gradient: "from-[#1F4AF6] to-[#1BC7FB]",
      popular: false,
    },
    {
      id: "all",
      name: "All Access Pass",
      price: "499",
      imageUrl: "/images/all.jpg",
      description: "Full access to all events and premium benefits",
      features: [
        "All Technical & Cultural Events",
        "Priority Registration",
        "Premium Swag Kit",
        "VIP Lounge Access",
      ],
      gradient: "from-[#8E2DE2] to-[#4A00E0]",
      popular: true,
    },
    {
      id: "cultural",
      name: "Cultural Pass",
      price: "299",
      imageUrl: "/images/cultural.jpg",
      description: "Access to all cultural and fun events",
      features: [
        "All Cultural Events",
        "Entertainment Shows",
        "Certificate of Participation",
        "Cultural Swag Kit",
      ],
      gradient: "from-[#8F46FF] to-[#FF6B6B]",
      popular: false,
    },
  ];

  return (
    <>
      {/* Navbar */}
      <Navbar />
      <Section className="overflow-hidden pt-32">
        <div className="container relative z-2">
          <div className="relative">
            {/* Background Glow Effects */}
            <div className="absolute top-0 -left-[40%] w-[80%] aspect-square rounded-full bg-[#1F4AF6]/20 blur-[120px] pointer-events-none" />
            <div className="absolute top-0 -right-[40%] w-[80%] aspect-square rounded-full bg-[#8F46FF]/20 blur-[120px] pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative text-center mb-12"
            >
              <Heading
                title="Choose Your Pass"
                text="Select the perfect pass that suits your interests and get ready for an amazing experience"
                tag="Event Passes"
                className="md:max-w-md lg:max-w-2xl mx-auto"
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
              {passes.map((pass, index) => (
                <motion.div
                  key={pass.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative bg-n-8 rounded-[20px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                    {/* Subtle Border Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-n-1/5 to-transparent pointer-events-none" />

                    {/* Image Container */}
                    <div className="relative h-[200px] overflow-hidden">
                      <Image
                        src={pass.imageUrl || "/images/placeholder.jpg"}
                        alt={pass.name}
                        fill
                        className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
                      />
                      {/* Image Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-n-8/80 to-transparent" />

                      {/* Price Badge */}
                      <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-n-1/10 backdrop-blur-sm">
                        <div className="flex items-center">
                          <span className="text-white text-sm font-medium">₹{pass.price}</span>
                        </div>
                      </div>

                      {pass.popular && (
                        <div className="absolute top-4 left-4">
                          <div className="bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] text-white text-sm font-medium px-4 py-1 rounded-full">
                            Popular
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content Container */}
                    <div className="p-6">
                      <h3 className="h4 mb-3 text-start group-hover:text-white/90 transition-colors">
                        {pass.name}
                      </h3>
                      <p className="body-2 text-n-4/80 mb-4 line-clamp-2 text-start group-hover:text-n-4/90 transition-colors">
                        {pass.description}
                      </p>

                      {/* Features List */}
                      <div className="space-y-2 mb-6">
                        {pass.features.map((feature, i) => (
                          <div key={i} className="flex items-center text-sm text-n-4">
                            <svg className="w-4 h-4 mr-2 text-n-1" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M9 12l2 2 4-4"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                            </svg>
                            {feature}
                          </div>
                        ))}
                      </div>

                      <button
                        className={`w-full rounded-full bg-gradient-to-r ${pass.gradient} py-3 px-6 text-white font-medium hover:shadow-xl hover:shadow-n-1/10 transition-all duration-200 group-hover:scale-[1.02] flex items-center justify-center`}
                      >
                        Get Started
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
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default PassesPage;
