import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import InventoryItem from "../../../../../models/InventoryItem";
import connectDB from "../../../../../lib/db";

// Properly typed context parameter
export async function GET(
  req: Request,
  { params }: { params: { category: string } }
) {
  const category = params?.category;
  if (!category) return new NextResponse("Category missing", { status: 400 });

  try {
    await connectDB();
    const items = await InventoryItem.find({ category }).lean();
    return NextResponse.json(items);
  } catch (error) {
    console.error("GET inventory error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { category: string } }
) {
  const category = params?.category;
  if (!category) return new NextResponse("Category missing", { status: 400 });

  const session = await auth();
  if (!session?.userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
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
    console.error("POST inventory error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}