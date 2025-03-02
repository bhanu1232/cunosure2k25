import Button from "@/components/atoms/button";
import { images, pricing } from "@/constants";
import React from "react";
import Image from "next/image";

const PricingList = () => {
  return (
    <div className="flex flex-wrap justify-center gap-8">
      {pricing.map((item) => (
        <div
          key={item.id}
          className="group relative w-full max-w-[380px] transform rounded-[2rem] border-2 border-n-6 bg-n-8 p-8 transition-all duration-300 hover:scale-105 hover:border-cyan-400 hover:shadow-2xl sm:w-[380px]"
        >
          {/* Pass Type Badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <div className="rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-1.5">
              <span className="text-sm font-semibold text-white">{item.title} Pass</span>
            </div>
          </div>

          {/* Price */}
          <div className="mb-8 mt-6 text-center">
            <div className="mb-3 flex items-center justify-center">
              <span className="text-2xl font-semibold text-n-1">₹</span>
              <span className="text-6xl font-bold text-n-1">{item.price}</span>
            </div>
            <p className="text-sm text-n-3">{item.description}</p>
          </div>

          {/* Features */}
          <div className="mb-8 space-y-4">
            {item.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-xl border border-n-6 bg-n-7 p-4 transition-colors group-hover:border-n-5"
              >
                <Image
                  src={images.check}
                  width={24}
                  height={24}
                  alt="check"
                  className="text-cyan-500"
                />
                <p className="text-sm text-n-2">{feature}</p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-center font-semibold text-white transition-all hover:from-cyan-600 hover:to-purple-600"
            href="https://forms.gle/Ld5PVS5UEqGFB5Ry8"
          >
            Get Pass Now
          </Button>

          {/* Decorative Elements */}
          <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-transparent blur-2xl" />
          <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500/20 to-transparent blur-2xl" />
        </div>
      ))}
    </div>
  );
};

export default PricingList;
