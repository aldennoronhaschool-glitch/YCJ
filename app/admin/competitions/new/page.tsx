import { getAllEvents } from "@/lib/supabase/events";
import { CompetitionForm } from "@/components/admin/competition-form";

export default async function NewCompetitionPage() {
  const events = await getAllEvents();

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Create New Competition</h1>
        <CompetitionForm events={events} />
      </div>
    </div>
  );
}

