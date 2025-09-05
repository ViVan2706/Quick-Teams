import { Schema, model, models } from "mongoose";

const TeamRequirementSchema = new Schema(
  {
    userId: { type: String, required: true, index: true }, // "demo" for now
    title: { type: String, required: true },
    description: { type: String, default: "" },
    skills: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["pending", "matched", "closed"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true } // adds createdAt, updatedAt
);

export default models.TeamRequirement ||
  model("TeamRequirement", TeamRequirementSchema);
