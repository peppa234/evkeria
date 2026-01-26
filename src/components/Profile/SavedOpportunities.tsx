"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@context/AuthContext";
import { useEffect, useState } from "react";
import { Loader2, ChevronRight } from "lucide-react";
import { Skeleton } from "@components/ui/skeleton";

interface SavedEvent {
  _id: string;
  title: string;
  date: string;
  location?: string;
  imageUrl?: string;
}

export function SavedOpportunities() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchSavedEvents();
    }
  }, [isAuthenticated, user]);

  const fetchSavedEvents = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}/saved-events`);
      if (res.ok) {
        const data = await res.json();
        // Standardized format: { success: true, data: { savedEvents: [...] } }
        if (data.success && data.data?.savedEvents) {
          setSavedEvents(data.data.savedEvents);
        } else {
          setSavedEvents([]);
        }
      }
    } catch (err) {
      setSavedEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = (id: string) => {
    router.push(`/events/${id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section className="w-full">
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
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-16 w-16 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : savedEvents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No saved events yet</p>
              <button
                onClick={() => router.push("/events")}
                className="mt-3 px-4 py-2 text-sm text-[#1e4e79] hover:underline"
              >
                Browse Events
              </button>
            </div>
          ) : (
            <>
              {(showAll ? savedEvents : savedEvents.slice(0, 4)).map((event) => (
                <div
                  key={event._id}
                  className="flex items-center justify-between rounded-xl sm:rounded-2xl border border-[#E4E9F2] px-3 sm:px-4 py-2 sm:py-3 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0">
                      <Image
                        src={event.imageUrl || "/image.png"}
                        alt={event.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 64px, 64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-outfit font-semibold text-xs sm:text-sm text-[#0B2443] truncate">
                        {event.title}
                      </div>
                      <div className="font-outfit text-[10px] sm:text-xs text-[#6B7280] truncate">
                        {formatDate(event.date)}{event.location ? ` • ${event.location}` : ""}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpen(event._id)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#E4E9F2] flex items-center justify-center hover:bg-[#EFF4FF] flex-shrink-0 ml-2 transition-colors"
                    aria-label="View event details"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#0B2443]" />
                  </button>
                </div>
              ))}

              {savedEvents.length > 4 && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="px-6 py-2 rounded-full border border-[#CBD5F5] text-sm font-outfit text-[#1A2B4C] hover:bg-[#EFF4FF] transition-colors"
                  >
                    {showAll ? "Show Less" : `View All (${savedEvents.length})`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
