"use client";

import { useState, useMemo } from "react";
import { Sidebar } from "@components/Organization/Sidebar";
import { EventEditDialog } from "@components/Organization/EventEditDialog";
import { DeleteEventDialog } from "@components/Organization/EventDeleteDialog";
import { EventCard } from "@components/Organization/EventCard";
import { PlusIcon, SearchIcon, XIcon, MapPinIcon, TagIcon, FilterIcon, CalendarIcon } from "lucide-react";
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

  const hasActiveFilters = searchQuery || locationFilter !== "All Locations" || categoryFilter !== "All Categories" || statusFilter !== "All Status";

  const resetFilters = () => {
    setSearchQuery("");
    setLocationFilter("All Locations");
    setCategoryFilter("All Categories");
    setStatusFilter("All Status");
  };

  const handleEdit = (id: number) => {
    setEditMode("edit");
    setIsEditOpen(true);
  };

  const handleDelete = (id: number) => {
    setIsDeleteOpen(true);
  };

  const handleViewApplications = (id: number) => {
    console.log("View applications for event", id);
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />

      <main className="flex-1 min-h-screen px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 pt-28 md:pt-8 md:ml-[280px]">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h1 className="font-outfit font-bold text-2xl text-[#0e1f35]">
                Event Management
              </h1>
              <p className="font-outfit text-sm text-gray-500 mt-1">
                Manage, edit, and track your posted events
              </p>
            </div>

            <Button
              onClick={() => {
                setEditMode("create");
                setIsEditOpen(true);
              }}
              className="bg-[#4fa3e3] hover:bg-[#3d8bc7] text-white font-outfit font-medium rounded-xl h-11 px-5 shadow-sm transition-all duration-200"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create Event
            </Button>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FilterIcon className="w-4 h-4 text-gray-400" />
              <span className="font-outfit font-medium text-sm text-gray-600">Filters</span>
            </div>
            
            {/* Search */}
            <div className="relative mb-4">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl font-outfit text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]/30 focus:border-[#4fa3e3] transition-all duration-200"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Location Filter */}
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full h-11 pl-10 pr-8 bg-gray-50 border border-gray-200 rounded-xl font-outfit text-sm text-gray-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]/30 focus:border-[#4fa3e3] transition-all duration-200"
                >
                  <option>All Locations</option>
                  <option>San Francisco</option>
                  <option>New York</option>
                  <option>Austin</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Category Filter */}
              <div className="relative">
                <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full h-11 pl-10 pr-8 bg-gray-50 border border-gray-200 rounded-xl font-outfit text-sm text-gray-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]/30 focus:border-[#4fa3e3] transition-all duration-200"
                >
                  <option>All Categories</option>
                  <option>Technology</option>
                  <option>Marketing</option>
                  <option>Business</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-11 pl-10 pr-8 bg-gray-50 border border-gray-200 rounded-xl font-outfit text-sm text-gray-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4fa3e3]/30 focus:border-[#4fa3e3] transition-all duration-200"
                >
                  <option>All Status</option>
                  <option>Upcoming</option>
                  <option>Active</option>
                  <option>Past</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Reset Button */}
              <Button 
                onClick={resetFilters} 
                variant="outline" 
                disabled={!hasActiveFilters}
                className={`h-11 rounded-xl font-outfit text-sm transition-all duration-200 ${
                  hasActiveFilters 
                    ? "border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300" 
                    : "border-gray-200 text-gray-400"
                }`}
              >
                <XIcon className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <p className="font-outfit text-sm text-gray-500">
                Showing <span className="font-medium text-[#0e1f35]">{filteredEvents.length}</span> of {mockEvents.length} events
              </p>
              {hasActiveFilters && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Active filters:</span>
                  <div className="flex gap-1">
                    {searchQuery && (
                      <span className="px-2 py-1 bg-[#4fa3e3]/10 text-[#4fa3e3] text-xs rounded-full font-medium">
                        Search
                      </span>
                    )}
                    {locationFilter !== "All Locations" && (
                      <span className="px-2 py-1 bg-[#4fa3e3]/10 text-[#4fa3e3] text-xs rounded-full font-medium">
                        {locationFilter}
                      </span>
                    )}
                    {categoryFilter !== "All Categories" && (
                      <span className="px-2 py-1 bg-[#4fa3e3]/10 text-[#4fa3e3] text-xs rounded-full font-medium">
                        {categoryFilter}
                      </span>
                    )}
                    {statusFilter !== "All Status" && (
                      <span className="px-2 py-1 bg-[#4fa3e3]/10 text-[#4fa3e3] text-xs rounded-full font-medium">
                        {statusFilter}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
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
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-outfit font-semibold text-lg text-[#0e1f35] mb-2">
                No events found
              </h3>
              <p className="font-outfit text-sm text-gray-500 mb-4">
                Try adjusting your filters or create a new event.
              </p>
              <Button
                onClick={resetFilters}
                variant="outline"
                className="font-outfit rounded-xl"
              >
                Clear all filters
              </Button>
            </div>
          )}
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
