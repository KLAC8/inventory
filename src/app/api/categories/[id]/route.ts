import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "../../../../../lib/db";
import Category from "../../../../../models/Category";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session.userId) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;
    const { name } = await req.json();
    
    if (!name || !name.trim()) {
      return new NextResponse("Name is required", { status: 400 });
    }

    await connectDB();

    // Check if another category with this name already exists (excluding current one)
    const existing = await Category.findOne({ 
      name: name.trim(), 
      _id: { $ne: id } 
    });
    if (existing) {
      return new NextResponse("Category already exists", { status: 409 });
    }

    const updated = await Category.findByIdAndUpdate(
      id, 
      { name: name.trim() }, 
      { new: true }
    );
    
    if (!updated) {
      return new NextResponse("Category not found", { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/categories/[id] error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session.userId) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;

    await connectDB();

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return new NextResponse("Category not found", { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/categories/[id] error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}