"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-context"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { API_BASE, uploadImageToCloudinary } from "@/lib/api"
import { Camera, Save, ArrowLeft, Upload, Smartphone, Lock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function EditProfilePage() {
  const { user, isAuthenticated, isReady } = useAuth()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    bio: "",
    profileImage: ""
  })
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [showPasswordSection, setShowPasswordSection] = useState(false)

  useEffect(() => {
    if (isReady && user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        address: user.address || "",
        phone: user.phone || "",
        bio: user.bio || "",
        profileImage: user.profileImage || ""
      })
    }
    
    // Debug environment variables
    console.log("Environment variables:", {
      API_BASE: process.env.NEXT_PUBLIC_API_BASE,
      CLOUDINARY_CLOUD: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    })
  }, [user, isReady])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      console.log("No file selected")
      return
    }

    console.log("File selected:", file.name, "Size:", file.size)

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return
    }

    setUploadingImage(true)
    try {
      console.log("Starting Cloudinary upload...")
      
      // Upload to Cloudinary
      const imageUrl = await uploadImageToCloudinary(file)
      console.log("Cloudinary upload successful:", imageUrl)
      
      // Update local state immediately for real-time preview
      setFormData(prev => ({
        ...prev,
        profileImage: imageUrl
      }))

      // Update database immediately
      const token = localStorage.getItem("token")
      if (token) {
        console.log("Updating database with new image...")
        const response = await fetch(`${API_BASE}/auth/me`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ profileImage: imageUrl })
        })

        if (response.ok) {
          const updatedUser = await response.json()
          console.log("Database update successful:", updatedUser)
          // Update local storage with new user data
          localStorage.setItem("user", JSON.stringify(updatedUser.data))
          toast.success("Profile image updated successfully!")
        } else {
          const errorData = await response.json()
          console.error("Database update failed:", errorData)
          throw new Error("Failed to update profile in database")
        }
      } else {
        console.error("No token found")
        throw new Error("No authentication token found")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error(`Failed to upload image: ${error.message || "Please try again."}`)
      // Reset to previous image on error
      setFormData(prev => ({
        ...prev,
        profileImage: user?.profileImage || ""
      }))
    } finally {
      setUploadingImage(false)
    }
  }

  const handleChoosePhoto = () => {
    console.log("Choose photo clicked")
    const input = document.getElementById('profileImage') as HTMLInputElement
    if (input) {
      console.log("File input found, clicking...")
      input.click()
    } else {
      console.error("File input not found")
    }
  }

  const handleTakePhoto = () => {
    console.log("Take photo clicked")
    // For now, we'll use the file input with camera capture
    const input = document.getElementById('cameraInput') as HTMLInputElement
    if (input) {
      console.log("Camera input found, clicking...")
      input.click()
    } else {
      console.error("Camera input not found")
    }
  }

  const handleChangePassword = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill in all password fields")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long")
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to change password")
      }

      toast.success("Password changed successfully!")
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" })
      setShowPasswordSection(false)
    } catch (error: any) {
      console.error("Error changing password:", error)
      toast.error(error.message || "Failed to change password. Please check your old password.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated || !user) {
      toast.error("Please log in to update your profile")
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      console.log("Updating profile with data:", formData)
      console.log("API endpoint:", `${API_BASE}/auth/me`)

      const response = await fetch(`${API_BASE}/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Profile update failed:", errorData)
        throw new Error(errorData.message || `Failed to update profile (${response.status})`)
      }

      const updatedUser = await response.json()
      console.log("Profile update successful:", updatedUser)
      
      toast.success("Profile updated successfully!")
      
      // Update local storage with new user data
      localStorage.setItem("user", JSON.stringify(updatedUser.data))
      
      // Update auth context if available
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("user-updated", { detail: updatedUser.data }))
      }
      
      // Reload the page to reflect changes
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast.error(`Failed to update profile: ${error.message || "Please try again."}`)
    } finally {
      setLoading(false)
    }
  }

  if (!isReady) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">Please log in to edit your profile</p>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Profile</h1>
            <p className="text-muted-foreground">Update your personal information</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Image */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={formData.profileImage} alt={formData.name} />
                      <AvatarFallback className="text-lg">
                        {formData.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={handleChoosePhoto}
                      disabled={uploadingImage}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploadingImage ? "Uploading..." : "Choose Photo"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={handleTakePhoto}
                      disabled={uploadingImage}
                    >
                      <Smartphone className="w-4 h-4 mr-2" />
                      Take Photo
                    </Button>
                    <input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <input
                      id="cameraInput"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* User Role Badge */}
                <div className="flex justify-center">
                  <Badge variant="secondary" className="text-sm">
                    {user.role === "admin" ? "Administrator" : 
                     user.role === "shopkeeper" ? "Shopkeeper" : "Customer"}
                  </Badge>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself"
                    rows={3}
                  />
                </div>

                {/* Password Change Section */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      <h3 className="text-lg font-semibold">Change Password</h3>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPasswordSection(!showPasswordSection)}
                    >
                      {showPasswordSection ? "Cancel" : "Change Password"}
                    </Button>
                  </div>

                  {showPasswordSection && (
                    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="oldPassword">Current Password *</Label>
                        <Input
                          id="oldPassword"
                          name="oldPassword"
                          type="password"
                          value={passwordData.oldPassword}
                          onChange={handlePasswordChange}
                          placeholder="Enter your current password"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password *</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="Enter your new password"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="Confirm your new password"
                          required
                        />
                      </div>

                      <Button
                        type="button"
                        onClick={handleChangePassword}
                        disabled={loading}
                        className="w-full"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        {loading ? "Changing Password..." : "Change Password"}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-4">
                  <Link href="/">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
