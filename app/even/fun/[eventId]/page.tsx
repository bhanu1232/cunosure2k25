"use client";
import { fun } from "@/constants";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
const FunEventDetailPage = ({ params }: { params: { eventId: string } }) => {
  const event = fun.find((e) => e.id === params.eventId);

  if (!event) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-n-8 px-4 py-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <nav className="mb-8">
          <Link
            href="/even"
            className="text-lg font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
          >
            Back to Events
          </Link>
        </nav>

        <div className="rounded-xl border border-n-6 bg-n-7 p-6 shadow-lg sm:p-8">
          <h1 className="mb-4 text-3xl font-bold text-white">{event.title}</h1>

          <div className="mb-8">
            <Image
              src={event.imageUrl}
              alt={event.title}
              width={800}
              height={400}
              className="h-64 w-full rounded-lg object-cover"
            />
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">About the Event</h2>
            <p className="whitespace-pre-line text-n-3">{event.fullDescription}</p>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">Rules</h2>
            <ul className="list-inside list-disc space-y-2 text-n-3">
              {event.rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">Requirements</h2>
            <ul className="list-inside list-disc space-y-2 text-n-3">
              {event.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">Prize Pool</h2>
            <p className="text-3xl font-bold text-cyan-400">₹{event.prize}</p>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">Event Coordinators</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {event.coordinators.map((coordinator, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-n-6 bg-n-8 p-4 transition-colors hover:border-cyan-400"
                >
                  <h3 className="mb-2 text-lg font-medium text-white">{coordinator.name}</h3>
                  <div className="space-y-1 text-n-3">
                    <p className="flex items-center gap-2">
                      <span>📱</span>
                      <a href={`tel:${coordinator.phone}`} className="hover:text-cyan-400">
                        {coordinator.phone}
                      </a>
                    </p>
                    <p className="flex items-center gap-2">
                      <span>📸</span>
                      <a
                        href={`https://instagram.com/${coordinator.insta}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-cyan-400"
                      >
                        @{coordinator.insta}
                      </a>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/#pricing"
            className="inline-block rounded-lg bg-cyan-500 px-8 py-3 text-center text-white transition-colors hover:bg-cyan-400"
          >
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FunEventDetailPage;
