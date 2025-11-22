"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Announcement } from "@/lib/supabase/announcements";

export function AnnouncementsManager({ initialAnnouncements }: { initialAnnouncements: Announcement[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });

  const handleCreate = async () => {
    if (!formData.title || !formData.content) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create announcement");
      }

      const newAnnouncement = await response.json();
      setAnnouncements([newAnnouncement, ...announcements]);
      setFormData({ title: "", content: "" });
      setIsCreating(false);
      toast({
        title: "Announcement created",
        description: "New announcement has been created successfully.",
      });
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!formData.title || !formData.content) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update announcement");
      }

      const updated = await response.json();
      setAnnouncements(announcements.map((a) => (a.id === id ? updated : a)));
      setEditingId(null);
      setFormData({ title: "", content: "" });
      toast({
        title: "Announcement updated",
        description: "Announcement has been updated successfully.",
      });
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete announcement");
      }

      setAnnouncements(announcements.filter((a) => a.id !== id));
      toast({
        title: "Announcement deleted",
        description: "Announcement has been deleted successfully.",
      });
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setFormData({ title: announcement.title, content: announcement.content });
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ title: "", content: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">All Announcements</h2>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Announcement
          </Button>
        )}
      </div>

      {isCreating && (
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle>Create New Announcement</CardTitle>
            <CardDescription>Add a new announcement to display on the homepage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="new_title">Title *</Label>
              <Input
                id="new_title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter announcement title"
              />
            </div>
            <div>
              <Label htmlFor="new_content">Content *</Label>
              <Textarea
                id="new_content"
                rows={4}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter announcement content"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Creating..." : "Create"}
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {announcements.length === 0 ? (
        <Card className="border border-gray-200">
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No announcements yet. Create your first one!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="border border-gray-200">
              {editingId === announcement.id ? (
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <Label htmlFor={`edit_title_${announcement.id}`}>Title *</Label>
                    <Input
                      id={`edit_title_${announcement.id}`}
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter announcement title"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`edit_content_${announcement.id}`}>Content *</Label>
                    <Textarea
                      id={`edit_content_${announcement.id}`}
                      rows={4}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Enter announcement content"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleUpdate(announcement.id)} disabled={loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? "Saving..." : "Save"}
                    </Button>
                    <Button variant="outline" onClick={cancelEdit}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{announcement.title}</h3>
                      <p className="text-gray-700 whitespace-pre-line">{announcement.content}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Created: {new Date(announcement.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(announcement)}
                        disabled={loading}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(announcement.id)}
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

