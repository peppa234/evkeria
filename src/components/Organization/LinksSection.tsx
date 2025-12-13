"use client";

import { useState, useEffect } from "react";
import { MailIcon, GlobeIcon, ZapIcon } from "lucide-react";
import { getDomainAsTitle } from "@lib/fetchWebsiteTitle";

interface LinksSectionProps {
  email?: string;
  websiteUrl?: string;
}

export function LinksSection({
  email = "algeria2.0@gmail.com",
  websiteUrl = "https://algeria20.com",
}: LinksSectionProps) {
  const [websiteTitle, setWebsiteTitle] = useState<string>("");

  useEffect(() => {
    if (websiteUrl) {
      // Extract title from URL (domain-based)
      const title = getDomainAsTitle(websiteUrl);
      setWebsiteTitle(title);
    }
  }, [websiteUrl]);

  return (
    <div className="bg-white rounded-[22px] shadow-[0px_8px_32px_rgba(0,0,0,0.08)]">
      {/* Header Section with colored background */}
      <div className="bg-[#FBFFE8] rounded-t-[26px] px-6 py-3">
        <div className="flex items-center gap-2">
          <ZapIcon className="w-5 h-5 text-gray-800" />
          <h2 className="font-outfit font-semibold text-gray-800 text-lg">
            Links
          </h2>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-10 py-6 space-y-2">
        {/* Email */}
        <div className="flex items-center gap-5">
          <MailIcon className="w-[30px] h-[30px] text-gray-700" />
          <a
            href={`mailto:${email}`}
            className="font-outfit font-bold text-[14px] leading-[30px] text-[#0E1F35] hover:text-[#4fa3e3] transition-colors"
          >
            {email}
          </a>
        </div>

        {/* Website */}
        <div className="flex items-center gap-5">
          <GlobeIcon className="w-[30px] h-[30px] text-gray-700" />
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-outfit font-bold text-[14px] leading-[30px] text-[#0E1F35] underline hover:text-[#4fa3e3] transition-colors"
          >
            {websiteTitle || websiteUrl}
          </a>
        </div>
      </div>
    </div>
  );
}
