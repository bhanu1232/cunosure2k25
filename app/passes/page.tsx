"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import PaymentModal from "@/components/payment/PaymentModal";
import Navbar from "@/components/layout/navbar";
const PASSES = [
  {
    id: "tech",
    name: "Technical Pass",
    price: 1000,
    features: [
      "Access to all technical events",
      "Workshop participation",
      "Certificate of participation",
      "Tech swag kit",
      "Networking opportunities",
    ],
    gradient: "from-[#1F4AF6] to-[#1BC7FB]",
    popular: false,
  },
  {
    id: "combo",
    name: "Combo Pass",
    price: 1500,
    features: [
      "Access to ALL events",
      "Premium workshop access",
      "Exclusive merchandise",
      "Priority registration",
      "Special networking events",
      "Food & refreshments",
      "Professional certification",
    ],
    gradient: "from-[#FF6B6B] to-[#FFB547]",
    popular: true,
  },
  {
    id: "nontech",
    name: "Non-Technical Pass",
    price: 800,
    features: [
      "Access to cultural events",
      "Sports participation",
      "Entertainment shows",
      "Fun activities",
      "Event certificate",
    ],
    gradient: "from-[#8F46FF] to-[#FF6B6B]",
    popular: false,
  },
];

const PassCard = ({ pass, onSelect }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`relative bg-n-8/50 backdrop-blur-sm rounded-[30px] p-6 border border-n-6 hover:border-n-5 transition-colors lg:p-8 ${
      pass.popular ? "lg:scale-105 lg:shadow-2xl" : ""
    }`}
  >
    {pass.popular && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF6B6B] to-[#FFB547] px-4 py-1 rounded-full">
        <p className="text-white text-sm font-semibold">Most Popular</p>
      </div>
    )}

    <div
      className={`h-12 w-12 rounded-2xl bg-gradient-to-r ${pass.gradient} flex items-center justify-center mb-4`}
    >
      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
        />
      </svg>
    </div>

    <div className="mb-4">
      <h3 className="text-2xl font-bold text-white mb-2">{pass.name}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-white">₹{pass.price}</span>
        <span className="text-n-4">/pass</span>
      </div>
    </div>

    <ul className="space-y-3 mb-8">
      {pass.features.map((feature: string, index: number) => (
        <motion.li
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center text-n-4"
        >
          <svg
            className="w-5 h-5 mr-3 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {feature}
        </motion.li>
      ))}
    </ul>

    <button
      onClick={() => onSelect(pass.id)}
      className={`w-full py-4 rounded-2xl bg-gradient-to-r ${pass.gradient} text-white font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]`}
    >
      Get Started
    </button>
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
    <section className="relative min-h-screen py-20 overflow-hidden">
      {/* Background Elements */}
      <Navbar />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1F4AF6] rounded-full opacity-20 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8F46FF] rounded-full opacity-20 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl mt-5">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Choose Your Pass
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-n-4 text-lg max-w-2xl mx-auto"
          >
            Select the perfect pass that matches your interests and unlock an amazing experience at
            Cynosure 2024
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {PASSES.map((pass) => (
            <PassCard key={pass.id} pass={pass} onSelect={handlePassSelect} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-n-4">
            Need help choosing?{" "}
            <a href="#" className="text-[#1F4AF6] hover:text-[#1BC7FB] transition-colors">
              Contact us
            </a>
          </p>
        </motion.div>
      </div>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        passType={selectedPass as "tech" | "nontech" | "combo"}
      />
    </section>
  );
};

export default PassesPage;
