import { redirect } from "next/navigation";
import { getEventById } from "@/lib/supabase/events";
import { EventRegistrationForm } from "@/components/event-registration-form";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EventRegistrationPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const event = await getEventById(id, false);

    if (!event) {
        redirect("/events");
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-12 px-4 pt-24">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6">
                        <Button asChild variant="ghost">
                            <Link href={`/events/${event.id}`}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Event Details
                            </Link>
                        </Button>
                    </div>

                    {/* Event Summary Card */}
                    <Card className="mb-8 border border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-3xl text-gray-900">{event.title}</CardTitle>
                            <CardDescription className="text-base">
                                {event.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-gray-500">Date</p>
                                        <p className="font-medium">
                                            {new Date(event.date).toLocaleDateString("en-US", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Clock className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-gray-500">Time</p>
                                        <p className="font-medium">{event.time}</p>
                                    </div>
                                </div>
                                {event.location && (
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <MapPin className="w-5 h-5 text-primary" />
                                        <div>
                                            <p className="text-sm text-gray-500">Location</p>
                                            <p className="font-medium">{event.location}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Registration Form */}
                    <EventRegistrationForm event={event} />
                </div>
            </div>
        </>
    );
}
