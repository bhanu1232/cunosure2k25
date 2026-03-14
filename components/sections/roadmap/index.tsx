import Heading from "@/components/atoms/heading";
import TagLine from "@/components/atoms/tag-line";
import { Gradient } from "@/components/design/roadmap";
import Section from "@/components/layout/section";
import { images, roadmap } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const Roadmap = () => {
  return (
    <Section id="roadmap" className="overflow-hidden max-sm:pb-3">
      <div className="container md:pb-10 max-sm:mb-1">
        {/* Heading */}

        {/* Cards grid */}
        <div className="relative grid gap-5 md:grid-cols-2 md:gap-6 md:pb-20">
          {roadmap.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "group relative md:flex even:md:translate-y-[4.5rem] rounded-2xl overflow-hidden border transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,0,0,0.45)]",
                item.colorful
                  ? "border-[#4A00E0]/25 bg-gradient-to-br from-[#4A00E0]/10 via-[#0D0A1E] to-[#8E2DE2]/8"
                  : "border-white/[0.07] bg-white/[0.03]"
              )}
            >
              {/* Inner layout */}
              <div className="relative w-full flex flex-col">
                {/* Image block */}
                <div className="relative overflow-hidden h-[220px] sm:h-[260px]">
                  {/* Grid texture */}
                  <div className="absolute inset-0 pointer-events-none z-10 opacity-20">
                    <Image src={images.grid} alt="" fill className="object-cover" />
                  </div>

                  <Image
                    src={item.imageUrl}
                    fill
                    className="object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
                    alt={item.title}
                  />

                  {/* Bottom fade */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#07050F] to-transparent z-20 pointer-events-none" />

                  {/* Date badge */}
                  <div className="absolute top-4 left-4 z-30">
                    <TagLine className="px-3 py-1.5 rounded-full text-xs border border-[#4A00E0]/30 bg-[#07050F]/70 backdrop-blur-md text-white/70 shadow-lg">
                      {item.date}
                    </TagLine>
                  </div>

                  {/* Index number */}
                  <div className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-[11px] font-black text-white/40 tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {/* Content block */}
                <div className="flex flex-col flex-grow p-6 gap-3">
                  <h4 className="text-base md:text-lg font-bold text-white leading-snug group-hover:text-[#8E2DE2] transition-colors duration-300">
                    {item.title}
                  </h4>

                  <p className="text-sm text-white/45 leading-relaxed line-clamp-3 flex-grow">
                    {item.text}
                  </p>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/[0.06]">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/20">
                      Cynosure 2026
                    </span>
                  </div>
                </div>
              </div>

              {/* Colorful card accent line at top */}
              {item.colorful && (
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#8E2DE2] to-transparent opacity-60" />
              )}
            </div>
          ))}

          <Gradient />
        </div>

        {/* CTA */}
        <div className="mt-14 flex flex-col items-center gap-3 md:mt-16 xl:mt-20">
          <Link
            href="/passes"
            className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-xl overflow-hidden font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_40px_rgba(74,0,224,0.35)]"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-white transition-opacity duration-300 group-hover:opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <span className="relative z-10 text-black group-hover:text-white transition-colors duration-300">
              Get Event Pass
            </span>
            <svg
              className="relative z-10 w-4 h-4 text-black group-hover:text-white group-hover:translate-x-1 transition-all duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>

          <p className="text-xs text-white/25 tracking-wide">
            Early bird pricing available. Limited seats.
          </p>
        </div>
      </div>
    </Section>
  );
};

export default Roadmap;
