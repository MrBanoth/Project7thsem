export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5001/api";

export function authHeaders(token?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function uploadImageToCloudinary(file: File): Promise<string> {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dotz49ani";
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "Project";
  
  console.log("Cloudinary config:", { cloud, preset });
  
  if (!cloud || !preset) {
    throw new Error("Cloudinary environment variables not configured");
  }
  
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", preset);
  
  console.log("Uploading to Cloudinary...");
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { 
    method: "POST", 
    body: form 
  });
  
  const json = await res.json();
  console.log("Cloudinary response:", json);
  
  if (!res.ok) {
    throw new Error(json?.error?.message || `Upload failed with status ${res.status}`);
  }
  
  return json.secure_url as string;
}


