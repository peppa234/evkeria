"use client";

import { useProfile } from "@components/Profile/ProfileContext";
import { ProfileHeader } from "@components/Profile/ProfileHeader";
import { SkillsSection } from "@components/Profile/SkillsSection";
import { InterestsSection } from "@components/Profile/InterestsSection";
import { SavedOpportunities } from "@components/Profile/SavedOpportunities";

export const dynamic = "force-dynamic";

export default function ProfilePage() {
  const { profile, setProfile } = useProfile();

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
    <div className="pb-12 sm:pb-16 md:pb-24 pt-20 sm:pt-32 md:pt-40">
      <ProfileHeader
        name={profile.name}
        email={profile.email}
        bio={profile.bio}
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
  );
}
