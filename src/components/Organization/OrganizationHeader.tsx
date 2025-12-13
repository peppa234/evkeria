"use client";

import Image from "next/image";

interface OrganizationHeaderProps {
  name?: string;
  type?: string;
  description?: string;
  logoUrl?: string;
  email?: string;
}

export function OrganizationHeader({
  name = "Algeria 2.0",
  type = "Algeria Organization",
  description = "We are a tech-focused organization that creates impactful learning experiences through events and workshops. By bringing together experts in AI, digital marketing, software development, cybersecurity, and cloud, we connect people with the skills, mentors, and opportunities they need to grow in today's fast-changing digital world.",
  logoUrl = "/logo_white.svg",
  email = "algeria2.0@gmail.com",
}: OrganizationHeaderProps) {
  return (
    <div className="bg-white rounded-[24px] mb-6 shadow-[0px_8px_32px_rgba(0,0,0,0.08)] overflow-hidden">
      {/* Colored header background */}
      <div className="bg-[rgba(79,163,227,0.44)] rounded-t-[23px] h-[97px]" />

      {/* Content Section */}
      <div className="relative px-10 py-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Logo and Info Column */}
          <div className="flex flex-col items-center -mt-[42.5px]">
            {/* Logo - positioned to be half in colored section, half in white */}
            <div className="w-[85px] h-[85px] rounded-full bg-white shadow-[-2px_4px_4px_-3px_rgba(0,0,0,0.06)] overflow-hidden flex items-center justify-center mb-2">
              <Image
                src={logoUrl}
                alt={`${name} logo`}
                width={85}
                height={85}
                className="w-[95px] h-[95px] object-cover "
              />
            </div>

            {/* Organization Name */}
            <h1 className="font-outfit font-bold text-[18px] leading-[32px] text-[#1F2937] text-center">
              {name}
            </h1>

            {/* Email */}
            <p className="font-outfit font-normal text-[13px] leading-[16px] text-[#6B7280] text-center">
              {email}
            </p>
          </div>

          {/* Description - centered in white section */}
          <div className="flex-1 flex items-center mt-4 md:mt-0">
            <p className="font-inter font-normal text-[14px] leading-[21px] text-[#374151]">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
