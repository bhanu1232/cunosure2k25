import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import Benefits from "@/components/sections/benefits";
import Collaboration from "@/components/sections/collaboration";
import Hero from "@/components/sections/hero";
import Roadmap from "@/components/sections/roadmap";
import Services from "@/components/sections/services";
import ButtonGradient from "@/components/svg/button-gradient";
import OfferPopup from "@/components/ui/offer-popup";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <OfferPopup />
      <div className={cn("overflow-hidden pt-[4.75rem] lg:pt-[5.25rem]")}>
        <Navbar />

        {/* Combo Pass Marquee Banner */}
        <div className="relative z-40 flex h-10 w-full overflow-hidden bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 shadow-lg sm:h-12 sm:shadow-[0_0_20px_rgba(249,115,22,0.6)]">
          <Link href="/passes" className="group flex size-full items-center">
            <div className="animate-marquee hover:[animation-play-state:paused]">
              {[...Array(8)].map((_, i) => (
                <span
                  key={i}
                  className="flex shrink-0 items-center whitespace-nowrap px-6 text-xs font-black uppercase tracking-widest text-white sm:text-sm"
                >
                  ⚡ <span className="ml-2 mr-1 text-yellow-200">PLATINUM COMBO PASS:</span> 3
                  MEMBERS FOR ₹1260
                  <span className="ml-2 mr-3 font-semibold text-white/80">
                    (JUST ₹420 EACH!)
                  </span>{" "}
                  🔥 LIMITED TIME OFFER
                </span>
              ))}
            </div>
          </Link>

          {/* Faded Edges for a sleek infinity loop look */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-orange-600 to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-orange-600 to-transparent sm:w-24" />
        </div>

        <Hero />
        <Collaboration />
        <Benefits />
        <Services />
        <Roadmap />
        <Footer />
      </div>
      <ButtonGradient />
    </main>
  );
}
