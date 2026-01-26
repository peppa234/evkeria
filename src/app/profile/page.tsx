"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ProfileHeader } from "@components/Profile/ProfileHeader";
import { SkillsSection } from "@components/Profile/SkillsSection";
import { InterestsSection } from "@components/Profile/InterestsSection";
import { SavedOpportunities } from "@components/Profile/SavedOpportunities";
import { EditProfileDialog } from "@components/Profile/EditProfileDialog";
import { ProfileCardSkeleton } from "@components/ui/skeleton";

export const dynamic = "force-dynamic";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, updateUser } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const addSkill = async (skill: string) => {
    if (!skill || !user || user.skills.includes(skill)) return;
    
    const newSkills = [...user.skills, skill];
    
    try {
      const res = await fetch(`/api/users/${user.id}/skills`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: newSkills }),
      });
      
      if (res.ok) {
        updateUser({ skills: newSkills });
      }
    } catch (error) {
      // Failed to add skill - fail silently
    }
  };

  const removeSkill = async (skill: string) => {
    if (!user) return;
    
    const newSkills = user.skills.filter((s) => s !== skill);
    
    try {
      const res = await fetch(`/api/users/${user.id}/skills`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: newSkills }),
      });
      
      if (res.ok) {
        updateUser({ skills: newSkills });
      }
    } catch (error) {
      // Failed to remove skill - fail silently
    }
  };

  const addInterest = async (interest: string) => {
    if (!interest || !user || user.interests.includes(interest)) return;
    
    const newInterests = [...user.interests, interest];
    
    try {
      const res = await fetch(`/api/users/${user.id}/interests`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests: newInterests }),
      });
      
      if (res.ok) {
        updateUser({ interests: newInterests });
      }
    } catch (error) {
      // Failed to add interest - fail silently
    }
  };

  const removeInterest = async (interest: string) => {
    if (!user) return;
    
    const newInterests = user.interests.filter((i) => i !== interest);
    
    try {
      const res = await fetch(`/api/users/${user.id}/interests`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests: newInterests }),
      });
      
      if (res.ok) {
        updateUser({ interests: newInterests });
      }
    } catch (error) {
      // Failed to remove interest - fail silently
    }
  };

  if (isLoading || !user) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 md:pt-36 pb-12 sm:pb-16">
        <ProfileCardSkeleton />
      </div>
    );
  }

  return (
    <>
      {/* Shared container - all sections align to this */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 md:pt-36 pb-12 sm:pb-16 flex flex-col gap-6">
        <ProfileHeader
          name={user.name}
          email={user.email}
          bio={user.bio || ""}
          avatarUrl={user.avatarUrl}
          onEditClick={() => setIsEditDialogOpen(true)}
        />
        <SavedOpportunities />
        <SkillsSection
          skills={user.skills}
          onAddSkill={addSkill}
          onRemoveSkill={removeSkill}
        />
        <InterestsSection
          interests={user.interests}
          onAddInterest={addInterest}
          onRemoveInterest={removeInterest}
        />
      </div>

      <EditProfileDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
    </>
  );
}
