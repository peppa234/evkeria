"use client";

import { useState } from "react";
import Image from "next/image";
import { Sidebar } from "@components/Organization/Sidebar";
import { OrganizationHeader } from "@components/Organization/OrganizationHeader";
import { FieldsSection } from "@components/Organization/FieldsSection";
import { OpportunitiesSection } from "@components/Organization/OpportunitiesSection";
import { LinksSection } from "@components/Organization/LinksSection";
import { dummyOrganizations } from "@data/dummy-organizations";
import { PencilIcon } from "lucide-react";

export default function OrganizationProfilePage() {
  const organization = dummyOrganizations[0];
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: organization.name,
    email: organization.email,
    description: organization.description,
    logo: organization.logo || "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    console.log("Saving organization data:", formData);
    setIsEditModalOpen(false);
  };

  const handleCancel = () => {
    setFormData({
      name: organization.name,
      email: organization.email,
      description: organization.description,
      logo: organization.logo || "",
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="bg-white flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-h-screen px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 pt-28 md:pt-8 md:ml-[280px]">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
          <h1 className="font-outfit font-bold text-[32px] leading-[36px] text-[#1F2937]">
            Organization Profile
          </h1>
          <p className="font-outfit font-normal text-[14px] leading-[20px] text-[#5D6472] mt-2">
            Modify your Profile
          </p>
        </header>

        <OrganizationHeader
          name={organization.name}
          type={organization.type}
          description={organization.description}
          logoUrl={organization.logo}
          email={organization.email}
          onEditClick={() => setIsEditModalOpen(true)}
        />

        <FieldsSection initialFields={organization.fields} />

        <OpportunitiesSection
          initialOpportunities={organization.opportunities}
        />

          <LinksSection
            email={organization.email}
            websiteUrl={organization.websiteUrl}
          />
        </div>
      </main>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-[764px] h-[750px] bg-white shadow-[0px_8px_32px_rgba(0,0,0,0.08)] rounded-[24px]">
            <div className="absolute left-1/2 top-8 -translate-x-1/2 flex flex-col items-center">
              <div className="relative w-[100px] h-[100px] rounded-full bg-gradient-to-r from-[#3B82F6] to-[#1E4E79] shadow-[0px_4px_6px_rgba(0,0,0,0.1),0px_10px_15px_rgba(0,0,0,0.1)] overflow-hidden flex items-center justify-center">
                <Image
                  src={formData.logo}
                  alt="Organization logo"
                  width={100}
                  height={100}
                  className="w-full h-full object-contain"
                />
                <button className="absolute bottom-[-8px] right-[-8px] w-[18px] h-[18px] bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors border-2 border-black">
                  <PencilIcon className="w-2.5 h-2.5 text-black" />
                </button>
              </div>
              <button className="mt-3 font-inter font-bold text-[14px] leading-[20px] text-[#1E4E79] hover:text-[#163a5c]">
                Edit Photo
              </button>
            </div>

            <div className="absolute left-[73px] top-[195px] w-[608px]">
              <label className="block font-outfit font-medium text-[14px] leading-[20px] text-[#374151] mb-2">
                Organization Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Edit your full name"
                className="w-[608px] h-[50px] px-4 border border-[#E5E7EB] rounded-[8px] font-inter text-[12px] leading-[15px] text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#4fa3e3] focus:border-transparent"
              />
            </div>

            <div className="absolute left-[73px] top-[285px] w-[608px]">
              <label className="block font-outfit font-medium text-[14px] leading-[20px] text-[#374151] mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Change your email address"
                className="w-[608px] h-[50px] px-4 border border-[#E5E7EB] rounded-[8px] font-inter text-[12px] leading-[15px] text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#4fa3e3] focus:border-transparent"
              />
            </div>

            <div className="absolute left-[73px] top-[375px] w-[608px]">
              <label className="block font-outfit font-medium text-[14px] leading-[20px] text-[#374151] mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Write your profile description here..."
                className="w-[608px] h-[115px] px-4 py-3 border border-[#E5E7EB] rounded-[8px] bg-[rgba(217,217,217,0.84)] font-inter text-[12px] leading-[15px] text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#4fa3e3] focus:border-transparent resize-none"
              />
            </div>

            <button
              onClick={handleSave}
              className="absolute left-[78px] top-[535px] w-[608px] h-[60px] flex items-center justify-center bg-[#1E4E79] shadow-[0px_4px_6px_rgba(0,0,0,0.1)] rounded-[19px] hover:bg-[#163a5c] transition-colors"
            >
              <span className="font-outfit font-semibold text-[18px] leading-[28px] text-white">
                Save Changes
              </span>
            </button>

            <button
              onClick={handleCancel}
              className="absolute left-[78px] top-[615px] w-[608px] h-[50px] flex items-center justify-center border border-[#E5E7EB] rounded-[19px] hover:bg-gray-50 transition-colors"
            >
              <span className="font-outfit font-medium text-[16px] leading-[24px] text-[#6B7280]">
                Cancel
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
