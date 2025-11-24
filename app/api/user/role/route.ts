import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserRole } from "@/lib/supabase/users";

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ role: null }, { status: 401 });
        }

        const role = await getUserRole(userId);
        return NextResponse.json({ role });
    } catch (error) {
        console.error("Error fetching user role:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
