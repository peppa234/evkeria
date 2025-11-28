"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { dummyEvents } from "@data/dummy-events";

export function SavedOpportunities() {
  const router = useRouter();

  const handleOpen = (id: string) => {
    router.push(`/events/${id}`);
  };

  return (
    <section className="max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto mt-6 sm:mt-8 px-4 sm:px-6">
      <div className="rounded-2xl sm:rounded-3xl bg-white shadow-lg overflow-hidden">
        <div className="flex items-center gap-2 bg-[#FDF7E8] px-4 sm:px-6 md:px-8 py-3 sm:py-4 border-b border-[#F1E2BF]">
          <Image
            src="/liked.png"
            alt="Saved opportunities"
            width={20}
            height={20}
            className="w-4 h-4 sm:w-5 sm:h-5"
          />
          <h2 className="font-outfit font-semibold text-base sm:text-lg text-[#0B2443]">
            Saved Opportunities
          </h2>
        </div>

        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 flex flex-col gap-3 sm:gap-4">
          {dummyEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between rounded-xl sm:rounded-2xl border border-[#E4E9F2] px-3 sm:px-4 py-2 sm:py-3 hover:shadow-md transition"
            >
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0">
                  <Image
                    src="/saved_opp.png"
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-outfit font-semibold text-xs sm:text-sm text-[#0B2443] truncate">
                    {event.title}
                  </div>
                  <div className="font-outfit text-[10px] sm:text-xs text-[#6B7280] truncate">
                    {event.date} • {event.location}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleOpen(event.id.toString())}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#E4E9F2] flex items-center justify-center hover:bg-[#EFF4FF] flex-shrink-0 ml-2"
                aria-label="View event details"
              >
                <span className="text-base sm:text-lg text-[#0B2443]">&gt;</span>
              </button>
            </div>
          ))}

          <div className="mt-4 flex justify-center">
            <button className="px-6 py-2 rounded-full border border-[#CBD5F5] text-sm font-outfit text-[#1A2B4C] hover:bg-[#EFF4FF]">
              View All Saved Events
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

