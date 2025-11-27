"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ProfileData = {
  name: string;
  email: string;
  bio: string;
  skills: string[];
  interests: string[];
};

type ProfileContextType = {
  profile: ProfileData;
  setProfile: (data: ProfileData) => void;
};

const defaultProfile: ProfileData = {
  name: "John Doe",
  email: "john.doe@email.com",
  bio: "Passionate software engineer with 5+ years of experience in full-stack development. I love building innovative solutions and contributing to open-source projects. Always eager to learn new technologies and collaborate with talented teams.",
  skills: ["JavaScript", "React", "Node.js", "Python", "UI/UX Design"],
  interests: ["Machine Learning", "Open Source", "Photography", "Travel"],
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
