import ButtonGradient from "@/components/svg/button-gradient";
import { cn } from "@/lib/utils";
import Benefits from "./events";
import Navbar from "@/components/layout/navbar";
export default function Coordinate() {
  return (
    <main>
      {/* Add the custom Navbar */}
      <Navbar />
      {/* Main Content */}
      <div className={cn("overflow-hidden pt-[4.75rem] lg:pt-[5.25rem]")}>
        <ButtonGradient />
        <Benefits />
      </div>
    </main>
  );
}
