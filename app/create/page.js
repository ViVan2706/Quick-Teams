"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import UserCard from "../components/cards/UserCard";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [rawUsers, setRawUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const SYNONYMS = useMemo(
    () => ({ js: "javascript", reactjs: "react", nodejs: "node" }),
    []
  );

  /* ---------------- Load Users ---------------- */
  useEffect(() => {
    fetch("/users.json")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.users || [];
        const arr = list.map((u, idx) => normalizeUser(u, idx, SYNONYMS));
        setRawUsers(arr);
      })
      .catch((err) => {
        console.error("Failed to load users JSON:", err);
        setRawUsers([]);
      })
      .finally(() => setLoadingUsers(false));
  }, [SYNONYMS]);

  /* ---------------- Build vocab ---------------- */
  const vocab = useMemo(() => {
    const set = new Set();
    rawUsers.forEach((u) => u.skills.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [rawUsers]);

  const vocabIndex = useMemo(() => {
    const m = {};
    vocab.forEach((s, i) => (m[s] = i));
    return m;
  }, [vocab]);

  /* ---------------- Vectorize users ---------------- */
  const { userVectors, userNorms } = useMemo(() => {
    const vectors = [];
    const norms = [];
    for (let u of rawUsers) {
      const vec = new Float32Array(vocab.length);
      for (let sk of u.skills) {
        const idx = vocabIndex[sk];
        if (idx !== undefined) vec[idx] += 1;
      }
      let s = 0;
      for (let i = 0; i < vec.length; i++) s += vec[i] * vec[i];
      const norm = Math.sqrt(s);
      vectors.push(vec);
      norms.push(norm);
    }
    return { userVectors: vectors, userNorms: norms };
  }, [rawUsers, vocabIndex, vocab.length]);

  /* ---------------- Create team ---------------- */
  const createTeam = (formData) => {
    const newTeam = {
      id: Date.now().toString(),
      ...formData,
      requirements: formData.skills.map((s) => normalizeSkill(s, SYNONYMS)),
      members: ["u000"], // current user placeholder
    };
    setTeams((t) => [...t, newTeam]);
    setSelectedTeam(newTeam);
  };

  /* ---------------- Suggest users ---------------- */
  const suggestUsers = (team, topK = 8) => {
    if (!team || !team.requirements) return [];

    const teamIndices = team.requirements
      .map((s) => vocabIndex[s])
      .filter((idx) => idx !== undefined);

    if (!teamIndices.length) return [];

    const teamNorm = Math.sqrt(teamIndices.length);
    const results = [];

    for (let i = 0; i < rawUsers.length; i++) {
      const uid = rawUsers[i].id;
      if (team.members.includes(uid)) continue;

      let dot = 0;
      const vec = userVectors[i];
      for (let idx of teamIndices) dot += vec[idx] || 0;

      const denom = userNorms[i] * teamNorm;
      const score = denom > 0 ? dot / denom : 0;

      if (score > 0) {
        results.push({ user: rawUsers[i], score });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFBDE] p-8">
      {loadingUsers && <p>Loading users…</p>}

      {!selectedTeam && <CreateTeamForm onCreate={createTeam} />}

      {selectedTeam && (
        <div className="flex-1 max-w-5xl mx-auto w-full mt-8">
          <h2 className="text-2xl font-bold text-[#096B68]">
            {selectedTeam.teamName}
          </h2>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Purpose:</span>{" "}
            {selectedTeam.purpose}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Timeline:</span>{" "}
            {selectedTeam.timeline || "Not specified"}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Max Size:</span>{" "}
            {selectedTeam.maxSize || "Not specified"}
          </p>
          <p className="text-gray-700 mb-4">{selectedTeam.description}</p>

          <SuggestedUsers team={selectedTeam} suggestUsers={suggestUsers} />

          <button
            className="mt-6 px-4 py-2 bg-gray-200 rounded-lg"
            onClick={() => setSelectedTeam(null)}
          >
            Create Another
          </button>
        </div>
      )}
    </div>
  );
}

/* -------------------- UI CreateTeamForm -------------------- */
function CreateTeamForm({ onCreate }) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
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
        <input
          type="text"
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          placeholder="Hackathon, Startup, Research Project..."
          className="w-full px-4 py-2 rounded-lg border border-[#90D1CA] bg-[#FFFBDE] text-black"
          required
        />
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
            name="maxSize"
            value={formData.maxSize}
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

      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-[#90D1CA] to-[#129990] text-white font-semibold rounded-lg"
      >
        Create Team
      </button>
    </form>
  );
}

/* ---------------- Suggested Users ---------------- */
function SuggestedUsers({ team, suggestUsers, onReject }) {
  const matches = suggestUsers(team, 8);

  if (!matches.length)
    return <p className="mt-4 text-gray-600">No matches found yet.</p>;

  return (
    <div className="mt-6">
      <h3 className="font-semibold text-lg mb-3">Suggested Members</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {matches.map(({ user }, index) => (
          <UserCard
            key={user.id}
            name={user.name}
            profile={user.profile}
            bio={user.bio}
            techstack={user.skills}
            onReject={() => onReject && onReject(index)}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------- Utils ---------------- */
function normalizeSkill(s, synonyms = {}) {
  if (!s) return "";
  const t = String(s).toLowerCase().trim();
  return synonyms[t] ?? t;
}

function normalizeUser(u, idx, SYNONYMS = {}) {
  const s = u.fields ?? u;
  const id = s.uid ?? s.id ?? `u${idx}`;
  const name = s.name ?? `User ${idx}`;
  const email = s.email ?? null;
  const role = s.role ?? null;
  const gender = s.gender ?? null;
  const bio = s.bio ?? "";
  const profile =
    s.profile ?? `https://i.pravatar.cc/150?img=${(idx % 70) + 1}`;

  const rawSkills = s.skills ?? s.techstack ?? [];
  const skillsArr = (Array.isArray(rawSkills)
    ? rawSkills
    : String(rawSkills).split(",")
  )
    .map((x) => normalizeSkill(x, SYNONYMS))
    .filter(Boolean);

  return {
    id,
    name,
    email,
    role,
    gender,
    bio,
    profile,
    skills: skillsArr,
    techstack: skillsArr,
  };
}
