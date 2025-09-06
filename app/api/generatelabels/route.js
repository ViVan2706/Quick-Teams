import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
const groq =new Groq({ apiKey:process.env.GROQ_API_KEY });
const filePath = path.join(process.cwd(), "public", "userdata.json");

export async function POST() {
//   try {
//     if (!process.env.GROQ_API_KEY) {
//       throw new Error("Missing GROQ_API_KEY in environment variables");
//     }

    const raw = fs.readFileSync(filePath, "utf-8");
    const profile = JSON.parse(raw);

    const prompt = `
Based on the following user profile:
Name: ${profile.name}
Bio: ${profile.bio}
Skills: ${profile.skills.join(", ")}
Interests: ${profile.interests.join(", ")}
Experience: ${profile.experience}

Assign exactly 3 labels.
Each label must be picked from these lists ONLY:

🔹 Role Orientation: Leader, Supporter, Executor, Innovator, Analyzer, Communicator
🔹 Skill Orientation: Technical, Creative, Managerial, Researcher, Finance/Business, Operations
🔹 Work Style: Planner, Improviser, Detail-oriented, Big-picture thinker, Risk-taker, Safe-player
🔹 Motivations: Learner, Achiever, Collaborator, Impact-driven, Career-focused

⚠ IMPORTANT: Respond ONLY in strict JSON format with no explanation text.
Example:
{ "labels": ["Leader", "Technical", "Planner"] }
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates labels." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const responseText = completion.choices[0].message.content;

    let labels = [];
    try {
      labels = JSON.parse(responseText).labels || [];
    } catch (err) {
      console.error("Failed to parse labels:", responseText);
      throw new Error("Groq returned invalid JSON");
    }

   labels = labels.slice(0, 3);
profile.labels = labels;
fs.writeFileSync(filePath, JSON.stringify(profile, null, 2), "utf-8");

return NextResponse.json({ success: true, labels });
} 
// catch (err) {
//   console.error("Error updating labels:", err);
//   return NextResponse.json(
//     { success: false, error: err.message },
//     { status: 500 }
//   );
// }