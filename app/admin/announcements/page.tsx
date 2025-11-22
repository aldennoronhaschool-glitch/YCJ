import { getAllAnnouncements } from "@/lib/supabase/announcements";
import { AnnouncementsManager } from "@/components/admin/announcements-manager";

export default async function AdminAnnouncementsPage() {
  const announcements = await getAllAnnouncements();

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Announcements Management</h1>
          <p className="text-gray-600">Create, edit, and manage announcements displayed on the homepage</p>
        </div>

        <AnnouncementsManager initialAnnouncements={announcements} />
      </div>
    </div>
  );
}

