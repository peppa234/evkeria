"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users, ExternalLink } from "lucide-react";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { EventCard } from "@components/EventCard/EventCard";
import { useEffect, useState } from "react";
import { SafeMarkdown } from "@components/SafeMarkdown";

interface ApiEvent {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  date: string;
  registrationDeadline?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  category: string;
  status: string;
  maxAttendees?: number;
  price: number;
  applicationLink?: string;
  organization?: {
    _id: string;
    name: string;
    logoUrl?: string;
    email?: string;
    websiteUrl?: string;
    description?: string;
  };
}

type Props = {
  event: ApiEvent;
};

interface RelatedEvent {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  category: string;
  organization?: {
    name: string;
  };
  location?: string;
  date: string;
}

interface EventCardData {
  id: string;
  title: string;
  description: string;
  image: string;
  badge: string;
  badgeColor: string;
  organization: string;
  location: string;
  date: string;
  category: string;
  hasOverlay: boolean;
}

export default function SingleEventContent({ event }: Props) {
  const [relatedEvents, setRelatedEvents] = useState<EventCardData[]>([]);

  useEffect(() => {
    fetchRelatedEvents();
  }, [event.category]);

  const fetchRelatedEvents = async () => {
    try {
      const res = await fetch(`/api/events?category=${event.category}&limit=3`);
      if (res.ok) {
        const data = await res.json();
        // Standardized format: { success: true, data: { events: [...] } }
        const events: RelatedEvent[] = data.success && data.data?.events ? data.data.events : [];
        // Filter out current event and map to card format
        const filtered: EventCardData[] = events
          .filter((e) => e.id !== event.id)
          .slice(0, 3)
          .map((e) => ({
            id: e.id,
            title: e.title,
            description: e.description || "",
            image: e.imageUrl || "/image.png",
            badge: e.category,
            badgeColor: "bg-[#f7c948]",
            organization: e.organization?.name || "Unknown Organization",
            location: e.location || "",
            date: new Date(e.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            category: e.category,
            hasOverlay: false,
          }));
        setRelatedEvents(filtered);
      }
    } catch (err) {
      // Error fetching related events - fail silently
    }
  };

  const eventDate = new Date(event.date);
  const formattedMonth = eventDate.toLocaleDateString("en-US", { month: "long" });
  const formattedDay = eventDate.getDate();
  const formattedYear = eventDate.getFullYear();

  const timeRange = event.startTime && event.endTime
    ? `${event.startTime} - ${event.endTime}`
    : event.startTime || "TBD";

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Main content */}
      <main className="lg:col-span-2 space-y-8">
        <section aria-labelledby="about-title" className="bg-white rounded-2xl shadow p-6">
          <h2 id="about-title" className="text-2xl font-outfit font-semibold text-[#1e1e1e] mb-4">
            About this Event
          </h2>
          {event.description ? (
            <div className="text-gray-700 leading-relaxed prose prose-slate max-w-none">
              <SafeMarkdown
                className=""
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                }}
              >
                {event.description}
              </SafeMarkdown>
            </div>
          ) : (
            <p className="text-gray-700 leading-relaxed">No description available for this event.</p>
          )}
        </section>

        {event.organization && (
          <section aria-labelledby="organized-title" className="bg-white rounded-2xl shadow p-6">
            <h2 id="organized-title" className="text-2xl font-outfit font-semibold text-[#1e1e1e] mb-4">
              Organized By
            </h2>
            <article className="flex items-start gap-4">
              <div className="w-16 h-16 bg-[#f0f8ff] rounded-xl flex items-center justify-center overflow-hidden">
                {event.organization.logoUrl ? (
                  <Image
                    src={event.organization.logoUrl}
                    alt="Organizer logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                ) : (
                  <div className="w-10 h-10 bg-[#1e4e79] rounded-full flex items-center justify-center text-white font-bold">
                    {event.organization.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-outfit font-semibold text-[#1e1e1e]">{event.organization.name}</h3>
                {event.organization.description && (
                  <div className="text-sm text-gray-600 mb-4 prose prose-sm prose-slate max-w-none">
                    <SafeMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                        ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                      }}
                    >
                      {event.organization.description}
                    </SafeMarkdown>
                  </div>
                )}
                {event.organization.websiteUrl && (
                  <a
                    href={event.organization.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#1e4e79] text-sm hover:underline"
                  >
                    Visit Website <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </article>
          </section>
        )}
      </main>

      {/* Sticky right sidebar */}
      <aside className="lg:col-span-1">
        <div className="sticky top-24 space-y-6">
          <Card className="rounded-2xl shadow-lg overflow-hidden">
            <CardContent className="p-6 text-center">
              <div className="text-[#1e1e1e] font-outfit font-bold text-3xl tracking-tight">{formattedMonth}</div>
              <div className="text-[#1e4e79] font-outfit font-bold text-6xl leading-none">{formattedDay}</div>
              <div className="text-gray-600 text-sm">{formattedYear}</div>

              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                <Calendar size={16} />
                <span>{timeRange}</span>
              </div>
              {event.location && (
                <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} />
                  <span>{event.location}</span>
                </div>
              )}

              {event.maxAttendees && (
                <div className="mt-4 text-sm text-gray-700 flex items-center justify-center gap-2">
                  <Users size={16} />
                  <span>Max {event.maxAttendees} attendees</span>
                </div>
              )}

              {event.price > 0 && (
                <div className="mt-4 text-lg font-bold text-[#1e4e79]">
                  {event.price} DZD
                </div>
              )}

              {event.applicationLink ? (
                <a
                  href={event.applicationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-6"
                >
                  <Button className="w-full h-12 bg-[#f7c948] text-black font-outfit font-semibold hover:bg-[#e5b83d]">
                    Apply Now
                  </Button>
                </a>
              ) : (
                <Button
                  className="mt-6 w-full h-12 bg-gray-300 text-gray-600 font-outfit font-semibold cursor-not-allowed"
                  disabled
                >
                  Applications Closed
                </Button>
              )}

              {event.registrationDeadline && (
                <p className="mt-3 text-xs text-gray-500">
                  Registration deadline:{" "}
                  {new Date(event.registrationDeadline).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </aside>

      {/* Related Events */}
      {relatedEvents.length > 0 && (
        <section className="lg:col-span-3 mt-12 bg-white rounded-2xl shadow p-8">
          <h3 className="font-outfit font-semibold text-[#1e4e79] text-xl mb-6">You Might Also Like</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {relatedEvents.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
