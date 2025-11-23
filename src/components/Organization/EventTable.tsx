import Link from "next/link";
import { Event } from "@data/dummy-events";

interface EventTableProps {
  events: Event[];
}

export function EventTable({ events }: EventTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-[#1e4e79] text-white">
          <tr>
            <th className="px-6 py-4 text-left font-outfit font-semibold">Title</th>
            <th className="px-6 py-4 text-left font-outfit font-semibold">Date</th>
            <th className="px-6 py-4 text-left font-outfit font-semibold">Location</th>
            <th className="px-6 py-4 text-left font-outfit font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-b">
              <td className="px-6 py-4 font-outfit">{event.title}</td>
              <td className="px-6 py-4 font-outfit">{event.date}</td>
              <td className="px-6 py-4 font-outfit">{event.location}</td>
              <td className="px-6 py-4">
                <Link
                  href={`/organization/events/${event.id}`}
                  className="text-[#4fa3e3] hover:underline font-outfit"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

