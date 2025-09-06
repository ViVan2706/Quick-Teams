// import { NextResponse } from "next/server";
// import mongoose from "mongoose";

// /* --- Connect to MongoDB --- */
// const MONGODB_URI = "mongodb://localhost:27017/Quickteams";

// // Reuse connection if already open
// if (mongoose.connection.readyState === 0) {
//   mongoose.connect(MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
// }

// /* --- Define Schema & Model --- */
// const findActionSchema = new mongoose.Schema({
//   facid: { type: String, required: true, unique: true },
//   uid: { type: String, required: true, default: "u000" },
//   purpose: { type: String, required: true },
//   status: { type: String, default: "not joined" },
//   created_at: { type: Date, default: Date.now },
// });

// const FindAction =
//   mongoose.models.findactions || mongoose.model("findactions", findActionSchema);

// /* --- GET all findactions --- */
// export async function GET() {
//   try {
//     const actions = await FindAction.find({});
//     return NextResponse.json(actions);
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// /* --- POST (create new findaction) --- */
// export async function POST(req) {
//   try {
//     const body = await req.json();

//     // generate unique facid
//     const facid = "f" + Math.floor(Math.random() * 1000000);

//     const newAction = await FindAction.create({
//       facid,
//       uid: body.uid || "u000",
//       purpose: body.purpose,
      
//       status: "not joined",
//       created_at: new Date(),
//     });

//     return NextResponse.json(newAction, { status: 201 });
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
import { promises as fs } from "fs";
import path from "path";

export async function POST(req) {
  try {
    const body = await req.json();

    // Load existing findactions.json
    const filePath = path.join(process.cwd(), "public", "findactions.json");
    const data = JSON.parse(await fs.readFile(filePath, "utf-8"));

    // Add new find action
    const newFindAction = {
      facid: body.facid,
      uid: body.uid,
      purpose: body.purpose,
      status: body.status || "not joined",
      title: body.title || body.headline || "Looking for Team",
    };
    
    data.findActions.push(newFindAction);

    // Save file back
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    return new Response(JSON.stringify(newFindAction), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}