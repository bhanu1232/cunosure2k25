"use client";

import React, { Suspense } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Building2, Clock, Users2, Utensils, Info, Calendar, CheckCircle2 } from "lucide-react";

// Dynamically import Navbar with no SSR to avoid hydration issues
const Navbar = dynamic(() => import("@/components/layout/navbar"), {
  ssr: false,
});

const accommodationDetails = [
  {
    title: "Availability",
    icon: Users2,
    details: [""],
    gradient: "from-[#FF6B6B] to-[#FF8E53]",
    description: "First come, first serve basis. Book early to secure your spot!",
  },
  {
    title: "Fee Structure",
    icon: Utensils,
    details: ["₹150/Night", "Includes 27nd Night Lunch", "and 28rd Afternoon Breakfast"],
    gradient: "from-[#4A00E0] to-[#8E2DE2]",
    description: "All-inclusive package with meals",
  },
  {
    title: "Amenities",
    icon: Info,
    details: ["Basic amenities provided;", "contact the accommodation", "desk for details."],
    gradient: "from-[#1BC7FB] to-[#1F4AF6]",
    description: "Comfortable stay with essential facilities",
  },
];

const importantPoints = [
  "Separate hostel rooms for boys and girls",
  "Basic amenities for bathing available",
  "Bring your own bedsheets",
  "Available on March 22, 2025 night",
  "Includes dinner and next day breakfast",
  "Must register in advance",
  "Collect pass on March 22 morning",
  "Only for registered Cynosure participants",
  "You are responsible for your belongings",
];

const AccommodationPage = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#100C1B]">
      <Suspense fallback={<div className="h-20 bg-[#100C1B]" />}>
        <Navbar />
      </Suspense>

      {/* Grid Background */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/assets/grid.png"
          alt="Grid Background"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#100C1B] via-[#100C1B]/90 to-[#100C1B]" />
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#4A00E0]/20 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#1BC7FB]/20 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-7xl mt-5 relative">
        {/* Enhanced Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 md:mb-16 relative pt-20 md:pt-24"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-20 bg-gradient-to-b from-transparent via-[#4A00E0] to-transparent opacity-40" />
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#4A00E0] shadow-lg shadow-[#4A00E0]/50" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#4A00E0] to-[#1BC7FB] rounded-full opacity-20 blur-xl" />
            <p className="px-8 py-3 rounded-full border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm relative">
              <span className="text-base md:text-lg font-medium bg-gradient-to-r from-[#4A00E0] to-[#1BC7FB] bg-clip-text text-transparent">
                Event Accommodation
              </span>
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent mb-6 relative"
          >
            Stay Information
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#4A00E0] to-transparent opacity-40" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Comfortable and convenient accommodation for Cynosure participants
          </motion.p>

          {/* Decorative Corner Elements */}
          <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-[#4A00E0]/20 rounded-tl-3xl" />
          <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-[#4A00E0]/20 rounded-tr-3xl" />
          <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-[#4A00E0]/20 rounded-bl-3xl" />
          <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-[#4A00E0]/20 rounded-br-3xl" />
        </motion.div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {accommodationDetails.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="group transform hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="relative h-full rounded-[30px] p-[1px] bg-gradient-to-b from-white/5 to-transparent">
                <div className="relative h-full rounded-[30px] bg-n-8/80 backdrop-blur-sm border border-white/5 overflow-hidden">
                  <div className="relative p-6 md:p-8">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-5`}
                    />
                    <div className="relative flex items-center gap-4 mb-6">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${item.gradient}`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-white">{item.title}</h2>
                    </div>
                    <div className="space-y-3">
                      {item.details.map((detail, idx) => (
                        <p
                          key={idx}
                          className="text-white/90 text-base md:text-lg flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                          {detail}
                        </p>
                      ))}
                      <p className="text-white/60 text-sm md:text-base mt-4 italic">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Important Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative rounded-[30px] p-[1px] bg-gradient-to-b from-white/5 to-transparent mb-12"
        >
          <div className="relative rounded-[30px] bg-n-8/80 backdrop-blur-sm border border-white/5 overflow-hidden p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <Info className="w-6 h-6 md:w-8 md:h-8 text-[#4A00E0]" />
              Important Guidelines
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {importantPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#4A00E0] mt-1 flex-shrink-0" />
                  <p className="text-white/80 text-base md:text-lg">{point}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/90 text-base md:text-lg font-medium">
                For any queries, please contact the accommodation desk before registering.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default AccommodationPage;
