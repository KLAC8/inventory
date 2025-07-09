import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

// Define the params type for the dynamic route
interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = params;

  if (!id) return new NextResponse("Missing id", { status: 400 });

  const { name } = await request.json();
  if (!name) return new NextResponse("Missing category name", { status: 400 });

  const client = await clientPromise;
  const db = client.db();

  await db.collection("categories").updateOne({ _id: new ObjectId(id) }, { $set: { name } });
  return NextResponse.json({ _id: id, name });
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = params;

  if (!id) return new NextResponse("Missing id", { status: 400 });

  const client = await clientPromise;
  const db = client.db();

  await db.collection("categories").deleteOne({ _id: new ObjectId(id) });
  return new NextResponse(null, { status: 204 });
}