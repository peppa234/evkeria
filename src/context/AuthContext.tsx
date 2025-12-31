"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  bio?: string;
  portfolioUrl?: string;
  avatarUrl?: string;
  skills: string[];
  interests: string[];
  savedEvents: string[];
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
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
        
        // Standardized format: { success: true, data: { type: "user" | "both", user: {...} } }
        // Handle both "user" and "both" types (both means user is logged in)
        if (data.success && data.data?.user && (data.data.type === "user" || data.data.type === "both")) {
          const userData = data.data.user;
          setUser({
            id: userData.id,
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            bio: userData.bio,
            portfolioUrl: userData.portfolioUrl,
            avatarUrl: userData.avatarUrl,
            skills: userData.skills || [],
            interests: userData.interests || [],
            savedEvents: userData.savedEvents || [],
          });
        } else {
          // No user session
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "user", email, password }),
      });

      const data = await res.json();

      // Standardized format: { success: false, error: { message: string } }
      if (!res.ok || !data.success) {
        const errorMsg = data.error?.message || "Login failed";
        return { success: false, error: errorMsg };
      }

      // Fetch full user data
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
        body: JSON.stringify({ type: "user", name, email, password }),
      });

      const data = await res.json();

      // Standardized format: { success: false, error: { message: string } }
      if (!res.ok || !data.success) {
        const errorMsg = data.error?.message || "Signup failed";
        return { success: false, error: errorMsg };
      }

      // Fetch full user data
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
      // Logout only from user account (keep org session if exists)
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "user" }),
      });
      setUser(null);
      // Force full page reload to clear any cached auth state
      window.location.href = "/";
    } catch (error) {
      // Logout error - fail silently
    }
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
