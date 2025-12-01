import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getEventById } from "@/lib/supabase/events";
import { getEventRegistrationFields } from "@/lib/supabase/event-registration-fields";
import { RegistrationFieldsEditor } from "@/components/admin/registration-fields-editor";

export default async function EventRegistrationFieldsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    // Check authentication and admin status
    try {
        const { userId } = await auth();

        if (!userId) {
            redirect("/admin/login");
        }

        const admin = await isAdmin();

        if (!admin) {
            redirect("/");
        }
    } catch (error) {
        redirect("/admin/login");
    }

    const { id } = await params;
    const event = await getEventById(id, true);
    const fields = await getEventRegistrationFields(id);

    if (!event) {
        redirect("/admin/events");
    }

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                            Customize Registration Form
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Add and manage custom fields for event registration
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/admin/events">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Events
                        </Link>
                    </Button>
                </div>

                <RegistrationFieldsEditor
                    eventId={event.id}
                    eventTitle={event.title}
                    initialFields={fields}
                />
            </div>
        </div>
    );
}
