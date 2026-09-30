import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || (process.env.DATABASE_URL?.startsWith("mongodb") ? process.env.DATABASE_URL : "");

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function isMongoConfigured(): boolean {
  return Boolean(uri && (uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://")));
}

export async function getMongoDb(): Promise<Db | null> {
  if (!isMongoConfigured()) {
    return null;
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    if (!clientPromise) {
      client = new MongoClient(uri);
      clientPromise = client.connect();
    }
  }

  try {
    const connectedClient = await clientPromise;
    return connectedClient.db("taplink");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    return null;
  }
}
