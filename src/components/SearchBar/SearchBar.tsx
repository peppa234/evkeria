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
      <h2
        style={{
          fontFamily: "Outfit, sans-serif",
          fontWeight: 600,
          fontSize: "48px",
          lineHeight: "60px",
          color: "#1e4e79",
          textAlign: "center",
          marginBottom: "32px",
        }}
      >
        Find Opportunities
      </h2>

      {/* Search Container */}
      <div className="relative" style={{ marginBottom: "32px" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "1255.38px",
            minHeight: "113.33px",
            margin: "0 auto",
            background: "#FFFFFF",
            boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.08)",
            borderRadius: "24px",
            display: "flex",
            alignItems: "center",
            padding: "26px",
            gap: "17px",
            flexWrap: "wrap",
          }}
        >
          {/* Search Input */}
          <div
            style={{
              flex: "1 1 300px",
              position: "relative",
              minWidth: "300px",
            }}
          >
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search events, volunteering, trainings…"
              style={{
                width: "100%",
                height: "61.03px",
                background: "#F9FAFB",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                padding: "0 28px",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "20px",
                color: "#374151",
                outline: "none",
                boxSizing: "border-box",
              }}
              className="placeholder-gray-400"
            />
          </div>

          {/* Location Dropdown */}
          <div style={{ position: "relative", width: "174.36px" }}>
            <button
              type="button"
              onClick={() => {
                setShowLocationDropdown(!showLocationDropdown);
                setShowTypeDropdown(false);
                setShowTimeDropdown(false);
              }}
              style={{
                width: "100%",
                height: "61.03px",
                background: "#F9FAFB",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "24px",
                color: "#374151",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: "pointer",
                outline: "none",
                boxSizing: "border-box",
              }}
            >
              <span>{wilaya || "Wilaya"}</span>
              <ChevronDown size={21.79} style={{ color: "#374151" }} />
            </button>
            {showLocationDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: 0,
                  right: 0,
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.08)",
                  zIndex: 50,
                  maxHeight: "240px",
                  overflowY: "auto",
                }}
              >
                {locations.map((loc) => (
                  <button
                    key={loc.value}
                    type="button"
                    onClick={() => {
                      setWilaya(loc.value);
                      setCurrentPage(1);
                      setShowLocationDropdown(false);
                    }}
                    style={{
                      width: "100%",
                      padding: "12px 20px",
                      textAlign: "left",
                      background: "transparent",
                      border: "none",
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "16px",
                      color: "#374151",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#F9FAFB")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {loc.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Type Dropdown */}
          <div style={{ position: "relative", width: "152.56px" }}>
            <button
              type="button"
              onClick={() => {
                setShowTypeDropdown(!showTypeDropdown);
                setShowLocationDropdown(false);
                setShowTimeDropdown(false);
              }}
              style={{
                width: "100%",
                height: "61.03px",
                background: "#F9FAFB",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "24px",
                color: "#374151",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: "pointer",
                outline: "none",
                boxSizing: "border-box",
              }}
            >
              <span>{type || "Type"}</span>
              <ChevronDown size={21.79} style={{ color: "#374151" }} />
            </button>
            {showTypeDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: 0,
                  right: 0,
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.08)",
                  zIndex: 50,
                  maxHeight: "240px",
                  overflowY: "auto",
                }}
              >
                {types.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => {
                      setType(t.value);
                      setCurrentPage(1);
                      setShowTypeDropdown(false);
                    }}
                    style={{
                      width: "100%",
                      padding: "12px 20px",
                      textAlign: "left",
                      background: "transparent",
                      border: "none",
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "16px",
                      color: "#374151",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#F9FAFB")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Time Dropdown */}
          <div style={{ position: "relative", width: "152.56px" }}>
            <button
              type="button"
              onClick={() => {
                setShowTimeDropdown(!showTimeDropdown);
                setShowLocationDropdown(false);
                setShowTypeDropdown(false);
              }}
              style={{
                width: "100%",
                height: "61.03px",
                background: "#F9FAFB",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "24px",
                color: "#374151",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: "pointer",
                outline: "none",
                boxSizing: "border-box",
              }}
            >
              <span>{time || "Time"}</span>
              <ChevronDown size={21.79} style={{ color: "#374151" }} />
            </button>
            {showTimeDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: 0,
                  right: 0,
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.08)",
                  zIndex: 50,
                  maxHeight: "240px",
                  overflowY: "auto",
                }}
              >
                {times.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => {
                      setTime(t.value);
                      setCurrentPage(1);
                      setShowTimeDropdown(false);
                    }}
                    style={{
                      width: "100%",
                      padding: "12px 20px",
                      textAlign: "left",
                      background: "transparent",
                      border: "none",
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "16px",
                      color: "#374151",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#F9FAFB")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
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
            style={{
              width: "153.65px",
              height: "61.03px",
              background: "#F7C948",
              boxShadow: "0px 2px 8px rgba(30, 78, 121, 0.24)",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontFamily: "Outfit, sans-serif",
              fontWeight: 600,
              fontSize: "16px",
              lineHeight: "24px",
              color: "#FFFFFF",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#E5B632")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#F7C948")}
          >
            <Search size={21.79} style={{ color: "#FFFFFF" }} />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Popular Searches */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <span
          style={{
            fontFamily: "Outfit, sans-serif",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "21px",
            color: "#6B7280",
            marginRight: "8px",
          }}
        >
          Popular searches:
        </span>
        {popularSearches.map((search, index) => (
          <span key={search.value}>
            <button
              type="button"
              onClick={() => handlePopularSearch(search)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "Outfit, sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "21px",
                color: "#1E4E79",
                textDecoration: "none",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.textDecoration = "underline")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.textDecoration = "none")
              }
            >
              {search.label}
            </button>
            {index < popularSearches.length - 1 && (
              <span
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "21px",
                  color: "#6B7280",
                  margin: "0 4px",
                }}
              >
                ,
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
