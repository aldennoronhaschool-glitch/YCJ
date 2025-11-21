"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Competition } from "@/lib/supabase/competitions";
import { Event } from "@/lib/supabase/events";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export function CompetitionsManager({
  initialCompetitions,
  events,
}: {
  initialCompetitions: Competition[];
  events: Event[];
}) {
  const [competitions, setCompetitions] = useState(initialCompetitions);
  const router = useRouter();
  const { toast } = useToast();

  const getEventTitle = (eventId: string | null) => {
    if (!eventId) return "No event";
    return events.find((e) => e.id === eventId)?.title || "Unknown event";
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this competition?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/competitions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete competition");
      }

      setCompetitions(competitions.filter((c) => c.id !== id));
      toast({
        title: "Competition deleted",
        description: "The competition has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {competitions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No competitions found. Create your first competition!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {competitions.map((competition) => (
            <Card key={competition.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{competition.title}</CardTitle>
                    <CardDescription>
                      Event: {getEventTitle(competition.event_id)}
                      {competition.max_participants && (
                        <> • Max participants: {competition.max_participants}</>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/admin/competitions/${competition.id}/edit`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(competition.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{competition.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

