"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { OfficeBearer } from "@/lib/supabase/officeBearers";
import { Upload, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import Image from "next/image";

interface OfficeBearersManagerProps {
  initialBearers: OfficeBearer[];
}

export function OfficeBearersManager({ initialBearers }: OfficeBearersManagerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [bearers, setBearers] = useState<OfficeBearer[]>(initialBearers);
  const [loading, setLoading] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | "new" | null>(null);
  const [newBearer, setNewBearer] = useState({
    name: "",
    role: "",
    photo_url: "",
  });

  const handleUpload = async (
    target: "new" | string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(target);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "office-bearers");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Upload failed" }));
        console.error("Upload error:", errorData);
        throw new Error(errorData.message || `Upload failed (${response.status})`);
      }

      const data = await response.json();

      if (target === "new") {
        setNewBearer({ ...newBearer, photo_url: data.url });
      } else {
        setBearers((prev) =>
          prev.map((b) =>
            b.id === target ? { ...b, photo_url: data.url } : b
          )
        );
      }

      toast({
        title: "Image uploaded",
        description: "Photo uploaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingId(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBearer.name || !newBearer.role) {
      toast({
        title: "Name and role required",
        description: "Please fill in both name and role.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/office-bearers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBearer),
      });

      if (!response.ok) {
        let errorMessage = `Failed to create office bearer (${response.status})`;
        try {
          const errorData = await response.json();
          console.error("Create office bearer error:", errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          // If response is not JSON, try to get text
          try {
            const textError = await response.text();
            console.error("Create office bearer error (text):", textError);
            errorMessage = textError || errorMessage;
          } catch (textError) {
            console.error("Create office bearer error (unknown):", response.status, response.statusText);
          }
        }
        throw new Error(errorMessage);
      }

      const created = await response.json();
      setBearers((prev) => [...prev, created]);
      setNewBearer({ name: "", role: "", photo_url: "" });

      toast({
        title: "Office bearer added",
        description: "New office bearer has been added successfully.",
      });

      router.refresh();
    } catch (error: any) {
      console.error("Create office bearer error (catch):", error);
      const errorMessage = error?.message || error?.toString() || "Unknown error occurred";
      console.error("Error message:", errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<OfficeBearer>) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/office-bearers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update office bearer");
      }

      const updated = await response.json();
      setBearers((prev) => prev.map((b) => (b.id === id ? updated : b)));

      toast({
        title: "Updated",
        description: "Office bearer details updated successfully.",
      });
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
    if (!confirm("Are you sure you want to remove this office bearer?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/office-bearers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete office bearer");
      }

      setBearers((prev) => prev.filter((b) => b.id !== id));
      toast({
        title: "Deleted",
        description: "Office bearer removed successfully.",
      });
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

  const moveBearer = (index: number, direction: "up" | "down") => {
    setBearers((prev) => {
      const newArr = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newArr.length) return prev;
      const temp = newArr[index];
      newArr[index] = newArr[targetIndex];
      newArr[targetIndex] = temp;
      return newArr;
    });
  };

  const handleSaveOrder = async () => {
    setLoading(true);
    try {
      const ordered = bearers.map((b, index) => ({
        id: b.id,
        order_index: index,
      }));

      const response = await fetch("/api/admin/office-bearers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: ordered }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save order");
      }

      toast({
        title: "Order saved",
        description: "Display order updated successfully.",
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

  return (
    <div className="space-y-8">
      {/* Create new office bearer */}
      <Card>
        <CardHeader>
          <CardTitle>Add Office Bearer</CardTitle>
          <CardDescription>
            Add a new office bearer with name, role, and optional photo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newBearer.name}
                  onChange={(e) =>
                    setNewBearer({ ...newBearer, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Role *</Label>
                <Input
                  id="role"
                  value={newBearer.role}
                  onChange={(e) =>
                    setNewBearer({ ...newBearer, role: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label>Photo (Optional)</Label>
              <div className="flex items-center gap-4 mt-2">
                {newBearer.photo_url && (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border">
                    <Image
                      src={newBearer.photo_url}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    id="new_photo"
                    className="hidden"
                    disabled={uploadingId === "new"}
                    onChange={(e) => handleUpload("new", e)}
                  />
                  <Label
                    htmlFor="new_photo"
                    className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <Upload className="w-4 h-4" />
                    {uploadingId === "new" ? "Uploading..." : "Upload Photo"}
                  </Label>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Office Bearer"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing office bearers */}
      <Card>
        <CardHeader>
          <CardTitle>Current Office Bearers</CardTitle>
          <CardDescription>
            Edit details, photos, and order of office bearers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {bearers.length === 0 ? (
            <p className="text-gray-500">
              No office bearers added yet. Use the form above to add one.
            </p>
          ) : (
            <div className="space-y-4">
              {bearers.map((bearer, index) => (
                <div
                  key={bearer.id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border rounded-lg p-4 bg-white"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      {bearer.photo_url ? (
                        <Image
                          src={bearer.photo_url}
                          alt={bearer.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center text-gray-400 text-2xl">
                          {bearer.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <div>
                          <Label className="text-xs text-gray-500">Name</Label>
                          <Input
                            value={bearer.name}
                            onChange={(e) =>
                              setBearers((prev) =>
                                prev.map((b) =>
                                  b.id === bearer.id
                                    ? { ...b, name: e.target.value }
                                    : b
                                )
                              )
                            }
                            onBlur={() =>
                              handleUpdate(bearer.id, { name: bearer.name })
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-500">Role</Label>
                          <Input
                            value={bearer.role}
                            onChange={(e) =>
                              setBearers((prev) =>
                                prev.map((b) =>
                                  b.id === bearer.id
                                    ? { ...b, role: e.target.value }
                                    : b
                                )
                              )
                            }
                            onBlur={() =>
                              handleUpdate(bearer.id, { role: bearer.role })
                            }
                          />
                        </div>
                      </div>
                      <div className="mt-2">
                        <Input
                          type="file"
                          accept="image/*"
                          id={`photo_${bearer.id}`}
                          className="hidden"
                          disabled={uploadingId === bearer.id}
                          onChange={(e) => handleUpload(bearer.id, e)}
                        />
                        <Label
                          htmlFor={`photo_${bearer.id}`}
                          className="inline-flex items-center gap-2 px-3 py-1 border rounded-md cursor-pointer hover:bg-gray-50 text-xs"
                        >
                          <Upload className="w-3 h-3" />
                          {uploadingId === bearer.id
                            ? "Uploading..."
                            : "Change Photo"}
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={index === 0 || loading}
                      onClick={() => moveBearer(index, "up")}
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={index === bearers.length - 1 || loading}
                      onClick={() => moveBearer(index, "down")}
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(bearer.id)}
                      disabled={loading}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={handleSaveOrder}
                  disabled={loading}
                >
                  Save Order
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


