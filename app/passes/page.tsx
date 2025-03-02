"use client";
import React, { useState } from "react";
import { db } from "@/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import Link from "next/link";

const PassesPage = () => {
  const [email, setEmail] = useState("");
  const [passes, setPasses] = useState<Array<{ name: string; url: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Query Firestore for passes associated with the email
      const passesRef = collection(db, "passes");
      const q = query(passesRef, where("email", "==", email.toLowerCase()));
      const querySnapshot = await getDocs(q);

      const passesData = querySnapshot.docs.map((doc) => ({
        name: doc.data().name || "Unnamed Pass",
        url: doc.data().pdfPath,
      }));

      setPasses(passesData);
      if (passesData.length === 0) {
        setError("No passes found for this email");
      }
    } catch (err) {
      setError("Error fetching passes. Please try again.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        {/* Navigation */}
        <nav className="mb-8">
          <Link
            href="/"
            className="text-lg font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
          >
            Back to Home
          </Link>
        </nav>

        {/* Main Content */}
        <div className="rounded-xl border border-cyan-400 bg-gray-800 p-6 shadow-[0_0_15px_rgba(34,211,238,0.3)] sm:p-8">
          <h1 className="mb-8 text-center text-2xl font-bold text-white sm:text-3xl">
            Download Your Passes
          </h1>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col gap-4 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Gmail ID"
                className="flex-1 rounded-lg border border-cyan-400 bg-gray-700 p-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-cyan-500 px-8 py-3 text-white transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-gray-600 sm:w-auto"
              >
                {loading ? "Searching..." : "Search Passes"}
              </button>
            </div>
          </form>

          {error && (
            <div className="mb-6 rounded-lg border border-red-500 bg-red-900/50 p-4 text-center text-red-400">
              {error}
            </div>
          )}

          {passes.length > 0 && (
            <div className="space-y-6">
              <h2 className="mb-4 text-xl font-semibold text-white">Available Passes</h2>
              <div className="grid gap-4">
                {passes.map((pass, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-between gap-4 rounded-lg border border-cyan-400 bg-gray-700 p-4 transition-shadow hover:shadow-[0_0_10px_rgba(34,211,238,0.2)] sm:flex-row"
                  >
                    <span className="text-center font-medium text-white sm:text-left">
                      {pass.name}
                    </span>
                    <a
                      href={pass.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full rounded-lg bg-cyan-500 px-6 py-2 text-center text-white transition-colors hover:bg-cyan-400 sm:w-auto"
                    >
                      Download PDF
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PassesPage;
