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
  image: string;
}

interface PassCardProps {
  pass: Pass;
  onSelect: (id: Pass["id"]) => void;
}

const PASSES: Pass[] = [
  {
    id: "bronze",
    name: "Bronze",
    price: 350,
    date: "Paricipation certificate",
    venue: "Access for all events",
    teamSize: "1 person",
    gradient: "from-[#0A84FF] to-[#0055D4]",
    image: "/assets/gradient.png",
  },
  {
    id: "silver",
    name: "Silver",
    price: 450,
    date: "Paricipation certificate",
    venue: "Access for all events",
    teamSize: "1 person",
    gradient: "from-[#FF3B30] to-[#DC1C13]",
    image: "/assets/gradient.png",
  },
  {
    id: "gold",
    name: "Gold",
    price: 550,
    date: "Paricipation certificate",
    venue: "Access for all events",
    teamSize: "1 person",
    gradient: "from-[#8E8E93] to-[#636366]",
    image: "/assets/gradient.png",
  },
];

const PassCard = ({ pass, onSelect }: PassCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="relative group cursor-pointer w-full"
    onClick={() => onSelect(pass.id)}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100 rounded-[30px]" />
    <div className="relative w-full overflow-hidden rounded-[30px] bg-[#1C1C1E]/40 backdrop-blur-xl border border-white/[0.08] group-hover:border-white/[0.12] transition-all duration-300 hover:shadow-[0_8px_16px_rgba(0,0,0,0.4)]">
      {/* Event Image */}
      <div className="relative h-[240px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10" />
        <Image
          src={pass.image}
          alt={pass.name}
          fill
          className="object-cover transform group-hover:scale-110 transition-transform duration-700"
        />

        {/* Price Tag */}
        <div className="absolute top-4 left-4 z-20">
          <div className="px-4 py-2 rounded-full bg-black/30 backdrop-blur-xl border border-white/[0.08] group-hover:border-white/[0.12] transition-all duration-300">
            <p className="text-base font-medium text-white flex items-center gap-2">
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                ₹{pass.price}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-6">
        <h3 className="text-2xl font-bold bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent mb-4 group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-300">
          {pass.name}
        </h3>

        <div className="space-y-3">
          <div className="flex items-center text-white/60 group-hover:text-white/70 transition-colors duration-300">
            <CalendarDays size={20} className="mr-3 text-emerald-400/80" />
            <span className="text-[15px] font-medium">{pass.date}</span>
          </div>

          <div className="flex items-center text-white/60 group-hover:text-white/70 transition-colors duration-300">
            <MapPin size={20} className="mr-3 text-purple-400/80" />
            <span className="text-[15px] font-medium">{pass.venue}</span>
          </div>

          <div className="flex items-center text-white/60 group-hover:text-white/70 transition-colors duration-300">
            <Users size={20} className="mr-3 text-cyan-400/80" />
            <span className="text-[15px] font-medium">{pass.teamSize}</span>
          </div>
        </div>

        <div className="mt-6 relative group/button">
          <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 opacity-70 blur-sm group-hover/button:opacity-100 transition-all duration-300" />
          <button
            className="relative w-full py-3.5 rounded-xl bg-[#1C1C1E] text-white font-medium 
            hover:bg-[#1C1C1E]/80 transition-colors flex items-center justify-center gap-2 group-hover:scale-[0.98] active:scale-95 duration-300"
          >
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold">
              Get the pass
            </span>
            <svg
              className="w-5 h-5 text-purple-400 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300"
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
          </button>
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
    <section className="relative min-h-screen py-20 overflow-hidden bg-[#0A0A0B]">
      <Navbar />

      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="container mx-auto px-4 max-w-6xl mt-5 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <div className="px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
              <span className="text-base font-medium bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Event Passes
              </span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
            Choose Your Pass
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
