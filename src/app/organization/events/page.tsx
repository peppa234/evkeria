"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Sidebar } from "@components/Organization/Sidebar";
import { EventEditDialog } from "@components/Organization/EventEditDialog";
import { DeleteEventDialog } from "@components/Organization/EventDeleteDialog";
import { EventCard } from "@components/Organization/EventCard";
import {
  PlusIcon,
  SearchIcon,
  XIcon,
  MapPinIcon,
  TagIcon,
  FilterIcon,
  CalendarIcon,
  Loader2,
} from "lucide-react";
import { EventListSkeleton } from "@components/ui/skeleton";
import { Button } from "@components/ui/button";
import { useOrganizationAuth } from "@context/OrganizationAuthContext";

interface OrgEvent {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  status: "Upcoming" | "Active" | "Past";
  date: string;
  registrationDeadline: string;
  startTime: string;
  endTime: string;
  location: string;
  category: string;
  maxAttendees: number;
  price: number;
  applicationLink: string;
}

export default function EventsPage() {
  const { organization, isLoading: authLoading } = useOrganizationAuth();
  const [events, setEvents] = useState<OrgEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editMode, setEditMode] = useState<"create" | "edit">("create");
  const [selectedEvent, setSelectedEvent] = useState<OrgEvent | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [deleteEventTitle, setDeleteEventTitle] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const fetchEvents = useCallback(async () => {
    if (!organization?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/organizations/${organization.id}/events`);

      if (!res.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await res.json();
      // Standardized format: { success: true, data: { events: [...] } }
      if (data.success && data.data?.events) {
        setEvents(
          data.data.events.map((e: OrgEvent) => ({
            ...e,
            imageUrl: e.imageUrl || "/image.png",
          }))
        );
      } else {
        setEvents([]);
      }
    } catch (err) {
      setError("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  }, [organization?.id]);

  useEffect(() => {
    if (organization?.id) {
      fetchEvents();
    }
  }, [organization?.id, fetchEvents]);

  // Get unique values for filters
  const uniqueLocations = useMemo(() => {
    const locations = events.map((e) => e.location).filter(Boolean);
    return [...new Set(locations)];
  }, [events]);

  const uniqueCategories = useMemo(() => {
    const categories = events.map((e) => e.category).filter(Boolean);
    return [...new Set(categories)];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesLocation =
        locationFilter === "All Locations" || event.location === locationFilter;
      const matchesCategory =
        categoryFilter === "All Categories" || event.category === categoryFilter;
      const matchesStatus =
        statusFilter === "All Status" || event.status === statusFilter;
      return matchesSearch && matchesLocation && matchesCategory && matchesStatus;
    });
  }, [events, searchQuery, locationFilter, categoryFilter, statusFilter]);

  const hasActiveFilters =
    searchQuery ||
    locationFilter !== "All Locations" ||
    categoryFilter !== "All Categories" ||
    statusFilter !== "All Status";

  const resetFilters = () => {
    setSearchQuery("");
    setLocationFilter("All Locations");
    setCategoryFilter("All Categories");
    setStatusFilter("All Status");
  };

  const handleCreate = () => {
    setEditMode("create");
    setSelectedEvent(null);
    setIsEditOpen(true);
  };

  const handleEdit = (id: string) => {
    const event = events.find((e) => e.id === id);
    if (event) {
      setEditMode("edit");
      setSelectedEvent(event);
      setIsEditOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    const event = events.find((e) => e.id === id);
    setDeleteEventId(id);
    setDeleteEventTitle(event?.title || "");
    setIsDeleteOpen(true);
  };

  const handleViewApplications = (id: string) => {
    const event = events.find((e) => e.id === id);
    if (event?.applicationLink) {
      window.open(event.applicationLink, "_blank");
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen bg-[#f8fafc]">
        <Sidebar />
        <main className="flex-1 min-h-screen flex items-center justify-center md:ml-[280px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#4fa3e3]" />
        </main>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex min-h-screen bg-[#f8fafc]">
        <Sidebar />
        <main className="flex-1 min-h-screen flex items-center justify-center md:ml-[280px]">
          <p className="text-gray-500">Please log in as an organization</p>
        </main>
      </div>
    );
  }

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
              onClick={handleCreate}
              className="bg-[#4fa3e3] hover:bg-[#3d8bc7] text-white font-outfit font-medium rounded-xl h-11 px-5 shadow-sm transition-all duration-200"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create Event
            </Button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Filters Section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FilterIcon className="w-4 h-4 text-gray-400" />
              <span className="font-outfit font-medium text-sm text-gray-600">
                Filters
              </span>
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
                  {uniqueLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
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
                  {uniqueCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
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
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
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
                Showing{" "}
                <span className="font-medium text-[#0e1f35]">
                  {filteredEvents.length}
                </span>{" "}
                of {events.length} events
              </p>
              {hasActiveFilters && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Active filters:</span>
                  <div className="flex gap-1 flex-wrap">
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
          {isLoading ? (
            <EventListSkeleton count={6} />
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={{
                    id: event.id,
                    title: event.title,
                    description: event.description,
                    image: event.imageUrl,
                    status: event.status,
                    date: new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }),
                    location: event.location,
                    category: event.category,
                  }}
                  onEdit={() => handleEdit(event.id)}
                  onDelete={() => handleDelete(event.id)}
                  onViewApplications={() => handleViewApplications(event.id)}
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
                {events.length === 0
                  ? "You haven't created any events yet. Start by creating your first event!"
                  : "Try adjusting your filters or create a new event."}
              </p>
              {events.length === 0 ? (
                <Button
                  onClick={handleCreate}
                  className="bg-[#4fa3e3] hover:bg-[#3d8bc7] text-white font-outfit rounded-xl"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Your First Event
                </Button>
              ) : (
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="font-outfit rounded-xl"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      <EventEditDialog
        open={isEditOpen}
        mode={editMode}
        event={selectedEvent}
        organizationId={organization.id}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedEvent(null);
        }}
        onSuccess={fetchEvents}
      />

      <DeleteEventDialog
        open={isDeleteOpen}
        eventId={deleteEventId}
        eventTitle={deleteEventTitle}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteEventId(null);
          setDeleteEventTitle("");
        }}
        onSuccess={fetchEvents}
      />
    </div>
  );
}
