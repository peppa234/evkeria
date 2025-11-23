import { EventCard } from "@components/EventCard/EventCard";
import { Event } from "@data/dummy-events";

interface SavedOpportunitiesProps {
  events: Event[];
}

export function SavedOpportunities({ events }: SavedOpportunitiesProps) {
  return (
    <div>
      <h2 className="font-outfit font-semibold text-2xl text-[#1e4e79] mb-6">
        Saved Opportunities
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

