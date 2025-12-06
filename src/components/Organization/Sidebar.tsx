"use client";

import {
  CalendarIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  UserIcon,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";

interface NavigationItem {
  icon: LucideIcon;
  label: string;
  href: string;
  active: boolean;
}

const SIDEBAR_WIDTH = 280;

interface SidebarContentProps {
  navigationItems: NavigationItem[];
  onLinkClick?: () => void;
}

function SidebarContent({ navigationItems, onLinkClick }: SidebarContentProps) {
  return (
    <>
      <div className="p-6">
        <Image
          className="w-[78px] h-[78px]"
          alt="Evkeria Logo"
          src="/img.png"
          width={78}
          height={78}
          priority
        />
      </div>

      <nav className="flex-1 px-6 space-y-2" aria-label="Main navigation">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} onClick={onLinkClick}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-12 rounded-xl font-outfit font-medium text-base transition-colors",
                  item.active
                    ? "bg-[#4fa3e3] text-white hover:bg-[#4fa3e3] hover:text-white"
                    : "text-[#b8d4f0] hover:bg-[#4fa3e3]/20 hover:text-white"
                )}
                aria-current={item.active ? "page" : undefined}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                <span className="ml-3">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 pb-6">
        <div className="w-full h-px bg-[#b8d4f0] mb-6" aria-hidden="true" />
        <Button
          variant="ghost"
          className="w-full justify-start text-[#b8d4f0] hover:bg-[#4fa3e3]/20 hover:text-white font-outfit font-medium text-base transition-colors"
          aria-label="Logout"
          onClick={onLinkClick}
        >
          <LogOutIcon className="w-5 h-5" aria-hidden="true" />
          <span className="ml-3">Logout</span>
        </Button>
      </div>
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems: NavigationItem[] = [
    {
      icon: HomeIcon,
      label: "Dashboard",
      href: "/organization/dashboard",
      active: pathname === "/organization/dashboard",
    },
    {
      icon: CalendarIcon,
      label: "My Events",
      href: "/organization/events",
      active:
        pathname === "/organization/events" ||
        pathname?.startsWith("/organization/events"),
    },
    {
      icon: UserIcon,
      label: "Profile",
      href: "/profile",
      active: pathname === "/profile",
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-[#1e4e79] text-white shadow-lg hover:bg-[#4fa3e3] transition-colors"
        aria-label="Toggle navigation menu"
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? (
          <XIcon className="w-6 h-6" />
        ) : (
          <MenuIcon className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex w-[280px] h-screen fixed left-0 top-0 shadow-lg bg-[#1e4e79] flex-col z-10"
        aria-label="Organization navigation sidebar"
      >
        <SidebarContent navigationItems={navigationItems} />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "md:hidden fixed top-0 right-0 w-[280px] h-screen shadow-lg bg-[#1e4e79] flex-col z-50 transform transition-transform duration-300 ease-in-out flex",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
        aria-label="Organization navigation sidebar"
        aria-hidden={!isMobileMenuOpen}
      >
        <SidebarContent
          navigationItems={navigationItems}
          onLinkClick={closeMobileMenu}
        />
      </aside>
    </>
  );
}

export { SIDEBAR_WIDTH };

