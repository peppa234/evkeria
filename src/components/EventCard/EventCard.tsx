import Image from "next/image";
import Link from "next/link";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardFooter } from "@components/ui/card";
import { Event } from "@data/dummy-events";
import { useState } from "react";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const [isFav, setIsFav] = useState<boolean>(event.isFav ?? false);

  const typeLabel = event.badge || (event as any).type;
  const countLabel = "volunteers";
  const countValue = event.volunteers ?? 0;

  return (
    <Card className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-out overflow-hidden border-0 hover:scale-[1.03] hover:-translate-y-2 active:scale-100">
      <CardContent className="p-0">
        <div className="relative h-48 sm:h-56">
          <Image
            className="w-full h-full object-cover transition-opacity duration-300"
            alt={event.title}
            src={event.image}
            fill
            priority={false}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={90}
            loading="lazy"
          />
          {event.hasOverlay && <div className="absolute inset-0 bg-black/20" />}
          <button
            type="button"
            aria-label={isFav ? "Unsave event" : "Save event"}
            className="absolute top-4 right-4 grid place-items-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
            onClick={() => setIsFav((v) => !v)}
          >
            <Image
              src={isFav ? "/Fav yes.svg" : "/Fav no.svg"}
              alt={isFav ? "Favorited" : "Not favorited"}
              width={20}
              height={20}
              className="opacity-90"
            />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <h3 className="font-outfit font-semibold text-lg sm:text-xl leading-tight text-[#1E1E1E] mb-3 sm:mb-4">
            {event.title}
          </h3>

          <p className="font-outfit text-[#6b7280] text-xs sm:text-sm mb-3 sm:mb-4">
            Organized by {event.organization}
          </p>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
            {event.location && (
              <Badge className="rounded-full bg-[#eaf4fb] text-[#1e4e79] px-3 sm:px-4 py-1 sm:py-2 font-outfit font-medium text-xs sm:text-sm hover:bg-[#1e4e79] hover:text-white transition-colors cursor-default">
                {event.location}
              </Badge>
            )}

            {event.date && (
              <Badge className="rounded-full bg-[#eaf4fb] text-[#1e4e79] px-3 sm:px-4 py-1 sm:py-2 font-outfit font-medium text-xs sm:text-sm hover:bg-[#1e4e79] hover:text-white transition-colors cursor-default">
                {event.date}
              </Badge>
            )}

            {typeLabel && (
              <Badge className="rounded-full bg-[#eaf4fb] text-[#1e4e79] px-3 sm:px-4 py-1 sm:py-2 font-outfit font-medium text-xs sm:text-sm hover:bg-[#1e4e79] hover:text-white transition-colors cursor-default">
                {typeLabel}
              </Badge>
            )}
          </div>

          {event.description && (
            <p className="font-outfit font-normal text-xs leading-relaxed text-[#6C757D] line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between px-4 sm:px-6 pb-4 sm:pb-6 gap-3">
        <Link href={`/events/${event.id}`} className="flex-shrink-0">
          <button className="flex items-center justify-center px-3 sm:px-4 py-2 gap-2 min-w-[100px] sm:min-w-[110px] h-9 sm:h-[37px] bg-transparent border border-[#E5E7EB] rounded-lg font-outfit font-medium text-xs sm:text-sm text-[#374151] hover:bg-[#F9FAFB] transition-colors cursor-pointer">
            View Details
          </button>
        </Link>

        <span className="font-outfit font-normal text-[10px] sm:text-xs text-[#6C757D] whitespace-nowrap">
          {countValue} {countLabel}
        </span>
      </CardFooter>
    </Card>
  );
}
