"use client";

// Force rebuild: Update Admin About Page UI

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Plus, Trash2, Image as ImageIcon, Users, FileText } from "lucide-react";
import { OfficeBearersManager } from "@/components/admin/office-bearers-manager";
import { OfficeBearer } from "@/lib/supabase/officeBearers";

interface AboutSection {
    id: string;
    section_key: string;
    title: string | null;
    content: string | null;
    image_url: string | null;
    order_index: number;
}

export default function AdminAboutPage() {
    const [activeTab, setActiveTab] = useState<'content' | 'bearers'>('content');
    const [sections, setSections] = useState<AboutSection[]>([]);
    const [bearers, setBearers] = useState<OfficeBearer[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [sectionsRes, bearersRes] = await Promise.all([
                fetch("/api/admin/about"),
                fetch("/api/admin/office-bearers")
            ]);

            if (!sectionsRes.ok) throw new Error("Failed to fetch sections");
            if (!bearersRes.ok) throw new Error("Failed to fetch office bearers");

            const sectionsData = await sectionsRes.json();
            const bearersData = await bearersRes.json();

            setSections(sectionsData);
            setBearers(bearersData);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load data",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (section: AboutSection) => {
        setSaving(section.id);
        try {
            const response = await fetch(`/api/admin/about/${section.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(section),
            });

            if (!response.ok) throw new Error("Failed to update section");

            toast({
                title: "Success",
                description: "Section updated successfully",
            });
            fetchData();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update section",
                variant: "destructive",
            });
        } finally {
            setSaving(null);
        }
    };

    const handleCreate = async () => {
        try {
            const newSection = {
                section_key: `section-${Date.now()}`,
                title: "New Section",
                content: "",
                image_url: null,
                order_index: sections.length,
            };

            const response = await fetch("/api/admin/about", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newSection),
            });

            if (!response.ok) throw new Error("Failed to create section");

            toast({
                title: "Success",
                description: "New section created",
            });
            fetchData();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create section",
                variant: "destructive",
            });
        }
    };

    const handleInitialize = async () => {
        setLoading(true);
        try {
            const defaultSections = [
                {
                    section_key: "hero",
                    title: "About Us",
                    content: "Welcome to Youth of Christha Jyothi",
                    image_url: null,
                    order_index: 0,
                },
                {
                    section_key: "mission",
                    title: "Our Mission",
                    content: "To build a vibrant community of faith, fellowship, and service among the youth of CSI Christha Jyothi Church.",
                    image_url: null,
                    order_index: 1,
                },
                {
                    section_key: "vision",
                    title: "Our Vision",
                    content: "Empowering young people to grow in their faith and make a positive impact in their communities.",
                    image_url: null,
                    order_index: 2,
                },
            ];

            for (const section of defaultSections) {
                await fetch("/api/admin/about", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(section),
                });
            }

            toast({
                title: "Success",
                description: "Default content initialized",
            });
            fetchData();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to initialize content",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this section?")) return;

        try {
            const response = await fetch(`/api/admin/about/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete section");

            toast({
                title: "Success",
                description: "Section deleted successfully",
            });
            fetchData();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete section",
                variant: "destructive",
            });
        }
    };

    const handleFieldChange = (id: string, field: keyof AboutSection, value: string | number) => {
        setSections((prev) =>
            prev.map((section) =>
                section.id === id ? { ...section, [field]: value } : section
            )
        );
    };

    const handleImageUpload = async (sectionId: string, file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to upload image");

            const { url } = await response.json();
            handleFieldChange(sectionId, "image_url", url);

            toast({
                title: "Success",
                description: "Image uploaded successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to upload image",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto pt-24 pb-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Manage About Us Page</h1>
                <p className="text-gray-600 mt-2">Edit content and office bearers</p>
            </div>

            <div className="flex gap-4 mb-8 border-b pb-4">
                <Button
                    variant={activeTab === 'content' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('content')}
                    className="flex items-center gap-2"
                >
                    <FileText className="w-4 h-4" />
                    Content Sections
                </Button>
                <Button
                    variant={activeTab === 'bearers' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('bearers')}
                    className="flex items-center gap-2"
                >
                    <Users className="w-4 h-4" />
                    Office Bearers
                </Button>
            </div>

            {activeTab === 'content' ? (
                <>
                    <div className="flex justify-end mb-6 gap-4">
                        {!sections.some(s => s.section_key === 'hero') && (
                            <Button
                                onClick={async () => {
                                    try {
                                        const response = await fetch("/api/admin/about", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({
                                                section_key: "hero",
                                                title: "About Us",
                                                content: "Welcome to Youth of Christha Jyothi",
                                                image_url: null,
                                                order_index: -1,
                                            }),
                                        });
                                        if (!response.ok) throw new Error("Failed to create hero section");
                                        toast({ title: "Success", description: "Hero section created" });
                                        fetchData();
                                    } catch (error) {
                                        toast({ title: "Error", description: "Failed to create hero section", variant: "destructive" });
                                    }
                                }}
                                variant="outline"
                                className="border-primary text-primary hover:bg-primary/10"
                            >
                                <ImageIcon className="w-4 h-4 mr-2" />
                                Add Hero Section (Background)
                            </Button>
                        )}
                        {sections.length === 0 && (
                            <Button onClick={handleInitialize} variant="outline">
                                <Save className="w-4 h-4 mr-2" />
                                Initialize Default Content
                            </Button>
                        )}
                        <Button onClick={handleCreate}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Section
                        </Button>
                    </div>

                    <div className="space-y-6">
                        {sections.map((section) => (
                            <Card key={section.id} className={section.section_key === 'hero' ? 'border-primary/50 bg-primary/5' : ''}>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className="uppercase text-sm bg-gray-100 px-2 py-1 rounded">
                                                {section.section_key}
                                            </span>
                                            {section.section_key === 'hero' && (
                                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-normal">
                                                    Main Header
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                onClick={() => handleUpdate(section)}
                                                disabled={saving === section.id}
                                                size="sm"
                                            >
                                                {saving === section.id ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-4 h-4 mr-2" />
                                                        Save
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(section.id)}
                                                variant="destructive"
                                                size="sm"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardTitle>
                                    <CardDescription>Section order: {section.order_index}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor={`key-${section.id}`}>Section Key (Unique ID)</Label>
                                            <Input
                                                id={`key-${section.id}`}
                                                value={section.section_key}
                                                onChange={(e) => handleFieldChange(section.id, "section_key", e.target.value)}
                                                placeholder="unique-key"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`order-${section.id}`}>Display Order</Label>
                                            <Input
                                                id={`order-${section.id}`}
                                                type="number"
                                                value={section.order_index}
                                                onChange={(e) => handleFieldChange(section.id, "order_index", parseInt(e.target.value))}
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor={`title-${section.id}`}>Title</Label>
                                        <Input
                                            id={`title-${section.id}`}
                                            value={section.title || ""}
                                            onChange={(e) => handleFieldChange(section.id, "title", e.target.value)}
                                            placeholder="Section title"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor={`content-${section.id}`}>Content</Label>
                                        <Textarea
                                            id={`content-${section.id}`}
                                            value={section.content || ""}
                                            onChange={(e) => handleFieldChange(section.id, "content", e.target.value)}
                                            placeholder="Section content"
                                            rows={6}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor={`image-${section.id}`}>
                                            {section.section_key === 'hero' ? 'Background Image (Recommended: 1920x1080)' : 'Image'}
                                        </Label>
                                        <div className="flex items-center gap-4 mt-2">
                                            <div className="flex-1">
                                                <Input
                                                    id={`image-${section.id}`}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleImageUpload(section.id, file);
                                                    }}
                                                />
                                                {section.image_url && (
                                                    <Input
                                                        value={section.image_url}
                                                        onChange={(e) => handleFieldChange(section.id, "image_url", e.target.value)}
                                                        placeholder="Or enter image URL"
                                                        className="mt-2"
                                                    />
                                                )}
                                            </div>
                                            {section.image_url && (
                                                <div className="relative w-32 h-32 rounded-lg overflow-hidden border bg-gray-50">
                                                    <img
                                                        src={section.image_url}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            ) : (
                <OfficeBearersManager initialBearers={bearers} />
            )}
        </div>
    );
}
