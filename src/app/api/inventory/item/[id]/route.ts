import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import InventoryItem from "../../../../../../models/InventoryItem";
import connectDB from "../../../../../../lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session.userId) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;
    const body = await req.json();

    await connectDB();

    
    const updated = await InventoryItem.findByIdAndUpdate(id, body, { new: true });

    if (!updated) return new NextResponse("Item not found", { status: 404 });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/inventory/item/[id] error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session.userId) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;

    await connectDB();

    const deleted = await InventoryItem.findByIdAndDelete(id);

    if (!deleted) return new NextResponse("Item not found", { status: 404 });

    return new NextResponse("Deleted", { status: 200 });
  } catch (error) {
    console.error("DELETE /api/inventory/item/[id] error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
