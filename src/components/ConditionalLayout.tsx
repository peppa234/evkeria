"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar/Navbar";
import { Footer } from "./Footer/Footer";



export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if current path is an auth page
  const isAuthPage = pathname?.startsWith('/auth');
  
  return (
    <>
       <Navbar />
      <main>{children}</main>
      {!isAuthPage && <Footer />}
    </>
  );
}