"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export default function CreateTeamForm() {
  const [formData, setFormData] = useState({
    teamName: "",
    purpose: "",
    description: "",
    timeline: "",
    maxSize: "",
    skills: [],
    skillInput: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto mt-6 bg-white shadow-lg rounded-xl p-8 border border-[#90D1CA]"
    >
      <h1 className="text-3xl font-bold text-center text-[#129990]">
        Create Your Dream Team
      </h1>
      <p className="text-center text-[#096B68] mb-8">
        Build something amazing with like-minded collaborators
      </p>

      <div className="space-y-6">
        {/* Team Name */}
        <div>
          <label className="block text-[#096B68] font-semibold mb-1">
            Team Name *
          </label>
          <input
            type="text"
            name="teamName"
            value={formData.teamName}
            onChange={handleChange}
            placeholder="e.g., Smart City Solutions, AI Research Team..."
            className="w-full px-4 py-2 rounded-lg border border-[#90D1CA] bg-[#FFFBDE] text-black focus:outline-none focus:ring-2 focus:ring-[#129990]"
            required
          />
        </div>

        {/* Team Purpose */}
        <div>
          <label className="block text-[#096B68] font-semibold mb-1">
            Team Purpose *
          </label>
          <input
            type="text"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            placeholder="e.g., SIH 2024, Startup, Research Project..."
            className="w-full px-4 py-2 rounded-lg border border-[#90D1CA] bg-[#FFFBDE] text-black focus:outline-none focus:ring-2 focus:ring-[#129990]"
            required
          />
        </div>

        {/* Team Description */}
        <div>
          <label className="block text-[#096B68] font-semibold mb-1">
            Team Description *
          </label>
          <textarea
            rows="4"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your project, goals..."
            className="w-full px-4 py-2 rounded-lg border border-[#90D1CA] bg-[#FFFBDE] text-black focus:outline-none focus:ring-2 focus:ring-[#129990]"
            required
          />
        </div>

        {/* Timeline & Max Team Size */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#096B68] font-semibold mb-1">
              Timeline
            </label>
            <input
              type="text"
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              placeholder="e.g., 3 months, 1 year..."
              className="w-full px-4 py-2 rounded-lg border border-[#90D1CA] bg-[#FFFBDE] text-black focus:outline-none focus:ring-2 focus:ring-[#129990]"
            />
          </div>
          <div>
            <label className="block text-[#096B68] font-semibold mb-1">
              Max Team Size
            </label>
            <input
              type="number"
              name="maxSize"
              value={formData.maxSize}
              onChange={handleChange}
              placeholder="e.g., 6"
              className="w-full px-4 py-2 rounded-lg border border-[#90D1CA] bg-[#FFFBDE] text-black focus:outline-none focus:ring-2 focus:ring-[#129990]"
            />
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-[#096B68] font-semibold mb-1">
            Skills/People Required *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="skillInput"
              value={formData.skillInput}
              onChange={handleChange}
              placeholder="Add required skills..."
              className="flex-1 px-4 py-2 rounded-lg border border-[#90D1CA] bg-[#FFFBDE] text-black focus:outline-none focus:ring-2 focus:ring-[#129990]"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="p-2 bg-[#129990] hover:bg-[#096B68] text-white rounded-lg transition"
            >
              <Plus size={18} />
            </button>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-[#90D1CA] text-[#096B68] rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-[#90D1CA] to-[#129990] text-white font-semibold rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Create Team
        </button>
      </div>
    </form>
  );
}
