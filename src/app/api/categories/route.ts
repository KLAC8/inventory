// app/api/categories/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "../../../../lib/db";
import Category from "../../../../models/Category";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).lean();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session.userId) return new NextResponse("Unauthorized", { status: 401 });

    const { name } = await req.json();
    if (!name || !name.trim()) {
      return new NextResponse("Name is required", { status: 400 });
    }

    await connectDB();

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) return new NextResponse("Category already exists", { status: 409 });

    const newCategory = await Category.create({
      name: name.trim(),
      createdBy: session.userId,
    });

    return NextResponse.json(newCategory);
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
