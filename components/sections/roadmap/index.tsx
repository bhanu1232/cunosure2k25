import { Gradient } from "@/components/design/roadmap";
import Section from "@/components/layout/section";
import { images, roadmap } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const Roadmap = () => {
  return (
    <Section id="roadmap" className="overflow-hidden bg-[#110c1d] max-sm:pb-3">
      <div className="container bg-[#110c1d] max-sm:mb-1 md:pb-10">
        {/* Heading */}

        {/* Cards grid */}
        <div className="relative mx-auto max-w-[800px] bg-[#110c1d] md:pb-20">
          {roadmap.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "group relative md:flex rounded-3xl overflow-hidden border transition-all duration-500 hover:-translate-y-1.5 w-full mb-10",
                item.colorful
                  ? "border-[#1BC7FB]/30 bg-[#110c1d]"
                  : "border-white/[0.07] bg-white/[0.03]"
              )}
            >
              {/* Inner layout */}
              <div className="relative flex w-full flex-col">
                {/* Image / Map block */}
                <div className="relative h-[250px] w-full overflow-hidden sm:h-[350px]">
                  {item.isMap && item.iframeHtml ? (
                    <div
                      className="absolute inset-0 z-20 size-full"
                      dangerouslySetInnerHTML={{ __html: item.iframeHtml }}
                    />
                  ) : (
                    <>
                      {/* Grid texture */}
                      <div className="pointer-events-none absolute inset-0 z-10 opacity-20">
                        <Image src={images.grid} alt="" fill className="object-cover" />
                      </div>

                      <Image
                        src={item.imageUrl}
                        fill
                        className="scale-105 object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                        alt={item.title}
                      />

                      {/* Bottom fade */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-1/2 bg-gradient-to-t from-[#07050F] to-transparent" />
                    </>
                  )}

                  {/* Index number */}
                  <div className="absolute right-4 top-4 z-30 flex size-8 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-sm">
                    <span className="text-[11px] font-black tabular-nums text-white/40">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {/* Content block */}
                <div className="flex grow flex-col gap-3 p-6">
                  <h4 className="text-base font-bold leading-snug text-white transition-colors duration-300 group-hover:text-[#8E2DE2] md:text-lg">
                    {item.title}
                  </h4>

                  <p className="line-clamp-3 grow text-sm leading-relaxed text-white/45">
                    {item.text}
                  </p>

                  {/* Bottom row */}
                  <div className="mt-2 flex items-center justify-between border-t border-white/[0.06] pt-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/20">
                      Cynosure 2026
                    </span>
                  </div>
                </div>
              </div>

              {/* Colorful card accent line at top */}
              {item.colorful && (
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8E2DE2] to-transparent opacity-60" />
              )}
            </div>
          ))}

          <Gradient />
        </div>

        {/* CTA */}
        <div className="mt-14 flex flex-col items-center gap-3 md:mt-16 xl:mt-20">
          <Link
            href="/passes"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl px-10 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_40px_rgba(74,0,224,0.35)]"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-white transition-opacity duration-300 group-hover:opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <span className="relative z-10 text-black transition-colors duration-300 group-hover:text-white">
              Register Now
            </span>
            <svg
              className="relative z-10 size-4 text-black transition-all duration-200 group-hover:translate-x-1 group-hover:text-white"
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

          <p className="text-xs tracking-wide text-white/25">
            Early bird pricing available. Limited seats.
          </p>
        </div>
      </div>
    </Section>
  );
};

export default Roadmap;
