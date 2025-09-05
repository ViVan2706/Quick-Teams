// import { NextResponse } from "next/server";
// import mongoose from "mongoose";

// export async function GET() {
//   try {
//     // Connect directly to your local MongoDB
//     await mongoose.connect("mongodb://localhost:27017/joinus");
    
//     // Fetch all events directly from the collection
//     const events = await mongoose.connection.db.collection("events").find({}).toArray();

//     return NextResponse.json(events);
//   } catch (err) {
//     console.error("API /api/events error:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
import { connectDB } from "@/lib/mongodb";
import Team from "@/models/Team";

export async function POST(req) {
  try {
    const body = await req.json();
    await connectDB();
    const team = await Team.create(body);

    return new Response(JSON.stringify(team), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error creating team:", err);
    return new Response(JSON.stringify({ error: "Failed to create team" }), {
      status: 500,
    });
  }
}
