import { getHomepageSettings } from "@/lib/supabase/homepage";
import { HomepageManager } from "@/components/admin/homepage-manager";

export default async function AdminHomepagePage() {
  const settings = await getHomepageSettings();

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Homepage Settings</h1>
          <p className="text-gray-600">Customize your homepage content, images, service times, welcome note, and contact information</p>
        </div>

        <HomepageManager initialSettings={settings} />
      </div>
    </div>
  );
}

