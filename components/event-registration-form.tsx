"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@/lib/supabase/events";
import { SignInButton } from "@clerk/nextjs";

export function EventRegistrationForm({ event }: { event: Event }) {
    const { isSignedIn, user } = useUser();
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        age: "",
        additional_info: "",
    });

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
            const response = await fetch("/api/event-registrations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    user_id: user.id,
                    event_id: event.id,
                    age: parseInt(formData.age),
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
                    <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                            id="name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                            id="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label htmlFor="age">Age *</Label>
                        <Input
                            id="age"
                            type="number"
                            required
                            min="1"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label htmlFor="additional_info">Additional Information (Optional)</Label>
                        <Textarea
                            id="additional_info"
                            value={formData.additional_info}
                            onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
                            placeholder="Any special requirements or notes..."
                            rows={4}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Submitting..." : "Submit Registration"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
