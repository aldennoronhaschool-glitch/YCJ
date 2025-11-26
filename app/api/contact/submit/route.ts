import { NextRequest, NextResponse } from "next/server";
import { submitContactForm } from "@/lib/supabase/contact-submissions";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        const requiredFields = [
            'first_name', 'last_name', 'gender', 'email',
            'phone', 'city', 'connection', 'message_title', 'message_body'
        ];

        for (const field of requiredFields) {
            if (!body[field] || body[field].trim() === '') {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Validate gender
        if (!['male', 'female'].includes(body.gender)) {
            return NextResponse.json(
                { error: "Invalid gender value" },
                { status: 400 }
            );
        }

        // Validate connection
        const validConnections = ['member', 'attending', 'online-other', 'online-only', 'none'];
        if (!validConnections.includes(body.connection)) {
            return NextResponse.json(
                { error: "Invalid connection value" },
                { status: 400 }
            );
        }

        // Submit the form
        const submission = await submitContactForm({
            first_name: body.first_name.trim(),
            last_name: body.last_name.trim(),
            gender: body.gender,
            email: body.email.trim().toLowerCase(),
            phone: body.phone.trim(),
            city: body.city.trim(),
            connection: body.connection,
            message_title: body.message_title.trim(),
            message_body: body.message_body.trim(),
        });

        // Send email notification to admin (non-blocking)
        try {
            const { sendAdminNotification } = await import('@/lib/email/notifications');
            await sendAdminNotification({
                first_name: body.first_name.trim(),
                last_name: body.last_name.trim(),
                gender: body.gender,
                email: body.email.trim().toLowerCase(),
                phone: body.phone.trim(),
                city: body.city.trim(),
                connection: body.connection,
                message_title: body.message_title.trim(),
                message_body: body.message_body.trim(),
            });
            console.log('Admin notification sent successfully');
        } catch (emailError) {
            // Log the error but don't fail the request
            console.error('Failed to send admin notification email:', emailError);
            // Continue - form submission was successful even if email failed
        }

        return NextResponse.json({
            success: true,
            message: "Thank you for contacting us! We'll get back to you soon.",
            submission_id: submission.id
        });

    } catch (error: any) {
        console.error("Error submitting contact form:", error);
        return NextResponse.json(
            { error: error.message || "Failed to submit contact form" },
            { status: 500 }
        );
    }
}
