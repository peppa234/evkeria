"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Search events..." }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4fa3e3] font-outfit"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 px-6 py-2 bg-[#4fa3e3] text-white rounded-full font-outfit font-medium hover:bg-[#3d8bc7] transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}

