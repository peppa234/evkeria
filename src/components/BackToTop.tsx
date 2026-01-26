"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when user scrolls down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Listen to scroll events
    window.addEventListener("scroll", toggleVisibility);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50
        flex items-center justify-center
        w-12 h-12 sm:w-14 sm:h-14 rounded-full
        bg-[#1e4e79] hover:bg-[#4fa3e3]
        text-white shadow-lg hover:shadow-xl
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-[#4fa3e3] focus:ring-offset-2
        active:scale-95
        ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-90 pointer-events-none"
        }
      `}
      aria-label="Back to top"
    >
      <ArrowUp 
        className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce-subtle" 
        strokeWidth={2.5}
      />
    </button>
  );
}
