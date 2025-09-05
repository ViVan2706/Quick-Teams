import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "teamHistory.json");

// Helper to read/write JSON
function readData() {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const data = readData();
  const items = data.teamRequirements
    .filter((item) => item.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return NextResponse.json(items);
}

export async function POST(req) {
  const body = await req.json();
  const { userId, title, description = "", skills = [] } = body;

  if (!userId || !title) {
    return NextResponse.json(
      { error: "userId and title are required" },
      { status: 400 }
    );
  }

  const data = readData();

  const newItem = {
    id: Date.now().toString(),
    userId,
    title,
    description,
    skills,
    createdAt: new Date().toISOString()
  };

  data.teamRequirements.push(newItem);
  writeData(data);

  return NextResponse.json(newItem, { status: 201 });
}

// import { NextResponse } from "next/server";
// import { connectToDB } from "../lib/mongoose";
// import {TeamRequirement} from "../models/TeamRequirement";

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const userId = searchParams.get("userId"); // "demo"

//   if (!userId) {
//     return NextResponse.json({ error: "Missing userId" }, { status: 400 });
//   }

//   await connectToDB();
//   const items = await TeamRequirement.find({ userId })
//     .sort({ createdAt: -1 })
//     .lean();

//   return NextResponse.json(items);
// }

// export async function POST(req) {
//   const body = await req.json();
//   const { userId, title, description = "", skills = [] } = body;

//   if (!userId || !title) {
//     return NextResponse.json(
//       { error: "userId and title are required" },
//       { status: 400 }
//     );
//   }

//   await connectToDB();
//   const doc = await new TeamRequirement({
//     userId,
//     title,
//     description,
//     skills,
//   }).save();

//   return NextResponse.json(doc, { status: 201 });
// }
