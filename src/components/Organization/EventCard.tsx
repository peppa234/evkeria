import Image from "next/image";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { EditIcon, TrashIcon, FileTextIcon } from "lucide-react";

interface OrgEvent {
  id: number;
  title: string;
  description: string;
  image: string;
  status: "Upcoming" | "Active" | "Past";
  date: string;
  location: string;
  category: string;
}

interface EventCardProps {
  event: OrgEvent;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onViewApplications: (id: number) => void;
}

export function EventCard({ event, onEdit, onDelete, onViewApplications }: EventCardProps) {
  const statusColors = {
    Upcoming: "bg-blue-100 text-blue-800",
    Active: "bg-green-100 text-green-800",
    Past: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="relative mb-4">
        <Image
          className="w-full h-48 rounded-lg object-cover"
          alt={event.title}
          src={event.image}
          width={400}
          height={192}
        />
        <Badge className={`absolute top-2 right-2 ${statusColors[event.status]}`}>
          {event.status}
        </Badge>
      </div>
      <h3 className="font-outfit font-semibold text-lg text-[#0e1f35] mb-2">
        {event.title}
      </h3>
      <p className="font-outfit text-sm text-gray-600 mb-3 line-clamp-2">
        {event.description}
      </p>
      <div className="space-y-1 mb-4">
        <p className="font-outfit text-sm text-gray-500">
          <span className="font-medium">Date:</span> {event.date}
        </p>
        <p className="font-outfit text-sm text-gray-500">
          <span className="font-medium">Location:</span> {event.location}
        </p>
        <Badge className="bg-[#eaf4fb] text-[#1e4e79] text-xs">
          {event.category}
        </Badge>
      </div>
      <div className="flex gap-2 mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(event.id)}
          className="flex-1"
          style={{ borderColor: '#4FA3E3', color: '#4FA3E3' }}
        >
          <EditIcon className="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(event.id)}
          className="flex-1"
          style={{ borderColor: '#EF4444', color: '#EF4444' }}
        >
          <TrashIcon className="w-4 h-4 mr-1" />
          Delete
        </Button>
      </div>
      <div className="flex">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewApplications(event.id)}
          className="w-full"
          style={{ backgroundColor: '#EBF8FF', borderColor: '#EBF8FF', color: '#1e4e79' }}
        >
          <FileTextIcon className="w-4 h-4 mr-1" />
          Application Form
        </Button>
      </div>
    </div>
  );
}

