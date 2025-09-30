"use client";

import React, { useEffect, useState } from "react";
import { AdminPanel } from "@/components/admin-panel";
import { Layout } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API_BASE } from "@/lib/api";

export default function AdminRoutePage() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const hasToken = typeof window !== "undefined" && !!localStorage.getItem("admin_token");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Invalid admin credentials");
      localStorage.setItem("admin_token", json.data.token);
      window.location.reload();
    } catch (err: any) {
      setError(err?.message || "Login failed");
    }
  };

  if (!hasToken) {
    return (
      <Layout>
        <div className="max-w-sm mx-auto p-6">
          <h1 className="text-2xl font-semibold mb-4">Admin Login</h1>
          <form onSubmit={onSubmit} className="space-y-3">
            <Input placeholder="Admin ID" value={adminId} onChange={(e) => setAdminId(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <AdminPanel onBack={() => (window.location.href = "/")} />
    </Layout>
  );
}


