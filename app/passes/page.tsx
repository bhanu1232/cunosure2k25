"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/navbar";
import { CheckCircle2, ChevronDown, X, AlertCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";

interface Event {
  id: string;
  name: string;
  price: number;
}

const EVENTS: Event[] = [
  { id: "e1", name: "Technical Quiz", price: 100 },
  { id: "e2", name: "Coding Challenge", price: 150 },
  { id: "e3", name: "Robotics Workshop", price: 200 },
  { id: "e4", name: "AI Workshop", price: 200 },
  { id: "e5", name: "Hackathon", price: 250 },
  { id: "e6", name: "Paper Presentation", price: 150 },
];

interface FormData {
  name: string;
  email: string;
  mobile: string;
  paymentId: string;
  selectedEvents: string[];
  uid?: string;
  participationCount?: number;
}

interface Notification {
  type: "success" | "error";
  message: string;
}

const DEFAULT_AMOUNT = 350;

const PassesPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    mobile: "",
    paymentId: "",
    selectedEvents: [],
  });
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const totalAmount = formData.selectedEvents.reduce((total, eventId) => {
    const event = EVENTS.find((e) => e.id === eventId);
    return total + (event?.price || 0);
  }, DEFAULT_AMOUNT);

  const handleEventToggle = (eventId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedEvents: prev.selectedEvents.includes(eventId)
        ? prev.selectedEvents.filter((id) => id !== eventId)
        : [...prev.selectedEvents, eventId],
    }));
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
      const registrationsRef = collection(db, "registrations");
      const q = query(registrationsRef, where("paymentId", "==", paymentId));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking payment ID:", error);
      throw error;
    }
  };

  const generateUID = (mobile: string) => {
    return `CS${mobile}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    try {
      const exists = await checkPaymentId(formData.paymentId);
      if (exists) {
        setNotification({
          type: "error",
          message: "This payment ID has already been used",
        });
        return;
      }

      const uid = generateUID(formData.mobile);

      const registrationData = {
        ...formData,
        uid,
        participationCount: formData.selectedEvents.length,
        totalAmount,
        date: new Date().toISOString(),
      };

      await addDoc(collection(db, "registrations"), registrationData);
      setNotification({
        type: "success",
        message: `Your application has been received. We will verify and inform you via email after successful verification Thank you!`,
      });
      setFormData({
        name: "",
        email: "",
        mobile: "",
        paymentId: "",
        selectedEvents: [],
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

  return (
    <section className="relative min-h-screen py-20 overflow-hidden bg-[#100C1B]">
      <Navbar />

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

            {/* Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-[35%] max-sm:left-[5%] top-[50%] max-sm:top-[40%] -translate-x-[50%] -translate-y-[50%] z-50 w-[calc(100%-2rem)] max-w-md"
            >
              <div
                className={`rounded-2xl p-6 shadow-xl backdrop-blur-md flex items-start gap-4 ${
                  notification.type === "success"
                    ? "bg-green-500/10 border border-green-500/20 text-green-500"
                    : "bg-red-500/10 border border-red-500/20 text-red-500"
                }`}
              >
                {notification.type === "success" ? (
                  <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 text-base sm:text-lg leading-relaxed">
                  {notification.message}
                </div>
                <button
                  onClick={() => setNotification(null)}
                  className="text-current opacity-70 hover:opacity-100 transition-opacity mt-0.5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Grid Background with improved overlay */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-[url('/assets/grid.png')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#100C1B] via-[#100C1B]/95 to-[#100C1B]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,0,224,0.1)_0%,transparent_65%)]" />
      </div>

      <div className="container mx-auto px-4 max-w-3xl mt-5 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 relative"
        >
          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,0,224,0.05)_0%,transparent_50%)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[conic-gradient(from_0deg_at_50%_50%,rgba(74,0,224,0.1)_0%,transparent_50%,rgba(142,45,226,0.1)_100%)] animate-slow-spin" />
          </div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[#4A00E0] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4A00E0]"></span>
              </span>
              <span className="text-base font-medium bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] bg-clip-text text-transparent">
                Registration Open
              </span>
            </div>

            <h3 className="text-4xl md:text-5xl max-sm:text-3xl font-bold bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent mb-6">
              Choose Your Events
            </h3>

            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto relative">
              Select multiple events to participate in
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
          className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Selection Dropdown */}
            <div className="space-y-6">
              {/* Total Amount - Always visible */}
              <div className="p-4 rounded-xl bg-[#4A00E0]/10 border border-[#4A00E0]/20">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="text-white font-semibold">Total Amount</span>
                    {formData.selectedEvents.length > 0 && (
                      <p className="text-white/60 text-sm">
                        Base fee + {formData.selectedEvents.length} event
                        {formData.selectedEvents.length > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] bg-clip-text text-transparent">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-white/60">Additional Events (Optional)</label>
                  {formData.selectedEvents.length > 0 && (
                    <span className="text-white/60 text-sm">
                      {formData.selectedEvents.length} selected
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border transition-colors duration-200 ${
                      isDropdownOpen
                        ? "border-[#4A00E0] bg-white/10"
                        : "border-white/10 hover:border-white/30"
                    } text-white cursor-pointer flex items-center justify-between`}
                  >
                    <div className="flex flex-wrap gap-2">
                      {formData.selectedEvents.length === 0 ? (
                        <span className="text-white/40">Click to add more events...</span>
                      ) : (
                        formData.selectedEvents.map((eventId) => {
                          const event = EVENTS.find((e) => e.id === eventId);
                          return (
                            <div
                              key={eventId}
                              className="flex items-center gap-1 bg-[#4A00E0]/20 px-2 py-1 rounded-full"
                            >
                              <span className="text-sm text-white">{event?.name}</span>
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
                          );
                        })
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-white/60 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 rounded-xl bg-[#1A1625] border border-white/10 shadow-xl backdrop-blur-md">
                      <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                        {EVENTS.map((event) => (
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
                            >
                              +₹{event.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Fields */}
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

              <div>
                <label className="block text-white/60 mb-2">Payment ID</label>
                <input
                  type="text"
                  name="paymentId"
                  value={formData.paymentId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#4A00E0] focus:outline-none transition-colors"
                  placeholder="Enter your payment ID"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] text-white font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Register Now"}
            </button>
          </form>
        </motion.div>

        {/* Contact Information */}
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
            <p className="text-white/60 mt-2">
              Email: contact@cynosure2025.com | Phone: +91 XXXXXXXXXX
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PassesPage;
