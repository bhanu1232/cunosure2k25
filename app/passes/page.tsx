"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import PaymentModal from "@/components/payment/PaymentModal";
import Navbar from "@/components/layout/navbar";
import Image from "next/image";
import { CalendarDays, Users, MapPin } from "lucide-react";

interface Pass {
  id: "bronze" | "silver" | "gold";
  name: string;
  price: number;
  date: string;
  venue: string;
  teamSize: string;
  gradient: string;
  features: string[];
}

interface PassCardProps {
  pass: Pass;
  onSelect: (id: Pass["id"]) => void;
}

const PASSES: Pass[] = [
  {
    id: "bronze",
    name: "Bronze Pass",
    price: 350,
    date: "Participation certificate",
    venue: "Access for all events",
    teamSize: "1 person",
    gradient: "from-[#B87333] via-[#DBA77C] to-[#B87333]",
    features: ["Access to Basic Events", "Digital Certificate", "Event Kit"],
  },
  {
    id: "silver",
    name: "Silver Pass",
    price: 450,
    date: "Participation certificate",
    venue: "Access for all events",
    teamSize: "1 person",
    gradient: "from-[#C0C0C0] via-[#E8E8E8] to-[#C0C0C0]",
    features: ["Access to All Events", "Premium Certificate", "Premium Kit"],
  },
  {
    id: "gold",
    name: "Gold Pass",
    price: 550,
    date: "Participation certificate",
    venue: "Access for all events",
    teamSize: "1 person",
    gradient: "from-[#FFD700] via-[#FDB931] to-[#FFD700]",
    features: ["VIP Access to All Events", "Special Certificate", "Exclusive Kit"],
  },
];

const PassCard = ({ pass, onSelect }: PassCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="group cursor-pointer"
    onClick={() => onSelect(pass.id)}
  >
    <div className="relative h-full rounded-[30px] p-[1px] bg-gradient-to-b from-white/5 to-transparent">
      <div className="relative h-full rounded-[30px] bg-n-8/80 backdrop-blur-sm border border-white/5 overflow-hidden">
        {/* Header Section with Gradient */}
        <div className="relative h-[200px] overflow-hidden">
          {/* Animated Gradient Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${pass.gradient} opacity-90`}>
            <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-20 mix-blend-overlay"></div>
          </div>

          {/* Floating Orbs */}
          <div className="absolute inset-0">
            <div className="absolute w-32 h-32 rounded-full bg-white/10 blur-2xl -top-16 -right-16 animate-pulse"></div>
            <div
              className="absolute w-32 h-32 rounded-full bg-white/10 blur-2xl -bottom-16 -left-16 animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>

          {/* Pass Type & Price */}
          <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
            {/* Popular Tag if Gold */}
            {pass.id === "gold" && (
              <div className="absolute top-4 right-4">
                <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                  <p className="text-xs font-semibold text-white">Most Popular</p>
                </div>
              </div>
            )}

            {/* Pass Type */}
            <h2 className="text-4xl font-bold text-white mb-4 tracking-wide">
              {pass.id.toUpperCase()}
            </h2>

            {/* Price */}
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-sm font-normal text-white/80">₹</span>
              <span className="text-4xl font-bold text-white">{pass.price}</span>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="p-6 bg-gradient-to-b from-black/50 to-transparent">
          <div className="space-y-4">
            {pass.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-r ${pass.gradient}`}
                >
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-white/90">{feature}</span>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Users size={16} />
                <span>{pass.teamSize}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <CalendarDays size={16} />
                <span>{pass.date}</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-6">
            <button className="relative w-full group/btn">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${pass.gradient} rounded-xl blur-sm opacity-75 group-hover/btn:opacity-100 transition-opacity duration-300`}
              ></div>
              <div className="relative flex items-center justify-center gap-2 bg-n-8/80 text-white px-6 py-3 rounded-xl backdrop-blur-sm border border-white/5 transition-colors duration-300">
                <span className="font-semibold">
                  Get {pass.id.charAt(0).toUpperCase() + pass.id.slice(1)} Pass
                </span>
                <svg
                  className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const PassesPage = () => {
  const [selectedPass, setSelectedPass] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePassSelect = (passId: string) => {
    setSelectedPass(passId);
    setIsModalOpen(true);
  };

  return (
    <section className="relative min-h-screen py-20 overflow-hidden bg-[#100C1B]">
      <Navbar />

      <div className="container mx-auto px-4 max-w-7xl mt-5 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <div className="px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
              <span className="text-base font-medium bg-gradient-to-r from-[#B87333] to-[#FFD700] bg-clip-text text-transparent">
                Event Passes
              </span>
            </div>
          </div>
          <h3 className="text-4xl md:text-5xl max-sm:text-3xl font-bold bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
            Choose Your Pass
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {PASSES.map((pass) => (
            <PassCard key={pass.id} pass={pass} onSelect={handlePassSelect} />
          ))}
        </div>
      </div>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        passType={selectedPass as "bronze" | "silver" | "gold"}
      />
    </section>
  );
};

export default PassesPage;
