import { NextRequest, NextResponse } from "next/server";
import {
    getAllContactSubmissions,
    updateContactSubmissionStatus,
    deleteContactSubmission,
    getContactSubmissionStats
} from "@/lib/supabase/contact-submissions";
import { isAdmin } from "@/lib/auth";

// GET - Fetch all contact submissions or stats
export async function GET(request: NextRequest) {
    try {
        const admin = await isAdmin();
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const statsOnly = searchParams.get('stats') === 'true';

        if (statsOnly) {
            const stats = await getContactSubmissionStats();
            return NextResponse.json(stats);
        }

        const submissions = await getAllContactSubmissions();
        return NextResponse.json(submissions);

    } catch (error: any) {
        console.error("Error fetching contact submissions:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch contact submissions" },
            { status: 500 }
        );
    }
}

// PATCH - Update submission status
export async function PATCH(request: NextRequest) {
    try {
        const admin = await isAdmin();
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json(
                { error: "Missing id or status" },
                { status: 400 }
            );
        }

        if (!['unread', 'read', 'archived'].includes(status)) {
            return NextResponse.json(
                { error: "Invalid status value" },
                { status: 400 }
            );
        }

        const updated = await updateContactSubmissionStatus(id, status);
        return NextResponse.json(updated);

    } catch (error: any) {
        console.error("Error updating contact submission:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update contact submission" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a submission
export async function DELETE(request: NextRequest) {
    try {
        const admin = await isAdmin();
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: "Missing submission id" },
                { status: 400 }
            );
        }

        await deleteContactSubmission(id);
        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Error deleting contact submission:", error);
        return NextResponse.json(
            { error: error.message || "Failed to delete contact submission" },
            { status: 500 }
        );
    }
}
