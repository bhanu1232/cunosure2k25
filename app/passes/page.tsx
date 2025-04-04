"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/navbar";
import { CheckCircle2, ChevronDown, X, AlertCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import Image from "next/image";

interface Event {
  id: string;
  name: string;
  price: number;
}

const TECH_EVENTS: Event[] = [
  { id: "Code Marathon", name: "Code Marathon", price: 125 },
  { id: "Blind Coding", name: "Blind Coding", price: 125 },
  { id: "Tech Quiz", name: "Tech Quiz", price: 125 },
  { id: "Query Crackers", name: "Query Crackers", price: 125 },
  { id: "Web Wreath", name: "Web Wreath", price: 125 },
];

const NON_TECH_EVENTS: Event[] = [
  { id: "Photography", name: "Photography", price: 125 },
  { id: "Treasure Hunt", name: "Treasure Hunt", price: 125 },
  { id: "Brain Battle Binge", name: "Brain Battle Binge", price: 125 },
  { id: "Curious Clue", name: "Curious Clue", price: 125 },
  { id: "The Matrix Mystery", name: "The Matrix Mystery", price: 125 },
];

const EXCLUDED_COMPLEMENTARY_EVENTS = ["Ideathon"]; // Only Ideathon is excluded

const COMPLEMENTARY_EVENTS = NON_TECH_EVENTS;

interface FormData {
  name: string;
  email: string;
  mobile: string;
  paymentId: string;
  selectedEvents: string[];
  complementaryEvent: string;
  gender: "male" | "female" | "";
  accommodation: "yes" | "no" | "";
  collegeName: string;
  uid?: string;
  participationCount?: number;
}

interface Notification {
  type: "success" | "error";
  message: string;
}

const DEFAULT_AMOUNT = 350;

// Dynamic pricing based on number of events
const getEventPrice = (eventCount: number): number => {
  if (eventCount <= 1) return 125;
  if (eventCount === 2) return 100;
  if (eventCount === 3) return 85;
  return 75; // More than 3 events
};

const totalAmount = getEventPrice(0);

const PassesPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    mobile: "",
    paymentId: "",
    selectedEvents: [],
    complementaryEvent: "",
    gender: "",
    accommodation: "",
    collegeName: "",
  });
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(false);
  const [isTechDropdownOpen, setIsTechDropdownOpen] = useState(false);
  const [isNonTechDropdownOpen, setIsNonTechDropdownOpen] = useState(false);
  const [isComplementaryDropdownOpen, setIsComplementaryDropdownOpen] = useState(false);

  const calculateTotalAmount = (): number => {
    const eventCount = formData.selectedEvents.length;
    let pricePerEvent = 125; // Default price for 1 event

    if (eventCount === 2) pricePerEvent = 100;
    else if (eventCount === 3) pricePerEvent = 85;
    else if (eventCount > 3) pricePerEvent = 75;

    return DEFAULT_AMOUNT + eventCount * pricePerEvent;
  };

  const totalAmount = calculateTotalAmount();

  const handleEventToggle = (eventId: string) => {
    setFormData((prev) => {
      const isSelected = prev.selectedEvents.includes(eventId);
      if (isSelected) {
        return {
          ...prev,
          selectedEvents: prev.selectedEvents.filter((id) => id !== eventId),
        };
      }
      return {
        ...prev,
        selectedEvents: [...prev.selectedEvents, eventId],
      };
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const checkPaymentId = async (paymentId: string) => {
    try {
      // Check in all registration collections
      const collections = ["registrations", "successRegistrations"];

      for (const collectionName of collections) {
        const registrationsRef = collection(db, collectionName);
        const q = query(registrationsRef, where("paymentId", "==", paymentId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          return true; // Payment ID found in one of the collections
        }
      }

      return false; // Payment ID not found in any collection
    } catch (error) {
      console.error("Error checking payment ID:", error);
      throw error;
    }
  };

  const checkMobileNumber = async (mobile: string) => {
    try {
      // Check in all registration collections
      const collections = ["registrations", "successRegistrations"];

      for (const collectionName of collections) {
        const registrationsRef = collection(db, collectionName);
        const q = query(registrationsRef, where("mobile", "==", mobile));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Return the collection name where the mobile number was found
          return collectionName;
        }
      }

      return null; // Mobile number not found in any collection
    } catch (error) {
      console.error("Error checking mobile number:", error);
      throw error;
    }
  };

  const generateUID = (mobile: string) => {
    return `CS${mobile}`;
  };

  const handleComplementaryEventSelect = (eventId: string) => {
    setFormData((prev) => ({
      ...prev,
      complementaryEvent: prev.complementaryEvent === eventId ? "" : eventId,
    }));
    setIsComplementaryDropdownOpen(false);
  };

  const getComplementaryEventName = (eventId: string) => {
    return COMPLEMENTARY_EVENTS.find((e) => e.id === eventId)?.name || "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    // Remove package validation
    if (!formData.complementaryEvent) {
      setNotification({
        type: "error",
        message: "Please select a complementary event",
      });
      setLoading(false);
      return;
    }

    if (!formData.gender) {
      setNotification({
        type: "error",
        message: "Please select your gender",
      });
      setLoading(false);
      return;
    }

    if (!formData.accommodation) {
      setNotification({
        type: "error",
        message: "Please select whether you need accommodation",
      });
      setLoading(false);
      return;
    }

    try {
      // Rest of the submit logic remains the same
      const existingRegistration = await checkMobileNumber(formData.mobile);
      if (existingRegistration) {
        let errorMessage = "This mobile number has already been registered";

        // Customize error message based on where the mobile number was found
        switch (existingRegistration) {
          case "registrations":
            errorMessage = "This mobile number has already been registered for general events";
            break;
          case "paper_presentations":
            errorMessage = "This mobile number has already been registered for Paper Presentation";
            break;
          case "ideathon_registrations":
            errorMessage = "This mobile number has already been registered for Ideathon";
            break;
        }

        setNotification({
          type: "error",
          message: errorMessage,
        });
        setLoading(false);
        return;
      }

      const paymentExists = await checkPaymentId(formData.paymentId);
      if (paymentExists) {
        setNotification({
          type: "error",
          message: "This payment ID has already been used",
        });
        setLoading(false);
        return;
      }

      const uid = generateUID(formData.mobile);

      const registrationData = {
        ...formData,
        uid,
        participationCount: formData.selectedEvents.length + (formData.complementaryEvent ? 1 : 0),
        totalAmount: totalAmount,
        date: new Date().toISOString(),
      };

      await addDoc(collection(db, "registrations"), registrationData);
      setNotification({
        type: "success",
        message: `Your application has been received. We will verify and inform you via email after successful verification. Thank you!`,
      });
      setFormData({
        name: "",
        email: "",
        mobile: "",
        paymentId: "",
        selectedEvents: [],
        complementaryEvent: "",
        gender: "",
        accommodation: "",
        collegeName: "",
      });
    } catch (error) {
      setNotification({
        type: "error",
        message: error instanceof Error ? error.message : "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const getEventName = (eventId: string) => {
    const techEvent = TECH_EVENTS.find((e) => e.id === eventId);
    const nonTechEvent = NON_TECH_EVENTS.find((e) => e.id === eventId);
    return techEvent?.name || nonTechEvent?.name || "";
  };

  return (
    <section className="relative min-h-screen py-20 overflow-hidden bg-[#100C1B]">
      <Navbar />
      <h1 className="">Registrations closed</h1>

      {/* Notification Popup */}
      <AnimatePresence>
        {notification && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setNotification(null)}
            />

            {/* Enhanced Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-[35%] max-sm:left-[5%] top-1/2 max-sm:top-[30%] -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md"
            >
              <div
                className={`
                  rounded-2xl p-8 shadow-2xl backdrop-blur-xl
                  ${
                    notification.type === "success"
                      ? "bg-white border-2 border-green-500/20"
                      : "bg-white border-2 border-red-500/20"
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl ${
                      notification.type === "success"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {notification.type === "success" ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <AlertCircle className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-semibold mb-1 ${
                        notification.type === "success" ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {notification.type === "success" ? "Success!" : "Error"}
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {notification.message}
                    </p>
                  </div>
                  <button
                    onClick={() => setNotification(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed left-[35%] max-sm:left-[5%] top-1/2 max-sm:top-[30%] -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md"
            />

            {/* Loading Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-[35%] max-sm:left-[5%] top-1/2 max-sm:top-[30%] -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md"
            >
              <div className="bg-[#1A1625]/95 border border-[#4A00E0]/20 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
                <div className="flex flex-col items-center gap-4">
                  {/* Loading Animation */}
                  <div className="relative size-16">
                    {/* Outer rotating ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-[#4A00E0]/20" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#4A00E0] animate-spin" />

                    {/* Inner pulsing circle */}
                    <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#4A00E0] to-[#8E2DE2] animate-pulse" />
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mb-2">
                      Processing Registration
                    </h3>
                    <p className="text-white/60">Please wait while we submit your details...</p>
                  </div>

                  {/* Progress Steps */}
                  <div className="w-full space-y-3 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-[#4A00E0] animate-pulse" />
                      <div className="text-sm text-white/60">Validating form data...</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-[#4A00E0]/40" />
                      <div className="text-sm text-white/40">Checking payment details...</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-[#4A00E0]/40" />
                      <div className="text-sm text-white/40">Submitting registration...</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-[url('/assets/grid.png')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#100C1B] via-[#100C1B]/95 to-[#100C1B]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,0,224,0.1)_0%,transparent_65%)]" />
      </div>

      {/* <div className="container mx-auto px-4 max-w-3xl mt-5 relative">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 relative"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="inline-flex items-center gap-2 mb-6 max-sm:mb-0 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[#4A00E0] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4A00E0]"></span>
              </span>
              <span className="text-base font-medium bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] bg-clip-text text-transparent">
                Registration Open
              </span>
            </div>

            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto relative">
              <motion.span
                className="absolute -right-4 -top-4 text-[#4A00E0]"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                ✦
              </motion.span>
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <p className="text-white/60">special events registrations</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <motion.div whileHover={{ y: -5 }} className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4A00E0]/20 to-[#8E2DE2]/20 rounded-2xl transform group-hover:scale-105 transition-transform duration-500" />
              <a
                href="/paper-presentation"
                className="relative block p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-sm border border-white/10 transition-all duration-300"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <div className="flex justify-between items-start">
                      <span className="px-3 py-1 rounded-full bg-[#4A00E0]/20 text-xs text-white/90 border border-[#4A00E0]/20 backdrop-blur-sm">
                        209
                      </span>
                      <span className="text-2xl text-white/90">📝</span>
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mb-2">
                    Pitch Perfect Paper
                  </h4>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-white/60 group-hover:text-white/90 transition-colors">
                      Click to Register
                      <span className="transform group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
              </a>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4A00E0]/20 to-[#8E2DE2]/20 rounded-2xl transform group-hover:scale-105 transition-transform duration-500" />
              <a
                href="/hackathon"
                className="relative block p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-sm border border-white/10 transition-all duration-300"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <div className="flex justify-between items-start">
                      <span className="px-3 py-1 rounded-full bg-[#4A00E0]/20 text-xs text-white/90 border border-[#4A00E0]/20 backdrop-blur-sm">
                        24h
                      </span>
                      <span className="text-2xl">⚡</span>
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mb-2">
                    Hackathon
                  </h4>
                  <div className="mt-auto flex items-center justify-between">
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center text-white/60 group-hover:text-white transition-colors"
                    >
                      <span className="text-sm">Click to Register</span>
                      <span className="ml-1 transform group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </motion.div>
                  </div>
                </div>
              </a>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4A00E0]/20 to-[#8E2DE2]/20 rounded-2xl transform group-hover:scale-105 transition-transform duration-500" />
              <a
                href="/ideathon"
                className="relative block p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-sm border border-white/10 transition-all duration-300"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <div className="flex justify-between items-start">
                      <span className="px-3 py-1 rounded-full bg-[#4A00E0]/20 text-xs text-white/90 border border-[#4A00E0]/20 backdrop-blur-sm">
                        ₹199
                      </span>
                      <span className="text-2xl">💫</span>
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mb-2">
                    Ideathon
                  </h4>
                  <div className="mt-auto flex items-center justify-between">
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center text-white/60 group-hover:text-white transition-colors"
                    >
                      <span className="text-sm">Click to Register</span>
                      <span className="ml-1 transform group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </motion.div>
                  </div>
                </div>
              </a>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
        >
          <h4 className="text-xl text-white/80 font-medium mb-4 text-center">Event Pricing</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#4A00E0]/10 border border-[#4A00E0]/20">
                <span className="text-white/80">Base Registration</span>
                <span className="font-semibold text-white">₹350</span>
              </div>
              <p className="text-sm text-white/60 px-3">
                Base registration fee includes access to the event and one complementary event
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <span className="text-white/80">1 Event</span>
                  <span className="font-medium text-white">₹125/event</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <span className="text-white/80">2 Events</span>
                  <span className="font-medium text-white">₹100/event</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <span className="text-white/80">3 Events</span>
                  <span className="font-medium text-white">₹85/event</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <span className="text-white/80">4+ Events</span>
                  <span className="font-medium text-white">₹75/event</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10"
        >
          <div className="text-center mb-6">
            <h4 className="text-xl text-white/80 font-medium">Event Registration</h4>
          </div>

          <div className="p-4 rounded-xl bg-[#4A00E0]/10 border border-[#4A00E0]/20 mb-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <span className="text-white font-semibold">Total Amount</span>
                <p className="text-white/60 text-sm">
                  Base fee + {formData.selectedEvents.length} event
                  {formData.selectedEvents.length !== 1 ? "s" : ""}
                </p>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-white bg-clip-text text-transparent">
                ₹{totalAmount}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <label className="block text-white/60">Complementary Event</label>
                    <span className="px-2 py-0.5 rounded-full bg-[#4A00E0]/20 border border-[#4A00E0]/20 text-xs text-white/80">
                      Free
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <div
                    onClick={() => setIsComplementaryDropdownOpen(!isComplementaryDropdownOpen)}
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border transition-colors duration-200 ${
                      isComplementaryDropdownOpen
                        ? "border-[#4A00E0] bg-white/10"
                        : "border-white/10 hover:border-white/30"
                    } text-white cursor-pointer flex items-center justify-between`}
                  >
                    <div className="flex flex-wrap gap-2">
                      {!formData.complementaryEvent ? (
                        <span className="text-white/40">Select your free event...</span>
                      ) : (
                        <div className="flex items-center gap-1 bg-[#4A00E0]/20 px-2 py-1 rounded-full">
                          <span className="text-sm text-white">
                            {getComplementaryEventName(formData.complementaryEvent)}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleComplementaryEventSelect(formData.complementaryEvent);
                            }}
                            className="text-white/60 hover:text-white transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-white/60 transition-transform duration-200 ${
                        isComplementaryDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {isComplementaryDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 rounded-xl bg-[#1A1625] border border-white/10 shadow-xl backdrop-blur-md">
                      <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                        {COMPLEMENTARY_EVENTS.map((event) => (
                          <div
                            key={event.id}
                            onClick={() => handleComplementaryEventSelect(event.id)}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                              formData.complementaryEvent === event.id
                                ? "bg-[#4A00E0]/20"
                                : "hover:bg-white/5"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded-full border-2 transition-colors ${
                                  formData.complementaryEvent === event.id
                                    ? "border-[#4A00E0] bg-[#4A00E0]"
                                    : "border-white/20"
                                }`}
                              >
                                {formData.complementaryEvent === event.id && (
                                  <CheckCircle2 className="w-4 h-4 text-white" />
                                )}
                              </div>
                              <span className="text-white">{event.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-white/40 mt-1">* Excluding Technical Events</p>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <label className="block text-white/60">Technical Events</label>
                  <div className="flex items-center gap-2">
                    {formData.selectedEvents.filter((id) => TECH_EVENTS.some((e) => e.id === id))
                      .length > 0 && (
                      <span className="text-white/60 text-sm">
                        {
                          formData.selectedEvents.filter((id) =>
                            TECH_EVENTS.some((e) => e.id === id)
                          ).length
                        }{" "}
                        selected
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <div
                    onClick={() => setIsTechDropdownOpen(!isTechDropdownOpen)}
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border transition-colors duration-200 ${
                      isTechDropdownOpen
                        ? "border-[#4A00E0] bg-white/10"
                        : "border-white/10 hover:border-white/30"
                    } text-white cursor-pointer flex items-center justify-between`}
                  >
                    <div className="flex flex-wrap gap-2">
                      {formData.selectedEvents.filter((id) => TECH_EVENTS.some((e) => e.id === id))
                        .length === 0 ? (
                        <span className="text-white/40">Select technical events...</span>
                      ) : (
                        formData.selectedEvents
                          .filter((id) => TECH_EVENTS.some((e) => e.id === id))
                          .map((eventId) => (
                            <div
                              key={eventId}
                              className="flex items-center gap-1 bg-[#4A00E0]/20 px-2 py-1 rounded-full"
                            >
                              <span className="text-sm text-white">{getEventName(eventId)}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEventToggle(eventId);
                                }}
                                className="text-white/60 hover:text-white transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-white/60 transition-transform duration-200 ${
                        isTechDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {isTechDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 rounded-xl bg-[#1A1625] border border-white/10 shadow-xl backdrop-blur-md">
                      <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                        {TECH_EVENTS.map((event) =>
                          event.id !== formData.complementaryEvent ? (
                            <div
                              key={event.id}
                              onClick={() => handleEventToggle(event.id)}
                              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                formData.selectedEvents.includes(event.id)
                                  ? "bg-[#4A00E0]/20"
                                  : "hover:bg-white/5"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-5 h-5 rounded-full border-2 transition-colors ${
                                    formData.selectedEvents.includes(event.id)
                                      ? "border-[#4A00E0] bg-[#4A00E0]"
                                      : "border-white/20"
                                  }`}
                                >
                                  {formData.selectedEvents.includes(event.id) && (
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                  )}
                                </div>
                                <span className="text-white">{event.name}</span>
                              </div>
                              <span
                                className={`text-sm transition-colors ${
                                  formData.selectedEvents.includes(event.id)
                                    ? "text-[#4A00E0]"
                                    : "text-white/60"
                                }`}
                              ></span>
                            </div>
                          ) : null
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-white/60">Non-Technical Events</label>
                  {formData.selectedEvents.filter((id) => NON_TECH_EVENTS.some((e) => e.id === id))
                    .length > 0 && (
                    <span className="text-white/60 text-sm">
                      {
                        formData.selectedEvents.filter((id) =>
                          NON_TECH_EVENTS.some((e) => e.id === id)
                        ).length
                      }{" "}
                      selected
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div
                    onClick={() => setIsNonTechDropdownOpen(!isNonTechDropdownOpen)}
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border transition-colors duration-200 ${
                      isNonTechDropdownOpen
                        ? "border-[#4A00E0] bg-white/10"
                        : "border-white/10 hover:border-white/30"
                    } text-white cursor-pointer flex items-center justify-between`}
                  >
                    <div className="flex flex-wrap gap-2">
                      {formData.selectedEvents.filter((id) =>
                        NON_TECH_EVENTS.some((e) => e.id === id)
                      ).length === 0 ? (
                        <span className="text-white/40">Select non-technical events...</span>
                      ) : (
                        formData.selectedEvents
                          .filter((id) => NON_TECH_EVENTS.some((e) => e.id === id))
                          .map((eventId) => (
                            <div
                              key={eventId}
                              className="flex items-center gap-1 bg-[#4A00E0]/20 px-2 py-1 rounded-full"
                            >
                              <span className="text-sm text-white">{getEventName(eventId)}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEventToggle(eventId);
                                }}
                                className="text-white/60 hover:text-white transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-white/60 transition-transform duration-200 ${
                        isNonTechDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {isNonTechDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 rounded-xl bg-[#1A1625] border border-white/10 shadow-xl backdrop-blur-md">
                      <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                        {NON_TECH_EVENTS.map((event) =>
                          event.id !== formData.complementaryEvent ? (
                            <div
                              key={event.id}
                              onClick={() => handleEventToggle(event.id)}
                              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                formData.selectedEvents.includes(event.id)
                                  ? "bg-[#4A00E0]/20"
                                  : "hover:bg-white/5"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-5 h-5 rounded-full border-2 transition-colors ${
                                    formData.selectedEvents.includes(event.id)
                                      ? "border-[#4A00E0] bg-[#4A00E0]"
                                      : "border-white/20"
                                  }`}
                                >
                                  {formData.selectedEvents.includes(event.id) && (
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                  )}
                                </div>
                                <span className="text-white">{event.name}</span>
                              </div>
                              <span
                                className={`text-sm transition-colors ${
                                  formData.selectedEvents.includes(event.id)
                                    ? "text-[#4A00E0]"
                                    : "text-white/60"
                                }`}
                              ></span>
                            </div>
                          ) : null
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white/60 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#4A00E0] focus:outline-none transition-colors"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-2">College Name</label>
                <input
                  type="text"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#4A00E0] focus:outline-none transition-colors"
                  placeholder="Enter your college name"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#4A00E0] focus:outline-none transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-2">Mobile</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                  pattern="[0-9]{10}"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#4A00E0] focus:outline-none transition-colors"
                  placeholder="Enter your mobile number"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-white/60 mb-2">Gender</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, gender: e.target.value as "male" }))
                        }
                        className="hidden"
                      />
                      <div
                        className={`px-4 py-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          formData.gender === "male"
                            ? "bg-[#4A00E0] text-white"
                            : "bg-white/5 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        Male
                      </div>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, gender: e.target.value as "female" }))
                        }
                        className="hidden"
                      />
                      <div
                        className={`px-4 py-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          formData.gender === "female"
                            ? "bg-[#4A00E0] text-white"
                            : "bg-white/5 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        Female
                      </div>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-white/60 mb-2">Need Accommodation?</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="accommodation"
                        value="yes"
                        checked={formData.accommodation === "yes"}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            accommodation: e.target.value as "yes",
                          }))
                        }
                        className="hidden"
                      />
                      <div
                        className={`px-4 py-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          formData.accommodation === "yes"
                            ? "bg-[#4A00E0] text-white"
                            : "bg-white/5 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        Yes
                      </div>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="accommodation"
                        value="no"
                        checked={formData.accommodation === "no"}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            accommodation: e.target.value as "no",
                          }))
                        }
                        className="hidden"
                      />
                      <div
                        className={`px-4 py-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          formData.accommodation === "no"
                            ? "bg-[#4A00E0] text-white"
                            : "bg-white/5 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        No
                      </div>
                    </label>
                  </div>
                  {formData.accommodation === "yes" && (
                    <p className="text-xs text-white/40 mt-1">
                      * Accommodation fee will be collected during check-in
                    </p>
                  )}
                </div>
              </div>

              <div className="relative p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="absolute top-0 right-0 px-3 py-1 rounded-tr-xl rounded-bl-xl bg-[#4A00E0]/20 border-b border-l border-[#4A00E0]/20">
                  <span className="text-xs text-white/60">Scan to Pay</span>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative w-48 h-48 bg-white rounded-xl p-3 mx-auto md:mx-0">
                    <Image
                      src="/pay_qr.jpeg"
                      alt="Payment QR Code"
                      width={200}
                      height={200}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#4A00E0]/10 via-transparent to-[#8E2DE2]/10 pointer-events-none rounded-xl"></div>
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-[#ffffff] to-[#fefefe] bg-clip-text text-transparent">
                    ₹{totalAmount}
                  </span>
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-white font-medium">Payment Instructions</h4>
                      <ul className="space-y-2 text-sm text-white/60">
                        <li className="flex flex-col items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-[#4A00E0]"></span>
                          Scan the QR code using any UPI app (Or)
                          <p className=" font-bold text-xl">PhonePe: 7981269983</p>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-[#4A00E0]"></span>
                          Pay the total amount shown above
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-[#4A00E0]"></span>
                          Save the payment ID/UTR number
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-[#4A00E0]"></span>
                          If any failure occur please send the payment details to this Whatsapp
                          number :9441005225
                        </li>
                      </ul>
                    </div>

                    <div className="p-3 rounded-lg bg-[#4A00E0]/10 border border-[#4A00E0]/20">
                      <p className="text-sm text-white/80">
                        <span className="font-medium text-white">Note:</span> After successful
                        payment, enter the payment ID/UTR number in the field below
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-2">Payment ID ( UTR )</label>
                <input
                  type="text"
                  name="paymentId"
                  value={formData.paymentId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#4A00E0] focus:outline-none transition-colors"
                  placeholder="Enter the UTR number"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] text-white font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className={`inline-flex items-center gap-2 ${loading ? "invisible" : ""}`}>
                Register Now
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-block px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <p className="text-white/80 text-lg">
              For registration inquiries, please contact the event coordinators
            </p>
            <p className="text-white/60 mt-2">Email: svucyno@gmail.com</p>
          </div>
        </motion.div>
      </div> */}
    </section>
  );
};

export default PassesPage;
