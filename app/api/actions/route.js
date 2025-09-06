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
// const actionSchema = new mongoose.Schema({
//   user_id: { type: String, required: true },
//   team_name: { type: String, required: true },
//   team_purpose: { type: String, required: true },
//   description: { type: String, required: true },
//   team_size: { type: Number, required: true },
//   skill_req: { type: [String], default: [] },
//   user_joined: { type: [String], default: [] },
//   status: { type: String, default: "pending" },
//   created_at: { type: Date, default: Date.now },
// });

// const Action =
//   mongoose.models.Action || mongoose.model("Action", actionSchema);

// /* --- GET all actions --- */
// export async function GET() {
//   try {
//     const actions = await Action.find({});
//     return NextResponse.json(actions);
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// /* --- POST (create new action) --- */
// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const newAction = await Action.create({
//       ...body,
//       created_at: new Date(),
//       status: "pending",
//     });

//     return NextResponse.json(newAction, { status: 201 });
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
   
//Change local json :
import { promises as fs } from "fs";
import path from "path";

// POST /api/actions
// route.js
export async function POST(req) {
  try {
    const body = await req.json();

    // Load existing actions.json
    const filePath = path.join(process.cwd(), "public", "actions.json");
    const data = JSON.parse(await fs.readFile(filePath, "utf-8"));

    // Add new action with all required fields
    const newAction = {
      ac_id: body.ac_id,
      user_id: body.user_id, // changed from uid to user_id
      team_name: body.team_name,
      team_purpose: body.team_purpose,
      description: body.description,
      team_size: body.team_size,
      skill_req: body.skill_req || [], // ensure this is always an array
      user_joined: body.user_joined || [],
      status: body.status || "pending",
      created_at: body.created_at || new Date().toISOString(),
    };
    
    data.actions.push(newAction);

    // Save file back
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    return new Response(JSON.stringify(newAction), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}