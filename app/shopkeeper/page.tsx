"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/components/auth-context";
import { ShopkeeperDashboard } from "@/components/shopkeeper-dashboard";
import { ShopCreateModal } from "@/components/shop-create-modal";
import { Layout } from "@/components/layout";
import { API_BASE, uploadImageToCloudinary } from "@/lib/api";

export default function ShopkeeperRoutePage() {
  const { isAuthenticated, user, isReady } = useAuth();
  const [needsShop, setNeedsShop] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("open-auth-modal"));
      }
    }
  }, [isAuthenticated, isReady]);

  useEffect(() => {
    const check = async () => {
      if (!isReady || !isAuthenticated || user?.role !== "shopkeeper") return;
      const res = await fetch(`${API_BASE}/shops?owner=${user.id}&limit=1`);
      const json = await res.json();
      const hasShop = json?.data?.length > 0;
      setNeedsShop(!hasShop);
      setOpen(!hasShop);
    };
    check();
  }, [isReady, isAuthenticated, user]);

  if (!isReady) return null;
  if (!isAuthenticated) return null;
  if (user?.role !== "shopkeeper") return <div className="p-6">Unauthorized</div>;

  return (
    <Layout>
      <ShopkeeperDashboard onBack={() => (window.location.href = "/")} />
      <ShopCreateModal
        open={open}
        onOpenChange={setOpen}
        onCreated={() => setNeedsShop(false)}
      />
    </Layout>
  );
}


