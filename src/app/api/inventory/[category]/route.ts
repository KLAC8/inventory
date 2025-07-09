import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import InventoryItem from "../../../../../models/InventoryItem";
import connectDB from "../../../../../lib/db";

export async function GET(
  _req: Request,
  context: { params: { category: string } }
) {
  try {
    const { category } = context.params;

    await connectDB();
    const items = await InventoryItem.find({ category }).lean();
    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/inventory/[category] error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  context: { params: { category: string } }
) {
  try {
    const session = await auth();
    if (!session.userId) return new NextResponse("Unauthorized", { status: 401 });

    const { category } = context.params;
    const body = await req.json();

    await connectDB();

    const newItem = await InventoryItem.create({
      category,
      itemCode: body.itemCode,
      name: body.name,
      totalQuantity: body.totalQuantity,
      balance: body.totalQuantity,
      unit: body.unit,
      acquiredDate: new Date(body.acquiredDate),
      condition: body.condition,
      description: body.description || "",
      givenTo: body.givenTo || "",
      givenBy: body.givenBy || "",
      createdBy: session.userId,
    });

    return NextResponse.json(newItem);
  } catch (error) {
    console.error("POST /api/inventory/[category] error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
