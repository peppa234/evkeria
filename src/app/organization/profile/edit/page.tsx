"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sidebar } from "@components/Organization/Sidebar";
import { Button } from "@components/ui/button";
import { dummyOrganizations } from "@data/dummy-organizations";
import { PencilIcon } from "lucide-react";

export default function OrganizationProfileEditPage() {
  const router = useRouter();

  
  const organization = dummyOrganizations[0];

  
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

    
    router.push("/organization/profile");
  };

  const handleCancel = () => {
    router.push("/organization/profile");
  };

  return (
    <div className="bg-white flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 md:ml-[280px] pt-16 md:pt-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-outfit font-bold text-[32px] leading-[36px] text-[#1F2937] mb-2">
            Organization Profile
          </h1>
          <p className="font-outfit font-normal text-[14px] leading-[20px] text-[#5D6472] mb-8">
            Modify your Profile
          </p>

          
          <div className="bg-white rounded-3xl shadow-[0px_8px_32px_rgba(0,0,0,0.12)] p-8 max-w-xl mx-auto">
            
            <div className="flex flex-col items-center mb-8">
              <div className="w-[85px] h-[85px] rounded-full bg-white shadow-[-2px_4px_4px_-3px_rgba(0,0,0,0.06)] overflow-hidden flex items-center justify-center mb-2">
                <Image
                  src={formData.logo}
                  alt="Organization logo"
                  width={85}
                  height={85}
                  className="w-[95px] h-[95px] object-cover"
                />
                <Button
                  aria-label="Edit logo"
                  className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors p-0"
                >
                  <PencilIcon className="w-4 h-4 text-gray-600" />
                </Button>
              </div>
              <button className="font-outfit text-sm text-[#4fa3e3] hover:text-[#3d8ac4] font-semibold">
                Edit Photo
              </button>
            </div>

            
            <div className="mb-6">
              <label className="block font-outfit font-medium text-sm text-[#1F2937] mb-2">
                Organization Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Edit your full name"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 font-outfit text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4fa3e3] focus:border-transparent"
              />
            </div>

            
            <div className="mb-6">
              <label className="block font-outfit font-medium text-sm text-[#1F2937] mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Change your email address"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 font-outfit text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4fa3e3] focus:border-transparent"
              />
            </div>

            
            <div className="mb-8">
              <label className="block font-outfit font-medium text-sm text-[#1F2937] mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Write your profile description here..."
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 font-outfit text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4fa3e3] focus:border-transparent resize-none bg-gray-50"
              />
            </div>

            
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleSave}
                className="w-full bg-[#1e4e79] hover:bg-[#163a5c] text-white font-outfit font-semibold text-base h-12 rounded-xl"
              >
                Save Changes
              </Button>
              <button
                onClick={handleCancel}
                className="w-full font-outfit font-medium text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
