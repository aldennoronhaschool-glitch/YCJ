import { getOfficeBearers } from "@/lib/supabase/officeBearers";
import { OfficeBearersManager } from "@/components/admin/office-bearers-manager";

export default async function AdminOfficeBearersPage() {
  const bearers = await getOfficeBearers();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Office Bearers
          </h1>
          <p className="text-gray-600">
            Manage the list of office bearers, including names, roles, and
            photos.
          </p>
        </div>

        <OfficeBearersManager initialBearers={bearers} />
      </div>
    </div>
  );
}


