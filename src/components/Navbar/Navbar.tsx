"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const isProfilePage = pathname?.startsWith("/profile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="absolute top-4 sm:top-8 left-0 right-0 z-20 w-full flex justify-center px-4">
        <div className="relative w-full max-w-[945px] h-[70px] sm:h-[101px] mx-auto">
          {/* Navbar Background */}
          <div className="absolute top-2.5 left-0 w-full h-[55px] sm:h-[79px] rounded-[35px] sm:rounded-[47px] shadow-[0px_4px_8.7px_#0000003d,inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)] backdrop-blur-[2.0px] backdrop-brightness-[110%] bg-[linear-gradient(90deg,rgba(79,163,227,0.2)_0%,rgba(111,179,230,0.2)_50%,rgba(44,90,125,0.2)_100%)]" />

          {/* Desktop Navigation - Left */}
          <nav className="hidden lg:flex absolute top-[20px] sm:top-[34px] left-[60px] xl:left-[123px] items-center gap-8 xl:gap-16">
            <Link
              href="/"
              className="font-outfit font-semibold text-white text-lg xl:text-2xl [text-shadow:0px_2px_9.4px_#00000030] whitespace-nowrap hover:text-[#9cd0ff] transition-all duration-300 ease-out hover:scale-105"
            >
              Home
            </Link>
            <Link
              href="/events"
              className="font-outfit font-semibold text-white text-lg xl:text-2xl [text-shadow:0px_2px_9.4px_#00000030] whitespace-nowrap hover:text-[#9cd0ff] transition-all duration-300 ease-out hover:scale-105"
            >
              Events
            </Link>
          </nav>

          {/* Logo - Centered Vertically and Horizontally */}
          <Link 
            href="/" 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 transition-transform duration-300 ease-out hover:scale-110 active:scale-95"
          >
            <Image
              className="w-[70px] h-[70px] sm:w-[101px] sm:h-[101px] object-cover"
              alt="EV Logo"
              src="/img.png"
              width={101}
              height={101}
            />
          </Link>

          {/* Desktop Navigation - Right */}
          <nav className="hidden lg:flex absolute top-[20px] sm:top-[34px] right-[60px] xl:right-[123px] items-center gap-8 xl:gap-16">
            <Link
              href="/trending"
              className="font-outfit font-semibold text-white text-lg xl:text-2xl [text-shadow:0px_2px_9.4px_#00000030] whitespace-nowrap hover:text-[#9cd0ff] transition-all duration-300 ease-out hover:scale-105"
            >
              Trending
            </Link>
            <Link
              href="/about"
              className="font-outfit font-semibold text-white text-lg xl:text-2xl [text-shadow:0px_2px_9.4px_#00000030] whitespace-nowrap hover:text-[#9cd0ff] transition-all duration-300 ease-out hover:scale-105"
            >
              About Us
            </Link>
          </nav>

          {/* Desktop Profile Icon - Inside navbar container */}
          <Link 
            href="/profile" 
            className="hidden lg:block absolute top-1/2 -translate-y-1/2 right-[-80px] xl:right-[-120px] w-[40px] h-[40px] sm:w-[51px] sm:h-[51px] z-10 transition-transform duration-300 ease-out hover:scale-110 active:scale-95"
          >
            <Image
              className="w-full h-full"
              alt="User profile"
              src={isProfilePage ? "/profile-active.svg" : "/group-13.svg"}
              width={51}
              height={51}
            />
          </Link>

          {/* Mobile Menu Button */}
          <div className="lg:hidden absolute top-[18px] sm:top-[25px] right-4 flex items-center">
            {/* Hamburger Button */}
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
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-300"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50 transition-transform duration-500 ease-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full bg-[#1E4E79] backdrop-blur-md shadow-2xl">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <Link href="/" onClick={closeMobileMenu}>
              <Image
                className="w-12 h-12 object-cover"
                alt="EV Logo"
                src="/img.png"
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

          {/* Mobile Menu Links */}
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
              href="/trending"
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

