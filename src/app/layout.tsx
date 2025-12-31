import type { Metadata } from "next";

import "@styles/globals.css";
import { ConditionalLayout } from "@components/ConditionalLayout";
import { AuthProvider } from "@/context/AuthContext";
import { OrganizationAuthProvider } from "@/context/OrganizationAuthContext";
import { ErrorBoundary } from "@components/ErrorBoundary";

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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <ErrorBoundary>
          <AuthProvider>
            <OrganizationAuthProvider>
              <ConditionalLayout>{children}</ConditionalLayout>
            </OrganizationAuthProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}