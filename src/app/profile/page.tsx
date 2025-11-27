"use client";

import { Navbar } from "@components/Navbar/Navbar";
import { Footer } from "@components/Footer/Footer";
import { useProfile } from "@/components/Profile/ProfileContext";
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import { SkillsSection } from "@/components/Profile/SkillsSection";
import { InterestsSection } from "@/components/Profile/InterestsSection";
import { SavedOpportunities } from "@/components/Profile/SavedOpportunities";

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
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0E4374] pb-24">
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
      </main>
      <Footer />
    </>
  );
}
