"use client";

import { useEffect, useState } from "react";

export default function TeamForm() {
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
        // ✅ initialize form values after data is loaded
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

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const formData = {
  //     headline,
  //     labels,
  //     techstack,
  //     hobbies,
  //     purpose,
  //     teamSize,
  //   };
  //   console.log("Form Data:", formData);
  //   // send to backend
  // };
  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = {
    uid: userData?.uid || "u000",
    headline,
    purpose,
    labels,
    techstack,
    hobbies,
    teamSize,
  };

  try {
    const res = await fetch("/api/findactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await res.json();

    if (res.ok) {
      alert("FindAction created successfully!");
      // reset form
      setHeadline("");
      setLabels([]);
      setTechstack([]);
      setHobbies([]);
      setPurpose("Hackathon");
      setTeamSize("Any");
    } else {
      alert("Error: " + result.error);
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong!");
  }
};


  return (
    <form onSubmit={handleSubmit} className="mt-15 bg-white text-black shadow-md rounded-2xl p-6 max-w-xl mx-auto space-y-6 border border-[#90D1CA]">
      <h2 className="text-xl font-semibold text-[#096B68]">Find a Team</h2>

      {/* Headline */}
      <div>
        <label className="block text-sm font-medium text-[#096B68] mb-1">Headline</label>
        <input
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="e.g. AI Enthusiast looking for a Hackathon team"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#129990]"
        />
      </div>

      {/* Labels */}
      <div>
        <label className="block text-sm font-medium text-[#096B68] mb-1">Labels</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {labels.map((label, i) => (
            <span key={i} className="px-3 py-1 text-sm bg-[#90D1CA] text-[#096B68] rounded-full flex items-center gap-1">
              {label}
              <button type="button" onClick={() => handleRemoveItem(setLabels, labels, i)} className="text-red-500 font-bold">
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
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#129990]"
        />
      </div>

      {/* Purpose */}
      <div>
        <label className="block text-sm font-medium text-[#096B68] mb-1">Purpose</label>
        <select
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#129990]"
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
        <label className="block text-sm font-medium text-[#096B68] mb-1">Hobbies</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {hobbies.map((hobby, i) => (
            <span key={i} className="px-3 py-1 text-sm bg-[#FFE5A0] text-[#096B68] rounded-full flex items-center gap-1">
              {hobby}
              <button type="button" onClick={() => handleRemoveItem(setHobbies, hobbies, i)} className="text-red-500 font-bold">
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
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#129990]"
        />
      </div>

      {/* Team Size */}
      <div>
        <label className="block text-sm font-medium text-[#096B68] mb-1">Team Size</label>
        <select
          value={teamSize}
          onChange={(e) => setTeamSize(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#129990]"
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
      <button type="submit" className="w-full bg-[#129990] text-white font-medium py-2 px-4 rounded-xl hover:bg-[#096B68] transition">
        Submit
      </button>
    </form>
  );
}
