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
  const handleClick = () => {
    if (!openNavigation) return;
    setOpenNavigation(false);
  };

  return (
    <div
      className={cn(
        `fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm`,
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      )}
    >
      <div className={cn(`flex items-center px-5 max-lg:py-4 lg:px-7.5 xl:px-10`)}>
        <Link href="#hero" className="group block">
          <div className="flex items-center gap-4">
            {/* Logo/Icon */}
            <div className="relative w-10 h-10 md:w-12 md:h-12  rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-[1px] bg-n-8 rounded-xl flex items-center justify-center">
                <Image src={"assets/brainwave-symbol.svg"} width={30} height={30} alt="AI" />
              </div>
            </div>

            {/* Text */}
            <div className="flex flex-col">
              <motion.span
                className="text-lg md:text-xl font-bold  "
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                CYNOSURE
              </motion.span>
            </div>
          </div>
        </Link>

        <nav
          className={cn(
            `fixed inset-x-0 bottom-0 top-20 hidden bg-n-8 lg:static lg:mx-auto lg:flex lg:bg-transparent`,
            openNavigation ? "flex" : "hidden"
          )}
        >
          <div
            className={cn(
              "relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row"
            )}
          >
            {navigation.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                onClick={handleClick}
                className={cn(
                  `block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1`,
                  "px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold",
                  item.url === hash ? "z-2 lg:text-n-1" : "lg:text-n-1/50",
                  "lg:leading-5 lg:hover:text-n-1 xl:px-12"
                )}
              >
                {item.title}
              </Link>
            ))}
          </div>
          <HamburgerMenu />
        </nav>

        <Button className="hidden lg:flex" href="#pricing">
          Register
        </Button>

        <Button className="ml-auto lg:hidden" px="px-3" onClick={toggleNavigation}>
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
