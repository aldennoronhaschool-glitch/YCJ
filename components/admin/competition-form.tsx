"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Competition } from "@/lib/supabase/competitions";
import { Event } from "@/lib/supabase/events";

export function CompetitionForm({
  competition,
  events,
}: {
  competition?: Competition;
  events: Event[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: competition?.title || "",
    description: competition?.description || "",
    event_id: competition?.event_id || "",
    max_participants: competition?.max_participants?.toString() || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = competition
        ? `/api/admin/competitions/${competition.id}`
        : "/api/admin/competitions";
      const method = competition ? "PATCH" : "POST";

      const payload = {
        ...formData,
        event_id: formData.event_id || null,
        max_participants: formData.max_participants
          ? parseInt(formData.max_participants)
          : null,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save competition");
      }

      toast({
        title: competition ? "Competition updated" : "Competition created",
        description: `Competition has been ${competition ? "updated" : "created"} successfully.`,
      });

      router.push("/admin/competitions");
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
    <Card>
      <CardHeader>
        <CardTitle>{competition ? "Edit Competition" : "Create Competition"}</CardTitle>
        <CardDescription>Fill in the competition details below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              required
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="event_id">Associated Event (Optional)</Label>
            <Select
              id="event_id"
              value={formData.event_id}
              onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
            >
              <option value="">No event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="max_participants">Max Participants (Optional)</Label>
            <Input
              id="max_participants"
              type="number"
              min="1"
              value={formData.max_participants}
              onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : competition ? "Update Competition" : "Create Competition"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

