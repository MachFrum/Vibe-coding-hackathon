
"use client";

import React, { useState, type ChangeEvent, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBusiness } from "@/contexts/BusinessContext";
import { Mail, Building, Info, UploadCloud, Loader2 } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { uploadProfileImage, auth } from '@/lib/firebase'; 
// Removed: import { updateProfile } from "firebase/auth"; // uploadProfileImage now handles this

const getInitials = (name?: string | null) => {
  if (!name) return "U";
  const names = name.split(" ");
  const initials = names.map((n) => n[0]).join("");
  return initials.toUpperCase() || "U";
};

// Keys for localStorage for portfolio items (as a fallback for this page)
const PORTFOLIO_DESC_KEY = 'malitrack-portfolio-description';
const PORTFOLIO_BANNER_KEY = 'malitrack-portfolio-banner-url'; // Will now store Firebase URL
const PORTFOLIO_LOGO_KEY = 'malitrack-portfolio-logo-url';   // Will now store Firebase URL


export default function ProfilePage() {
  const { businessName } = useBusiness();
  const { currentUser, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(currentUser?.photoURL || null);
  const [isUploading, setIsUploading] = useState(false);

  const [mockBusinessDescription, setMockBusinessDescription] = useState("This is a placeholder description for your business. Update it on the 'Your Portfolio' page.");
  const [mockBannerImageUrl, setMockBannerImageUrl] = useState<string | null>("https://placehold.co/800x200.png");
  const [mockProfileImageUrl, setMockProfileImageUrl] = useState<string | null>("https://placehold.co/200x200.png");


  useEffect(() => {
    if (currentUser?.photoURL) {
      setProfileImagePreview(currentUser.photoURL);
    }
    // Load portfolio data from localStorage for display on this page
    const storedDesc = localStorage.getItem(PORTFOLIO_DESC_KEY);
    if (storedDesc) setMockBusinessDescription(storedDesc);
    
    // These will now load Firebase Storage URLs if set from portfolio page
    const storedBanner = localStorage.getItem(PORTFOLIO_BANNER_KEY);
    if (storedBanner) setMockBannerImageUrl(storedBanner);
    const storedLogo = localStorage.getItem(PORTFOLIO_LOGO_KEY);
    if (storedLogo) setMockProfileImageUrl(storedLogo);

  }, [currentUser]);


  const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setProfileImageFile(null);
      setProfileImagePreview(currentUser?.photoURL || null); 
    }
  };

  const handleProfileImageUpload = async () => {
    if (!profileImageFile || !currentUser) {
      toast({ title: "No image selected or not logged in.", variant: "destructive" });
      return;
    }
    setIsUploading(true);
    try {
      const downloadURL = await uploadProfileImage(currentUser.uid, profileImageFile);
      setProfileImagePreview(downloadURL); // Update preview with the actual cloud URL
      
      toast({ title: "Profile Image Uploaded", description: "Your new profile image is set." });
      // AuthContext's onAuthStateChanged should eventually pick up the new photoURL for currentUser
      // or UserNav might need a refresh for immediate update from auth.currentUser if not deep watching.
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Profile image upload error:", error);
      }
      toast({ title: "Upload Failed", description: "Could not upload profile image.", variant: "destructive" });
      setProfileImagePreview(currentUser?.photoURL || null); // Revert preview on error
    } finally {
      setIsUploading(false);
      setProfileImageFile(null); 
    }
  };

  const handleContactSupport = () => {
    window.location.href = "mailto:support@malitrack.com?subject=Support Request";
  };

  if (authLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!currentUser) {
    return <div className="text-center py-10">Please sign in to view your profile.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24 md:h-32 md:w-32">
              <AvatarImage src={profileImagePreview || undefined} alt={currentUser.displayName || currentUser.email || "User"} data-ai-hint="user avatar large" />
              <AvatarFallback>{getInitials(currentUser.displayName || currentUser.email)}</AvatarFallback>
            </Avatar>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="profile-picture" className="text-sm">Change Profile Picture</Label>
              <div className="flex items-center gap-2">
                <Input id="profile-picture" type="file" accept="image/*" onChange={handleProfileImageChange} className="text-xs"/>
              </div>
               {profileImageFile && ( 
                <Button onClick={handleProfileImageUpload} size="sm" className="mt-2 w-full" disabled={isUploading}>
                  {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <UploadCloud className="mr-2 h-4 w-4" />}
                   {isUploading ? "Uploading..." : "Upload New Picture"}
                </Button>
              )}
            </div>
          </div>
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-semibold">{currentUser.displayName || "User"}</h2>
            <p className="text-muted-foreground">{currentUser.email}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center"><Building className="mr-2 h-5 w-5 text-primary" />Business Portfolio Summary</CardTitle>
          <CardDescription>Overview of your primary business. Edit details on the "Your Portfolio" page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{businessName || "Your Business Name"}</h3>
            <p className="text-sm text-muted-foreground mt-1">{mockBusinessDescription}</p>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-1">Banner Image (from Portfolio):</p>
              {mockBannerImageUrl && mockBannerImageUrl !== "https://placehold.co/800x200.png" ? (
                <Image
                  src={mockBannerImageUrl}
                  alt="Business Banner"
                  width={600}
                  height={150}
                  className="rounded-md object-cover aspect-[4/1]"
                  data-ai-hint="business banner preview"
                  onError={() => setMockBannerImageUrl("https://placehold.co/800x200.png")} // Fallback if cloud URL fails
                />
              ) : (
                <Image
                  src={"https://placehold.co/800x200.png"}
                  alt="Business Banner Placeholder"
                  width={600}
                  height={150}
                  className="rounded-md object-cover aspect-[4/1]"
                  data-ai-hint="business banner preview"
                />
              )}
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Profile/Logo Image (from Portfolio):</p>
               {mockProfileImageUrl && mockProfileImageUrl !== "https://placehold.co/200x200.png" ? (
                <Image
                  src={mockProfileImageUrl}
                  alt="Business Profile/Logo"
                  width={150}
                  height={150}
                  className="rounded-md object-cover aspect-square"
                  data-ai-hint="business logo preview"
                  onError={() => setMockProfileImageUrl("https://placehold.co/200x200.png")} // Fallback
                />
              ) : (
                 <Image
                  src={"https://placehold.co/200x200.png"}
                  alt="Business Profile/Logo Placeholder"
                  width={150}
                  height={150}
                  className="rounded-md object-cover aspect-square"
                  data-ai-hint="business logo preview"
                />
              )}
            </div>
          </div>
           <p className="text-xs text-muted-foreground flex items-center mt-3">
            <Info className="h-3 w-3 mr-1.5" />
            To update these details and images, please visit the &quot;Your Portfolio&quot; page.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Support</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleContactSupport}>
            <Mail className="mr-2 h-5 w-5" /> Contact MaliTrack Support
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}
