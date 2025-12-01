"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { EventRegistrationField } from "@/lib/supabase/event-registration-fields";
import { Plus, Trash2, GripVertical, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export function RegistrationFieldsEditor({
    eventId,
    eventTitle,
    initialFields,
}: {
    eventId: string;
    eventTitle: string;
    initialFields: EventRegistrationField[];
}) {
    const [fields, setFields] = useState<EventRegistrationField[]>(initialFields);
    const [newField, setNewField] = useState<{
        field_label: string;
        field_type: 'text' | 'email' | 'phone' | 'number' | 'textarea' | 'select';
        is_required: boolean;
        field_options: string[];
    }>({
        field_label: "",
        field_type: "text",
        is_required: true,
        field_options: [],
    });
    const [optionsInput, setOptionsInput] = useState("");
    const { toast } = useToast();
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    const handleAddField = async () => {
        if (!newField.field_label.trim()) {
            toast({
                title: "Error",
                description: "Field label is required",
                variant: "destructive",
            });
            return;
        }

        setSaving(true);
        try {
            const response = await fetch("/api/admin/event-registration-fields", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    event_id: eventId,
                    field_label: newField.field_label,
                    field_type: newField.field_type,
                    is_required: newField.is_required,
                    field_options: newField.field_type === "select"
                        ? optionsInput.split(",").map(o => o.trim()).filter(Boolean)
                        : null,
                    field_order: fields.length,
                }),
            });

            if (!response.ok) throw new Error("Failed to add field");

            const addedField = await response.json();
            setFields([...fields, addedField]);
            setNewField({
                field_label: "",
                field_type: "text",
                is_required: true,
                field_options: [],
            });
            setOptionsInput("");

            toast({
                title: "Field added",
                description: "Registration field has been added successfully.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteField = async (id: string) => {
        if (!confirm("Are you sure you want to delete this field?")) return;

        try {
            const response = await fetch(`/api/admin/event-registration-fields/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete field");

            setFields(fields.filter(f => f.id !== id));
            toast({
                title: "Field deleted",
                description: "Registration field has been deleted successfully.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleToggleRequired = async (field: EventRegistrationField) => {
        try {
            const response = await fetch(`/api/admin/event-registration-fields/${field.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_required: !field.is_required }),
            });

            if (!response.ok) throw new Error("Failed to update field");

            const updated = await response.json();
            setFields(fields.map(f => f.id === field.id ? updated : f));
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Registration Form Fields for: {eventTitle}</CardTitle>
                    <p className="text-sm text-gray-600">
                        Customize the registration form by adding custom fields. Users will fill these out when registering.
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Existing Fields */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg">Current Fields</h3>
                        <div className="text-sm text-gray-600 mb-2">
                            <strong>Default fields (always included):</strong> Name, Email, Phone, Age
                        </div>
                        {fields.length === 0 ? (
                            <p className="text-gray-500 text-sm">No custom fields added yet.</p>
                        ) : (
                            <div className="space-y-2">
                                {fields.map((field) => (
                                    <Card key={field.id} className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 flex-1">
                                                <GripVertical className="w-4 h-4 text-gray-400" />
                                                <div className="flex-1">
                                                    <p className="font-medium">{field.field_label}</p>
                                                    <p className="text-sm text-gray-500">
                                                        Type: {field.field_type}
                                                        {field.field_type === "select" && field.field_options && (
                                                            <span> • Options: {field.field_options.join(", ")}</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant={field.is_required ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handleToggleRequired(field)}
                                                >
                                                    {field.is_required ? "Required" : "Optional"}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleDeleteField(field.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Add New Field */}
                    <div className="border-t pt-6">
                        <h3 className="font-semibold text-lg mb-4">Add New Field</h3>
                        <div className="grid gap-4">
                            <div>
                                <Label htmlFor="field_label">Field Label *</Label>
                                <Input
                                    id="field_label"
                                    value={newField.field_label}
                                    onChange={(e) => setNewField({ ...newField, field_label: e.target.value })}
                                    placeholder="e.g., T-Shirt Size, Dietary Restrictions"
                                />
                            </div>

                            <div>
                                <Label htmlFor="field_type">Field Type *</Label>
                                <Select
                                    id="field_type"
                                    value={newField.field_type}
                                    onChange={(e) => setNewField({ ...newField, field_type: e.target.value as any })}
                                >
                                    <option value="text">Text</option>
                                    <option value="email">Email</option>
                                    <option value="phone">Phone</option>
                                    <option value="number">Number</option>
                                    <option value="textarea">Long Text (Textarea)</option>
                                    <option value="select">Dropdown (Select)</option>
                                </Select>
                            </div>

                            {newField.field_type === "select" && (
                                <div>
                                    <Label htmlFor="options">Dropdown Options (comma-separated) *</Label>
                                    <Input
                                        id="options"
                                        value={optionsInput}
                                        onChange={(e) => setOptionsInput(e.target.value)}
                                        placeholder="e.g., Small, Medium, Large, XL"
                                    />
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_required"
                                    checked={newField.is_required}
                                    onChange={(e) => setNewField({ ...newField, is_required: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <Label htmlFor="is_required" className="cursor-pointer">
                                    Required field
                                </Label>
                            </div>

                            <Button onClick={handleAddField} disabled={saving} className="w-full">
                                <Plus className="w-4 h-4 mr-2" />
                                {saving ? "Adding..." : "Add Field"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
