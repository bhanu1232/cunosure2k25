import ButtonGradient from "@/components/svg/button-gradient";
import CoordinateNavbar from "./CoordinateNavbar"; // Import the custom Navbar
import { cn } from "@/lib/utils";
import Benefits from "./events"; // Import the Benefits component
import Benefits1 from "./nontech";
export default function Even() {
  return (
    <main>
      {/* Add the custom Navbar */}
      <CoordinateNavbar />

      {/* Main Content */}
      <div className={cn("overflow-hidden pt-[4.75rem] lg:pt-[5.25rem]")}>
        <ButtonGradient />
        <Benefits />
        <Benefits1 />
      </div>
    </main>
  );
}
