"use client";

import React, { useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  setDoc,
  doc,
  writeBatch,
  runTransaction,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  passType?: "tech" | "nontech" | "combo";
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PASS_DETAILS = {
  tech: {
    name: "Technical Pass",
    amount: 100000, // ₹1000 in paise
    description: "Technical Events Pass - Cynosure 2024",
  },
  nontech: {
    name: "Non-Technical Pass",
    amount: 80000, // ₹800 in paise
    description: "Non-Technical Events Pass - Cynosure 2024",
  },
  combo: {
    name: "Combo Pass",
    amount: 150000, // ₹1500 in paise
    description: "All Events Combo Pass - Cynosure 2024",
  },
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const registrationsRef = collection(db, "registrations");

const PaymentModal = ({ isOpen, onClose, passType = "tech" }: PaymentModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ paymentId: string; passName: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const checkExistingPayment = async (paymentId: string) => {
    try {
      const q = query(registrationsRef, where("paymentId", "==", paymentId));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking existing payment:", error);
      return false;
    }
  };

  const saveToFirebaseWithRetry = async (paymentData: any, status: "success" | "failed") => {
    const registrationData = {
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      passType,
      amount: PASS_DETAILS[passType].amount / 100,
      date: new Date().toISOString(),
      paymentId: status === "success" ? paymentData.razorpay_payment_id : null,
      status,
    };

    try {
      setLoading(true);
      const docRef = await addDoc(collection(db, "registrations"), registrationData);
      console.log("Document saved with ID:", docRef.id);
      return true;
    } catch (error) {
      console.error("Firebase save error:", error);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        const retryRef = await addDoc(collection(db, "registrations"), registrationData);
        console.log("Document saved on retry with ID:", retryRef.id);
        return true;
      } catch (retryError) {
        console.error("Firebase retry save error:", retryError);
        throw retryError;
      }
    } finally {
      setLoading(false);
    }
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
    });
  };

  const makePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(null);

    try {
      const res = await initializeRazorpay();
      if (!res) {
        throw new Error("Razorpay SDK failed to load");
      }

      const passDetails = PASS_DETAILS[passType];

      const options = {
        key: "rzp_test_HXKzpEFbUzcNwC",
        amount: passDetails.amount,
        currency: "INR",
        name: "Cynosure 2024",
        description: passDetails.description,
        handler: async function (response: any) {
          try {
            const saved = await saveToFirebaseWithRetry(response, "success");
            if (saved) {
              setSuccess({
                paymentId: response.razorpay_payment_id,
                passName: PASS_DETAILS[passType].name,
              });
            }
          } catch (error: any) {
            console.error("Save Error:", error);
            setError(
              `Payment successful but data save failed. Please save your Payment ID and contact support: ${response.razorpay_payment_id}`
            );
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
        },
        notes: {
          passType: passType,
        },
        theme: {
          color: passType === "tech" ? "#1F4AF6" : passType === "nontech" ? "#8F46FF" : "#FF6B6B",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", async function (response: any) {
        try {
          await saveToFirebaseWithRetry(response, "failed");
          setError("Payment failed: " + response.error.description);
        } catch (error) {
          console.error("Save Error:", error);
          setError("Payment failed. Please try again later.");
        }
      });

      paymentObject.open();
    } catch (error) {
      console.error("Payment Error:", error);
      setError(error instanceof Error ? error.message : "Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };

  const getButtonGradient = () => {
    switch (passType) {
      case "tech":
        return "from-[#1F4AF6] to-[#1BC7FB]";
      case "nontech":
        return "from-[#8F46FF] to-[#FF6B6B]";
      case "combo":
        return "from-[#FF6B6B] to-[#FFB547]";
      default:
        return "from-[#1F4AF6] to-[#1BC7FB]";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => !loading && onClose()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md p-6 bg-n-8 rounded-[30px] shadow-xl"
          >
            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-500"
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
                <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
                <p className="text-n-4 mb-4">Your registration has been confirmed</p>
                <div className="bg-n-6 rounded-lg p-4 mb-6">
                  <p className="text-n-4 mb-2">
                    Pass Type: <span className="text-white">{success.passName}</span>
                  </p>
                  <p className="text-n-4 mb-2">
                    Payment ID: <span className="text-white">{success.paymentId}</span>
                  </p>
                  <p className="text-n-4 text-sm">
                    Please save this payment ID for future reference
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSuccess(null);
                    setFormData({ name: "", email: "", mobile: "" });
                    onClose();
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-center mb-2 text-white">
                  {PASS_DETAILS[passType].name}
                </h2>
                <p className="text-n-4 text-center mb-6">
                  Amount: ₹{PASS_DETAILS[passType].amount / 100}
                </p>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={makePayment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-n-4 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-n-6 text-white border border-n-6 focus:border-[#1F4AF6] focus:outline-none transition-colors"
                      placeholder="Enter your name"
                      pattern="[A-Za-z ]{3,50}"
                      title="Name should be between 3 and 50 characters and contain only letters"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-n-4 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-n-6 text-white border border-n-6 focus:border-[#1F4AF6] focus:outline-none transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-n-4 mb-1">Mobile</label>
                    <input
                      type="tel"
                      name="mobile"
                      required
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-n-6 text-white border border-n-6 focus:border-[#1F4AF6] focus:outline-none transition-colors"
                      placeholder="Enter your mobile number"
                      pattern="[0-9]{10}"
                      title="Please enter a valid 10-digit mobile number"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-6 rounded-full bg-gradient-to-r ${getButtonGradient()} text-white font-semibold hover:shadow-lg hover:shadow-n-1/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      `Pay Now - ₹${PASS_DETAILS[passType].amount / 100}`
                    )}
                  </button>
                </form>

                {!loading && (
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-n-4 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </>
            )}

            {loading && (
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-[30px] flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <svg
                    className="animate-spin h-10 w-10 text-white mb-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <p className="text-white font-medium">Processing your payment...</p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
