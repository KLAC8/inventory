import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error("Please add your MONGODB_URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  // Use global variable for hot reload caching
  let globalWithMongo = global as typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
