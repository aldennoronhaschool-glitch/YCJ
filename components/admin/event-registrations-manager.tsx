"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EventRegistration } from "@/lib/supabase/event-registrations";
import { Event } from "@/lib/supabase/events";
import { Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";

export function EventRegistrationsManager({
    initialRegistrations,
    events,
}: {
    initialRegistrations: EventRegistration[];
    events: Event[];
}) {
    const searchParams = useSearchParams();
    const eventParam = searchParams.get("event");
    const [registrations, setRegistrations] = useState(initialRegistrations);
    const [selectedEvent, setSelectedEvent] = useState<string>(eventParam || "all");
    const { toast } = useToast();

    useEffect(() => {
        if (eventParam) {
            setSelectedEvent(eventParam);
        }
    }, [eventParam]);

    const getEventTitle = (eventId: string) => {
        return events.find((e) => e.id === eventId)?.title || "Unknown";
    };

    const filteredRegistrations =
        selectedEvent === "all"
            ? registrations
            : registrations.filter((r) => r.event_id === selectedEvent);

    const handleDownloadCSV = () => {
        // Collect all unique custom field keys
        const customKeys = new Set<string>();
        filteredRegistrations.forEach(reg => {
            if (reg.custom_fields) {
                Object.keys(reg.custom_fields).forEach(key => customKeys.add(key));
            }
        });
        const customKeysArray = Array.from(customKeys);

        const headers = ["Name", "Email", "Phone", "Age", "Additional Info", "Event", "Date", ...customKeysArray];

        const rows = filteredRegistrations.map((reg) => {
            const row = [
                reg.name || "",
                reg.email || "",
                reg.phone || "",
                reg.age?.toString() || "",
                reg.additional_info || "",
                getEventTitle(reg.event_id),
                new Date(reg.created_at).toLocaleDateString(),
            ];

            // Add custom field values
            customKeysArray.forEach(key => {
                row.push(reg.custom_fields?.[key] ? String(reg.custom_fields[key]) : "");
            });

            return row;
        });

        const csvContent = [
            headers.join(","),
            ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `event-registrations-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this registration?")) {
            return;
        }

        try {
            const response = await fetch(`/api/event-registrations/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete registration");
            }

            setRegistrations(registrations.filter((r) => r.id !== id));
            toast({
                title: "Registration deleted",
                description: "The registration has been deleted successfully.",
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
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Event Registrations</CardTitle>
                        <div className="flex gap-4">
                            <select
                                value={selectedEvent}
                                onChange={(e) => setSelectedEvent(e.target.value)}
                                className="px-4 py-2 border rounded-md"
                            >
                                <option value="all">All Events</option>
                                {events.map((event) => (
                                    <option key={event.id} value={event.id}>
                                        {event.title}
                                    </option>
                                ))}
                            </select>
                            <Button onClick={handleDownloadCSV}>
                                <Download className="w-4 h-4 mr-2" />
                                Download CSV
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredRegistrations.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No registrations found.</p>
                    ) : (
                        <div className="space-y-4">
                            {filteredRegistrations.map((registration) => (
                                <Card key={registration.id}>
                                    <CardContent className="pt-6">
                                        <div className="flex justify-between items-start">
                                            <div className="grid md:grid-cols-2 gap-4 flex-1">
                                                {/* Only show standard fields if they have values */}
                                                {registration.name && (
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Name</p>
                                                        <p className="text-lg">{registration.name}</p>
                                                    </div>
                                                )}
                                                {registration.email && (
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Email</p>
                                                        <p className="text-lg">{registration.email}</p>
                                                    </div>
                                                )}
                                                {registration.phone && (
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Phone</p>
                                                        <p className="text-lg">{registration.phone}</p>
                                                    </div>
                                                )}
                                                {registration.age && (
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Age</p>
                                                        <p className="text-lg">{registration.age}</p>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Event</p>
                                                    <p className="text-lg">{getEventTitle(registration.event_id)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Registered On</p>
                                                    <p className="text-lg">
                                                        {new Date(registration.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                                {registration.additional_info && (
                                                    <div className="md:col-span-2">
                                                        <p className="text-sm font-medium text-gray-500">Additional Info</p>
                                                        <p className="text-lg">{registration.additional_info}</p>
                                                    </div>
                                                )}
                                                {/* Render Custom Fields */}
                                                {registration.custom_fields && Object.entries(registration.custom_fields).map(([key, value]) => (
                                                    <div key={key}>
                                                        <p className="text-sm font-medium text-gray-500">{key}</p>
                                                        <p className="text-lg">{String(value)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleDelete(registration.id)}
                                                className="ml-4"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
