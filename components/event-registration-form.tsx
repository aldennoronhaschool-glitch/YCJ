"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@/lib/supabase/events";
import { SignInButton } from "@clerk/nextjs";
import { EventRegistrationField } from "@/lib/supabase/event-registration-fields";

export function EventRegistrationForm({ event }: { event: Event }) {
    const { isSignedIn, user } = useUser();
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [fields, setFields] = useState<EventRegistrationField[]>([]);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [loadingFields, setLoadingFields] = useState(true);

    useEffect(() => {
        const fetchFields = async () => {
            try {
                const response = await fetch(`/api/event-registration-fields?event_id=${event.id}`);
                if (!response.ok) throw new Error("Failed to fetch fields");

                const data = await response.json();
                setFields(data);

                // Initialize form data with empty values
                const initialData: Record<string, any> = {};
                data.forEach((field: EventRegistrationField) => {
                    initialData[field.field_label.toLowerCase().replace(/\s+/g, '_')] = '';
                });
                setFormData(initialData);
            } catch (error) {
                console.error("Error fetching registration fields:", error);
                toast({
                    title: "Error",
                    description: "Failed to load registration form. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setLoadingFields(false);
            }
        };

        fetchFields();
    }, [event.id, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isSignedIn || !user) {
            toast({
                title: "Sign in required",
                description: "Please sign in to register for this event.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);

        try {
            // Collect all form data as custom fields
            // The backend will handle mapping to standard fields if needed
            const allFieldsData: Record<string, any> = {};

            fields.forEach((field) => {
                const fieldKey = field.field_label.toLowerCase().replace(/\s+/g, '_');
                const value = formData[fieldKey];

                // Store with original field label as key
                if (value !== undefined && value !== '') {
                    allFieldsData[field.field_label] = value;
                }
            });

            const response = await fetch("/api/event-registrations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: user.id,
                    event_id: event.id,
                    custom_fields: allFieldsData,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to register");
            }

            toast({
                title: "Registration successful!",
                description: "You have been registered for this event.",
            });

            router.push("/events");
        } catch (error: any) {
            toast({
                title: "Registration failed",
                description: error.message || "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const renderField = (field: EventRegistrationField) => {
        const fieldKey = field.field_label.toLowerCase().replace(/\s+/g, '_');
        const value = formData[fieldKey] || '';

        const handleChange = (newValue: string) => {
            setFormData({ ...formData, [fieldKey]: newValue });
        };

        switch (field.field_type) {
            case 'textarea':
                return (
                    <div key={field.id}>
                        <Label htmlFor={fieldKey}>
                            {field.field_label} {field.is_required && '*'}
                        </Label>
                        <Textarea
                            id={fieldKey}
                            required={field.is_required}
                            value={value}
                            onChange={(e) => handleChange(e.target.value)}
                            rows={4}
                        />
                    </div>
                );

            case 'select':
                return (
                    <div key={field.id}>
                        <Label htmlFor={fieldKey}>
                            {field.field_label} {field.is_required && '*'}
                        </Label>
                        <Select
                            id={fieldKey}
                            required={field.is_required}
                            value={value}
                            onChange={(e) => handleChange(e.target.value)}
                        >
                            <option value="">Select an option</option>
                            {field.field_options?.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </Select>
                    </div>
                );

            default:
                return (
                    <div key={field.id}>
                        <Label htmlFor={fieldKey}>
                            {field.field_label} {field.is_required && '*'}
                        </Label>
                        <Input
                            id={fieldKey}
                            type={field.field_type}
                            required={field.is_required}
                            value={value}
                            onChange={(e) => handleChange(e.target.value)}
                            min={field.field_type === 'number' ? '1' : undefined}
                        />
                    </div>
                );
        }
    };

    if (!isSignedIn) {
        return (
            <Card className="border border-gray-200 shadow-md">
                <CardHeader>
                    <CardTitle className="text-gray-900">Sign In Required</CardTitle>
                    <CardDescription className="text-gray-600">
                        Please sign in to register for this event.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SignInButton mode="modal">
                        <Button className="w-full">Sign In</Button>
                    </SignInButton>
                </CardContent>
            </Card>
        );
    }

    if (loadingFields) {
        return (
            <Card className="border border-gray-200 shadow-md">
                <CardHeader>
                    <CardTitle className="text-gray-900">Loading...</CardTitle>
                    <CardDescription className="text-gray-600">
                        Please wait while we load the registration form.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="border border-gray-200 shadow-md">
            <CardHeader>
                <CardTitle className="text-gray-900 text-2xl">Register for {event.title}</CardTitle>
                <CardDescription className="text-gray-600">
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {fields.map((field) => renderField(field))}

                    {fields.length === 0 && (
                        <p className="text-gray-500 text-sm">
                            No registration fields configured for this event.
                        </p>
                    )}

                    <Button type="submit" className="w-full" disabled={loading || fields.length === 0}>
                        {loading ? "Submitting..." : "Submit Registration"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
