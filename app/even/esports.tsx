import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Gamepad2, Trophy, Users, Clock } from "lucide-react";

const ESPORTS_EVENTS = [
  {
    id: "Free fire",
    icon: "/freefire.webp",
    title: "Free fire",
    price: 500,
    description: "4v4 tactical shooter tournament. Show your skills and strategy.",
    players: "4 players per team",
    schedule: "March 27-28, 2025",
    prize: "₹5,000 Prize Pool",
  },
  {
    id: "bgmi",
    icon: "/bgmi.jpeg",
    title: "BGMI",
    price: 400,
    description: "Battle Royale mobile gaming competition. Last team standing wins.",
    players: "4 players per team",
    schedule: "March 27, 2025",
    prize: "₹3,000 Prize Pool",
  },
];

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
