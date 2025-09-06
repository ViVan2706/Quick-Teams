import Groq from "groq-sdk";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

dotenv.config(); // loads .env.local at project root

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const body = await req.json();
    const answers = body.answers || [];

    // Build dynamic prompt
    const prompt = `
You are a label generator.
Assign exactly 3 labels to the user.
Each label must be picked from these lists ONLY:

🔹 Role Orientation: Leader, Supporter, Executor, Innovator, Analyzer, Communicator
🔹 Skill Orientation: Technical, Creative, Managerial, Researcher, Finance/Business, Operations
🔹 Work Style: Planner, Improviser, Detail-oriented, Big-picture thinker, Risk-taker, Safe-player
🔹 Motivations: Learner, Achiever, Collaborator, Impact-driven, Career-focused

⚠ IMPORTANT: Respond ONLY in strict JSON format with no explanation text.
Example:
{ "labels": ["Leader", "Technical", "Planner"] }

Based on the following quiz answers, assign the labels:
${answers
  .map((a, i) => `question_${i + 1}: ${a?.answer || ""}`)
  .join("\n")}
    `;

    // Call Groq
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    });

    const responseText = completion.choices[0]?.message?.content?.trim() || "";

    let labels = [];
    try {
      labels = JSON.parse(responseText).labels || [];
    } catch (err) {
      console.error("❌ Failed to parse labels:", responseText);
      throw new Error("Groq returned invalid JSON");
    }

    // Keep only 3 labels
    labels = labels.slice(0, 3);

    // Read profile
    const filePath = path.join(process.cwd(), "public", "userdata.json");
    const profile = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Update labels
    profile.labels = labels;

    // Save profile
    fs.writeFileSync(filePath, JSON.stringify(profile, null, 2), "utf-8");

    return NextResponse.json({ success: true, labels });
  } catch (error) {
    console.error("Error generating labels:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
