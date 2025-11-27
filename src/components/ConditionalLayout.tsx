"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar/Navbar";
import { Footer } from "./Footer/Footer";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isAuthPage = pathname?.startsWith('/auth');
  const isProfilePage = pathname?.startsWith('/profile');
  
  return (
    <>
      <Navbar />
      <main className={isProfilePage ? "bg-[#1e4e79] min-h-screen" : ""}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </>
  );
}