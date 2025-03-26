import Button from "@/components/atoms/button";
import Heading from "@/components/atoms/heading";
import TagLine from "@/components/atoms/tag-line";
import { Gradient } from "@/components/design/roadmap";
import Section from "@/components/layout/section";
import { images, roadmap } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const Roadmap = () => {
  return (
    <Section id="roadmap" className="overflow-hidden max-sm:pb-3">
      <div className="container md:pb-10 max-sm:mb-1">
        <Heading tag="Ready to get started" title="Experience. Connect. Elevate." />

        <div className="relative grid gap-6 md:grid-cols-2 md:gap-8 md:pb-20">
          {roadmap.map((item, index) => {
            return (
              <div
                key={item.id}
                className={cn(
                  "group relative md:flex even:md:translate-y-[5rem] rounded-[2rem] transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2",
                  "before:absolute before:inset-0 before:rounded-[2rem] before:bg-gradient-to-b before:from-[#4A00E0]/20 before:to-transparent before:opacity-0 before:transition-opacity before:duration-500 group-hover:before:opacity-100",
                  item.colorful ? "bg-gradient-to-br from-[#4A00E0]/10 to-[#8E2DE2]/10" : "bg-n-6"
                )}
              >
                <div className="relative rounded-[1.9375rem] p-6 xl:p-8 overflow-hidden backdrop-blur-sm border border-white/10">
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
                      <TagLine className="backdrop-blur-sm bg-[#4A00E0]/10 px-4 py-1 rounded-full shadow-lg border border-[#4A00E0]/20">
                        {item.date}
                      </TagLine>
                    </div>

                    {/* Image with hover effect */}
                    <div className="-mx-6 -mt-4 mb-6 overflow-hidden rounded-xl">
                      <Image
                        src={item.imageUrl}
                        className="w-full transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                        width={630}
                        height={420}
                        alt={item.title}
                      />
                    </div>

                    {/* Content with hover effects */}
                    <h4 className="h4 mb-4 transition-colors group-hover:text-[#4A00E0] group-hover:drop-shadow-lg">
                      {item.title}
                    </h4>
                    <p className="body-2 text-n-4 mb-6 line-clamp-3 transition-colors group-hover:text-n-3">
                      {item.text}
                    </p>

                    {/* Register button */}
                    <div className="inline-flex transform transition-transform duration-200 hover:scale-105 active:scale-95">
                      <a
                        href={item.toref}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] text-white font-semibold hover:shadow-lg transition-all duration-300 group/btn"
                        target="blank"
                      >
                        Register Now
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </a>
                    </div>
                  </div>

                  {/* Decorative corner gradients */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#4A00E0]/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-tr-[2rem]" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tl from-[#8E2DE2]/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-bl-[2rem]" />
                </div>
              </div>
            );
          })}

          <Gradient />
        </div>

        <div className="mt-12 flex justify-center md:mt-15 xl:mt-20">
          <div className="transform transition-transform duration-200 overflow-hidden  hover:scale-105 active:scale-95">
            <Button
              href="/"
              className="px-8 py-4 bg-white rounded-2xl text-black  font-semibold hover:shadow-[0_0_20px_rgba(74,0,224,0.4)] transition-all duration-300 animate-fade-up group/main flex items-center gap-2 opacity-30 cursor-not-allowed "
            >
              Get Event Pass
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Roadmap;
