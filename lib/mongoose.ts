import mongoose from "mongoose";

const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error("Missing MONGODB_URI");

let cached = (global as any)._mongoose;
if (!cached) cached = (global as any)._mongoose = { conn: null, promise: null };

export async function connectToDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, { dbName: process.env.MONGODB_DB || undefined })
      .then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
