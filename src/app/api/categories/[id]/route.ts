// app/api/categories/[id]/route.ts
import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/db";
import Category from "../../../../../models/Category";

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) return new NextResponse("Missing id", { status: 400 });

    const { name } = await req.json();
    if (!name || !name.trim()) return new NextResponse("Name is required", { status: 400 });

    await connectDB();

    const updated = await Category.findByIdAndUpdate(id, { name: name.trim() }, { new: true });
    if (!updated) return new NextResponse("Category not found", { status: 404 });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/categories/[id] error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) return new NextResponse("Missing id", { status: 400 });

    await connectDB();

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) return new NextResponse("Category not found", { status: 404 });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/categories/[id] error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
