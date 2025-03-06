import Heading from "@/components/atoms/heading";
import Section from "@/components/layout/section";
import { images } from "@/constants";
import Image from "next/image";
import React from "react";
import PricingList from "./pricing-list";
import { LeftLine, RightLine } from "@/components/design/pricing";

const Pricing = () => {
  return (
    <Section id="pricing" className="overflow-hidden">
      <div className="container relative z-2">
        {/* Heading */}
        <div className="relative mb-16 text-center">
          <Heading tag="Get Ready for Cynosure" className="mx-auto max-w-2xl" />
          <p className="mx-auto mt-4 max-w-xl text-n-3">
            Register for the events you want to attend and join us for an unforgettable experience
            at Cynosure 2025.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="relative">
          <PricingList />
          <LeftLine />
          <RightLine />
        </div>
      </div>

      {/* Background Gradients */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[50rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-n-6/50 to-transparent blur-3xl" />
    </Section>
  );
};

export default Pricing;
