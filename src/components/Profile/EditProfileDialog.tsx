"use client";

import { FormEvent, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useProfile } from "./ProfileContext";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function EditProfileDialog({ isOpen, onClose }: Props) {
  const { profile, setProfile } = useProfile();
  
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [bio, setBio] = useState(profile.bio);
  const [photoUrl, setPhotoUrl] = useState<string>("/profile_pic.png");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setName(profile.name);
      setEmail(profile.email);
      setBio(profile.bio);
    }
  }, [isOpen, profile]);


  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setProfile({
      ...profile,
      name: name.trim(),
      email: email.trim(),
      bio: bio.trim(),
    });
    onClose();
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={handleBackdropClick}
      />
      
      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 overflow-y-auto py-8">
        <div 
          className="w-full max-w-2xl rounded-2xl sm:rounded-3xl bg-white shadow-2xl px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-10 animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            aria-label="Close dialog"
          >
            <span className="text-gray-500 text-xl leading-none">×</span>
          </button>

          {/* Photo section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden">
              <Image
                src={photoUrl}
                alt="Profile photo"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={handlePhotoClick}
                className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center hover:scale-105 transition"
                aria-label="Edit photo"
              >
                <Image
                  src="/pencil.svg"
                  alt="Edit photo"
                  width={16}
                  height={16}
                />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
            <p className="mt-3 font-outfit text-sm text-[#4B5B72]">
              Edit Photo
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-1">
              <label className="font-outfit text-sm text-[#4B5B72]">
                Full Name
              </label>
              <input
                className="rounded-xl border border-[#D1D5DB] px-4 py-2 text-sm font-outfit outline-none focus:border-[#4fa3e3] transition-colors"
                placeholder="Edit your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-outfit text-sm text-[#4B5B72]">
                Phone Number
              </label>
              <input
                className="rounded-xl border border-[#D1D5DB] px-4 py-2 text-sm font-outfit outline-none focus:border-[#4fa3e3] transition-colors"
                placeholder="Add your phone number"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-outfit text-sm text-[#4B5B72]">
                Email Address
              </label>
              <input
                type="email"
                className="rounded-xl border border-[#D1D5DB] px-4 py-2 text-sm font-outfit outline-none focus:border-[#4fa3e3] transition-colors"
                placeholder="Change your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-outfit text-sm text-[#4B5B72]">
                Portfolio URL
              </label>
              <input
                className="rounded-xl border border-[#D1D5DB] px-4 py-2 text-sm font-outfit outline-none focus:border-[#4fa3e3] transition-colors"
                placeholder="https://yourportfolio.com"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-outfit text-sm text-[#4B5B72]">
                Description
              </label>
              <textarea
                rows={4}
                className="rounded-xl border border-[#D1D5DB] px-4 py-2 text-sm font-outfit outline-none focus:border-[#4fa3e3] transition-colors resize-none"
                placeholder="Write your profile description here..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#1e4e79] text-sm font-outfit text-white hover:bg-[#2a5f8f] transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-full border border-[#E5E7EB] text-sm font-outfit text-[#4B5B72] hover:bg-[#F3F4F6] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

