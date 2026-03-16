"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { navigation } from "@/constants";
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
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 py-4 lg:grid lg:h-[88px] lg:grid-cols-3 lg:px-8">
        {/* === LEFT: Logo === */}
        <div className="flex items-center justify-start lg:col-span-1">
          <Link href="/" className="group flex items-center gap-3 outline-none md:gap-4">
            <div className="relative size-10 overflow-hidden rounded-xl bg-gradient-to-br from-[#8E2DE2] to-[#4A00E0] p-px shadow-lg transition-colors duration-500 group-hover:from-[#1BC7FB] group-hover:to-[#4A00E0] md:size-11">
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-[#0A0514]">
                <Image
                  src="/assets/logo.jpg"
                  width={44}
                  height={44}
                  alt="Cynosure Logo"
                  className="size-full transform-gpu rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
            <motion.span
              className="bg-gradient-to-r from-white to-white/90 bg-clip-text text-lg font-bold tracking-tight text-transparent transition-colors duration-500 group-hover:to-[#1BC7FB] md:text-xl"
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
          <div className="relative z-2 flex w-full flex-col items-center justify-center gap-8 p-8 lg:flex-row lg:gap-2 lg:p-0">
            {navigation.map((item) => {
              const isActive = item.url === hash;
              return (
                <Link
                  key={item.id}
                  href={item.url}
                  onClick={() => handleClick(item.url)}
                  className="group relative block w-full text-center outline-none lg:w-auto lg:px-5 lg:py-2"
                >
                  {/* Desktop Active Indicator - Made Solid */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 hidden rounded-full border border-white/20 bg-[#1A1A32] lg:block"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}

                  {/* Link Text */}
                  <span
                    className={cn(
                      "relative z-10 font-code uppercase text-2xl lg:text-xs font-semibold tracking-wider transition-colors duration-300 block py-2",
                      isActive ? "text-white" : "text-white/60 lg:group-hover:text-white"
                    )}
                  >
                    {item.title}
                  </span>

                  {/* Mobile Underline Indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 h-1 w-12 -translate-x-1/2 rounded-t-full bg-gradient-to-r from-[#4A00E0] to-[#1BC7FB] lg:hidden" />
                  )}
                </Link>
              );
            })}
          </div>
          <HamburgerMenu />
        </nav>

        {/* === RIGHT: CTA & Mobile Hamburger === */}
        <div className="flex items-center justify-end gap-4 lg:col-span-1">
          {/* Desktop Button */}
          <div className="hidden lg:block">
            <Link
              href="/passes"
              className="group relative inline-flex transform-gpu items-center justify-center overflow-hidden rounded-full p-px outline-none transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#8E2DE2] via-[#4A00E0] to-[#1BC7FB] transition-opacity duration-500" />
              <div className="relative rounded-full bg-[#0A0514] px-7 py-2.5 transition-colors duration-500 group-hover:bg-[#1A1A32]">
                <span className="text-sm font-semibold tracking-wide text-white transition-colors duration-300">
                  Register
                </span>
              </div>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="relative z-50 flex size-10 items-center justify-center rounded-full border border-white/10 bg-[#1A1A32] shadow-lg outline-none transition-transform active:scale-95 lg:hidden"
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
