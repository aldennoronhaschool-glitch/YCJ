import { getAllRegistrations } from "@/lib/supabase/registrations";
import { getAllCompetitions } from "@/lib/supabase/competitions";
import { RegistrationsManager } from "@/components/admin/registrations-manager";

export default async function AdminRegistrationsPage() {
  const registrations = await getAllRegistrations();
  const competitions = await getAllCompetitions();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Registrations</h1>
        <RegistrationsManager
          initialRegistrations={registrations}
          competitions={competitions}
        />
      </div>
    </div>
  );
}

