import { getAllCompetitions } from "@/lib/supabase/competitions";
import { getAllEvents } from "@/lib/supabase/events";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CompetitionsManager } from "@/components/admin/competitions-manager";

export default async function AdminCompetitionsPage() {
  const competitions = await getAllCompetitions();
  const events = await getAllEvents();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Competition Management</h1>
            <p className="text-gray-600">Create and manage competitions</p>
          </div>
          <Button asChild>
            <Link href="/admin/competitions/new">
              <Plus className="w-4 h-4 mr-2" />
              New Competition
            </Link>
          </Button>
        </div>

        <CompetitionsManager initialCompetitions={competitions} events={events} />
      </div>
    </div>
  );
}

