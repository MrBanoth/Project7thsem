"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { API_BASE } from "@/lib/api";

type User = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "shopkeeper" | "customer";
  profileImage?: string;
  address?: string;
  phone?: string;
  bio?: string;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: User["role"]) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Use API_BASE from lib/api to avoid duplicate definitions

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
    setIsReady(true);

    // Listen for user updates from profile edit
    const handleUserUpdate = (event: CustomEvent) => {
      console.log("User updated event received:", event.detail);
      setUser(event.detail);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(event.detail));
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("user-updated", handleUserUpdate as EventListener);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("user-updated", handleUserUpdate as EventListener);
      }
    };
  }, []);

  const persist = (t: string, u: User) => {
    setToken(t);
    setUser(u);
    if (typeof window !== "undefined") {
      localStorage.setItem("token", t);
      localStorage.setItem("user", JSON.stringify(u));
    }
    // If shopkeeper, remember their first shop id globally for add-product
    if (u.role === "shopkeeper") {
      setTimeout(() => {
        setShopkeeperDefaultShop(t, u).catch(() => {});
      }, 0);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Login failed");
    persist(json.data.token, json.data.user);
  };

  const register = async (name: string, email: string, password: string, role: User["role"]) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Registration failed");
    persist(json.data.token, json.data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };
  
  // Fetch profile on load if token exists (keeps avatar in sync)
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        if (res.ok) {
          setUser(json.data);
          if (typeof window !== "undefined") {
            localStorage.setItem("auth_user", JSON.stringify(json.data));
          }
          if (json.data?.role === "shopkeeper") {
            setShopkeeperDefaultShop(token, json.data).catch(() => {});
          }
        }
      } catch {}
    };
    fetchProfile();
  }, [token]);

  async function setShopkeeperDefaultShop(t: string, u: User) {
    try {
      let res = await fetch(`${API_BASE}/shops?owner=${u.id}&limit=1`, { headers: { Authorization: `Bearer ${t}` } });
      let json = await res.json();
      let firstShopId = json?.data?.[0]?._id;
      if (!firstShopId) {
        // Fallback: pick any active shop to enable posting for demo
        res = await fetch(`${API_BASE}/shops?isActive=true&limit=1`);
        json = await res.json();
        firstShopId = json?.data?.[0]?._id;
      }
      if (firstShopId && typeof window !== "undefined") {
        (window as any).__seed_shop_id = firstShopId;
      }
    } catch {}
  }

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isReady,
    login,
    register,
    logout,
  }), [user, token, isReady]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


