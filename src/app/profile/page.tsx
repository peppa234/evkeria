"use client";

import { useState } from "react";
import { useProfile } from "@components/Profile/ProfileContext";
import { ProfileHeader } from "@components/Profile/ProfileHeader";
import { SkillsSection } from "@components/Profile/SkillsSection";
import { InterestsSection } from "@components/Profile/InterestsSection";
import { SavedOpportunities } from "@components/Profile/SavedOpportunities";
import { EditProfileDialog } from "@components/Profile/EditProfileDialog";

export const dynamic = "force-dynamic";

export default function ProfilePage() {
  const { profile, setProfile } = useProfile();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const addSkill = (skill: string) => {
    if (!skill || profile.skills.includes(skill)) return;
    setProfile({ ...profile, skills: [...profile.skills, skill] });
  };

  const removeSkill = (skill: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skill),
    });
  };

  const addInterest = (interest: string) => {
    if (!interest || profile.interests.includes(interest)) return;
    setProfile({
      ...profile,
      interests: [...profile.interests, interest],
    });
  };

  const removeInterest = (interest: string) => {
    setProfile({
      ...profile,
      interests: profile.interests.filter((i) => i !== interest),
    });
  };

  return (
    <>
      {/* Shared container - all sections align to this */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 md:pt-36 pb-12 sm:pb-16 flex flex-col gap-6">
        <ProfileHeader
          name={profile.name}
          email={profile.email}
          bio={profile.bio}
          onEditClick={() => setIsEditDialogOpen(true)}
        />
        <SavedOpportunities />
        <SkillsSection
          skills={profile.skills}
          onAddSkill={addSkill}
          onRemoveSkill={removeSkill}
        />
        <InterestsSection
          interests={profile.interests}
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
