import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@components/ui/badge";
import { Card, CardContent } from "@components/ui/card";
import { EventCard } from "@components/EventCard/EventCard";
import SingleEventContent from "./SingleEventContent";
import { dummyEvents, type Event } from "@data/dummy-events";

type Props = {
  params: {
    id: string;
  };
};

export function generateStaticParams() {
  return dummyEvents.map((e) => ({ id: e.id.toString() }));
}

export default function EventPage({ params }: Props) {
  const { id } = params;
  const event = dummyEvents.find((e) => e.id.toString() === id);

  if (!event) {
    notFound();
  }

  const relatedEvents = dummyEvents.filter((e) => e.id !== event!.id).slice(0, 3);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="relative w-full h-96 lg:h-[520px]">
        <Image
          src={event!.image}
          alt={event!.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(270deg,rgba(55,144,223,0.49)_0%,rgba(30,78,121,0.49)_56%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 pt-28 lg:pt-44 pb-10 lg:pb-20">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="lg:flex-1 text-white">
              <h1 className="font-outfit font-bold text-3xl lg:text-5xl leading-tight mb-2">
                {event!.title}
              </h1>
              <p className="text-sm lg:text-base font-outfit text-[rgba(255,255,255,0.95)] mb-4">
                Organized by {event!.organization}
              </p>

              <div className="flex items-center gap-3 flex-wrap mt-8">
                <div className="flex items-center gap-2 h-9 bg-[#f0f8ff] rounded-full px-3">
                  <Image src="/frame-3.svg" alt="location" width={16} height={16} />
                  <span className="text-[#1e4e79] text-sm">{event!.location}</span>
                </div>
                <div className="flex items-center gap-2 h-9 bg-[#f0f8ff] rounded-full px-3">
                  <Image src="/frame-4.svg" alt="date" width={16} height={16} />
                  <span className="text-[#1e4e79] text-sm">{event!.date}</span>
                </div>
                <div className="flex items-center gap-2 h-9 bg-[#f0f8ff] rounded-full px-3">
                  <span className="text-[#1e4e79] text-sm">{event!.category}</span>
                </div>
              </div>
            </div>

            {/* Hero right-side card removed as requested */}
          </div>
        </div>
      </div>

      {/* Main content (moved to reusable component) */}
      <SingleEventContent event={event as Event} />
    </div>
  );
}

