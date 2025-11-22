import { getAllRegistrations } from "@/lib/supabase/registrations";
import { getAllCompetitions } from "@/lib/supabase/competitions";
import { RegistrationsManager } from "@/components/admin/registrations-manager";

export default async function AdminRegistrationsPage() {
  const registrations = await getAllRegistrations();
  const competitions = await getAllCompetitions();

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Registrations</h1>
        <RegistrationsManager
          initialRegistrations={registrations}
          competitions={competitions}
        />
      </div>
    </div>
  );
}

