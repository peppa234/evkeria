
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  name: string;
  email: string;
  bio: string;
};

export function ProfileHeader({ name, email, bio }: Props) {
  const router = useRouter();

  const handleEditClick = () => {
    router.push("/profile/edit");
  };

  return (
    <section className="max-w-5xl mx-auto mt-40 mb-8">
      <div className="rounded-3xl overflow-hidden bg-white shadow-lg">
        <div className="bg-[#7DB7E9] h-32 relative">
          <div className="absolute -bottom-12 left-10 flex items-end gap-4">
            <div className="relative">
              <Image
                src="/profile_pic.svg"
                alt="Profile picture"
                width={112}
                height={112}
                className="rounded-full border-4 border-white shadow-lg"
              />
              <button
                onClick={handleEditClick}
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center hover:scale-105 transition z-10"
                aria-label="Edit profile"
              >
                <Image
                  src="/pencil.svg"
                  alt="Edit profile"
                  width={18}
                  height={18}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-16 pb-8 px-10 flex flex-col gap-2">
          <div className="font-outfit font-semibold text-2xl text-[#0B2443]">
            {name}
          </div>
          <div className="font-outfit text-sm text-[#4B5B72]">
            {email}
          </div>
          <p className="mt-3 font-outfit text-sm leading-relaxed text-[#1A2B4C] max-w-3xl">
            {bio}
          </p>
        </div>
      </div>
    </section>
  );
}
