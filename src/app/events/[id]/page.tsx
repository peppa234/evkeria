"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SingleEventContent from "./SingleEventContent";
import { Loader2 } from "lucide-react";

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

export default function EventPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/events/${id}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 404) {
          const errorMsg = errorData.error?.message || "Event not found";
          setError(errorMsg);
        } else {
          const errorMsg = errorData.error?.message || "Failed to fetch event";
          throw new Error(errorMsg);
        }
        return;
      }

      const data = await res.json();
      // Standardized format: { success: true, data: { id, title, ... } }
      if (data.success && data.data) {
        setEvent(data.data);
      } else {
        setError("Event not found");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load event");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#1e4e79]" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error || "Event not found"}</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-[#1e4e79] text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="relative w-full min-h-[320px] h-auto lg:min-h-[520px]">
        <Image
          src={event.imageUrl || "/image.png"}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(270deg,rgba(55,144,223,0.49)_0%,rgba(30,78,121,0.49)_56%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 pt-[100px] sm:pt-[120px] lg:pt-44 pb-8 lg:pb-20">
          <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
            <div className="lg:flex-1 text-white">
              <h1 className="hero-title font-outfit font-bold text-2xl sm:text-3xl lg:text-5xl leading-tight mb-2">
                {event.title}
              </h1>
              <p className="hero-subtitle text-sm lg:text-base font-outfit text-[rgba(255,255,255,0.95)] mb-3 lg:mb-4">
                Organized by {event.organization?.name || "Unknown Organization"}
              </p>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap mt-4 sm:mt-6 lg:mt-8">
                {event.location && (
                  <div className="flex items-center gap-2 h-8 sm:h-9 bg-[#f0f8ff] rounded-full px-2 sm:px-3">
                    <Image src="/frame-3.svg" alt="location" width={16} height={16} />
                    <span className="text-[#1e4e79] text-xs sm:text-sm">{event.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 h-8 sm:h-9 bg-[#f0f8ff] rounded-full px-2 sm:px-3">
                  <Image src="/frame-4.svg" alt="date" width={16} height={16} />
                  <span className="text-[#1e4e79] text-xs sm:text-sm">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2 h-8 sm:h-9 bg-[#f0f8ff] rounded-full px-2 sm:px-3">
                  <span className="text-[#1e4e79] text-xs sm:text-sm">{event.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SingleEventContent event={event} />
    </div>
  );
}
