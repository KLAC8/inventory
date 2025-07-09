import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import InventoryItem from "../../../../../models/InventoryItem";
import connectDB from "../../../../../lib/db";

interface Params {
  category: string;
}

export async function GET(
  _req: Request,
  { params }: { params: Params }
) {
  try {
    await connectDB();
    const items = await InventoryItem.find({ category: params.category }).lean();
    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/inventory/[category] error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Params }
) {
  try {
    const session = await auth();
    if (!session.userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();

    // Simple validation (you can expand this as needed)
    if (!body.itemCode || !body.name || !body.totalQuantity || !body.unit || !body.acquiredDate || !body.condition) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await connectDB();

    const newItem = await InventoryItem.create({
      category: params.category,
      itemCode: body.itemCode,
      name: body.name,
      totalQuantity: body.totalQuantity,
      balance: body.totalQuantity,
      unit: body.unit,
      acquiredDate: new Date(body.acquiredDate), // ensure date
      condition: body.condition,
      description: body.description || "",
      givenTo: body.givenTo || "",
      givenBy: body.givenBy || "",
      createdBy: session.userId, // Use authenticated user ID here
    });

    return NextResponse.json(newItem);
  } catch (error) {
    console.error("POST /api/inventory/[category] error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
