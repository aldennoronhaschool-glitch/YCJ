"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

export default function AdminContactPage() {
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch("/api/admin/contact");
            if (!response.ok) throw new Error("Failed to fetch settings");
            const data = await response.json();
            setSettings(data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load contact settings",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch("/api/admin/contact", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            if (!response.ok) throw new Error("Failed to update settings");

            toast({
                title: "Success",
                description: "Contact settings updated successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update settings",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key: string, value: string) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Contact Page</h1>
                    <p className="text-gray-600 mt-2">Edit contact information and settings</p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save All Changes
                        </>
                    )}
                </Button>
            </div>

            <div className="space-y-6">
                {/* Hero Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Hero Section</CardTitle>
                        <CardDescription>Page title and subtitle</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="hero_title">Title</Label>
                            <Input
                                id="hero_title"
                                value={settings.hero_title || ""}
                                onChange={(e) => handleChange("hero_title", e.target.value)}
                                placeholder="Contact Us"
                            />
                        </div>
                        <div>
                            <Label htmlFor="hero_subtitle">Subtitle</Label>
                            <Input
                                id="hero_subtitle"
                                value={settings.hero_subtitle || ""}
                                onChange={(e) => handleChange("hero_subtitle", e.target.value)}
                                placeholder="Get in touch with us"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                        <CardDescription>Phone, email, and office hours</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="telephone">Telephone (Internal Use)</Label>
                            <Input
                                id="telephone"
                                value={settings.telephone || ""}
                                onChange={(e) => handleChange("telephone", e.target.value)}
                                placeholder="+91 (80) 6753 7777"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                This number is for internal use only. Visitors will see the Display Telephone below.
                            </p>
                        </div>
                        <div>
                            <Label htmlFor="display_telephone">Display Telephone (Public)</Label>
                            <Input
                                id="display_telephone"
                                value={settings.display_telephone || ""}
                                onChange={(e) => handleChange("display_telephone", e.target.value)}
                                placeholder="xxxxxxx"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                This is what visitors see on the contact page. Use "xxxxxxx" to hide the number, or enter a real number to display it.
                            </p>
                        </div>
                        <div>
                            <Label htmlFor="telephone_hours">Telephone Hours</Label>
                            <Input
                                id="telephone_hours"
                                value={settings.telephone_hours || ""}
                                onChange={(e) => handleChange("telephone_hours", e.target.value)}
                                placeholder="Tuesday to Sunday"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={settings.email || ""}
                                onChange={(e) => handleChange("email", e.target.value)}
                                placeholder="info@ycjchurch.org"
                            />
                        </div>
                        <div>
                            <Label htmlFor="office_hours">Office Hours</Label>
                            <Input
                                id="office_hours"
                                value={settings.office_hours || ""}
                                onChange={(e) => handleChange("office_hours", e.target.value)}
                                placeholder="10:00am to 6:00pm"
                            />
                        </div>
                        <div>
                            <Label htmlFor="office_days">Office Days</Label>
                            <Input
                                id="office_days"
                                value={settings.office_days || ""}
                                onChange={(e) => handleChange("office_days", e.target.value)}
                                placeholder="Tuesday to Sunday"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Address */}
                <Card>
                    <CardHeader>
                        <CardTitle>Address</CardTitle>
                        <CardDescription>Physical location details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="address_line1">Address Line 1</Label>
                            <Input
                                id="address_line1"
                                value={settings.address_line1 || ""}
                                onChange={(e) => handleChange("address_line1", e.target.value)}
                                placeholder="CSI Christa Jyothi Church"
                            />
                        </div>
                        <div>
                            <Label htmlFor="address_line2">Address Line 2</Label>
                            <Input
                                id="address_line2"
                                value={settings.address_line2 || ""}
                                onChange={(e) => handleChange("address_line2", e.target.value)}
                                placeholder="Bima Nagar, Bailoor, Udupi"
                            />
                        </div>
                        <div>
                            <Label htmlFor="address_line3">Address Line 3</Label>
                            <Input
                                id="address_line3"
                                value={settings.address_line3 || ""}
                                onChange={(e) => handleChange("address_line3", e.target.value)}
                                placeholder="Karnataka 576101"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Map */}
                <Card>
                    <CardHeader>
                        <CardTitle>Map</CardTitle>
                        <CardDescription>Google Maps embed URL</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <Label htmlFor="map_embed_url">Map Embed URL</Label>
                            <Textarea
                                id="map_embed_url"
                                value={settings.map_embed_url || ""}
                                onChange={(e) => handleChange("map_embed_url", e.target.value)}
                                placeholder="https://www.google.com/maps/embed?pb=..."
                                rows={3}
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Get this from Google Maps → Share → Embed a map
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Social Media */}
                <Card>
                    <CardHeader>
                        <CardTitle>Social Media</CardTitle>
                        <CardDescription>Social media profile links</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="facebook_url">Facebook URL</Label>
                            <Input
                                id="facebook_url"
                                value={settings.facebook_url || ""}
                                onChange={(e) => handleChange("facebook_url", e.target.value)}
                                placeholder="https://facebook.com/yourpage"
                            />
                        </div>
                        <div>
                            <Label htmlFor="twitter_url">Twitter URL</Label>
                            <Input
                                id="twitter_url"
                                value={settings.twitter_url || ""}
                                onChange={(e) => handleChange("twitter_url", e.target.value)}
                                placeholder="https://twitter.com/yourhandle"
                            />
                        </div>
                        <div>
                            <Label htmlFor="instagram_url">Instagram URL</Label>
                            <Input
                                id="instagram_url"
                                value={settings.instagram_url || ""}
                                onChange={(e) => handleChange("instagram_url", e.target.value)}
                                placeholder="https://instagram.com/yourhandle"
                            />
                        </div>
                        <div>
                            <Label htmlFor="youtube_url">YouTube URL</Label>
                            <Input
                                id="youtube_url"
                                value={settings.youtube_url || ""}
                                onChange={(e) => handleChange("youtube_url", e.target.value)}
                                placeholder="https://youtube.com/@yourchannel"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* App Downloads */}
                <Card>
                    <CardHeader>
                        <CardTitle>App Download Links</CardTitle>
                        <CardDescription>Links to mobile apps</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="app_store_url">App Store URL</Label>
                            <Input
                                id="app_store_url"
                                value={settings.app_store_url || ""}
                                onChange={(e) => handleChange("app_store_url", e.target.value)}
                                placeholder="https://apps.apple.com/..."
                            />
                        </div>
                        <div>
                            <Label htmlFor="play_store_url">Google Play Store URL</Label>
                            <Input
                                id="play_store_url"
                                value={settings.play_store_url || ""}
                                onChange={(e) => handleChange("play_store_url", e.target.value)}
                                placeholder="https://play.google.com/store/apps/..."
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8 flex justify-end">
                <Button onClick={handleSave} disabled={saving} size="lg">
                    {saving ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save All Changes
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
