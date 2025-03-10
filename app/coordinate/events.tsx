import React from "react";
import Section from "@/components/layout/section";
import Heading from "../../components/atoms/heading";
import { coord } from "@/constants";
import Image from "next/image";
import { Instagram, Mail, Phone } from "lucide-react";

const Benefits = () => {
  // Separate faculty coordinator
  const facultyCoord = coord[0];
  const studentCoords = coord.slice(1);

  return (
    <Section id="features pt-2">
      <div className="container relative z-2">
        <div className="mb-16">
          <Heading className="md:max-w-md lg:max-w-2xl" title="Coordinators" />

          {/* Faculty Coordinator Card */}
          <div className="mx-auto max-w-md">
            <div className="relative overflow-hidden rounded-2xl border border-n-6 bg-n-7 p-6 transition-colors hover:border-cyan-400">
              <div className="flex flex-col items-center">
                <div className="relative size-48 overflow-hidden rounded-full">
                  <Image
                    src={facultyCoord.coordinatorImage}
                    alt={facultyCoord.coordinatorName}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="mb-2 text-2xl max-sm:text-lg  font-semibold text-white">
                  {facultyCoord.coordinatorName}
                </h3>
                <p className="text-lg text-n-3">Coordinator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Student Coordinators Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studentCoords.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl border border-n-6 bg-n-7 p-6 transition-colors hover:border-cyan-400"
            >
              {/* Coordinator Image */}
              <div className="mb-4 flex justify-center">
                <div className="relative size-40 overflow-hidden rounded-full">
                  <Image
                    src={item.coordinatorImage}
                    alt={item.coordinatorName}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>

              {/* Coordinator Info */}
              <div className="text-center">
                <h3 className="mb-2 text-xl font-semibold text-white">{item.coordinatorName}</h3>
                <p className="mb-4 text-sm text-n-3">Student Organizer</p>
              </div>

              {/* Contact Links */}
              <div className="flex justify-center space-x-4">
                {item.title && (
                  <a
                    href={`https://instagram.com/${item.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 rounded-lg bg-n-6 px-4 py-2 text-sm text-n-1 transition-colors hover:bg-n-5"
                  >
                    <Instagram className="size-4 text-pink-500" />
                    <span className="hidden sm:inline">Instagram</span>
                  </a>
                )}
                {item.mail && (
                  <a
                    href={`mailto:${item.mail}`}
                    className="group flex items-center gap-2 rounded-lg bg-n-6 px-4 py-2 text-sm text-n-1 transition-colors hover:bg-n-5"
                  >
                    <Mail className="size-4 text-cyan-500" />
                    <span className="hidden sm:inline">Email</span>
                  </a>
                )}
                {item.contactInfo && !item.contactInfo.includes("@") && (
                  <a
                    href={`tel:${item.contactInfo}`}
                    className="group flex items-center gap-2 rounded-lg bg-n-6 px-4 py-2 text-sm text-n-1 transition-colors hover:bg-n-5"
                  >
                    <Phone className="size-4 text-green-500" />
                    <span className="hidden sm:inline">Call</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Benefits;
