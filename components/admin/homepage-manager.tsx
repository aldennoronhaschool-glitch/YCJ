"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, Save } from "lucide-react";
import Image from "next/image";

export function HomepageManager({ initialSettings }: { initialSettings: Record<string, string> }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    hero_title: initialSettings.hero_title || "Youth of Christha Jyothi",
    hero_subtitle: initialSettings.hero_subtitle || "CSI Christha Jyothi Church - Building a vibrant community of faith, fellowship, and service",
    hero_background_image: initialSettings.hero_background_image || "",
    hero_background_color: initialSettings.hero_background_color || "from-blue-50 via-indigo-50 to-purple-50",
    announcements_enabled: initialSettings.announcements_enabled || "true",
  });

  const handleImageUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(key);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "homepage");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setSettings({ ...settings, [key]: data.url });
      toast({
        title: "Image uploaded",
        description: "Background image uploaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/homepage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save settings");
      }

      toast({
        title: "Settings saved",
        description: "Homepage settings have been updated successfully.",
      });

      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>Customize the main hero section of your homepage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="hero_title">Hero Title</Label>
            <Input
              id="hero_title"
              value={settings.hero_title}
              onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
              placeholder="Youth of Christha Jyothi"
            />
          </div>

          <div>
            <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
            <Textarea
              id="hero_subtitle"
              rows={3}
              value={settings.hero_subtitle}
              onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
              placeholder="CSI Christha Jyothi Church - Building a vibrant community..."
            />
          </div>

          <div>
            <Label htmlFor="hero_background_color">Background Gradient</Label>
            <Input
              id="hero_background_color"
              value={settings.hero_background_color}
              onChange={(e) => setSettings({ ...settings, hero_background_color: e.target.value })}
              placeholder="from-blue-50 via-indigo-50 to-purple-50"
            />
            <p className="text-sm text-gray-500 mt-1">
              Tailwind CSS gradient classes (e.g., from-blue-50 via-indigo-50 to-purple-50)
            </p>
          </div>

          <div>
            <Label>Background Image (Optional)</Label>
            {settings.hero_background_image && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border mb-4">
                <Image
                  src={settings.hero_background_image}
                  alt="Background preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload("hero_background_image", e)}
                disabled={uploading === "hero_background_image"}
                className="hidden"
                id="hero_background_image"
              />
              <Label
                htmlFor="hero_background_image"
                className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50"
              >
                <Upload className="w-4 h-4" />
                {uploading === "hero_background_image" ? "Uploading..." : "Upload Background Image"}
              </Label>
              {settings.hero_background_image && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSettings({ ...settings, hero_background_image: "" })}
                >
                  Remove
                </Button>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Upload a background image for the hero section. If set, it will override the gradient.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Other Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="announcements_enabled"
              checked={settings.announcements_enabled === "true"}
              onChange={(e) =>
                setSettings({ ...settings, announcements_enabled: e.target.checked ? "true" : "false" })
              }
              className="w-4 h-4"
            />
            <Label htmlFor="announcements_enabled">Show Announcements Section</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button onClick={handleSave} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

