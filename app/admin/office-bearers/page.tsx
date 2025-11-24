import { getOfficeBearers } from "@/lib/supabase/officeBearers";
import { OfficeBearersManager } from "@/components/admin/office-bearers-manager";

export const dynamic = 'force-dynamic';


const bearers = await getOfficeBearers();

return (
  <div className="min-h-screen bg-background py-12 px-4">
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
          Office Bearers
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage the list of office bearers, including names, roles, and
          photos.
        </p>
      </div>

      <OfficeBearersManager initialBearers={bearers} />
    </div>
  </div>
);
}


