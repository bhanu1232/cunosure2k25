import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Clock, ArrowRight } from "lucide-react";
import { ESPORTS_EVENTS } from "@/constants";
import Link from "next/link";

const Esports = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {ESPORTS_EVENTS.map((item, index) => (
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
            <div className="relative h-40 sm:h-44 overflow-hidden shrink-0">
              <Image
                src={item.icon}
                alt={item.title}
                width={400}
                height={300}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090f] via-[#09090f]/30 to-transparent" />
              {/* Spot badge */}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-bold tracking-wide">
                SPOT
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-5 flex flex-col flex-1">
              <h3 className="text-sm sm:text-base font-bold text-white mb-2 line-clamp-2 leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-white/40 mb-4 flex-1 line-clamp-3 leading-relaxed">
                {item.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-white/50 text-xs">
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{item.players}</span>
                </div>
                <div className="flex items-center gap-2 text-white/50 text-xs">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{item.schedule}</span>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-3 border-t border-white/[0.05] mt-auto">
                <Link
                  href={`/events/esport/${item.id}`}
                  className="flex items-center justify-between w-full group/btn"
                >
                  <span className="text-xs sm:text-sm font-semibold text-white/70 group-hover/btn:text-white transition-colors">
                    View Details
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center group-hover/btn:bg-white/10 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 text-white/50 group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-all" />
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

export default Esports;
