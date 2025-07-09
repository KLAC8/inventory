import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Category from "../../../../models/Category";
import connectDB from "../../../../lib/db";

export async function GET() {
  await connectDB();
  const categories = await Category.find({}).lean();
  return NextResponse.json(categories.map(c => c.name));
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session.userId) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const { name, createdBy } = body;

  await connectDB();

  const existing = await Category.findOne({ name });
  if (existing) return new Response("Category already exists", { status: 409 });

  const newCategory = await Category.create({ name, createdBy });
  return NextResponse.json(newCategory);
}
