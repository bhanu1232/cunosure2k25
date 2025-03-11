"use client";

import React, { useRef, useEffect } from "react";
import Section from "@/components/layout/section";
import Heading from "../../components/atoms/heading";
import { coord, coord1 } from "@/constants";
import Image from "next/image";
import { Instagram, Mail, Phone } from "lucide-react";

const Benefits = () => {
  // Separate faculty coordinator and student coordinators
  const facultyCoord = coord[0];
  const studentCoords = coord.slice(1);
  const studentCoords1 = coord1;
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);

  // Function to create auto scroll effect
  const useAutoScroll = (ref: React.RefObject<HTMLDivElement>) => {
    useEffect(() => {
      const scrollContainer = ref.current;
      if (!scrollContainer) return;

      let scrollInterval: NodeJS.Timeout;
      let isPaused = false;

      const startAutoScroll = () => {
        scrollInterval = setInterval(() => {
          if (!isPaused && scrollContainer) {
            scrollContainer.scrollLeft += 1;
            if (
              scrollContainer.scrollLeft >=
              scrollContainer.scrollWidth - scrollContainer.clientWidth
            ) {
              scrollContainer.scrollLeft = 0;
            }
          }
        }, 20);
      };

      startAutoScroll();

      const handleMouseEnter = () => {
        isPaused = true;
      };

      const handleMouseLeave = () => {
        isPaused = false;
      };

      scrollContainer.addEventListener("mouseenter", handleMouseEnter);
      scrollContainer.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        clearInterval(scrollInterval);
        if (scrollContainer) {
          scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
          scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
        }
      };
    }, [ref]);
  };

  // Initialize auto scroll for both sections
  useAutoScroll(scrollRef);
  useAutoScroll(scrollRef2);

  // Component for coordinator cards
  const CoordinatorCards = ({
    scrollReference,
    data,
  }: {
    scrollReference: React.RefObject<HTMLDivElement>;
    data: typeof studentCoords;
  }) => (
    <div className="relative overflow-hidden">
      <div
        ref={scrollReference}
        className="flex gap-6 overflow-x-auto scrollbar-hide transition-all duration-300 ease-linear"
        style={{ scrollBehavior: "auto" }}
      >
        {/* Duplicate cards for infinite scroll effect */}
        {[...data, ...data].map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="min-w-[300px] flex-shrink-0 group relative overflow-hidden rounded-2xl border border-n-6 bg-n-7 p-6 transition-colors hover:border-cyan-400"
          >
            {/* Coordinator Image */}
            <div className="mb-4 flex justify-center">
              <div className="relative size-40 overflow-hidden rounded-full">
                <Image
                  src={item.coordinatorImage}
                  alt={item.coordinatorName}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </div>

            {/* Coordinator Info */}
            <div className="text-center">
              <h3 className="mb-2 text-xl font-semibold text-white">{item.coordinatorName}</h3>
              <p className="mb-4 text-sm text-n-3">Student Organizer</p>
            </div>

            {/* Contact Links */}
            <div className="flex justify-center space-x-4">
              {item.title && (
                <a
                  href={`https://instagram.com/${item.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-lg bg-n-6 px-4 py-2 text-sm text-n-1 transition-colors hover:bg-n-5"
                >
                  <Instagram className="size-4 text-pink-500" />
                  <span className="hidden sm:inline">Instagram</span>
                </a>
              )}
              {item.mail && (
                <a
                  href={`mailto:${item.mail}`}
                  className="group flex items-center gap-2 rounded-lg bg-n-6 px-4 py-2 text-sm text-n-1 transition-colors hover:bg-n-5"
                >
                  <Mail className="size-4 text-cyan-500" />
                  <span className="hidden sm:inline">Email</span>
                </a>
              )}
              {item.contactInfo && !item.contactInfo.includes("@") && (
                <a
                  href={`tel:${item.contactInfo}`}
                  className="group flex items-center gap-2 rounded-lg bg-n-6 px-4 py-2 text-sm text-n-1 transition-colors hover:bg-n-5"
                >
                  <Phone className="size-4 text-green-500" />
                  <span className="hidden sm:inline">Call</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Gradient Overlays */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-n-8 to-transparent"></div>
      <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-n-8 to-transparent"></div>
    </div>
  );

  return (
    <Section id="features pt-2">
      <div className="container relative z-2">
        <div className="mb-16">
          <Heading className="md:max-w-md lg:max-w-2xl" title="Coordinators" />

          {/* Faculty Coordinator Card */}
          <div className="mx-auto max-w-md">
            <div className="relative overflow-hidden rounded-2xl border border-n-6 bg-n-7 p-6 transition-colors hover:border-cyan-400">
              <div className="flex flex-col items-center">
                <div className="relative size-48 overflow-hidden rounded-full">
                  <Image
                    src={facultyCoord.coordinatorImage}
                    alt={facultyCoord.coordinatorName}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="mb-2 text-2xl max-sm:text-lg font-semibold text-white">
                  {facultyCoord.coordinatorName}
                </h3>
                <p className="text-lg text-n-3">Coordinator</p>
              </div>
            </div>
          </div>
        </div>

        {/* First Student Coordinators Section */}
        <div className="mb-20">
          <Heading className="mb-10" title="organizers" />
          <CoordinatorCards scrollReference={scrollRef} data={studentCoords} />
        </div>

        {/* Second Student Coordinators Section */}
        <div>
          <Heading className="mb-10" title="" />
          <CoordinatorCards scrollReference={scrollRef2} data={studentCoords1} />
        </div>
      </div>
    </Section>
  );
};

export default Benefits;

// Add this to your global CSS file
// @layer utilities {
//   .scrollbar-hide::-webkit-scrollbar {
//     display: none;
//   }
//   .scrollbar-hide {
//     -ms-overflow-style: none;
//     scrollbar-width: none;
//   }
//   @keyframes scroll {
//     from { transform: translateX(0); }
//     to { transform: translateX(200%); }
//   }
//   .animate-scroll {
//     animation: scroll 2s linear infinite;
//   }
// }
