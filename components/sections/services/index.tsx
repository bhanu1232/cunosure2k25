"use client";

import React from "react";
import Section from "@/components/layout/section";
import Heading from "../../atoms/heading";
import { brainwaveServices, images } from "@/constants";
import Image from "next/image";

type Props = {};

const Services = (props: Props) => {
  return (
    <Section id="how-to-use">
      <div className="container">
        <Heading
          title="Cynosure Past Highlights"
          text="Relive the excitement and unforgettable moments of Cynosure's past events!"
        />

        <div className="relative">
          <div className="relative z-1 mb-5 flex h-[39rem] items-center overflow-hidden rounded-3xl border border-n-1/10 p-8 lg:p-20 xl:h-[46rem]">
            <div className="pointer-events-none absolute left-0 top-0 h-full md:w-3/5 xl:w-auto">
              <Image
                src={images.service1}
                alt="smartest ai"
                width={800}
                height={730}
                className="size-full object-cover md:object-right"
              />
            </div>

            <div className="relative z-1 ml-auto max-w-[17rem]">
              {/* <h4 className="h4 mb-4">Smartest AI</h4>
              <p className="body-2 mb-12 text-n-3">
                Brainwave unlocks the potential of AI-powered applications
              </p> */}
              <ul className="body-2">
                {brainwaveServices.map((service, index) => (
                  <li key={index} className="flex items-start border-t border-n-6 py-4">
                    <Image src={images.check} alt="check" width={24} height={24} />
                    <p className="ml-4">{service}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Services;
