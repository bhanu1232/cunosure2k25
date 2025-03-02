import React from "react";
import Section from "@/components/layout/section";
import Heading from "../../atoms/heading";
import { events, fun } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { Props } from "next/script";

const Benefits = (props: Props) => {
  // Select top 4 tech events and top 2 fun events
  const topTechEvents = events.slice(0, 4);
  const topFunEvents = fun.slice(0, 2);

  // Combine and shuffle the events
  const mixedEvents = [...topTechEvents, ...topFunEvents].sort(() => Math.random() - 0.5);

  return (
    <Section id="features">
      <div className="container relative z-2">
        <Heading className="md:max-w-md lg:max-w-2xl" title="Featured Events at Cynosure" />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {mixedEvents.map((item) => (
            <Link href={`/even${item.type === "fun" ? "/fun" : ""}/${item.id}`} key={item.id}>
              <div className="group relative block h-[450px] overflow-hidden rounded-2xl border border-n-6 bg-n-7 transition-colors hover:border-cyan-400">
                {/* Image Container */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={item.imageUrl || "/assets/placeholder.jpg"}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Content Container */}
                <div className="relative z-2 flex h-[calc(450px-192px)] flex-col p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h5 className="text-2xl font-semibold text-white">{item.title}</h5>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        item.type === "fun"
                          ? "bg-purple-500/10 text-purple-500"
                          : "bg-cyan-500/10 text-cyan-500"
                      }`}
                    >
                      {item.type === "fun" ? "Fun Event" : "Tech Event"}
                    </span>
                  </div>
                  <p className="mb-4 line-clamp-3 grow text-sm text-n-3">{item.text}</p>

                  {/* Prize and Button Container */}
                  <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-n-3">Prize Pool</p>
                      <p className="text-lg font-bold text-cyan-400">₹{item.prize}</p>
                    </div>
                    <button className="w-full rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-400">
                      View Details
                    </button>
                  </div>
                </div>

                {/* Gradient Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-n-7/80 to-n-7" />
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-10 flex justify-center">
        <Link
          className="border-b font-code text-xs font-bold uppercase tracking-wider"
          href="/even"
        >
          Explore all events
        </Link>
      </div>
    </Section>
  );
};

export default Benefits;
