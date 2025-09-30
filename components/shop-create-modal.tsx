"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API_BASE, authHeaders, uploadImageToCloudinary } from "@/lib/api";
import { useAuth } from "@/components/auth-context";

type Props = { open: boolean; onOpenChange: (o: boolean) => void; onCreated?: (shopId: string) => void };

export function ShopCreateModal({ open, onOpenChange, onCreated }: Props) {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let bannerUrl = bannerImage;
      if (bannerFile) {
        bannerUrl = await uploadImageToCloudinary(bannerFile);
      }
      const res = await fetch(`${API_BASE}/shops`, {
        method: "POST",
        headers: authHeaders(token || undefined),
        body: JSON.stringify({ name, address, bannerImage: bannerUrl }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to create shop");
      const id = json.data?._id;
      if (id) {
        if (typeof window !== "undefined") (window as any).__seed_shop_id = id;
        onCreated?.(id);
      }
      onOpenChange(false);
    } catch (err: any) {
      setError(err?.message || "Error creating shop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create your shop</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <Input placeholder="Shop name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
          <Input placeholder="Banner image URL (optional)" value={bannerImage} onChange={(e) => setBannerImage(e.target.value)} />
          <div className="text-xs text-muted-foreground">Or upload an image</div>
          <Input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">{loading ? "Creating..." : "Create Shop"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}


