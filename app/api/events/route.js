import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  try {
    // Connect directly to your local MongoDB
    await mongoose.connect("mongodb://localhost:27017/joinus");
    
    // Fetch all events directly from the collection
    const events = await mongoose.connection.db.collection("events").find({}).toArray();

    return NextResponse.json(events);
  } catch (err) {
    console.error("API /api/events error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
