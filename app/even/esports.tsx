import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Gamepad2, Trophy, Users, Clock } from "lucide-react";
import { ESPORTS_EVENTS } from "@/constants";
import Link from "next/link";
const Esports = () => {
  return (
    <div className="pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        {ESPORTS_EVENTS.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="h-full bg-n-7 rounded-3xl overflow-hidden border border-n-6 hover:border-color-1 transition-colors relative flex flex-col">
              {/* Game icon/image */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-blue-600/20 z-10" />
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-purple-500/90 rounded-full text-white text-xs font-medium z-20 backdrop-blur-sm">
                  spot
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-color-1 transition-colors">
                  {item.title}
                </h3>
                <p className="text-n-3 mb-4 flex-1">{item.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-n-2">
                    <Users className="w-4 h-4 text-color-1" />
                    <span className="text-sm">{item.players}</span>
                  </div>
                  <div className="flex items-center gap-2 text-n-2">
                    <Clock className="w-4 h-4 text-color-1" />
                    <span className="text-sm">{item.schedule}</span>
                  </div>
                  {/* <div className="flex items-center gap-2 text-n-2">
                    <Trophy className="w-4 h-4 text-color-1" />
                    <span className="text-sm">{item.prize}</span>
                  </div> */}
                  <Link
                    href={`/even/esport/${item.id}`}
                    className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-full bg-gradient-to-r from-[#8F46FF] to-[#FF6B6B] hover:shadow-lg hover:shadow-n-1/10 text-white font-medium transition-all duration-200 text-sm group-hover:scale-[1.02]"
                  >
                    View Details
                    <svg
                      className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M4 12h16m-4-4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Esports;
