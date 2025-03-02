"use client";
import Link from "next/link";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Button from "../../components/atoms/button";
import MenuSvg from "../../components/svg/menu-svg";

type Props = {};

const CoordinateNavbar = (props: Props) => {
  const [openNavigation, setOpenNavigation] = useState<boolean>(false);

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
        {/* Logo */}
        <Link href="/" className={cn(`block w-48 xl:mr-8`)}>
          <h2>Cynosure</h2>
        </Link>

        {/* Navigation Links */}
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
            {/* Static Links */}
            <Link
              href="/#about"
              onClick={handleClick}
              className={cn(
                `block relative font-code text-2xl uppercase text-slate-300 transition-colors hover:text-color-1`,
                "px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold",
                "lg:leading-5 lg:hover:text-n-1 xl:px-12"
              )}
            >
              About
            </Link>
            <Link
              href="/#pricing"
              onClick={handleClick}
              className={cn(
                `block relative font-code text-2xl uppercase text-slate-300 transition-colors hover:text-color-1`,
                "px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold",
                "lg:leading-5 lg:hover:text-n-1 xl:px-12"
              )}
            >
              Passes
            </Link>
            <Link
              href="/even"
              onClick={handleClick}
              className={cn(
                `block relative font-code text-2xl uppercase text-slate-300 transition-colors hover:text-color-1`,
                "px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold",
                "lg:leading-5 lg:hover:text-n-1 xl:px-12"
              )}
            >
              Events
            </Link>
            <Link
              href="/coordinate"
              onClick={handleClick}
              className={cn(
                `block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1`,
                "px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold",
                "lg:leading-5 lg:hover:text-n-1 xl:px-12"
              )}
            >
              Coordinators
            </Link>
          </div>
        </nav>

        {/* Register Button */}
        <Button className="hidden lg:flex" href="/#pricing">
          Register
        </Button>

        {/* Hamburger Menu Button */}
        <Button className="ml-auto lg:hidden" px="px-3" onClick={toggleNavigation}>
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>
  );
};

export default CoordinateNavbar;
