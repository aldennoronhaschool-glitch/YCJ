import { getCompetitionById } from "@/lib/supabase/competitions";
import { getAllEvents } from "@/lib/supabase/events";
import { notFound } from "next/navigation";
import { CompetitionForm } from "@/components/admin/competition-form";

export default async function EditCompetitionPage({
  params,
}: {
  params: { id: string };
}) {
  const competition = await getCompetitionById(params.id);
  const events = await getAllEvents();

  if (!competition) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Edit Competition</h1>
        <CompetitionForm competition={competition} events={events} />
      </div>
    </div>
  );
}

