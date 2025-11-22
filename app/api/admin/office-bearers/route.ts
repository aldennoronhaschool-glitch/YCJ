import { isAdmin } from "@/lib/auth";
import {
  createOfficeBearer,
  updateOfficeBearer,
} from "@/lib/supabase/officeBearers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { name, role, photo_url } = body;

    if (!name || !role) {
      return NextResponse.json(
        { message: "Name and role are required" },
        { status: 400 }
      );
    }

    const bearer = await createOfficeBearer({
      name: name.trim(),
      role: role.trim(),
      photo_url: photo_url || null,
    });

    return NextResponse.json(bearer, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/admin/office-bearers:", error);
    return NextResponse.json(
      { 
        message: error.message || "Internal server error",
        error: error.toString(),
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  // Used for saving order only
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { order } = body as {
      order: { id: string; order_index: number }[];
    };

    if (!order || !Array.isArray(order)) {
      return NextResponse.json(
        { message: "Invalid order payload" },
        { status: 400 }
      );
    }

    await Promise.all(
      order.map((item) =>
        updateOfficeBearer(item.id, { order_index: item.order_index })
      )
    );

    return NextResponse.json({ message: "Order updated" });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


