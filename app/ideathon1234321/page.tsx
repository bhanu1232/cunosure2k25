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
  ideaLink: string;
  teamMembers: string;
  collegeName: string;
  gender: "male" | "female" | "";
  accommodation: "yes" | "no" | "";
  uid?: string;
}

interface Notification {
  type: "success" | "error";
  message: string;
}

const IDEATHON_FEE = 199;

const IdeathonPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    mobile: "",
    paymentId: "",
    ideaLink: "",
    teamMembers: "",
    collegeName: "",
    gender: "",
    accommodation: "",
  });
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const checkPaymentId = async (paymentId: string) => {
    try {
      const registrationsRef = collection(db, "ideathon_registrations");
      const q = query(registrationsRef, where("paymentId", "==", paymentId));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking payment ID:", error);
      throw error;
    }
  };

  const checkMobileNumber = async (mobile: string) => {
    try {
      const registrationsRef = collection(db, "ideathon_registrations");
      const q = query(registrationsRef, where("mobile", "==", mobile));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking mobile number:", error);
      throw error;
    }
  };

  const generateUID = (mobile: string) => {
    return `ID${mobile}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    try {
      // Check mobile number first
      const mobileExists = await checkMobileNumber(formData.mobile);
      if (mobileExists) {
        setNotification({
          type: "error",
          message: "This mobile number has already been registered for Ideathon",
        });
        setLoading(false);
        return;
      }

      // Then check payment ID
      const paymentExists = await checkPaymentId(formData.paymentId);
      if (paymentExists) {
        setNotification({
          type: "error",
          message: "This payment ID has already been used",
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

      const uid = generateUID(formData.mobile);

      const registrationData = {
        ...formData,
        uid,
        amount: IDEATHON_FEE,
        date: new Date().toISOString(),
      };

      await addDoc(collection(db, "ideathon_registrations"), registrationData);
      setNotification({
        type: "success",
        message: `Your Ideathon registration has been received. We will verify and inform you via email after successful verification. Thank you!`,
      });
      setFormData({
        name: "",
        email: "",
        mobile: "",
        paymentId: "",
        ideaLink: "",
        teamMembers: "",
        collegeName: "",
        gender: "",
        accommodation: "",
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
              Ideathon Registration
            </h3>

            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto relative mb-8">
              Online Registration & Offline Final Round
              <motion.span
                className="absolute -right-4 -top-4 text-[#4A00E0]"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                ✦
              </motion.span>
            </p>

            {/* Process Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10 mb-8 max-w-2xl mx-auto"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#4A00E0]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Online Registration</h4>
                    <p className="text-white/60 text-sm">
                      Register your team and submit your innovative idea through Google Drive link
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#4A00E0]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Initial Screening</h4>
                    <p className="text-white/60 text-sm">
                      Our expert panel will review all submitted ideas and select the most promising
                      teams
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#4A00E0]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Offline Final Round</h4>
                    <p className="text-white/60 text-sm">
                      Selected teams will present their ideas in person at the venue and should pay
                      an additional 250 rupees per person
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#4A00E0]/10 border border-[#4A00E0]/20">
                  <p className="text-sm text-white/80">
                    <span className="font-medium text-white">Important:</span> Selected teams will
                    be notified via email with detailed instructions about the final round schedule
                    and accommodation arrangements. The additional fee should be paid upon
                    selection.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Registration Fee Display */}
            <div className="p-4 rounded-xl bg-[#4A00E0]/10 border border-[#4A00E0]/20">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">Registration Fee</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] bg-clip-text text-transparent">
                  ₹{IDEATHON_FEE}
                </span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-white/60 mb-2">Team Leader Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#4A00E0] focus:outline-none transition-colors"
                  placeholder="Enter team leader's name"
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
                <label className="block text-white/60 mb-2">Team Members ( 4 members MAX )</label>
                <textarea
                  name="teamMembers"
                  value={formData.teamMembers}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#4A00E0] focus:outline-none transition-colors min-h-[100px]"
                  placeholder="Enter team members' names (one per line)"
                />
                <p className="text-xs text-white/40 mt-1">
                  Maximum 4 members per team if more than 4 it wont be shortlisted
                </p>
              </div>

              <div>
                <label className="block text-white/60 mb-2">Idea Document Link</label>
                <div className="relative">
                  <input
                    type="url"
                    name="ideaLink"
                    value={formData.ideaLink}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#4A00E0] focus:outline-none transition-colors"
                    placeholder="Enter your Google Drive link"
                  />
                </div>
                <p className="text-xs text-white/40 mt-1">
                  Share your idea document using Google Drive
                </p>
              </div>

              {/* Add these new fields before the Payment QR Code Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Gender Selection */}
                <div className="space-y-2">
                  <label className="block text-white/60 mb-2">Gender (Team Leader)</label>
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

                {/* Accommodation Selection */}
                <div className="space-y-2">
                  <label className="block text-white/60 mb-2">
                    Need Accommodation?(shortlisted)
                  </label>
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

              {/* Payment QR Code Section */}
              <div className="relative p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="absolute top-0 right-0 px-3 py-1 rounded-tr-xl rounded-bl-xl bg-[#4A00E0]/20 border-b border-l border-[#4A00E0]/20">
                  <span className="text-xs text-white/60">Scan to Pay</span>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* QR Code */}
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

                  {/* Payment Instructions */}
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
                          Pay the registration fee shown above
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-[#4A00E0]"></span>
                          Save the payment ID/UTR number
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
              For Ideathon inquiries, please contact the coordinators
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

export default IdeathonPage;
