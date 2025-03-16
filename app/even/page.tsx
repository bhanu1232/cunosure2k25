"use client";
import { useState } from "react";
import ButtonGradient from "@/components/svg/button-gradient";
import { cn } from "@/lib/utils";
import Benefits from "./events"; // Import the Benefits component
import Benefits1 from "./nontech";
import Esports from "./esports"; // Import the Esports component
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/navbar";
export default function Even() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filterButtons = [
    { id: "all", label: "All Events" },
    { id: "tech", label: "Tech Events" },
    { id: "nontech", label: "Non-Tech Events" },
    { id: "esports", label: "Esports" },
  ];

  return (
    <main className="min-h-screen bg-n-8">
      {/* Add the custom Navbar */}
      <Navbar />
      {/* Main Content */}
      <div className={cn("overflow-hidden pt-[4.75rem] lg:pt-[5.25rem]")}>
        <ButtonGradient />

        {/* Hero Section */}
        <div className="container mx-auto px-4 py-8 max-sm:pb-2 ">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-4xl max-sm:text-2xl font-bold text-white mb-4 md:text-5xl lg:text-6xl"
          >
            Explore Our Events
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center text-n-3 mb-8 max-w-2xl mx-auto max-sm:text-sm"
          >
            Discover amazing technical, non-technical, and esports events that await you
          </motion.p>
        </div>

        {/* Filter Buttons */}
        <div className="container mx-auto px-4 mb-12">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {filterButtons.map((button) => (
              <motion.button
                key={button.id}
                onClick={() => setActiveFilter(button.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative rounded-xl px-6 py-3 font-semibold transition-all duration-300 ease-out
                  ${
                    activeFilter === button.id
                      ? "bg-gradient-to-r from-cyan-500 to-cyan-400 text-white shadow-lg shadow-cyan-500/25"
                      : "bg-n-7 text-n-3 hover:bg-n-6"
                  } min-w-[140px] sm:min-w-[160px]`}
              >
                {activeFilter === button.id && (
                  <motion.span
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{button.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto px-4"
          >
            {(activeFilter === "all" || activeFilter === "tech") && <Benefits />}
            {(activeFilter === "all" || activeFilter === "nontech") && <Benefits1 />}
            {(activeFilter === "all" || activeFilter === "esports") && <Esports />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
