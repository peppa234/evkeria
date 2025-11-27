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
    <section className="max-w-5xl mx-auto mt-8">
      <div className="rounded-3xl bg-white shadow-lg overflow-hidden">
        <div className="flex items-center gap-2 bg-[#FDF7E8] px-8 py-4 border-b border-[#F1E2BF]">
          <Image
            src="/liked.png"
            alt="Saved opportunities"
            width={20}
            height={20}
          />
          <h2 className="font-outfit font-semibold text-lg text-[#0B2443]">
            Saved Opportunities
          </h2>
        </div>

        <div className="px-8 py-6 flex flex-col gap-4">
          {dummyEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between rounded-2xl border border-[#E4E9F2] px-4 py-3 hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden">
                  <Image
                    src="/saved_opp.png"
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-outfit font-semibold text-sm text-[#0B2443]">
                    {event.title}
                  </div>
                  <div className="font-outfit text-xs text-[#6B7280]">
                    {event.date} • {event.location}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleOpen(event.id.toString())}
                className="w-9 h-9 rounded-full border border-[#E4E9F2] flex items-center justify-center hover:bg-[#EFF4FF]"
                aria-label="View event details"
              >
                <span className="text-lg text-[#0B2443]">&gt;</span>
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

