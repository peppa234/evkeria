"use client";
import { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";

interface SearchBarProps {
  queryInput: string;
  setQueryInput: (value: string) => void;
  wilaya: string;
  setWilaya: (value: string) => void;
  type: string;
  setType: (value: string) => void;
  time: string;
  setTime: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  setSearchQuery: (value: string) => void;
  setCurrentPage: (page: number) => void;
}

export function SearchBar({
  queryInput,
  setQueryInput,
  wilaya,
  setWilaya,
  type,
  setType,
  time,
  setTime,
  onSearchSubmit,
  setSearchQuery,
  setCurrentPage,
}: SearchBarProps) {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  const locations = [
    { label: "ALL", value: "" },
    { label: "Algiers", value: "Algiers" },
    { label: "Oran", value: "Oran" },
    { label: "Online", value: "Online" },
  ];

  const types = [
    { label: "ALL", value: "" },
    { label: "Workshop", value: "Workshop" },
    { label: "Training", value: "Training" },
    { label: "Volunteering", value: "Volunteering" },
    { label: "Conference", value: "Conference" },
  ];

  const times = [
    { label: "Time", value: "" },
    { label: "Upcoming", value: "Upcoming" },
    { label: "This Week", value: "This Week" },
    { label: "This Month", value: "This Month" },
  ];

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearchSubmit(e as any);
    }
  };

  const popularSearches = [
    { label: "Tech Events", value: "Tech Events", type: "" },
    { label: "Volunteering", value: "Volunteering", type: "Volunteering" },
    {
      label: "Training Programs",
      value: "Training Programs",
      type: "Training",
    },
  ];

  const handlePopularSearch = (search: (typeof popularSearches)[0]) => {
    setQueryInput(search.value);
    setSearchQuery(search.value);
    if (search.type) {
      setType(search.type);
    }
    setCurrentPage(1);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {/* Title */}
      <h2 className="font-outfit font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-[48px] leading-tight sm:leading-normal lg:leading-[60px] text-[#1e4e79] text-center mb-6 sm:mb-8">
        Find Opportunities
      </h2>

      {/* Search Container */}
      <div className="relative mb-6 sm:mb-8">
        <div className="relative w-full max-w-5xl xl:max-w-[1255.38px] min-h-[80px] sm:min-h-[113.33px] mx-auto bg-white shadow-[0px_4px_24px_rgba(0,0,0,0.08)] rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row items-stretch sm:items-center p-4 sm:p-6 lg:p-[26px] gap-3 sm:gap-4 lg:gap-[17px]">
          {/* Search Input */}
          <div className="flex-1 w-full sm:min-w-0 sm:flex-[1_1_300px] relative">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search events, volunteering, trainings…"
              className="w-full h-12 sm:h-[61.03px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl font-outfit font-normal text-sm sm:text-base text-[#374151] outline-none focus:border-[#4fa3e3] px-4 sm:px-7 placeholder-gray-400"
            />
          </div>

          {/* Location Dropdown */}
          <div className="relative w-full sm:w-auto sm:flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                setShowLocationDropdown(!showLocationDropdown);
                setShowTypeDropdown(false);
                setShowTimeDropdown(false);
              }}
              className="w-full sm:w-[140px] lg:w-[174.36px] h-12 sm:h-[61.03px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl font-outfit font-normal text-sm sm:text-base text-[#374151] flex items-center justify-center gap-2 cursor-pointer outline-none hover:bg-[#F3F4F6] transition-colors"
            >
              <span className="truncate">{wilaya || "Wilaya"}</span>
              <ChevronDown size={20} className="text-[#374151] flex-shrink-0" />
            </button>
            {showLocationDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E7EB] rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.08)] z-50 max-h-60 overflow-y-auto">
                {locations.map((loc) => (
                  <button
                    key={loc.value}
                    type="button"
                    onClick={() => {
                      setWilaya(loc.value);
                      setCurrentPage(1);
                      setShowLocationDropdown(false);
                    }}
                    className="w-full px-4 sm:px-5 py-3 text-left bg-transparent border-none font-outfit text-sm sm:text-base text-[#374151] cursor-pointer hover:bg-[#F9FAFB] transition-colors"
                  >
                    {loc.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Type Dropdown */}
          <div className="relative w-full sm:w-auto sm:flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                setShowTypeDropdown(!showTypeDropdown);
                setShowLocationDropdown(false);
                setShowTimeDropdown(false);
              }}
              className="w-full sm:w-[130px] lg:w-[152.56px] h-12 sm:h-[61.03px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl font-outfit font-normal text-sm sm:text-base text-[#374151] flex items-center justify-center gap-2 cursor-pointer outline-none hover:bg-[#F3F4F6] transition-colors"
            >
              <span className="truncate">{type || "Type"}</span>
              <ChevronDown size={20} className="text-[#374151] flex-shrink-0" />
            </button>
            {showTypeDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E7EB] rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.08)] z-50 max-h-60 overflow-y-auto">
                {types.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => {
                      setType(t.value);
                      setCurrentPage(1);
                      setShowTypeDropdown(false);
                    }}
                    className="w-full px-4 sm:px-5 py-3 text-left bg-transparent border-none font-outfit text-sm sm:text-base text-[#374151] cursor-pointer hover:bg-[#F9FAFB] transition-colors"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Time Dropdown */}
          <div className="relative w-full sm:w-auto sm:flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                setShowTimeDropdown(!showTimeDropdown);
                setShowLocationDropdown(false);
                setShowTypeDropdown(false);
              }}
              className="w-full sm:w-[130px] lg:w-[152.56px] h-12 sm:h-[61.03px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl font-outfit font-normal text-sm sm:text-base text-[#374151] flex items-center justify-center gap-2 cursor-pointer outline-none hover:bg-[#F3F4F6] transition-colors"
            >
              <span className="truncate">{time || "Time"}</span>
              <ChevronDown size={20} className="text-[#374151] flex-shrink-0" />
            </button>
            {showTimeDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E7EB] rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.08)] z-50 max-h-60 overflow-y-auto">
                {times.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => {
                      setTime(t.value);
                      setCurrentPage(1);
                      setShowTimeDropdown(false);
                    }}
                    className="w-full px-4 sm:px-5 py-3 text-left bg-transparent border-none font-outfit text-sm sm:text-base text-[#374151] cursor-pointer hover:bg-[#F9FAFB] transition-colors"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onSearchSubmit(e as any);
            }}
            className="w-full sm:w-[140px] lg:w-[153.65px] h-12 sm:h-[61.03px] bg-[#F7C948] shadow-[0px_2px_8px_rgba(30,78,121,0.24)] rounded-xl border-none cursor-pointer flex items-center justify-center gap-2 font-outfit font-semibold text-sm sm:text-base text-white hover:bg-[#E5B632] transition-colors"
          >
            <Search size={20} className="text-white" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Popular Searches */}
      <div className="text-center mb-6 sm:mb-8 flex flex-wrap items-center justify-center gap-1 sm:gap-2">
        <span className="font-outfit font-normal text-xs sm:text-sm text-[#6B7280]">
          Popular searches:
        </span>
        {popularSearches.map((search, index) => (
          <span key={search.value} className="flex items-center">
            <button
              type="button"
              onClick={() => handlePopularSearch(search)}
              className="font-outfit font-medium text-xs sm:text-sm text-[#1E4E79] hover:underline transition-all bg-transparent border-none cursor-pointer"
            >
              {search.label}
            </button>
            {index < popularSearches.length - 1 && (
              <span className="font-outfit font-normal text-xs sm:text-sm text-[#6B7280] mx-1 sm:mx-2">
                ,
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
