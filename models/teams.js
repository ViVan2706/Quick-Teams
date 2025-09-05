import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  team_name: { type: String, required: true },
  team_purpose: { type: String, required: true },
  description: { type: String, required: true },
  team_size: { type: Number, required: true },
  skill_req: { type: [String], default: [] },
  user_joined: { type: [String], default: [] },
  status: { type: String, default: "pending" },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.models.Team || mongoose.model("Team", TeamSchema);
