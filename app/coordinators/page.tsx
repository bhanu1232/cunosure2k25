"use client";

import ButtonGradient from "@/components/svg/button-gradient";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/navbar";
import CoordinatorsContent from "./events";

export default function CoordinatorsPage() {
  return (
    <div className="overflow-hidden bg-n-8">
      <Navbar />
      <CoordinatorsContent />
      <ButtonGradient />
    </div>
  );
}
