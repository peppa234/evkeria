"use client";

import { useState, useEffect } from "react";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  type: "user" | "organization";
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
  };
}
