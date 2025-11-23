import Image from "next/image";
import Link from "next/link";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Event } from "@data/dummy-events";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative h-52">
          <Image
            className="w-full h-full object-cover"
            alt={event.title}
            src={event.image}
            fill
          />
          {event.hasOverlay && (
            <div className="absolute inset-0 bg-black/25" />
          )}
          <Badge
            className={`absolute top-4 left-4 ${event.badgeColor} font-outfit font-medium text-white text-sm px-3 py-1`}
          >
            {event.badge}
          </Badge>
        </div>

        <div className="p-6">
          <h3 className="font-outfit font-semibold text-[#1e4e79] text-2xl leading-tight mb-6">
            {event.title}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-[#4fa3e3] rounded-full" />
            <p className="font-outfit font-medium text-[#4fa3e3] text-base">
              {event.organization}
            </p>
          </div>

          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <Image className="w-4 h-4" alt="Location" src="/frame-3.svg" width={16} height={16} />
              <span className="font-outfit font-normal text-[#1e4e79] text-sm">
                {event.location}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Image className="w-4 h-4" alt="Date" src="/frame-4.svg" width={16} height={16} />
              <span className="font-outfit font-normal text-[#1e4e79] text-sm">
                {event.date}
              </span>
            </div>
          </div>

          <Link href={`/events/${event.id}`}>
            <Button className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#4fa3e3] to-[#6fb3e6] font-outfit font-medium text-white text-base hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

