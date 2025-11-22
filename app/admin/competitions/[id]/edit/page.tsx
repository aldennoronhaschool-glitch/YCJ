import { getCompetitionById } from "@/lib/supabase/competitions";
import { getAllEvents } from "@/lib/supabase/events";
import { notFound } from "next/navigation";
import { CompetitionForm } from "@/components/admin/competition-form";

export default async function EditCompetitionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const competition = await getCompetitionById(id);
  const events = await getAllEvents();

  if (!competition) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Edit Competition</h1>
        <CompetitionForm competition={competition} events={events} />
      </div>
    </div>
  );
}

