"use client";

import { useState, useMemo } from "react";
import { Event } from "@data/dummy-events";

export function useSearch(events: Event[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || event.category === selectedCategory;
      const matchesLocation = !selectedLocation || event.location === selectedLocation;

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [events, searchQuery, selectedCategory, selectedLocation]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedLocation,
    setSelectedLocation,
    filteredEvents,
  };
}

