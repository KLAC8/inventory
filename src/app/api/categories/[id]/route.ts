import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { name } = await request.json();
  if (!name) return new NextResponse("Missing category name", { status: 400 });

  const client = await clientPromise;
  const db = client.db();

  await db.collection("categories").updateOne({ _id: new ObjectId(params.id) }, { $set: { name } });
  return NextResponse.json({ _id: params.id, name });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const client = await clientPromise;
  const db = client.db();

  await db.collection("categories").deleteOne({ _id: new ObjectId(params.id) });
  return new NextResponse(null, { status: 204 });
}
