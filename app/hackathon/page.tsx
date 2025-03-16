"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/navbar";
import { CheckCircle2, X, AlertCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import Image from "next/image";

interface FormData {
  name: string;
  email: string;
  mobile: string;
  paymentId: string;
  teamName: string;
  problemStatement: string;
  teamSize: "2" | "3" | "4" | "";
  teamMembers: string[];
  accommodation: "yes" | "no" | "";
  uid?: string;
}

interface Notification {
  type: "success" | "error";
  message: string;
}

const ENTRY_FEE = 300;
const TEAM_REGISTRATION_FEE = 200;

const initialFormState: FormData = {
  name: "",
  email: "",
  mobile: "",
  paymentId: "",
  teamName: "",
  problemStatement: "",
  teamSize: "4",
  teamMembers: Array(4).fill(""),
  accommodation: "",
};

const HackathonPage = () => {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const checkPaymentId = async (paymentId: string) => {
    try {
      const collections = ["hackathon_registrations", "successRegistrations"];

      for (const collectionName of collections) {
        const registrationsRef = collection(db, collectionName);
        const q = query(registrationsRef, where("paymentId", "==", paymentId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error checking payment ID:", error);
      throw error;
    }
  };

  const checkMobileNumber = async (mobile: string) => {
    try {
      const collections = ["hackathon_registrations", "successRegistrations"];

      for (const collectionName of collections) {
        const registrationsRef = collection(db, collectionName);
        const q = query(registrationsRef, where("mobile", "==", mobile));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          return collectionName;
        }
      }

      return null;
    } catch (error) {
      console.error("Error checking mobile number:", error);
      throw error;
    }
  };

  const generateUID = (mobile: string) => {
    return `HK${mobile}`;
  };

  const calculateTotalAmount = (): number => {
    if (!formData.teamSize) return 0;
    const memberCount = parseInt(formData.teamSize);
    return ENTRY_FEE * memberCount + TEAM_REGISTRATION_FEE;
  };

  const handleTeamMemberChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newTeamMembers = [...(prev.teamMembers || [])];
      newTeamMembers[index] = value;
      return {
        ...prev,
        teamMembers: newTeamMembers,
      };
    });
  };

  const handleTeamSizeChange = (size: "2" | "3" | "4") => {
    setFormData((prev) => ({
      ...prev,
      teamSize: size,
      teamMembers: Array(parseInt(size)).fill(""),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    // Validate team size
    if (!formData.teamSize) {
      setNotification({
        type: "error",
        message: "Please select your team size",
      });
      setLoading(false);
      return;
    }

    // Validate team name
    if (!formData.teamName) {
      setNotification({
        type: "error",
        message: "Please enter your team name",
      });
      setLoading(false);
      return;
    }

    // Validate accommodation
    if (!formData.accommodation) {
      setNotification({
        type: "error",
        message: "Please select whether you need accommodation",
      });
      setLoading(false);
      return;
    }

    try {
      // Check mobile number
      const existingRegistration = await checkMobileNumber(formData.mobile);
      if (existingRegistration) {
        setNotification({
          type: "error",
          message: "This mobile number has already been registered for Hackathon",
        });
        setLoading(false);
        return;
      }

      // Check payment ID
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
        totalAmount: calculateTotalAmount(),
        date: new Date().toISOString(),
      };

      await addDoc(collection(db, "hackathon_registrations"), registrationData);
      setNotification({
        type: "success",
        message:
          "Your Hackathon registration has been received. We will verify and inform you via email after successful verification. Thank you!",
      });
      setFormData({ ...initialFormState, teamSize: "", teamMembers: [] });
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setNotification(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-[35%] max-sm:left-[5%] top-1/2 max-sm:top-[30%] -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md"
            >
              <div
                className={`rounded-2xl p-8 shadow-2xl backdrop-blur-xl ${
                  notification.type === "success"
                    ? "bg-white border-2 border-green-500/20"
                    : "bg-white border-2 border-red-500/20"
                }`}
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-[35%] max-sm:left-[5%] top-1/2 max-sm:top-[30%] -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md"
            >
              <div className="bg-[#1A1625]/95 border border-[#4A00E0]/20 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative size-16">
                    <div className="absolute inset-0 rounded-full border-4 border-[#4A00E0]/20" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#4A00E0] animate-spin" />
                    <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#4A00E0] to-[#8E2DE2] animate-pulse" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Processing Registration
                    </h3>
                    <p className="text-white/60">Please wait while we submit your details...</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 max-w-3xl relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Hackathon</h1>
          <p className="text-white/60">24-hour coding challenge</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Team Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-white/60 mb-2">Team Name</label>
                <input
                  type="text"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#4A00E0] focus:outline-none transition-colors"
                  placeholder="Enter your team name"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-2">Problem Statement</label>
                <textarea
                  name="problemStatement"
                  value={formData.problemStatement}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      problemStatement: e.target.value,
                    }))
                  }
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#4A00E0] focus:outline-none transition-colors resize-none h-24"
                  placeholder="Describe your problem statement or project idea"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-2">Members</label>
                <div className="grid grid-cols-3 gap-4">
                  {["2", "3", "4"].map((size) => (
                    <label key={size} className="flex items-center">
                      <input
                        type="radio"
                        name="teamSize"
                        value={size}
                        checked={formData.teamSize === size}
                        onChange={(e) => handleTeamSizeChange(e.target.value as "2" | "3" | "4")}
                        className="hidden"
                      />
                      <div
                        className={`w-full px-4 py-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          formData.teamSize === size
                            ? "bg-[#4A00E0] text-white"
                            : "bg-white/5 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        {size}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Team Members */}
            {formData.teamSize && (
              <div className="space-y-4">
                <h3 className="text-base text-white/80 font-medium">Members Info</h3>
                {Array.from({ length: parseInt(formData.teamSize) }).map((_, index) => (
                  <div key={index}>
                    <label className="block text-white/60 mb-2">
                      {index === 0 ? "Leader" : `Member ${index + 1}`}
                    </label>
                    <input
                      type="text"
                      value={formData.teamMembers[index] || ""}
                      onChange={(e) => handleTeamMemberChange(index, e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#4A00E0] focus:outline-none transition-colors"
                      placeholder={`Enter ${index === 0 ? "leader" : "member"}'s name`}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Team Leader Contact Details */}
            <div className="space-y-4">
              <h3 className="text-base text-white/80 font-medium">Contact Info</h3>

              <div>
                <label className="block text-white/60 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#4A00E0] focus:outline-none transition-colors"
                  placeholder="Enter team leader's email"
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
                  placeholder="Enter team leader's mobile number"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-2">Accommodation</label>
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
                  <p className="text-xs text-white/40 mt-1">* Fee collected at check-in</p>
                )}
              </div>
            </div>

            {/* Payment Section */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#4A00E0]/10 border border-[#4A00E0]/20">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="text-white font-semibold">Total Amount</span>
                    {formData.teamSize && (
                      <div className="space-y-1">
                        <p className="text-white/60 text-sm">
                          Entry fee (₹{ENTRY_FEE} × {formData.teamSize})
                        </p>
                        <p className="text-white/60 text-sm">
                          Team registration fee (₹{TEAM_REGISTRATION_FEE})
                        </p>
                      </div>
                    )}
                  </div>
                  <span className="text-2xl font-bold text-white">₹{calculateTotalAmount()}</span>
                </div>
              </div>

              <div className="relative p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="absolute top-0 right-0 px-3 py-1 rounded-tr-xl rounded-bl-xl bg-[#4A00E0]/20 border-b border-l border-[#4A00E0]/20">
                  <span className="text-xs text-white/60">Scan to Pay</span>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative w-48 h-48 bg-white rounded-xl p-3">
                    <Image
                      src="/pay_qr.jpeg"
                      alt="Payment QR Code"
                      width={200}
                      height={200}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-white font-medium">Payment Instructions</h4>
                      <ul className="space-y-2 text-sm text-white/60">
                        <li className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-[#4A00E0]"></span>
                          Scan the QR code using any UPI app
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-[#4A00E0]"></span>
                          Pay ₹{calculateTotalAmount()} as registration fee
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-[#4A00E0]"></span>
                          Save the payment ID/UTR number
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-2">Payment ID (UTR)</label>
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
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] text-white font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Register Team
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
              For Hackathon inquiries, please contact the event coordinators
            </p>
            <p className="text-white/60 mt-2">Email: svucyno@gmail.com</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HackathonPage;
