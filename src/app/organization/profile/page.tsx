"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@components/Organization/Sidebar";
import { OrganizationHeader } from "@components/Organization/OrganizationHeader";
import { FieldsSection } from "@components/Organization/FieldsSection";
import { OpportunitiesSection } from "@components/Organization/OpportunitiesSection";
import { LinksSection } from "@components/Organization/LinksSection";
import { EditOrganizationProfileDialog } from "@components/Organization/EditOrganizationProfileDialog";
import { useOrganizationAuth } from "@context/OrganizationAuthContext";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OrganizationProfilePage() {
  const router = useRouter();
  const { organization, isLoading: authLoading } = useOrganizationAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!organization) {
        router.push("/auth/organization/login");
      } else {
        setIsLoading(false);
      }
    }
  }, [organization, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="bg-white flex min-h-screen">
        <Sidebar />
        <main className="flex-1 min-h-screen px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 pt-28 md:pt-8 md:ml-[280px]">
          <div className="max-w-6xl mx-auto flex items-center justify-center min-h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-[#4fa3e3]" />
          </div>
        </main>
      </div>
    );
  }

  if (!organization) {
    return null;
  }

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
          description={organization.description || ""}
          logoUrl={organization.logoUrl}
          email={organization.email}
          onEditClick={() => setIsEditModalOpen(true)}
        />

        <FieldsSection initialFields={organization.fields || []} />

        <OpportunitiesSection
          initialOpportunities={organization.opportunities || []}
        />

        <LinksSection
          email={organization.email}
          websiteUrl={organization.websiteUrl}
        />
        </div>
      </main>

      <EditOrganizationProfileDialog
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}
