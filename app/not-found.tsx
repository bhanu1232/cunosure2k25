import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#100C1B] text-white">
      <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] bg-clip-text text-transparent">
        404 - Page Not Found
      </h2>
      <p className="text-white/60 mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] text-white font-medium hover:opacity-90 transition-opacity"
      >
        Return Home
      </Link>
    </div>
  );
}
