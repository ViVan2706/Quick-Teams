"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TeamsPage() {
  const [formData, setFormData] = useState({
    teamName: "",
    purpose: "",
    description: "",
    timeline: "",
    team_size: "",
    skills: [],
    skillInput: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (formData.skillInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, prev.skillInput.trim()],
        skillInput: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Generate new action id
    const newId = "a" + Math.floor(Math.random() * 10000);

    // Construct new action object in correct format
    const newAction = {
      ac_id: newId,
      user_id: "u101", // TODO: replace with actual logged-in user
      team_name: formData.teamName,
      team_purpose: formData.purpose,
      description: formData.description,
      team_size: Number(formData.team_size || 0),
      skill_req: formData.skills,
      user_joined: [],
      status: "pending",
      created_at: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAction),
      });

      if (res.ok) {
        router.push(`/create/results?action_id=${newId}`);
      } else {
        console.error("Failed to create action:", await res.text());
      }
    } catch (err) {
      console.error("Error while creating team:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFBDE] p-8 mt-10">
      <form
        onSubmit={handleSubmit}
        className="flex-1 max-w-4xl mx-auto w-full bg-white shadow-lg rounded-xl p-8 border border-[#90D1CA]"
      >
        <h2 className="text-2xl font-bold text-[#129990] mb-4">Team Details</h2>

        {/* Team Name */}
        <div className="mb-4">
          <label className="block text-[#096B68] font-semibold mb-1">
            Team Name *
          </label>
          <input
            type="text"
            name="teamName"
            value={formData.teamName}
            onChange={handleChange}
            placeholder="Smart City Hackers"
            className="w-full px-4 py-2 rounded-lg border border-[#90D1CA] bg-[#FFFBDE] text-black"
            required
          />
        </div>

        {/* Purpose */}
        <div className="mb-4">
          <label className="block text-[#096B68] font-semibold mb-1">
            Team Purpose *
          </label>
          <select
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-[#90D1CA] bg-[#FFFBDE] text-black focus:outline-none focus:ring-2 focus:ring-[#129990]"
            required
          >
            <option value="" disabled>
              Select a purpose
            </option>
            <option value="College/School Project">College/School Project</option>
            <option value="Startup / Entrepreneurship">Startup / Entrepreneurship</option>
            <option value="Research / Innovation">Research / Innovation</option>
            <option value="Sports / E-sports">Sports / E-sports</option>
            <option value="Volunteer / NGO Work">Volunteer / NGO Work</option>
            <option value="Creative Collaboration">Creative Collaboration</option>
            <option value="Community / Club Activity">Community / Club Activity</option>
            <option value="Workshop / Training">Workshop / Training</option>
            <option value="Coding / Algorithm Competition">Coding / Algorithm Competition</option>
            <option value="Art / Music Project">Art / Music Project</option>
            <option value="Event Organization">Event Organization</option>
            <option value="Social Campaign / Awareness Drive">Social Campaign / Awareness Drive</option>
            <option value="Product / Prototype Development">Product / Prototype Development</option>
          </select>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-[#096B68] font-semibold mb-1">
            Description *
          </label>
          <textarea
            rows="4"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your project, goals..."
            className="w-full px-4 py-2 rounded-lg border border-[#90D1CA] bg-[#FFFBDE] text-black"
            required
          />
        </div>

        {/* Timeline + Max Size */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[#096B68] font-semibold mb-1">
              Timeline
            </label>
            <input
              type="text"
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              placeholder="3 months, 1 year..."
              className="w-full px-4 py-2 rounded-lg border border-[#90D1CA] bg-[#FFFBDE] text-black"
            />
          </div>
          <div>
            <label className="block text-[#096B68] font-semibold mb-1">
              Max Team Size
            </label>
            <input
              type="number"
              name="team_size"
              value={formData.team_size}
              onChange={handleChange}
              placeholder="6"
              className="w-full px-4 py-2 rounded-lg border border-[#90D1CA] bg-[#FFFBDE] text-black"
            />
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <label className="block text-[#096B68] font-semibold mb-1">
            Skills Required *
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              name="skillInput"
              value={formData.skillInput}
              onChange={handleChange}
              placeholder="React, Node, AI..."
              className="flex-1 px-4 py-2 rounded-lg border border-[#90D1CA] bg-[#FFFBDE] text-black"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="p-2 bg-[#129990] text-white rounded-lg"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Display Added Skills */}
          <div className="flex gap-2 mt-2 flex-wrap">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="flex items-center gap-1 px-3 py-1 bg-[#90D1CA] text-[#096B68] rounded-full text-sm font-medium"
              >
                {skill}
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      skills: prev.skills.filter((_, i) => i !== index),
                    }))
                  }
                  className="text-[#129990] hover:text-black font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-[#90D1CA] to-[#129990] text-white font-semibold rounded-lg"
        >
          Create Team
        </button>
      </form>
    </div>
  );
}
