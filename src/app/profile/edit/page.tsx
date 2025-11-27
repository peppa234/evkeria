"use client";
import { Navbar } from "@components/Navbar/Navbar";
import { Footer } from "@components/Footer/Footer";
import { FormEvent, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useProfile } from "@/components/Profile/ProfileContext";

export default function EditProfilePage() {
  const { profile, setProfile } = useProfile();
  const router = useRouter();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [bio, setBio] = useState(profile.bio);
  const [photoUrl, setPhotoUrl] = useState<string>("/profile_pic.png");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setProfile({
      ...profile,
      name: name.trim(),
      email: email.trim(),
      bio: bio.trim(),
    });
    router.push("/profile");
  };

  const handleCancel = () => {
    router.push("/profile");
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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0E4374] pb-24 pt-32 relative">
        <div className="fixed inset-0 bg-black/30 z-30" />
        <section className="fixed inset-0 z-40 flex items-center justify-center px-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl px-10 py-10">
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
                    src="/edit.png"
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

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col gap-1">
                <label className="font-outfit text-sm text-[#4B5B72]">
                  Full Name
                </label>
                <input
                  className="rounded-xl border border-[#D1D5DB] px-4 py-2 text-sm font-outfit outline-none focus:border-[#4A7FD9]"
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
                  className="rounded-xl border border-[#D1D5DB] px-4 py-2 text-sm font-outfit outline-none focus:border-[#4A7FD9]"
                  placeholder="Add your phone number"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-outfit text-sm text-[#4B5B72]">
                  Email Address
                </label>
                <input
                  type="email"
                  className="rounded-xl border border-[#D1D5DB] px-4 py-2 text-sm font-outfit outline-none focus:border-[#4A7FD9]"
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
                  className="rounded-xl border border-[#D1D5DB] px-4 py-2 text-sm font-outfit outline-none focus:border-[#4A7FD9]"
                  placeholder="https://yourportfolio.com"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-outfit text-sm text-[#4B5B72]">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="rounded-xl border border-[#D1D5DB] px-4 py-2 text-sm font-outfit outline-none focus:border-[#4A7FD9] resize-none"
                  placeholder="Write your profile description here..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#184579] text-sm font-outfit text-white hover:bg-[#133761]"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full py-3 rounded-full border border-[#E5E7EB] text-sm font-outfit text-[#4B5B72] hover:bg-[#F3F4F6]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
