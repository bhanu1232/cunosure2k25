"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { navigation } from "@/constants";
import Button from "../atoms/button";
import MenuSvg from "../svg/menu-svg";
import { HamburgerMenu } from "../design/navbar";
import { motion } from "framer-motion";
import Image from "next/image";

const Navbar = () => {
  const [hash, setHash] = useState<string>("hero");
  const [openNavigation, setOpenNavigation] = useState<boolean>(false);

  useEffect(() => {
    const dynamicNavbarHighlight = () => {
      const sections = document.querySelectorAll("section[id]");

      sections.forEach((current) => {
        if (current === null) return;

        const sectionId = current.getAttribute("id");
        const sectionHeight = (current as HTMLElement).offsetHeight;
        const sectionTop = current.getBoundingClientRect().top - sectionHeight * 0.2;

        if (sectionTop < 0 && sectionTop + sectionHeight > 0 && hash !== sectionId) {
          setHash(`#${sectionId as string}`);
        }
      });
    };

    window.addEventListener("scroll", dynamicNavbarHighlight);

    return () => window.removeEventListener("scroll", dynamicNavbarHighlight);
  }, [hash]);

  const toggleNavigation = () => setOpenNavigation(!openNavigation);
  const handleClick = (url?: string) => {
    if (url) setHash(url);
    if (openNavigation) setOpenNavigation(false);
  };

  return (
    <div
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-colors duration-300 border-b border-white/[0.05] bg-[#0A0514]",
        openNavigation && "h-screen lg:h-auto"
      )}
    >
      {/* 
        Using a 3-column grid for perfect absolute alignment on desktop:
        Col 1: Logo (Left aligned)
        Col 2: Navigation (Center aligned)
        Col 3: CTA Button (Right aligned)
      */}
      <div className="flex items-center justify-between lg:grid lg:grid-cols-3 px-5 py-4 lg:px-8 max-w-[1400px] mx-auto h-[72px] lg:h-[88px]">
        
        {/* === LEFT: Logo === */}
        <div className="flex items-center justify-start lg:col-span-1">
          <Link href="/" className="group flex items-center gap-3 md:gap-4 outline-none">
            <div className="relative w-10 h-10 md:w-11 md:h-11 rounded-xl overflow-hidden shadow-lg p-[1px] bg-gradient-to-br from-[#8E2DE2] to-[#4A00E0] group-hover:from-[#1BC7FB] group-hover:to-[#4A00E0] transition-colors duration-500">
              <div className="absolute inset-0 bg-[#0A0514] rounded-xl flex items-center justify-center">
                <Image
                  src="/assets/logo.jpg"
                  width={44}
                  height={44}
                  alt="Cynosure Logo"
                  className="rounded-xl w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 transform-gpu"
                />
              </div>
            </div>
            <motion.span
              className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent group-hover:to-[#1BC7FB] transition-colors duration-500"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              CYNOSURE
            </motion.span>
          </Link>
        </div>

        {/* === CENTER: Navigation Links === */}
        <nav
          className={cn(
            "fixed inset-x-0 bottom-0 top-[72px] lg:top-0 bg-n-8 lg:static lg:bg-transparent lg:flex lg:items-center lg:justify-center lg:col-span-1",
            openNavigation ? "flex flex-col justify-start pt-12 lg:pt-0" : "hidden"
          )}
        >
          <div className="relative z-2 flex flex-col items-center justify-center gap-8 lg:flex-row lg:gap-2 p-8 lg:p-0 w-full">
            {navigation.map((item) => {
              const isActive = item.url === hash;
              return (
                <Link
                  key={item.id}
                  href={item.url}
                  onClick={() => handleClick(item.url)}
                  className="relative group block lg:px-5 lg:py-2 outline-none w-full lg:w-auto text-center"
                >
                  {/* Desktop Active Indicator - Made Solid */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 rounded-full bg-[#1A1A32] border border-white/20 hidden lg:block"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  
                  {/* Link Text */}
                  <span className={cn(
                    "relative z-10 font-code uppercase text-2xl lg:text-xs font-semibold tracking-wider transition-colors duration-300 block py-2",
                    isActive 
                      ? "text-white" 
                      : "text-white/60 lg:group-hover:text-white"
                  )}>
                    {item.title}
                  </span>

                  {/* Mobile Underline Indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-[#4A00E0] to-[#1BC7FB] rounded-t-full lg:hidden" />
                  )}
                </Link>
              );
            })}
          </div>
          <HamburgerMenu />
        </nav>

        {/* === RIGHT: CTA & Mobile Hamburger === */}
        <div className="flex items-center justify-end lg:col-span-1 gap-4">
          {/* Desktop Button */}
          <div className="hidden lg:block">
            <Link href="/passes" className="group relative inline-flex items-center justify-center p-[1px] rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 outline-none transform-gpu">
              <div className="absolute inset-0 bg-gradient-to-r from-[#8E2DE2] via-[#4A00E0] to-[#1BC7FB] transition-opacity duration-500" />
              <div className="relative bg-[#0A0514] px-7 py-2.5 rounded-full transition-colors duration-500 group-hover:bg-[#1A1A32]">
                <span className="font-semibold text-sm tracking-wide text-white transition-colors duration-300">
                  Register
                </span>
              </div>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            className="lg:hidden relative z-50 flex items-center justify-center w-10 h-10 rounded-full bg-[#1A1A32] border border-white/10 outline-none active:scale-95 transition-transform shadow-lg" 
            onClick={toggleNavigation}
            aria-label="Toggle Menu"
          >
            <MenuSvg openNavigation={openNavigation} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Navbar;
