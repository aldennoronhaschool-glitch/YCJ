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
    service_times_enabled: initialSettings.service_times_enabled || "true",
    // Service Times
    service_1_label: initialSettings.service_1_label || "1st Service",
    service_1_time: initialSettings.service_1_time || "8 AM",
    service_2_label: initialSettings.service_2_label || "2nd Service",
    service_2_time: initialSettings.service_2_time || "10:00 AM",
    service_3_label: initialSettings.service_3_label || "3rd Service",
    service_3_time: initialSettings.service_3_time || "12:00 PM",
    service_4_label: initialSettings.service_4_label || "4th Service",
    service_4_time: initialSettings.service_4_time || "6 PM",
    service_language: initialSettings.service_language || "ALL SERVICES IN ENGLISH",
    // Welcome Note
    welcome_note: initialSettings.welcome_note || `This life is a beautiful gift of God. Life can get both fair and unfair at times. We find ourselves fighting battles (some meaningful and some meaningless) and believe they are here to stay. Many call life a race and some don't even know why they are running it. In the midst of it all, we pray that God's pure light would lead your way and you would know He truly cares.

We pray that God would provide for you the comfort and strength He has promised His children and that you would discover the freedom in trusting the One who will never let you down. The Lord builds both our character and competence for HIS glory in us.

God has been gracious and we are here not by our strength but by His faithfulness. He built the Youth of Christha Jyothi brick by brick while we stood lifting our hands in worship. Our prayer is that this family at YCJ would abound in God's love, goodness, and grace. We pray that you would find God in this kingdom to place and time of your life. There is hope and rest in Him for all who are Seeking. We pray you wouldn't miss it.`,
    welcome_note_signature: initialSettings.welcome_note_signature || "Youth of Christha Jyothi Leadership",
    // Contact Information
    contact_email: initialSettings.contact_email || "info@ycjchurch.org",
    contact_phone: initialSettings.contact_phone || "+91 (XX) XXXX XXXX",
    contact_phone_hours: initialSettings.contact_phone_hours || "Tuesday to Sunday",
    contact_office_hours: initialSettings.contact_office_hours || "10:00am to 6:00pm",
    contact_office_days: initialSettings.contact_office_days || "Tuesday to Sunday",
    contact_address_line1: initialSettings.contact_address_line1 || "CSI Christa Jyothi Church",
    contact_address_line2: initialSettings.contact_address_line2 || "Bima Nagar, Bailoor, Udupi, Karnataka 576101",
    // Social Media
    social_facebook: initialSettings.social_facebook || "",
    social_instagram: initialSettings.social_instagram || "",
    social_youtube: initialSettings.social_youtube || "",
    social_whatsapp: initialSettings.social_whatsapp || "",
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
      {/* Hero Section */}
      <Card className="border border-gray-200">
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

      {/* Service Times Section */}
      <Card className="border border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Service Times</CardTitle>
              <CardDescription>Edit the service times displayed on the homepage</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="service_times_enabled"
                checked={settings.service_times_enabled === "true"}
                onChange={(e) =>
                  setSettings({ ...settings, service_times_enabled: e.target.checked ? "true" : "false" })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="service_times_enabled" className="cursor-pointer">
                Show Service Times
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="service_1_label">Service 1 Label</Label>
              <Input
                id="service_1_label"
                value={settings.service_1_label}
                onChange={(e) => setSettings({ ...settings, service_1_label: e.target.value })}
                placeholder="1st Service"
              />
            </div>
            <div>
              <Label htmlFor="service_1_time">Service 1 Time</Label>
              <Input
                id="service_1_time"
                value={settings.service_1_time}
                onChange={(e) => setSettings({ ...settings, service_1_time: e.target.value })}
                placeholder="8 AM"
              />
            </div>
            <div>
              <Label htmlFor="service_2_label">Service 2 Label</Label>
              <Input
                id="service_2_label"
                value={settings.service_2_label}
                onChange={(e) => setSettings({ ...settings, service_2_label: e.target.value })}
                placeholder="2nd Service"
              />
            </div>
            <div>
              <Label htmlFor="service_2_time">Service 2 Time</Label>
              <Input
                id="service_2_time"
                value={settings.service_2_time}
                onChange={(e) => setSettings({ ...settings, service_2_time: e.target.value })}
                placeholder="10:00 AM"
              />
            </div>
            <div>
              <Label htmlFor="service_3_label">Service 3 Label</Label>
              <Input
                id="service_3_label"
                value={settings.service_3_label}
                onChange={(e) => setSettings({ ...settings, service_3_label: e.target.value })}
                placeholder="3rd Service"
              />
            </div>
            <div>
              <Label htmlFor="service_3_time">Service 3 Time</Label>
              <Input
                id="service_3_time"
                value={settings.service_3_time}
                onChange={(e) => setSettings({ ...settings, service_3_time: e.target.value })}
                placeholder="12:00 PM"
              />
            </div>
            <div>
              <Label htmlFor="service_4_label">Service 4 Label</Label>
              <Input
                id="service_4_label"
                value={settings.service_4_label}
                onChange={(e) => setSettings({ ...settings, service_4_label: e.target.value })}
                placeholder="4th Service"
              />
            </div>
            <div>
              <Label htmlFor="service_4_time">Service 4 Time</Label>
              <Input
                id="service_4_time"
                value={settings.service_4_time}
                onChange={(e) => setSettings({ ...settings, service_4_time: e.target.value })}
                placeholder="6 PM"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="service_language">Service Language Text</Label>
            <Input
              id="service_language"
              value={settings.service_language}
              onChange={(e) => setSettings({ ...settings, service_language: e.target.value })}
              placeholder="ALL SERVICES IN ENGLISH"
            />
          </div>
        </CardContent>
      </Card>

      {/* Welcome Note Section */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>Welcome Note</CardTitle>
          <CardDescription>Edit the welcome message displayed on the homepage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="welcome_note">Welcome Message</Label>
            <Textarea
              id="welcome_note"
              rows={10}
              value={settings.welcome_note}
              onChange={(e) => setSettings({ ...settings, welcome_note: e.target.value })}
              placeholder="Enter your welcome message..."
            />
          </div>
          <div>
            <Label htmlFor="welcome_note_signature">Signature</Label>
            <Input
              id="welcome_note_signature"
              value={settings.welcome_note_signature}
              onChange={(e) => setSettings({ ...settings, welcome_note_signature: e.target.value })}
              placeholder="Youth of Christha Jyothi Leadership"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Section */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Edit contact details displayed on the homepage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="contact_email">Email</Label>
            <Input
              id="contact_email"
              type="email"
              value={settings.contact_email}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              placeholder="info@ycjchurch.org"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_phone">Phone Number</Label>
              <Input
                id="contact_phone"
                value={settings.contact_phone}
                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                placeholder="+91 (XX) XXXX XXXX"
              />
            </div>
            <div>
              <Label htmlFor="contact_phone_hours">Phone Hours</Label>
              <Input
                id="contact_phone_hours"
                value={settings.contact_phone_hours}
                onChange={(e) => setSettings({ ...settings, contact_phone_hours: e.target.value })}
                placeholder="Tuesday to Sunday"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_office_hours">Office Hours</Label>
              <Input
                id="contact_office_hours"
                value={settings.contact_office_hours}
                onChange={(e) => setSettings({ ...settings, contact_office_hours: e.target.value })}
                placeholder="10:00am to 6:00pm"
              />
            </div>
            <div>
              <Label htmlFor="contact_office_days">Office Days</Label>
              <Input
                id="contact_office_days"
                value={settings.contact_office_days}
                onChange={(e) => setSettings({ ...settings, contact_office_days: e.target.value })}
                placeholder="Tuesday to Sunday"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="contact_address_line1">Address Line 1</Label>
            <Input
              id="contact_address_line1"
              value={settings.contact_address_line1}
              onChange={(e) => setSettings({ ...settings, contact_address_line1: e.target.value })}
              placeholder="CSI Christha Jyothi Church"
            />
          </div>
          <div>
            <Label htmlFor="contact_address_line2">Address Line 2</Label>
            <Input
              id="contact_address_line2"
              value={settings.contact_address_line2}
              onChange={(e) => setSettings({ ...settings, contact_address_line2: e.target.value })}
              placeholder="Bangalore, Karnataka"
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media Section */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>Add social media links to display in the Follow Us section</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="social_facebook">Facebook URL</Label>
            <Input
              id="social_facebook"
              type="url"
              value={settings.social_facebook}
              onChange={(e) => setSettings({ ...settings, social_facebook: e.target.value })}
              placeholder="https://facebook.com/yourpage"
            />
          </div>
          <div>
            <Label htmlFor="social_instagram">Instagram URL</Label>
            <Input
              id="social_instagram"
              type="url"
              value={settings.social_instagram}
              onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
              placeholder="https://instagram.com/yourpage"
            />
          </div>
          <div>
            <Label htmlFor="social_youtube">YouTube URL</Label>
            <Input
              id="social_youtube"
              type="url"
              value={settings.social_youtube}
              onChange={(e) => setSettings({ ...settings, social_youtube: e.target.value })}
              placeholder="https://youtube.com/@yourchannel"
            />
          </div>
          <div>
            <Label htmlFor="social_whatsapp">WhatsApp URL</Label>
            <Input
              id="social_whatsapp"
              type="url"
              value={settings.social_whatsapp}
              onChange={(e) => setSettings({ ...settings, social_whatsapp: e.target.value })}
              placeholder="https://wa.me/1234567890"
            />
            <p className="text-sm text-gray-500 mt-1">
              Format: https://wa.me/1234567890 (include country code, no + or spaces)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Section */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>Add social media links to display in the Follow Us section</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="social_facebook">Facebook URL</Label>
            <Input
              id="social_facebook"
              type="url"
              value={settings.social_facebook}
              onChange={(e) => setSettings({ ...settings, social_facebook: e.target.value })}
              placeholder="https://facebook.com/yourpage"
            />
          </div>
          <div>
            <Label htmlFor="social_instagram">Instagram URL</Label>
            <Input
              id="social_instagram"
              type="url"
              value={settings.social_instagram}
              onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
              placeholder="https://instagram.com/yourpage"
            />
          </div>
          <div>
            <Label htmlFor="social_youtube">YouTube URL</Label>
            <Input
              id="social_youtube"
              type="url"
              value={settings.social_youtube}
              onChange={(e) => setSettings({ ...settings, social_youtube: e.target.value })}
              placeholder="https://youtube.com/@yourchannel"
            />
          </div>
          <div>
            <Label htmlFor="social_whatsapp">WhatsApp URL</Label>
            <Input
              id="social_whatsapp"
              type="url"
              value={settings.social_whatsapp}
              onChange={(e) => setSettings({ ...settings, social_whatsapp: e.target.value })}
              placeholder="https://wa.me/1234567890"
            />
            <p className="text-sm text-gray-500 mt-1">
              Format: https://wa.me/1234567890 (include country code, no + or spaces)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Other Settings */}
      <Card className="border border-gray-200">
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
