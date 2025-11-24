"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Plus, Trash2, Image as ImageIcon } from "lucide-react";

interface AboutSection {
    id: string;
    section_key: string;
    title: string | null;
    content: string | null;
    image_url: string | null;
    order_index: number;
}

export default function AdminAboutPage() {
    const [sections, setSections] = useState<AboutSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        try {
            const response = await fetch("/api/admin/about");
            if (!response.ok) throw new Error("Failed to fetch sections");
            const data = await response.json();
            setSections(data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load about sections",
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
            fetchSections();
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
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Manage About Us Page</h1>
                <p className="text-gray-600 mt-2">Edit the content sections for the About Us page</p>
            </div>

            <div className="space-y-6">
                {sections.map((section) => (
                    <Card key={section.id}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="uppercase">{section.section_key}</span>
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
                            </CardTitle>
                            <CardDescription>Section order: {section.order_index}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
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
                                <Label htmlFor={`image-${section.id}`}>Image</Label>
                                <div className="flex items-center gap-4">
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
                                        <div className="relative w-20 h-20 rounded overflow-hidden border">
                                            <img
                                                src={section.image_url}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                                {section.image_url && (
                                    <Input
                                        value={section.image_url}
                                        onChange={(e) => handleFieldChange(section.id, "image_url", e.target.value)}
                                        placeholder="Or enter image URL"
                                        className="mt-2"
                                    />
                                )}
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
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
