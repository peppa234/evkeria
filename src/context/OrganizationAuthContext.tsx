"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

type Organization = {
  id: string;
  email: string;
  name: string;
  type?: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  fields: string[];
  opportunities: string[];
};

type OrganizationAuthContextType = {
  organization: Organization | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshOrganization: () => Promise<void>;
  updateOrganization: (data: Partial<Organization>) => void;
};

const OrganizationAuthContext = createContext<OrganizationAuthContextType | undefined>(undefined);

export function OrganizationAuthProvider({ children }: { children: ReactNode }) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check session on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      
      if (res.ok) {
        const data = await res.json();
        
        // Standardized format: { success: true, data: { type: "organization" | "both", organization: {...} } }
        // Handle both "organization" and "both" types (both means org is logged in)
        if (data.success && data.data?.organization && (data.data.type === "organization" || data.data.type === "both")) {
          const orgData = data.data.organization;
          setOrganization({
            id: orgData.id,
            email: orgData.email,
            name: orgData.name,
            type: orgData.type,
            description: orgData.description,
            logoUrl: orgData.logoUrl,
            websiteUrl: orgData.websiteUrl,
            fields: orgData.fields || [],
            opportunities: orgData.opportunities || [],
          });
        } else {
          // No organization session
          setOrganization(null);
        }
      } else {
        setOrganization(null);
      }
    } catch (error) {
      setOrganization(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "organization", email, password }),
      });

      const data = await res.json();

      // Standardized format: { success: false, error: { message: string } }
      if (!res.ok || !data.success) {
        const errorMsg = data.error?.message || "Login failed";
        return { success: false, error: errorMsg };
      }

      // Fetch full organization data
      await checkAuth();
      // Refresh the router cache to update middleware state
      router.refresh();
      return { success: true };
    } catch (error) {
      return { success: false, error: "Network error" };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "organization", name, email, password }),
      });

      const data = await res.json();

      // Standardized format: { success: false, error: { message: string } }
      if (!res.ok || !data.success) {
        const errorMsg = data.error?.message || "Signup failed";
        return { success: false, error: errorMsg };
      }

      // Fetch full organization data
      await checkAuth();
      // Refresh the router cache to update middleware state
      router.refresh();
      return { success: true };
    } catch (error) {
      return { success: false, error: "Network error" };
    }
  };

  const logout = async () => {
    try {
      // Logout only from organization account (keep user session if exists)
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "organization" }),
      });
      setOrganization(null);
      // Force full page reload to clear any cached auth state
      window.location.href = "/";
    } catch (error) {
      // Logout error - fail silently
    }
  };

  const refreshOrganization = async () => {
    await checkAuth();
  };

  const updateOrganization = (data: Partial<Organization>) => {
    if (organization) {
      setOrganization({ ...organization, ...data });
    }
  };

  return (
    <OrganizationAuthContext.Provider
      value={{
        organization,
        isLoading,
        isAuthenticated: !!organization,
        login,
        signup,
        logout,
        refreshOrganization,
        updateOrganization,
      }}
    >
      {children}
    </OrganizationAuthContext.Provider>
  );
}

export function useOrganizationAuth() {
  const ctx = useContext(OrganizationAuthContext);
  if (!ctx) throw new Error("useOrganizationAuth must be used within OrganizationAuthProvider");
  return ctx;
}

