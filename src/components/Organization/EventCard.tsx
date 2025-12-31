import Image from "next/image";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { EditIcon, TrashIcon, FileTextIcon, CalendarIcon, MapPinIcon } from "lucide-react";
import { getMarkdownPreview } from "@lib/utils/sanitize";

interface OrgEvent {
  id: string;
  title: string;
  description: string;
  image: string;
  status: "Upcoming" | "Active" | "Past";
  date: string;
  location: string;
  category: string;
}


interface FullEventCardProps {
  event: OrgEvent;
  onEdit: () => void;
  onDelete: () => void;
  onViewApplications: () => void;
}


interface SimpleEventCardProps {
  image: string;
  title: string;
  date: string;
  event?: never;
  onEdit?: never;
  onDelete?: never;
  onViewApplications?: never;
}

type EventCardProps = FullEventCardProps | SimpleEventCardProps;

function isFullEventCard(props: EventCardProps): props is FullEventCardProps {
  return 'event' in props && props.event !== undefined;
}

export function EventCard(props: EventCardProps) {

  if (!isFullEventCard(props)) {
    const { image, title, date } = props;
    return (
      <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 group">
        <div className="relative w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden">
          <Image
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            alt={title}
            src={image}
            width={56}
            height={56}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-outfit font-medium text-[#0e1f35] text-sm truncate group-hover:text-[#4fa3e3] transition-colors">
            {title}
          </h4>
          <div className="flex items-center gap-1 mt-1">
            <CalendarIcon className="w-3 h-3 text-gray-400" />
            <p className="font-outfit text-xs text-gray-500">
              {date}
            </p>
          </div>
        </div>
        <div className="w-2 h-2 rounded-full bg-[#4fa3e3] opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
  }

 
  const { event, onEdit, onDelete, onViewApplications } = props;
  
  const statusConfig = {
    Upcoming: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
    Active: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
    Past: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  };

  const status = statusConfig[event.status];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-200 group">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <Image
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          alt={event.title}
          src={event.image}
          width={400}
          height={176}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <Badge className={`absolute top-3 right-3 ${status.bg} ${status.text} border-0 font-outfit font-medium text-xs px-2.5 py-1`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot} mr-1.5`} />
          {event.status}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-outfit font-semibold text-[#0e1f35] text-base mb-2 line-clamp-1">
          {event.title}
        </h3>
        <p className="font-outfit text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">
          {getMarkdownPreview(event.description, 120)}
        </p>
        
        {/* Meta Info */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-gray-500">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span className="font-outfit text-xs">{event.date}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <MapPinIcon className="w-3.5 h-3.5" />
            <span className="font-outfit text-xs">{event.location}</span>
          </div>
        </div>

        <Badge className="bg-[#f0f7ff] text-[#1e4e79] border-0 font-outfit font-medium text-xs mb-4">
          {event.category}
        </Badge>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex-1 h-9 rounded-lg font-outfit text-xs border-[#4fa3e3] text-[#4fa3e3] hover:bg-[#4fa3e3]/10 transition-colors"
          >
            <EditIcon className="w-3.5 h-3.5 mr-1.5" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="flex-1 h-9 rounded-lg font-outfit text-xs border-red-300 text-red-500 hover:bg-red-50 transition-colors"
          >
            <TrashIcon className="w-3.5 h-3.5 mr-1.5" />
            Delete
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewApplications}
          className="w-full h-9 mt-2 rounded-lg font-outfit text-xs bg-[#f0f7ff] text-[#1e4e79] hover:bg-[#e0efff] transition-colors"
        >
          <FileTextIcon className="w-3.5 h-3.5 mr-1.5" />
          View Applications
        </Button>
      </div>
    </div>
  );
}
