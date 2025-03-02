"use client";
import React, { useState } from "react";
import { db } from "@/firebase/config";
import { collection, addDoc } from "firebase/firestore";

const UploadPassPage = () => {
  const [email, setEmail] = useState("");
  const [passName, setPassName] = useState("");
  const [pdfLink, setPdfLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfLink || !email) return;

    setLoading(true);
    setStatus(null);

    try {
      // Save data to Firestore
      await addDoc(collection(db, "passes"), {
        email: email.toLowerCase(),
        name: passName,
        pdfPath: pdfLink,
        uploadedAt: new Date().toISOString(),
      });

      setStatus({
        type: "success",
        message: "Pass details saved successfully!",
      });

      // Reset form
      setEmail("");
      setPdfLink("");
      setPassName("");
    } catch (error) {
      console.error("Save error:", error);
      setStatus({
        type: "error",
        message: "Error saving pass details. Please try again.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Add Pass Details</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block font-medium">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border p-2"
            placeholder="Enter recipient's email"
            required
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Pass Name</label>
          <input
            type="text"
            value={passName}
            onChange={(e) => setPassName(e.target.value)}
            className="w-full rounded border p-2"
            placeholder="Enter pass name"
            required
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">PDF Link</label>
          <input
            type="url"
            value={pdfLink}
            onChange={(e) => setPdfLink(e.target.value)}
            className="w-full rounded border p-2"
            placeholder="Enter PDF link"
            required
          />
        </div>

        {status && (
          <div
            className={`rounded p-4 ${
              status.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {status.message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !pdfLink || !email}
          className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Saving..." : "Save Pass Details"}
        </button>
      </form>
    </div>
  );
};

export default UploadPassPage;
