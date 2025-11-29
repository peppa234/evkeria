"use client";

import { EventCard } from "@components/EventCard/EventCard";
import { SearchBar } from "@components/SearchBar/SearchBar";
import { dummyEvents } from "@data/dummy-events";
import { useSearch } from "@hooks/useSearch";

export default function EventsPage() {
  const { searchQuery, setSearchQuery, filteredEvents } = useSearch(dummyEvents);

  return (
    <div className="min-h-screen bg-white pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <h1 className="font-outfit font-semibold text-[#1e4e79] text-5xl lg:text-6xl text-center mb-6">
          Browse Events
        </h1>

        <div className="mb-12">
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}

