"use client";

import Image from "next/image";
import { PencilIcon } from "lucide-react";

interface OrganizationHeaderProps {
  name?: string;
  type?: string;
  description?: string;
  logoUrl?: string;
  email?: string;
  onEditClick?: () => void;
}

export function OrganizationHeader({
  name = "Algeria 2.0",
  type = "Algeria Organization",
  description = "We are a tech-focused organization that creates impactful learning experiences through events and workshops. By bringing together experts in AI, digital marketing, software development, cybersecurity, and cloud, we connect people with the skills, mentors, and opportunities they need to grow in today's fast-changing digital world.",
  logoUrl = "/logo_white.svg",
  email = "algeria2.0@gmail.com",
  onEditClick,
}: OrganizationHeaderProps) {
  return (
    <div className="bg-white rounded-[24px] mb-6 shadow-[0px_8px_32px_rgba(0,0,0,0.08)] overflow-hidden">
      
      <div className="bg-[rgba(79,163,227,0.44)] rounded-t-[23px] h-[97px]" />

      
      <div className="relative px-10 py-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          
          <div className="flex flex-col items-center -mt-[42.5px]">
            
            <div className="relative w-[85px] h-[85px] mb-2">
              <div className="w-[85px] h-[85px] rounded-full bg-white shadow-[-2px_4px_4px_-3px_rgba(0,0,0,0.06)] overflow-hidden flex items-center justify-center">
                <Image
                  src={logoUrl}
                  alt={`${name} logo`}
                  width={85}
                  height={85}
                  className="w-[95px] h-[95px] object-cover "
                />
              </div>
              {onEditClick && (
                <button
                  onClick={onEditClick}
                  className="absolute bottom-[-4px] right-[-4px] w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
                  aria-label="Edit profile"
                >
                  <PencilIcon className="w-3 h-3 text-gray-600" />
                </button>
              )}
            </div>

            
            <h1 className="font-outfit font-bold text-[18px] leading-[32px] text-[#1F2937] text-center">
              {name}
            </h1>

            
            <p className="font-outfit font-normal text-[13px] leading-[16px] text-[#6B7280] text-center">
              {email}
            </p>
          </div>

          
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
