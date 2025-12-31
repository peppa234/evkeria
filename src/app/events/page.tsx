"use client";

import Image from "next/image";
import { EventCard } from "@components/EventCard/EventCard";
import { SearchBar } from "@components/SearchBar/SearchBar";
import { useMemo, useState, useEffect } from "react";
import { Pagination } from "@components/Pagination/Pagination";
import { Loader2 } from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { EventListSkeleton } from "@components/ui/skeleton";

// Type for events from API
interface ApiEvent {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  date: string;
  location?: string;
  category: string;
  status: string;
  price: number;
  organization?: {
    _id: string;
    name: string;
    logoUrl?: string;
  };
}

export default function EventsPage() {
  const { user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [savedEventIds, setSavedEventIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [queryInput, setQueryInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [wilaya, setWilaya] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch events and saved events
  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchSavedEventIds();
    }
  }, [isAuthenticated, user]);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/events?limit=100");
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMsg = errorData.error?.message || "Failed to fetch events";
        throw new Error(errorMsg);
      }

      const data = await res.json();
      // Standardized format: { success: true, data: { events: [...] } }
      if (data.success && data.data?.events) {
        setEvents(data.data.events);
      } else {
        setEvents([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSavedEventIds = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/users/${user.id}/saved-events`);
      if (res.ok) {
        const data = await res.json();
        // Standardized format: { success: true, data: { savedEvents: [...] } }
        // savedEvents can be either populated event objects or just IDs
        if (data.success && data.data?.savedEvents) {
          const savedEvents = data.data.savedEvents;
          // Handle both populated objects and IDs
          interface SavedEventItem {
            _id?: string;
          }
          const ids = savedEvents.map((e: SavedEventItem | string) => {
            // If it's a populated event object, use _id, otherwise it's already an ID
            return String(typeof e === 'object' && e._id ? e._id : e);
          });
          setSavedEventIds(ids);
        } else {
          setSavedEventIds([]);
        }
      }
    } catch (err) {
      setSavedEventIds([]);
    }
  };

  // Convert API event to format EventCard expects
  const mapApiEventToCardEvent = (apiEvent: ApiEvent) => {
    const eventId = String(apiEvent.id);
    return {
      id: eventId,
      title: apiEvent.title,
      description: apiEvent.description || "",
      image: apiEvent.imageUrl || "/image.png",
      badge: apiEvent.category,
      badgeColor: "bg-[#f7c948]",
      organization: apiEvent.organization?.name || "Unknown Organization",
      location: apiEvent.location || "",
      date: new Date(apiEvent.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      category: apiEvent.category,
      hasOverlay: false,
      isFav: savedEventIds.includes(eventId),
    };
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(queryInput.trim());
    setCurrentPage(1);
  };

  // Apply all filters
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      // Search filter
      const searchOk = !searchQuery || 
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ev.description?.toLowerCase().includes(searchQuery.toLowerCase()));

      // Location filter
      const wilayaOk = !wilaya || 
        ev.location?.toLowerCase() === wilaya.toLowerCase();

      // Category/type filter
      const typeOk = !type || 
        ev.category.toLowerCase() === type.toLowerCase();

      // Time filter
      const timeOk = (() => {
        if (!time) return true;
        const d = new Date(ev.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (time === "This Week") {
          const in7 = new Date(today);
          in7.setDate(in7.getDate() + 7);
          return d >= today && d <= in7;
        }
        if (time === "This Month") {
          return (
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear()
          );
        }
        if (time === "Upcoming") {
          return d >= today;
        }
        return true;
      })();

      return searchOk && wilayaOk && typeOk && timeOk;
    });
  }, [events, searchQuery, wilaya, type, time]);

  // Pagination
  const pageSize = 12;
  const totalItems = filteredEvents.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedEvents = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredEvents.slice(start, start + pageSize);
  }, [filteredEvents, safePage]);

  // Map to card format
  const cardEvents = paginatedEvents.map(mapApiEventToCardEvent);

  // Extract unique locations and categories from events
  const availableLocations = useMemo(() => {
    const locations = events
      .map((e) => e.location)
      .filter((loc): loc is string => !!loc && loc.trim() !== "");
    return [...new Set(locations)].sort();
  }, [events]);

  const availableTypes = useMemo(() => {
    const categories = events
      .map((e) => e.category)
      .filter((cat): cat is string => !!cat && cat.trim() !== "");
    return [...new Set(categories)].sort();
  }, [events]);

  return (
    <div className="bg-white w-full overflow-x-hidden">
      <section className="hero-section relative min-h-screen overflow-hidden">
        <Image
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          alt="Hero background"
          src="/people-taking-part-high-protocol-event 1.png"
          fill
          priority
          sizes="100vw"
          quality={90}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(55,144,223,0.35)] to-[rgba(30,78,121,0.35)]" />

        <div className="hero-content relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-16 pt-[90px] sm:pt-[100px] lg:pt-0">
          <div className="w-full max-w-4xl xl:max-w-[1031px] text-center animate-fade-in">
            <h1
              className="hero-title font-outfit font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[96px] 2xl:text-[110px] leading-tight sm:leading-normal lg:leading-[121px] text-white mx-auto animate-slide-up"
              style={{
                textShadow: "0px 4px 54.7px rgba(79, 163, 227, 0.63)",
              }}
            >
              Discover Opportunities
            </h1>
            <p className="hero-subtitle font-outfit font-normal text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[28px] 2xl:text-[32px] leading-relaxed text-white text-center mt-4 sm:mt-6 mx-auto max-w-3xl animate-slide-up delay-100">
              Find events, volunteering programs, and learning experiences
              across Algeria.
            </p>

            <div className="hero-buttons flex gap-4 animate-slide-up delay-200"></div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full pointer-events-none z-10">
          <svg
            className="w-full h-auto block"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,70 Q360,15 720,45 T1440,35 L1440,100 L0,100 Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      <section id="events-section" className="relative z-10 py-16 bg-white isolate">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          <SearchBar
            queryInput={queryInput}
            setQueryInput={setQueryInput}
            wilaya={wilaya}
            setWilaya={setWilaya}
            type={type}
            setType={setType}
            time={time}
            setTime={setTime}
            onSearchSubmit={onSearchSubmit}
            setSearchQuery={setSearchQuery}
            setCurrentPage={setCurrentPage}
            availableLocations={availableLocations}
            availableTypes={availableTypes}
          />

          {isLoading ? (
            <EventListSkeleton count={6} />
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500">{error}</p>
              <button
                onClick={fetchEvents}
                className="mt-4 px-4 py-2 bg-[#1e4e79] text-white rounded-lg"
              >
                Retry
              </button>
            </div>
          ) : cardEvents.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">No events found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cardEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          {!isLoading && !error && cardEvents.length > 0 && (
            <Pagination
              currentPage={safePage}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </section>
    </div>
  );
}
