"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { GalleryImage } from "@/lib/supabase/gallery";
import { Event } from "@/lib/supabase/events";
import { Upload, Trash2, X, Folder, ChevronDown, ChevronRight, Edit, Plus, Save } from "lucide-react";
import { Label } from "@/components/ui/label";

interface PreviewImage {
  file: File;
  preview: string;
}

interface ImageKitFolder {
  id: string;
  name: string;
  coverImage: string;
  count: number;
  images: any[];
  description?: string | null;
}

export function GalleryManager({
  initialImages,
  events,
}: {
  initialImages: GalleryImage[];
  events: Event[];
}) {
  const [uploading, setUploading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [customEventName, setCustomEventName] = useState<string>("");
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
  const [folders, setFolders] = useState<ImageKitFolder[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [folderDescriptions, setFolderDescriptions] = useState<Record<string, string>>({});
  const [addingToFolder, setAddingToFolder] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/imagekit/gallery');
      if (response.ok) {
        const data = await response.json();
        const foldersData = data.folders || [];
        setFolders(foldersData);

        // Initialize descriptions
        const descriptions: Record<string, string> = {};
        foldersData.forEach((folder: ImageKitFolder) => {
          descriptions[folder.id] = folder.description || "";
        });
        setFolderDescriptions(descriptions);
      }
    } catch (error) {
      console.error("Error fetching folders:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, targetFolder?: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!targetFolder && !selectedEvent && !customEventName) {
      toast({
        title: "Missing information",
        description: "Please select an event or enter a custom event name first.",
        variant: "destructive",
      });
      return;
    }

    const newPreviews: PreviewImage[] = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setPreviewImages([...previewImages, ...newPreviews]);

    if (targetFolder) {
      setAddingToFolder(targetFolder);
      setCustomEventName(targetFolder);
    }

    e.target.value = "";
  };

  const removePreview = (index: number) => {
    const newPreviews = [...previewImages];
    URL.revokeObjectURL(newPreviews[index].preview);
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
  };

  const handleSubmit = async () => {
    if (previewImages.length === 0) {
      toast({
        title: "No images selected",
        description: "Please select images to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = previewImages.map(async ({ file }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "gallery");
        if (selectedEvent) {
          formData.append("event_id", selectedEvent);
        }
        if (customEventName) {
          formData.append("custom_event_name", customEventName);
        }

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Upload failed");
        }

        return response.json();
      });

      const results = await Promise.all(uploadPromises);

      toast({
        title: "Images uploaded",
        description: `${results.length} image(s) uploaded successfully.`,
      });

      previewImages.forEach(({ preview }) => URL.revokeObjectURL(preview));
      setPreviewImages([]);
      setSelectedEvent("");
      setCustomEventName("");
      setAddingToFolder(null);

      await fetchFolders();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveDescription = async (folderName: string) => {
    try {
      const response = await fetch('/api/imagekit/folder-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folderName,
          description: folderDescriptions[folderName] || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save description");
      }

      toast({
        title: "Description saved",
        description: "Folder description updated successfully.",
      });

      setEditingFolder(null);
      await fetchFolders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteImage = async (fileId: string, folderName: string) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      const response = await fetch(`/api/imagekit/delete/${fileId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      toast({
        title: "Image deleted",
        description: "The image has been deleted successfully.",
      });

      await fetchFolders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Upload New Images</h3>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event">Associate with Existing Event</Label>
                <select
                  id="event"
                  value={selectedEvent}
                  onChange={(e) => {
                    setSelectedEvent(e.target.value);
                    if (e.target.value) setCustomEventName("");
                  }}
                  disabled={!!customEventName || previewImages.length > 0}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select an event...</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end pb-2 text-center text-sm text-gray-500 font-bold">
                OR
              </div>

              <div>
                <Label htmlFor="customEvent">Create New Folder / Custom Event Name</Label>
                <input
                  id="customEvent"
                  type="text"
                  value={customEventName}
                  onChange={(e) => {
                    setCustomEventName(e.target.value);
                    if (e.target.value) setSelectedEvent("");
                  }}
                  disabled={!!selectedEvent || previewImages.length > 0 || !!addingToFolder}
                  placeholder="e.g., Youth Retreat 2024"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            {previewImages.length > 0 && (
              <div className="pt-4 border-t">
                <Label>Selected Images ({previewImages.length})</Label>
                {addingToFolder && (
                  <p className="text-sm text-primary mb-2">Adding to folder: {addingToFolder}</p>
                )}
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-2">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                        <Image
                          src={preview.preview}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          onClick={() => removePreview(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          type="button"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">{preview.file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t flex gap-3">
              <input
                type="file"
                id="upload"
                multiple
                accept="image/*"
                onChange={(e) => handleFileSelect(e)}
                disabled={uploading || (!selectedEvent && !customEventName)}
                className="hidden"
              />
              <Label
                htmlFor="upload"
                className={`flex items-center justify-center gap-2 px-6 py-3 border rounded-md cursor-pointer transition-colors ${!selectedEvent && !customEventName
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border-primary text-primary hover:bg-primary/10"
                  }`}
              >
                <Upload className="w-4 h-4" />
                Select Images
              </Label>

              {previewImages.length > 0 && (
                <Button
                  onClick={handleSubmit}
                  disabled={uploading}
                  className="px-6"
                >
                  {uploading ? "Uploading..." : `Upload ${previewImages.length} Image${previewImages.length > 1 ? 's' : ''}`}
                </Button>
              )}
            </div>

            {(!selectedEvent && !customEventName) && (
              <p className="text-xs text-red-500">Please select an event or enter a name first.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Existing Folders Section */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Existing Folders ({folders.length})</h3>
          {loading ? (
            <p className="text-gray-500 text-center py-8">Loading folders...</p>
          ) : folders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No folders yet. Upload images to create folders.</p>
          ) : (
            <div className="space-y-4">
              {folders.map((folder) => (
                <div key={folder.id} className="border rounded-lg overflow-hidden">
                  <div className="p-4 bg-gray-50">
                    <div className="flex items-start justify-between gap-4">
                      <button
                        onClick={() => toggleFolder(folder.id)}
                        className="flex-1 flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
                      >
                        <Folder className="w-5 h-5 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold">{folder.name}</h4>
                          <p className="text-sm text-gray-500">{folder.count} images</p>
                          {folder.description && !editingFolder && (
                            <p className="text-sm text-gray-600 mt-1">{folder.description}</p>
                          )}
                        </div>
                        {expandedFolders.has(folder.id) ? (
                          <ChevronDown className="w-5 h-5 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-5 h-5 flex-shrink-0" />
                        )}
                      </button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingFolder(editingFolder === folder.id ? null : folder.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>

                    {editingFolder === folder.id && (
                      <div className="mt-4 space-y-2">
                        <Label htmlFor={`desc-${folder.id}`}>Folder Description (Optional)</Label>
                        <textarea
                          id={`desc-${folder.id}`}
                          value={folderDescriptions[folder.id] || ""}
                          onChange={(e) => setFolderDescriptions({
                            ...folderDescriptions,
                            [folder.id]: e.target.value
                          })}
                          placeholder="Add a description for this folder..."
                          className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSaveDescription(folder.name)}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Description
                        </Button>
                      </div>
                    )}
                  </div>

                  {expandedFolders.has(folder.id) && (
                    <div className="p-4 border-t">
                      <div className="flex justify-end mb-4">
                        <input
                          type="file"
                          id={`add-${folder.id}`}
                          multiple
                          accept="image/*"
                          onChange={(e) => handleFileSelect(e, folder.name)}
                          className="hidden"
                        />
                        <Label
                          htmlFor={`add-${folder.id}`}
                          className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-md cursor-pointer hover:bg-primary/10 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Images to this Folder
                        </Label>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {folder.images.map((image) => (
                          <div key={image.id} className="relative group">
                            <div className="relative aspect-square rounded-lg overflow-hidden border">
                              <Image
                                src={image.url}
                                alt={image.name}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => handleDeleteImage(image.id, folder.name)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
