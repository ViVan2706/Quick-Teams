"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [userData, setUserData] = useState(null);

  // Form states
  const [headline, setHeadline] = useState("");
  const [labels, setLabels] = useState([]);
  const [techstack, setTechstack] = useState([]);
  const [hobbies, setHobbies] = useState([]);
  const [purpose, setPurpose] = useState("Hackathon");
  const [teamSize, setTeamSize] = useState("Any");

  useEffect(() => {
    fetch("/users.json")
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
        setLabels(data.labels || []);
        setTechstack(data.techstack || []);
        setHobbies(data.hobbies || []);
      })
      .catch((err) => console.error("Error loading user data:", err));
  }, []);

  if (!userData) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  const handleAddItem = (setter, list, value) => {
    if (value && !list.includes(value)) {
      setter([...list, value]);
    }
  };

  const handleRemoveItem = (setter, list, index) => {
    const updated = [...list];
    updated.splice(index, 1);
    setter(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      headline,
      labels,
      techstack,
      hobbies,
      purpose,
      teamSize,
    };
    console.log("Form Data:", formData);
    // send to backend here
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffde7] p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-[#fffff0] text-black shadow-md rounded-2xl p-6 max-w-xl w-full border border-[#90D1CA] space-y-6"
      >
        <h2 className="text-2xl font-bold text-[#00796B]">Find a Team</h2>

        {/* Headline */}
        <div>
          <label className="block text-gray-700 mb-1">Headline</label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="e.g. AI Enthusiast looking for a Hackathon team"
            className="w-full border border-gray-300 rounded-md p-2 bg-[#FFFBDE]"
          />
        </div>

        {/* Labels */}
        <div>
          <label className="block text-gray-700 mb-1">Labels</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {labels.map((label, i) => (
              <span
                key={i}
                className="px-3 py-1 text-sm bg-[#FFFBDE] text-[#096B68] rounded-full flex items-center gap-1 "
              >
                {label}
                <button
                  type="button"
                  onClick={() => handleRemoveItem(setLabels, labels, i)}
                  className="text-red-500 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add a label..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddItem(setLabels, labels, e.target.value);
                e.target.value = "";
              }
            }}
            className="w-full border border-gray-300 rounded-md p-2 bg-[#FFFBDE]"
          />
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-gray-700 mb-1">Purpose</label>
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 bg-[#FFFBDE]"
          >
            <option value="Hackathon">Hackathon</option>
            <option value="College Project">College/School Project</option>
            <option value="Startup">Startup / Entrepreneurship</option>
            <option value="Research Project">Research / Innovation</option>
            <option value="Sports Tournament">Sports / E-sports</option>
            <option value="Volunteer Work">Volunteer / NGO Work</option>
            <option value="Creative Collaboration">Creative Collaboration</option>
            <option value="Community Activity">Community / Club Activity</option>
            <option value="Workshop / Training">Workshop / Training</option>
            <option value="Coding Competition">Coding / Algorithm Competition</option>
            <option value="Art / Music Project">Art / Music Project</option>
            <option value="Event Organization">Event Organization</option>
            <option value="Social Campaign">Social Campaign / Awareness Drive</option>
            <option value="Product Development">Product / Prototype Development</option>
          </select>
        </div>

        {/* Hobbies */}
        <div>
          <label className="block text-gray-700 mb-1 ">Hobbies</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {hobbies.map((hobby, i) => (
              <span
                key={i}
                className="px-3 py-1 text-sm bg-[#FFFBDE] text-[#096B68] rounded-full flex items-center gap-1"
              >
                {hobby}
                <button
                  type="button"
                  onClick={() => handleRemoveItem(setHobbies, hobbies, i)}
                  className="text-red-500 font-bold bg-[#FFFBDE]"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add a hobby..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddItem(setHobbies, hobbies, e.target.value);
                e.target.value = "";
              }
            }}
            className="w-full border border-gray-300 rounded-md p-2 bg-[#FFFBDE]"
          />
        </div>

        {/* Team Size */}
        <div>
          <label className="block text-gray-700 mb-1">Team Size</label>
          <select
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 bg-[#FFFBDE]" 
          >
            <option value="Any">Any</option>
            {[2, 3, 4, 5, 6, 7, 8].map((size) => (
              <option key={size} value={size}>
                {size} Members
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 mt-4 bg-gradient-to-r from-[#00796B] to-[#4DB6AC] text-white font-semibold rounded-md"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
