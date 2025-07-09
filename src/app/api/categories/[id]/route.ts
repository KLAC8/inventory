import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  if (!id) return new NextResponse("Missing id", { status: 400 });

  const { name } = await request.json();
  if (!name) return new NextResponse("Missing category name", { status: 400 });


  const db = client.db();

  await db.collection("categories").updateOne({ _id: new ObjectId(params.id) }, { $set: { name } });
  return NextResponse.json({ _id: params.id, name });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  if (!id) return new NextResponse("Missing id", { status: 400 });

  const client = await clientPromise;
  const db = client.db();

  await db.collection("categories").deleteOne({ _id: new ObjectId(params.id) });
  return new NextResponse(null, { status: 204 });
}