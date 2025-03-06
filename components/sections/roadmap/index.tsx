import Button from "@/components/atoms/button";
import Heading from "@/components/atoms/heading";
import TagLine from "@/components/atoms/tag-line";
import { Gradient } from "@/components/design/roadmap";
import Section from "@/components/layout/section";
import { images, roadmap } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type Props = {};

const Roadmap = (props: Props) => {
  return (
    <Section id="roadmap" className="overflow-hidden">
      <div className="container md:pb-10">
        <Heading tag="Ready to get started" title="Experience. Connect. Elevate." />

        <div className="relative grid gap-6 md:grid-cols-2 md:gap-4 md:pb-20">
          {roadmap.map((item) => {
            return (
              <div
                key={item.id}
                className={cn(
                  "group md:flex even:md:translate-y-[5rem] p-0.25 rounded-[2rem] transition-transform duration-500 hover:scale-[1.02]",
                  item.colorful ? "bg-conic-gradient" : "bg-n-6"
                )}
              >
                <div className="relative rounded-[1.9375rem] bg-n-8 p-6 xl:p-8 overflow-hidden">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-n-8/50 to-n-8/0 pointer-events-none z-10" />

                  {/* Background grid with reduced opacity */}
                  <div className="absolute left-0 top-0 max-w-full opacity-30">
                    <Image
                      src={images.grid}
                      alt="grid"
                      width={550}
                      height={550}
                      className="w-full"
                    />
                  </div>

                  <div className="relative z-1">
                    {/* Date tag with glow effect */}
                    <div className="mb-4 inline-block">
                      <TagLine className="backdrop-blur-sm bg-n-1/10 px-4 py-1 rounded-full shadow-lg">
                        {item.date}
                      </TagLine>
                    </div>

                    {/* Image with hover effect */}
                    <div className="-mx-6 -mt-4 mb-6 overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        className="w-full transition-transform duration-500 group-hover:scale-110"
                        width={630}
                        height={420}
                        alt={item.title}
                      />
                    </div>

                    {/* Content with hover effects */}
                    <h4 className="h4 mb-3 transition-colors group-hover:text-color-1">
                      {item.title}
                    </h4>
                    <p className="body-2 text-n-4 line-clamp-3 transition-colors group-hover:text-n-3">
                      {item.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          <Gradient />
        </div>

        <div className="mt-8 flex justify-center md:mt-15 xl:mt-20">
          <Button href="/passes" white className="animate-fade-up">
            Register Now
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default Roadmap;
