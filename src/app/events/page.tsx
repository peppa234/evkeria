"use client";

import Image from "next/image";
import Link from "next/link";
import { EventCard } from "@components/EventCard/EventCard";
import { SearchBar } from "@components/SearchBar/SearchBar";
import { dummyEvents, Event } from "@data/dummy-events";
import { useSearch } from "@hooks/useSearch";

// Icon paths - using existing icons from public folder
const locationIcon = "/frame-3.svg";
const dateIcon = "/frame-4.svg";
const categoryIcon = "/frame-2.svg";

export default function EventsPage() {
  const { searchQuery, setSearchQuery, filteredEvents } = useSearch(dummyEvents);
  
  // Use first event as featured event for hero section
  const featuredEvent = filteredEvents[0] || dummyEvents[0];
  const otherEvents = filteredEvents.length > 1 ? filteredEvents.slice(1) : filteredEvents;

  const eventTags = [
    { icon: locationIcon, text: featuredEvent.location },
    { icon: dateIcon, text: featuredEvent.date },
    { icon: categoryIcon, text: featuredEvent.category },
  ];

  return (
    <div className="bg-white overflow-hidden w-full relative min-h-screen">
      {/* Hero Section - Featured Event */}
      <div className="relative w-full h-[600px] lg:h-[916px]">
        <div className="absolute inset-0">
          <Image
            src={featuredEvent.image || "/image.png"}
            alt="Event Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[linear-gradient(270deg,rgba(55,144,223,0.49)_0%,rgba(30,78,121,0.49)_56%)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 pt-32 lg:pt-[474px] pb-20 px-8 lg:px-[75px]">
          <h1 className="font-outfit font-semibold text-white text-4xl lg:text-[64px] tracking-[0] leading-tight mb-8 lg:mb-[68px] max-w-4xl">
            {featuredEvent.title}
          </h1>
          <p className="font-outfit font-normal text-[#e4e5e6] text-base lg:text-lg tracking-[0] leading-7 mb-8 lg:mb-[52px]">
            Organized by {featuredEvent.organization}
          </p>
          <div className="flex gap-3 flex-wrap">
            {eventTags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-2 h-9 bg-[#f0f8ff] rounded-full px-4"
              >
                <div className="w-4 h-4 relative">
                  <Image
                    className="w-full h-full object-contain"
                    alt=""
                    src={tag.icon}
                    width={16}
                    height={16}
                  />
                </div>
                <span className="font-outfit font-medium text-[#1e4e79] text-sm tracking-[0] leading-5 whitespace-nowrap">
                  {tag.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Vector at Bottom */}
        <div className="absolute bottom-0 left-0 w-full h-48 lg:h-[234px]">
          <Image
            src="/vector-5.svg"
            alt=""
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="relative bg-white pt-12 lg:pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          {/* Search Section */}
          <div className="mb-12">
            <SearchBar onSearch={setSearchQuery} placeholder="Search events..." />
          </div>

          {/* Page Title */}
          <div className="mb-12">
            <h2 className="font-outfit font-semibold text-[#1e1e1e] text-3xl lg:text-4xl tracking-[0] leading-8 mb-4">
              {searchQuery ? `Search Results (${filteredEvents.length})` : "Browse All Events"}
            </h2>
            {!searchQuery && (
              <p className="font-outfit font-normal text-gray-600 text-base tracking-[0] leading-6">
                Explore workshops, conferences, and networking opportunities
              </p>
            )}
          </div>

          {/* Events Grid - Show featured event card as well if there are multiple events */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-outfit font-normal text-gray-600 text-lg mb-4">
                No events found matching your search.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="font-outfit font-medium text-[#1e4e79] hover:text-[#4fa3e3] transition-colors"
              >
                Clear search
              </button>
            </div>
          )}

          {/* You Might Also Like Section */}
          {!searchQuery && filteredEvents.length > 3 && (
            <section className="mt-20 pt-12 border-t border-gray-200">
              <h2 className="font-outfit font-semibold text-[#1e1e1e] text-2xl tracking-[0] leading-8 mb-12">
                You Might Also Like
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredEvents.slice(1, 4).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}