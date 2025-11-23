"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/organization/dashboard", label: "Dashboard" },
    { href: "/organization/events", label: "Events" },
    { href: "/organization/events/create", label: "Create Event" },
  ];

  return (
    <aside className="w-64 bg-[#1e4e79] min-h-screen p-6">
      <nav className="flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`font-outfit font-medium px-4 py-2 rounded-lg transition-colors ${
              pathname === link.href
                ? "bg-[#4fa3e3] text-white"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

