"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const isProfilePage = pathname?.startsWith("/profile");
  
  return (
    <>
      <header className={`${isHomepage ? 'absolute top-8 left-0 right-0 z-20' : 'absolute top-8 left-0 right-0 z-20'} w-full flex justify-center`}>
        <div className="relative w-[945px] h-[101px] mx-auto">
          <div className="absolute top-2.5 left-0 w-full h-[79px] rounded-[47px] shadow-[0px_4px_8.7px_#0000003d,inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)] backdrop-blur-[2.0px] backdrop-brightness-[110%] bg-[linear-gradient(90deg,rgba(79,163,227,0.2)_0%,rgba(111,179,230,0.2)_50%,rgba(44,90,125,0.2)_100%)]" />

          <nav className="absolute top-[34px] left-[123px] flex items-center gap-16">
            <Link
              href="/"
              className="font-outfit font-semibold text-white text-2xl [text-shadow:0px_2px_9.4px_#00000030] whitespace-nowrap hover:text-[#9cd0ff] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/events"
              className="font-outfit font-semibold text-white text-2xl [text-shadow:0px_2px_9.4px_#00000030] whitespace-nowrap hover:text-[#9cd0ff] transition-colors"
            >
              Events
            </Link>
          </nav>

          <Link href="/" className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
            <Image
              className="w-[101px] h-[101px] object-cover"
              alt="EV Logo"
              src="/img.png"
              width={101}
              height={101}
            />
          </Link>

          <nav className="absolute top-[34px] right-[123px] flex items-center gap-16">
            <Link
              href="/trending"
              className="font-outfit font-semibold text-white text-2xl [text-shadow:0px_2px_9.4px_#00000030] whitespace-nowrap hover:text-[#9cd0ff] transition-colors"
            >
              Trending
            </Link>
            <Link
              href="/about"
              className="font-outfit font-semibold text-white text-2xl [text-shadow:0px_2px_9.4px_#00000030] whitespace-nowrap hover:text-[#9cd0ff] transition-colors"
            >
              About Us
            </Link>
          </nav>
        </div>
      </header>

      <div className={`${isHomepage ? 'absolute top-8 left-0 right-0 z-20' : 'absolute top-8 left-0 right-0 z-20'} w-full flex justify-center`}>
        <div className="relative w-[945px]">
          <Link 
            href="/profile" 
            className="absolute top-[27px] right-[-120px] w-[51px] h-[51px] z-20"
          >
            <Image
              className="w-full h-full"
              alt="User profile"
              src={isProfilePage ? "/profile-active.svg" : "/group-13.svg"}
              width={51}
              height={51}
            />
          </Link>
        </div>
      </div>
    </>
  );
}

