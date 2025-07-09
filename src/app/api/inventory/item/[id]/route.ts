import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import InventoryItem from "../../../../../../models/InventoryItem";
import connectDB from "../../../../../../lib/db";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session.userId) return new Response("Unauthorized", { status: 401 });

  const resolvedParams = await context.params;
  const body = await req.json();

  await connectDB();

  const updated = await InventoryItem.findByIdAndUpdate(resolvedParams.id, body, { new: true });

  if (!updated) return new Response("Item not found", { status: 404 });

  return NextResponse.json(updated);
}
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session.userId) return new Response("Unauthorized", { status: 401 });

  const resolvedParams = await context.params;

  await connectDB();

  const deleted = await InventoryItem.findByIdAndDelete(resolvedParams.id);

  if (!deleted) return new Response("Item not found", { status: 404 });

  return new Response("Deleted", { status: 200 });
}
