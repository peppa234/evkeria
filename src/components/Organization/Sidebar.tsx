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
import { useOrganizationAuth } from "@context/OrganizationAuthContext";

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
  onLogout: () => void;
}

function SidebarContent({ navigationItems, onLinkClick, onLogout }: SidebarContentProps) {
  return (
    <>
      <div className="p-6 pb-8">
        <Link href="/" onClick={onLinkClick} className="block hover:opacity-80 transition-opacity">
          <Image
            className="w-[78px] h-[78px]"
            alt="Evkeria Logo"
            src="/logo_white.svg"
            width={78}
            height={78}
            priority
          />
        </Link>
      </div>

      <nav className="flex-1 px-6 space-y-4" aria-label="Main navigation">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} onClick={onLinkClick}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-12 rounded-xl font-outfit font-medium text-base transition-all duration-200",
                  item.active
                    ? "bg-[#4fa3e3] text-white hover:bg-[#4fa3e3] hover:text-white shadow-lg shadow-[#4fa3e3]/30"
                    : "text-[#b8d4f0] hover:bg-[#4fa3e3]/20 hover:text-white hover:translate-x-1"
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

      <div className="px-6 pb-8 pt-4">
        <div className="w-full h-px bg-[#b8d4f0]/30 mb-6" aria-hidden="true" />
        <Button
          variant="ghost"
          onClick={onLogout}
          className="w-full justify-start text-[#b8d4f0] hover:bg-red-500/20 hover:text-red-300 hover:translate-x-1 font-outfit font-medium text-base transition-all duration-200"
          aria-label="Logout"
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
  const { logout } = useOrganizationAuth();

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
      href: "/organization/profile",
      active: pathname === "/organization/profile",
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    closeMobileMenu();
    logout();
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-[#1e4e79] text-white shadow-lg hover:bg-[#4fa3e3] transition-all duration-200 hover:scale-105"
        aria-label="Toggle navigation menu"
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? (
          <XIcon className="w-6 h-6" />
        ) : (
          <MenuIcon className="w-6 h-6" />
        )}
      </button>

      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      <aside
        className="hidden md:flex w-[280px] h-screen fixed left-0 top-0 shadow-lg bg-[#1e4e79] flex-col z-10"
        aria-label="Organization navigation sidebar"
      >
        <SidebarContent navigationItems={navigationItems} onLogout={handleLogout} />
      </aside>

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
          onLogout={handleLogout}
        />
      </aside>
    </>
  );
}

export { SIDEBAR_WIDTH };
