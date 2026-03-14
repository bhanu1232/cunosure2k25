"use client";
import React from "react";
import { events } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Calendar, MapPin, Users, CheckCircle2, ArrowRight } from "lucide-react";

const Benefits = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {events.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.4, delay: index * 0.07 }}
          className="group"
        >
          <div className="relative h-full rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] overflow-hidden transition-colors duration-300 flex flex-col">
            {/* Image */}
            <div className="relative h-44 sm:h-48 overflow-hidden shrink-0">
              <Image
                src={item.backgroundUrl || "/assets/placeholder.jpg"}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090f] via-[#09090f]/30 to-transparent" />
              {/* Prize badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-semibold">
                <Trophy className="w-3 h-3 text-white/70" />
                ₹{item.prize}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-base sm:text-lg font-bold text-white mb-4 line-clamp-2 leading-snug">
                {item.title}
              </h3>

              <div className="space-y-2 mb-5 flex-1">
                <div className="flex items-center gap-2 text-white/50 text-xs sm:text-sm">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{item.date || "Date TBA"}</span>
                </div>
                <div className="flex items-center gap-2 text-white/50 text-xs sm:text-sm">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{item.venue || "Venue TBA"}</span>
                </div>
                <div className="flex items-center gap-2 text-white/50 text-xs sm:text-sm">
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{item.teamSize || "Individual"}</span>
                </div>
                <div className="flex items-center gap-2 text-white/50 text-xs sm:text-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{item.spot || "Spot Registration Available"}</span>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4 border-t border-white/[0.05] mt-auto">
                <Link
                  href={`/events/${item.id}`}
                  className="flex items-center justify-between w-full group/btn"
                >
                  <span className="text-sm font-semibold text-white/70 group-hover/btn:text-white transition-colors">
                    View Details
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center group-hover/btn:bg-white/10 transition-colors">
                    <ArrowRight className="w-4 h-4 text-white/50 group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Benefits;
