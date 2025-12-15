"use client";

import { useState, useMemo } from "react";
import { Sidebar, SIDEBAR_WIDTH } from "@components/Organization/Sidebar";
import { EventEditDialog } from "@components/Organization/EventEditDialog";
import { DeleteEventDialog } from "@components/Organization/EventDeleteDialog";
import { QuickActionButton } from "@components/Organization/QuickActionButton";
import { EventCard } from "@components/Organization/EventCard";
import { PlusIcon, SearchIcon, RotateCcwIcon } from "lucide-react";
import { Button } from "@components/ui/button";

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

const mockEvents: OrgEvent[] = [
  {
    id: 1,
    title: "Tech Conference 2024",
    description: "A comprehensive conference on the latest in technology.",
    image: "/image.png",
    status: "Upcoming",
    date: "Dec 20, 2024",
    location: "San Francisco",
    category: "Technology",
  },
  {
    id: 2,
    title: "Marketing Summit",
    description: "Learn marketing strategies from industry experts.",
    image: "/image-1.png",
    status: "Active",
    date: "Dec 10, 2024",
    location: "New York",
    category: "Marketing",
  },
  {
    id: 3,
    title: "Business Workshop",
    description: "Hands-on workshop for business development.",
    image: "/image-2.png",
    status: "Past",
    date: "Nov 15, 2024",
    location: "Austin",
    category: "Business",
  },
  {
    id: 4,
    title: "AI Workshop",
    description: "Dive deep into artificial intelligence and machine learning.",
    image: "/image.png",
    status: "Upcoming",
    date: "Jan 15, 2025",
    location: "San Francisco",
    category: "Technology",
  },
  {
    id: 5,
    title: "Digital Marketing Bootcamp",
    description: "Intensive training on digital marketing techniques.",
    image: "/image-1.png",
    status: "Active",
    date: "Dec 12, 2024",
    location: "New York",
    category: "Marketing",
  },
  {
    id: 6,
    title: "Entrepreneurship Seminar",
    description: "Insights from successful entrepreneurs.",
    image: "/image-2.png",
    status: "Past",
    date: "Oct 20, 2024",
    location: "Austin",
    category: "Business",
  },
];

export default function EventsPage() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editMode, setEditMode] = useState<"create" | "edit">("edit");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const filteredEvents = useMemo(() => {
    return mockEvents.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = locationFilter === "All Locations" || event.location === locationFilter;
      const matchesCategory = categoryFilter === "All Categories" || event.category === categoryFilter;
      const matchesStatus = statusFilter === "All Status" || event.status === statusFilter;
      return matchesSearch && matchesLocation && matchesCategory && matchesStatus;
    });
  }, [searchQuery, locationFilter, categoryFilter, statusFilter]);

  const resetFilters = () => {
    setSearchQuery("");
    setLocationFilter("All Locations");
    setCategoryFilter("All Categories");
    setStatusFilter("All Status");
  };

  const handleEdit = (id: number) => {
    setEditMode("edit");
    setIsEditOpen(true);
    // TODO: Pass event data to dialog if needed
  };

  const handleDelete = (id: number) => {
    setIsDeleteOpen(true);
    // TODO: Pass event id to dialog if needed
  };

  const handleViewApplications = (id: number) => {
    // TODO: Navigate to applications page or open dialog
    console.log("View applications for event", id);
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">
      <Sidebar />

      <main
        className="flex-1 min-h-screen px-6 py-8 md:px-10"
        style={{ marginLeft: SIDEBAR_WIDTH }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h1 className="font-outfit font-semibold text-2xl text-[#0e1f35]">
                Event Management
              </h1>
              <p className="font-outfit text-sm text-gray-500 mt-1">
                Manage, edit, and track your posted events.
              </p>
            </div>

            <QuickActionButton
              href="#"
              icon={PlusIcon}
              label="Create Event"
              variant="primary"
              onClickOverride={() => {
                setEditMode("create");
                setIsEditOpen(true);
              }}
            />
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by event name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: '#D9D9D9' }}
              >
                <option>All Locations</option>
                <option>San Francisco</option>
                <option>New York</option>
                <option>Austin</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: '#D9D9D9' }}
              >
                <option>All Categories</option>
                <option>Technology</option>
                <option>Marketing</option>
                <option>Business</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: '#D9D9D9' }}
              >
                <option>All Status</option>
                <option>Upcoming</option>
                <option>Active</option>
                <option>Past</option>
              </select>
              <Button onClick={resetFilters} variant="outline" className="flex items-center gap-2">
                <RotateCcwIcon className="w-4 h-4" />
                Reset Filters
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Showing {filteredEvents.length} of {mockEvents.length} events
            </p>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewApplications={handleViewApplications}
              />
            ))}
          </div>
        </div>
      </main>

      <EventEditDialog
        open={isEditOpen}
        mode={editMode}
        onClose={() => setIsEditOpen(false)}
      />

      <DeleteEventDialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
