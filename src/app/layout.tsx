import type { Metadata } from "next";
import { Navbar } from "@components/Navbar/Navbar";
import { Footer } from "@components/Footer/Footer";
import "@styles/globals.css";

export const metadata: Metadata = {
  title: "Evkeria - Discover, Network & Innovate",
  description: "Explore volunteering, events, trainings, and exchange programs across Algeria — all in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

