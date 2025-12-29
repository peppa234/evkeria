"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const isProfilePage = pathname?.startsWith("/profile");
  const isEventsPage = pathname === "/events";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleTrendingClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isEventsPage) {
      e.preventDefault();
      const element = document.getElementById('events-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header className="absolute top-4 sm:top-8 left-0 right-0 z-20 w-full px-4 lg:px-8">
        
        <div className="hidden lg:block relative w-full">
          
          <nav className="mx-auto flex items-center justify-center w-fit h-[79px] rounded-[47px] shadow-[0px_4px_8.7px_#0000003d,inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)] backdrop-blur-[12px] backdrop-brightness-[110%] bg-[linear-gradient(90deg,rgba(79,163,227,0.25)_0%,rgba(111,179,230,0.25)_50%,rgba(44,90,125,0.25)_100%)] border border-white/20 px-10 xl:px-14 gap-8 xl:gap-12">
          
            <Link
              href="/"
              className="font-outfit font-semibold text-white text-base xl:text-lg [text-shadow:0px_2px_9.4px_#00000030] whitespace-nowrap hover:text-[#9cd0ff] transition-all duration-300 ease-out hover:scale-105"
            >
              Home
            </Link>
            <Link
              href="/events"
              className="font-outfit font-semibold text-white text-base xl:text-lg [text-shadow:0px_2px_9.4px_#00000030] whitespace-nowrap hover:text-[#9cd0ff] transition-all duration-300 ease-out hover:scale-105"
            >
              Events
            </Link>

            <Link 
              href="/" 
              className="mx-4 xl:mx-8 transition-transform duration-300 ease-out hover:scale-110 active:scale-95 flex-shrink-0"
            >
              <Image
                className="w-[70px] h-[70px] xl:w-[85px] xl:h-[85px] object-cover drop-shadow-lg"
                alt="EV Logo"
                src="/logo_white.svg"
                width={85}
                height={85}
              />
            </Link>

          
            <Link
              href="/events#events-section"
              onClick={handleTrendingClick}
              className="font-outfit font-semibold text-white text-base xl:text-lg [text-shadow:0px_2px_9.4px_#00000030] whitespace-nowrap hover:text-[#9cd0ff] transition-all duration-300 ease-out hover:scale-105"
            >
              Trending
            </Link>
            <Link
              href="/about"
              className="font-outfit font-semibold text-white text-base xl:text-lg [text-shadow:0px_2px_9.4px_#00000030] whitespace-nowrap hover:text-[#9cd0ff] transition-all duration-300 ease-out hover:scale-105"
            >
              About Us
            </Link>
          </nav>

         
          <Link 
            href="/profile" 
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[48px] h-[48px] xl:w-[52px] xl:h-[52px] transition-transform duration-300 ease-out hover:scale-110 active:scale-95"
          >
            <Image
              className="w-full h-full drop-shadow-md"
              alt="User profile"
              src={isProfilePage ? "/profile-active.svg" : "/group-13.svg"}
              width={52}
              height={52}
            />
          </Link>
        </div>

   
        <div className="lg:hidden relative w-full h-[70px] flex items-center justify-between">
     
          <Link 
            href="/" 
            className="transition-transform duration-300 ease-out hover:scale-110 active:scale-95"
          >
            <Image
              className="w-[60px] h-[60px] object-cover"
              alt="EV Logo"
              src="/logo_white.svg"
              width={60}
              height={60}
            />
          </Link>

      
          <button
            onClick={toggleMobileMenu}
            className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 z-30"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-300"
          onClick={closeMobileMenu}
        />
      )}


      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50 transition-transform duration-500 ease-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full bg-[#1E4E79] backdrop-blur-md shadow-2xl">
         
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <Link href="/" onClick={closeMobileMenu}>
              <Image
                className="w-12 h-12 object-cover"
                alt="EV Logo"
                src="/logo_white.svg"
                width={48}
                height={48}
              />
            </Link>
            <button
              onClick={closeMobileMenu}
              className="w-10 h-10 flex items-center justify-center text-white"
              aria-label="Close menu"
            >
              <span className="text-3xl">×</span>
            </button>
          </div>

         
          <nav className="flex flex-col p-6 gap-6">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="font-outfit font-semibold text-white text-2xl [text-shadow:0px_2px_9.4px_#00000030] hover:text-[#9cd0ff] transition-all duration-300 ease-out py-2 hover:translate-x-2"
            >
              Home
            </Link>
            <Link
              href="/events"
              onClick={closeMobileMenu}
              className="font-outfit font-semibold text-white text-2xl [text-shadow:0px_2px_9.4px_#00000030] hover:text-[#9cd0ff] transition-all duration-300 ease-out py-2 hover:translate-x-2"
            >
              Events
            </Link>
            <Link
              href="/events#events-section"
              onClick={closeMobileMenu}
              className="font-outfit font-semibold text-white text-2xl [text-shadow:0px_2px_9.4px_#00000030] hover:text-[#9cd0ff] transition-all duration-300 ease-out py-2 hover:translate-x-2"
            >
              Trending
            </Link>
            <Link
              href="/about"
              onClick={closeMobileMenu}
              className="font-outfit font-semibold text-white text-2xl [text-shadow:0px_2px_9.4px_#00000030] hover:text-[#9cd0ff] transition-all duration-300 ease-out py-2 hover:translate-x-2"
            >
              About Us
            </Link>
            <Link
              href="/profile"
              onClick={closeMobileMenu}
              className="font-outfit font-semibold text-white text-2xl [text-shadow:0px_2px_9.4px_#00000030] hover:text-[#9cd0ff] transition-all duration-300 ease-out py-2 hover:translate-x-2"
            >
              Profile
            </Link>
          </nav>
        </div>
      </div>

    </>
  );
}

