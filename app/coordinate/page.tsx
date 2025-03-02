import ButtonGradient from "@/components/svg/button-gradient";
import CoordinateNavbar from "./CoordinateNavbar"; // Import the custom Navbar
import { cn } from "@/lib/utils";
import Benefits from "./events";

export default function Coordinate() {
  return (
    <main>
      {/* Add the custom Navbar */}
      <CoordinateNavbar />

      {/* Main Content */}
      <div className={cn("overflow-hidden pt-[4.75rem] lg:pt-[5.25rem]")}>
        <ButtonGradient />
        <Benefits />
      </div>
    </main>
  );
}
