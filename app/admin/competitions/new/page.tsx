import { getAllEvents } from "@/lib/supabase/events";
import { CompetitionForm } from "@/components/admin/competition-form";

export default async function NewCompetitionPage() {
  const events = await getAllEvents();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Create New Competition</h1>
        <CompetitionForm events={events} />
      </div>
    </div>
  );
}

