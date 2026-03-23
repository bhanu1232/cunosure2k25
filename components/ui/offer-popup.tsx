"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export default function OfferPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup after a short delay so it feels natural
    const timer = setTimeout(() => {
      // Check if they already closed it in this session
      const hasSeenPopup = sessionStorage.getItem("cyno_offer_seen");
      if (!hasSeenPopup) {
        setIsOpen(true);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("cyno_offer_seen", "true");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm transition-opacity duration-300">
      <div 
        className="relative w-full max-w-md animate-[zoomIn_0.3s_ease-out] overflow-hidden rounded-[2rem] p-[2px]"
      >
        {/* Animated gradient border wrapper */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-purple-500 to-amber-500 animate-[spin_4s_linear_infinite]" style={{ backgroundSize: "200% 200%" }} />
        
        {/* Inner Card content */}
        <div className="relative flex h-full w-full flex-col items-center rounded-[calc(2rem-2px)] bg-slate-950/95 p-8 text-center backdrop-blur-xl">
          <button 
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-full bg-white/5 p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>

          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.4)]">
            <span className="text-3xl">👑</span>
          </div>

          <h2 className="mb-2 text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
            Flash Offer!
          </h2>
          
          <h3 className="mb-4 text-xl font-bold text-white">
            Platinum Combo Pass
          </h3>
          
          <p className="mb-6 text-sm leading-relaxed text-white/70">
            Register as a group of <strong className="text-white">3 members</strong> and get full access to all Technical and Non-Technical events.
          </p>

          <div className="mb-8 w-full rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Only</p>
            <p className="my-1 text-5xl font-black text-white">₹1200</p>
            <p className="text-xs font-semibold text-white/50">Equivalent to ₹400 per person!</p>
          </div>

          <Link 
            href="/passes"
            onClick={handleClose}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-8 py-4 text-sm font-black uppercase tracking-[0.15em] text-white shadow-[0_0_20px_rgba(249,115,22,0.5)] transition-all hover:scale-[1.02] active:scale-95"
          >
            <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 group-hover:translate-y-0" />
            <span className="relative z-10">Claim Offer Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
