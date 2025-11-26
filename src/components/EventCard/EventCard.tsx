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
    <Card className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 hover:scale-105">
      <CardContent className="p-0">
        <div className="relative h-56">
          <Image
            className="w-full h-full object-cover"
            alt={event.title}
            src={event.image}
            fill
            priority={false}
          />
          {event.hasOverlay && <div className="absolute inset-0 bg-black/20" />}
          <button
            type="button"
            aria-label={isFav ? "Unsave event" : "Save event"}
            className="absolute top-4 right-4 grid place-items-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
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

        <div className="p-6">
          <h3
            style={{
              fontFamily: "Outfit, sans-serif",
              fontStyle: "normal",
              fontWeight: 600,
              fontSize: "20px",
              lineHeight: "28px",
              color: "#1E1E1E",
              marginBottom: "12px",
            }}
          >
            {event.title}
          </h3>

          <p className="font-outfit text-[#6b7280] text-sm mb-4">
            Organized by {event.organization}
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            {event.location && (
              <Badge className="rounded-full bg-[#eaf4fb] text-[#1e4e79] px-4 py-2 font-outfit font-medium hover:bg-[#1e4e79] hover:text-white transition-colors cursor-default">
                {event.location}
              </Badge>
            )}

            {event.date && (
              <Badge className="rounded-full bg-[#eaf4fb] text-[#1e4e79] px-4 py-2 font-outfit font-medium hover:bg-[#1e4e79] hover:text-white transition-colors cursor-default">
                {event.date}
              </Badge>
            )}

            {typeLabel && (
              <Badge className="rounded-full bg-[#eaf4fb] text-[#1e4e79] px-4 py-2 font-outfit font-medium hover:bg-[#1e4e79] hover:text-white transition-colors cursor-default">
                {typeLabel}
              </Badge>
            )}
          </div>

          {event.description && (
            <p
              style={{
                fontFamily: "Outfit, sans-serif",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "20px",
                color: "#6C757D",
              }}
            >
              {event.description}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between px-6 pb-6">
        <Link href={`/events/${event.id}`}>
          <button
            style={{
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: "8px 15px",
              gap: "10px",
              width: "110px",
              height: "37px",
              background: "rgba(0, 0, 0, 0.001)",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              fontFamily: "Outfit, sans-serif",
              fontStyle: "normal",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "20px",
              textAlign: "center",
              color: "#374151",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F9FAFB")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(0, 0, 0, 0.001)")
            }
          >
            View Details
          </button>
        </Link>

        <span
          style={{
            fontFamily: "Outfit, sans-serif",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "12px",
            lineHeight: "16px",
            color: "#6C757D",
          }}
        >
          {countValue} {countLabel}
        </span>
      </CardFooter>
    </Card>
  );
}
