"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { GalleryImage } from "@/lib/supabase/gallery";
import { Event } from "@/lib/supabase/events";
import { Upload, Trash2 } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function GalleryManager({
  initialImages,
  events,
}: {
  initialImages: GalleryImage[];
  events: Event[];
}) {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "gallery");
        if (selectedEvent) {
          formData.append("event_id", selectedEvent);
        }

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        return response.json();
      });

      const results = await Promise.all(uploadPromises);
      
      toast({
        title: "Images uploaded",
        description: `${results.length} image(s) uploaded successfully.`,
      });

      // Refresh images
      window.location.reload();
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      setImages(images.filter((img) => img.id !== id));
      toast({
        title: "Image deleted",
        description: "The image has been deleted successfully.",
      });
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
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="event">Associate with Event (Optional)</Label>
              <Select
                id="event"
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
              >
                <option value="">No event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <input
                type="file"
                id="upload"
                multiple
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
              <Label
                htmlFor="upload"
                className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50 w-fit"
              >
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading..." : "Upload Images"}
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <Card key={image.id} className="relative group">
            <div className="relative aspect-square">
              <Image
                src={image.image_url}
                alt="Gallery image"
                fill
                className="object-cover rounded-t-lg"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(image.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

