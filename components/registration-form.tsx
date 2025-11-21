"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Competition } from "@/lib/supabase/competitions";
import { SignInButton } from "@clerk/nextjs";

export function RegistrationForm({ competitions }: { competitions: Competition[] }) {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    competition_id: "",
    name: "",
    phone: "",
    age: "",
    team_name: "",
    payment_mode: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn || !user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to register for competitions.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          user_id: user.id,
          age: parseInt(formData.age),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to register");
      }

      toast({
        title: "Registration successful!",
        description: "Your registration has been submitted successfully.",
      });

      router.push("/");
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
      <Card>
        <CardHeader>
          <CardTitle>Sign In Required</CardTitle>
          <CardDescription>
            Please sign in to register for competitions.
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
    <Card>
      <CardHeader>
        <CardTitle>Competition Registration</CardTitle>
        <CardDescription>Fill in your details to register</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="competition_id">Competition *</Label>
            <Select
              id="competition_id"
              required
              value={formData.competition_id}
              onChange={(e) => setFormData({ ...formData, competition_id: e.target.value })}
            >
              <option value="">Select a competition</option>
              {competitions.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.title}
                </option>
              ))}
            </Select>
          </div>

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
            <Label htmlFor="team_name">Team Name (if team competition)</Label>
            <Input
              id="team_name"
              value={formData.team_name}
              onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="payment_mode">Payment Mode</Label>
            <Select
              id="payment_mode"
              value={formData.payment_mode}
              onChange={(e) => setFormData({ ...formData, payment_mode: e.target.value })}
            >
              <option value="">Select payment mode</option>
              <option value="cash">Cash</option>
              <option value="online">Online</option>
              <option value="pending">Pending</option>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Registration"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

