import { NextResponse } from "next/server";
import mongoose from "mongoose";

/* --- Connect to MongoDB --- */
const MONGODB_URI = "mongodb://localhost:27017/Quickteams";

// Reuse connection if already open
if (mongoose.connection.readyState === 0) {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

/* --- Define Schema & Model --- */
const findActionSchema = new mongoose.Schema({
  facid: { type: String, required: true, unique: true },
  uid: { type: String, required: true, default: "u000" },
  purpose: { type: String, required: true },
  status: { type: String, default: "not joined" },
  created_at: { type: Date, default: Date.now },
});

const FindAction =
  mongoose.models.findactions || mongoose.model("findactions", findActionSchema);

/* --- GET all findactions --- */
export async function GET() {
  try {
    const actions = await FindAction.find({});
    return NextResponse.json(actions);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* --- POST (create new findaction) --- */
export async function POST(req) {
  try {
    const body = await req.json();

    // generate unique facid
    const facid = "f" + Math.floor(Math.random() * 1000000);

    const newAction = await FindAction.create({
      facid,
      uid: body.uid || "u000",
      purpose: body.purpose,
      
      status: "not joined",
      created_at: new Date(),
    });

    return NextResponse.json(newAction, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
