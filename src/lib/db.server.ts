import { MongoClient, type Db } from "mongodb";

let clientPromise: Promise<MongoClient> | undefined;

export async function getDb(): Promise<Db> {
  const uri = process.env["MONGODB_URI"];
  if (!uri) throw new Error("MONGODB_URI is missing. Add it to .env");
  if (!clientPromise) clientPromise = new MongoClient(uri).connect();
  return (await clientPromise).db(process.env["MONGODB_DB"] || "scna");
}
