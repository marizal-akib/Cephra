"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, UserCircle2 } from "lucide-react";

function formatDate(value: string | null | undefined) {
  if (!value) return "Not available";
  return new Date(value).toLocaleString();
}

type ProfileDetailsClientProps = {
  userId: string;
  email: string | null;
  createdAt: string | null;
  lastSignInAt: string | null;
  initialName: string;
  initialAvatarUrl: string | null;
  initialCredentials: string | null;
  initialDesignation: string | null;
};

export function ProfileDetailsClient({
  userId,
  email,
  createdAt,
  lastSignInAt,
  initialName,
  initialAvatarUrl,
  initialCredentials,
  initialDesignation,
}: ProfileDetailsClientProps) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(initialName);
  const [credentials, setCredentials] = useState(initialCredentials ?? "");
  const [designation, setDesignation] = useState(initialDesignation ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState<string | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  async function uploadProfileImage(file: File) {
    setAvatarMessage(null);

    if (!file.type.startsWith("image/")) {
      setAvatarMessage("Please upload an image file.");
      return;
    }

    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setAvatarMessage("Image must be smaller than 5 MB.");
      return;
    }

    setAvatarUploading(true);
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const uploadPath = `${userId}/avatar.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(uploadPath, file, { upsert: true, cacheControl: "3600" });

    if (uploadError) {
      setAvatarUploading(false);
      setAvatarMessage("Unable to upload image. Check the avatars storage bucket.");
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(uploadPath);
    const publicUrl = data.publicUrl;
    const { error: userError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrl },
    });

    setAvatarUploading(false);
    if (userError) {
      setAvatarMessage("Image uploaded, but could not save profile picture URL.");
      return;
    }

    setAvatarUrl(publicUrl);
    setAvatarMessage("Profile picture updated.");
  }

  async function handleImageInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadProfileImage(file);
    e.target.value = "";
  }

  async function handleDrop(e: React.DragEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsDraggingImage(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await uploadProfileImage(file);
  }

  async function handleProfileSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProfileMessage(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setProfileMessage("Name is required.");
      return;
    }

    setProfileSaving(true);
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          full_name: trimmedName,
          credentials: credentials.trim() || null,
          designation: designation.trim() || null,
        },
        { onConflict: "id" }
      );

    if (profileError) {
      setProfileSaving(false);
      setProfileMessage("Unable to update profile details.");
      return;
    }

    const { error: userError } = await supabase.auth.updateUser({
      data: { full_name: trimmedName },
    });

    setProfileSaving(false);
    if (userError) {
      setProfileMessage("Profile updated, but auth metadata update failed.");
      return;
    }

    setProfileMessage("Profile details updated.");
  }

  async function handlePasswordChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPasswordMessage(null);

    if (password.length < 8) {
      setPasswordMessage("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMessage("Passwords do not match.");
      return;
    }

    setPasswordSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setPasswordSaving(false);

    if (error) {
      setPasswordMessage("Unable to change password.");
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setPasswordMessage("Password updated successfully.");
  }

  return (
    <div className="p-6">
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Profile Details</h1>
          <p className="text-sm text-muted-foreground">
            View and update your account information used in Cephra.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <p className="text-muted-foreground">Photo</p>
              <div>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="h-16 w-16 rounded-full border border-border object-cover"
                  />
                ) : (
                  <UserCircle2 className="h-16 w-16 text-muted-foreground" />
                )}
              </div>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <p className="text-muted-foreground">Name</p>
              <p>{name}</p>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <p className="text-muted-foreground">Credentials</p>
              <p>{credentials || "Not provided"}</p>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <p className="text-muted-foreground">Designation</p>
              <p>{designation || "Not provided"}</p>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <p className="text-muted-foreground">Email</p>
              <p>{email || "Not available"}</p>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <p className="text-muted-foreground">User ID</p>
              <p className="break-all">{userId}</p>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <p className="text-muted-foreground">Created</p>
              <p>{formatDate(createdAt)}</p>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <p className="text-muted-foreground">Last Sign In</p>
              <p>{formatDate(lastSignInAt)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={handleProfileSave}>
              <div className="space-y-1.5">
                <label className="text-sm text-muted-foreground">Profile Picture</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageInputChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingImage(true);
                  }}
                  onDragLeave={() => setIsDraggingImage(false)}
                  onDrop={handleDrop}
                  disabled={avatarUploading}
                  className={`w-full rounded-lg border border-dashed p-4 text-left transition-colors ${
                    isDraggingImage ? "border-primary bg-primary/5" : "border-border bg-background"
                  } ${avatarUploading ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-muted/40"}`}
                >
                  <div className="flex items-center gap-3">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Current profile"
                        className="h-12 w-12 rounded-full border border-border object-cover"
                      />
                    ) : (
                      <UserCircle2 className="h-12 w-12 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {avatarUploading ? "Uploading..." : "Drag & drop or click to upload"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, WEBP up to 5 MB
                      </p>
                    </div>
                    <Upload className="ml-auto h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
                {avatarMessage ? <p className="text-sm text-muted-foreground">{avatarMessage}</p> : null}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-muted-foreground">Full Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-muted-foreground">Credentials</label>
                <Input
                  value={credentials}
                  onChange={(e) => setCredentials(e.target.value)}
                  placeholder="e.g. MBBS, MD, DM Neurology"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-muted-foreground">Designation</label>
                <Input
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Consultant Neurologist"
                />
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={profileSaving}>
                  {profileSaving ? "Saving..." : "Save Changes"}
                </Button>
                {profileMessage ? <p className="text-sm text-muted-foreground">{profileMessage}</p> : null}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={handlePasswordChange}>
              <div className="space-y-1.5">
                <label className="text-sm text-muted-foreground">New Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-muted-foreground">Confirm New Password</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                />
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={passwordSaving}>
                  {passwordSaving ? "Updating..." : "Update Password"}
                </Button>
                {passwordMessage ? (
                  <p className="text-sm text-muted-foreground">{passwordMessage}</p>
                ) : null}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
