import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import InventoryItem from "../../../../../models/InventoryItem";
import connectDB from "../../../../../lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ category: string }> }
) {
  const resolvedParams = await context.params;
  await connectDB();
  const items = await InventoryItem.find({ category: resolvedParams.category }).lean();
  return NextResponse.json(items);
}

export async function POST(
  req: Request,
  context: { params: Promise<{ category: string }> }
) {
  const session = await auth();
  const userId = session.userId;
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const resolvedParams = await context.params;
  const body = await req.json();

  await connectDB();

  const newItem = await InventoryItem.create({
    category: resolvedParams.category,
    itemCode: body.itemCode,
    name: body.name,
    totalQuantity: body.totalQuantity,
    balance: body.totalQuantity,
    unit: body.unit,
    acquiredDate: body.acquiredDate,
    condition: body.condition,
    description: body.description,
    givenTo: body.givenTo || "",
    givenBy: body.givenBy || "",
    createdBy: body.createdBy || "", // frontend user fullName
  });

  return NextResponse.json(newItem);
}
