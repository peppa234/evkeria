
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
    <section className="max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto mt-20 sm:mt-32 md:mt-40 mb-6 sm:mb-8 px-4 sm:px-6">
      <div className="rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-lg">
        <div className="bg-[#7DB7E9] h-24 sm:h-28 md:h-32 relative">
          <div className="absolute -bottom-8 sm:-bottom-10 md:-bottom-12 left-4 sm:left-6 md:left-10 flex items-end gap-3 sm:gap-4">
            <div className="relative">
              <Image
                src="/profile_pic.svg"
                alt="Profile picture"
                width={112}
                height={112}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-2 sm:border-4 border-white shadow-lg"
              />
              <button
                onClick={handleEditClick}
                className="absolute bottom-0 right-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white shadow flex items-center justify-center hover:scale-105 transition z-10"
                aria-label="Edit profile"
              >
                <Image
                  src="/pencil.svg"
                  alt="Edit profile"
                  width={18}
                  height={18}
                  className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 sm:pt-14 md:pt-16 pb-6 sm:pb-8 px-4 sm:px-6 md:px-10 flex flex-col gap-2">
          <div className="font-outfit font-semibold text-xl sm:text-2xl text-[#0B2443]">
            {name}
          </div>
          <div className="font-outfit text-xs sm:text-sm text-[#4B5B72]">
            {email}
          </div>
          <p className="mt-2 sm:mt-3 font-outfit text-xs sm:text-sm leading-relaxed text-[#1A2B4C] max-w-3xl">
            {bio}
          </p>
        </div>
      </div>
    </section>
  );
}
