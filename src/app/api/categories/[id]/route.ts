import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connectDB from "../../../../../lib/db";
import Category from "../../../../../models/Category";

export async function PUT(
  req: Request,
  context: Promise<{ params: { id: string } }>
) {
  const { params } = await context;
  const { id } = params;
  const { name } = await req.json();

  if (!name) {
    return new NextResponse("Missing category name", { status: 400 });
  }

  await connectDB();

  if (!Types.ObjectId.isValid(id)) {
    return new NextResponse("Invalid ID", { status: 400 });
  }

  const updated = await Category.findByIdAndUpdate(id, { name }, { new: true });

  if (!updated) {
    return new NextResponse("Category not found", { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  context: Promise<{ params: { id: string } }>
) {
  const { params } = await context;
  const { id } = params;

  await connectDB();

  if (!Types.ObjectId.isValid(id)) {
    return new NextResponse("Invalid ID", { status: 400 });
  }

  const deleted = await Category.findByIdAndDelete(id);

  if (!deleted) {
    return new NextResponse("Category not found", { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
