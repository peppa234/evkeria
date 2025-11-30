"use client";
import Image from "next/image";
import { EventCard } from "@components/EventCard/EventCard";
import { SearchBar } from "@components/SearchBar/SearchBar";
import { dummyEvents } from "@data/dummy-events";
import { useSearch } from "@hooks/useSearch";
import { useMemo, useState } from "react";
import { Pagination } from "@components/Pagination/Pagination";

export default function EventsPage() {
  const { searchQuery, setSearchQuery, filteredEvents } =
    useSearch(dummyEvents);

  // Filters (local)
  const [queryInput, setQueryInput] = useState("");
  const [wilaya, setWilaya] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [time, setTime] = useState<string>("");

  // Submit merges the big input with useSearch
  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(queryInput.trim());
    setCurrentPage(1);
  };

  // Apply additional client filters on top of useSearch results
  const fullyFilteredEvents = useMemo(() => {
    return filteredEvents.filter((ev) => {
      const wilayaOk = wilaya
        ? ev.location.toLowerCase() === wilaya.toLowerCase()
        : true;
      const typeOk = type
        ? ev.category.toLowerCase() === type.toLowerCase() ||
          ev.badge.toLowerCase() === type.toLowerCase()
        : true;

      // Basic time filter examples; adjust to your real data if you have start/end dates
      const timeOk = (() => {
        if (!time) return true;
        const d = new Date(ev.date); // expects parseable date strings
        const today = new Date();
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

      return wilayaOk && typeOk && timeOk;
    });
  }, [filteredEvents, wilaya, type, time]);

  // Pagination: 12 per page
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const totalItems = fullyFilteredEvents.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedEvents = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return fullyFilteredEvents.slice(start, start + pageSize);
  }, [fullyFilteredEvents, safePage]);

  return (
    <div className="bg-white w-full overflow-x-hidden">
      {/* Hero (same height as home page) */}
      <section className="relative min-h-screen overflow-hidden">
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

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-16">
          <div className="w-full max-w-4xl xl:max-w-[1031px] text-center animate-fade-in">
            <h1
              className="font-outfit font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[96px] leading-tight sm:leading-normal lg:leading-[121px] text-white mx-auto animate-slide-up"
              style={{
                textShadow: "0px 4px 54.7px rgba(79, 163, 227, 0.63)",
              }}
            >
              Discover Opportunities
            </h1>
            <p className="font-outfit font-normal text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[24px] leading-relaxed text-white text-center mt-4 sm:mt-6 mx-auto max-w-3xl animate-slide-up delay-100">
              Find events, volunteering programs, and learning experiences
              across Algeria.
            </p>

            <div className="flex gap-4 animate-slide-up delay-200"></div>
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

      <section className="py-16 bg-white">
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
          />

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <Pagination
            currentPage={safePage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>
    </div>
  );
}
