"use client";

import React, { useState, useEffect, useMemo } from "react";

/**
 * DemoTeamsPage — /create route
 * Expects public/firestore-users.json or similar shape.
 */
export default function DemoTeamsPage() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [rawUsers, setRawUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // optional synonyms to normalize common abbreviations
  const SYNONYMS = useMemo(
    () => ({ js: "javascript", "reactjs": "react", "nodejs": "node" }),
    []
  );

  // --- load the JSON from /public/firestore-users.json
  useEffect(() => {
    fetch("/users.json")
      .then((res) => res.json())
      .then((data) => {
        // normalize incoming JSON to array of { id, name, skills: [] }
        const arr = (data.users || data).map((u, idx) => {
          const id =
            u.fields?.uid ?? u.uid ?? u.id ?? `u${idx}`; // tolerant id
          const name = u.fields?.name ?? u.name ?? `User ${idx}`;
          // accept either fields.skills (array) or skills array
          const skills = (u.fields?.skills ?? u.skills ?? [])
            .map((s) => normalizeSkill(s, SYNONYMS))
            .filter(Boolean);
          return { id, name, skills };
        });
        setRawUsers(arr);
      })
      .catch((err) => {
        console.error("Failed to load users JSON:", err);
        setRawUsers([]);
      })
      .finally(() => setLoadingUsers(false));
  }, [SYNONYMS]);

  // --- Build vocabulary from users' skills
  const vocab = useMemo(() => {
    const set = new Set();
    rawUsers.forEach((u) => u.skills.forEach((s) => set.add(s)));
    return Array.from(set); // stable array of skill tokens
  }, [rawUsers]);

  // skill -> index map for fast lookup
  const vocabIndex = useMemo(() => {
    const m = {};
    vocab.forEach((s, i) => (m[s] = i));
    return m;
  }, [vocab]);

  // --- Vectorize users into Float32Array and precompute norms
  const { userVectors, userNorms } = useMemo(() => {
    const vectors = [];
    const norms = [];

    for (let u of rawUsers) {
      const vec = new Float32Array(vocab.length);
      for (let sk of u.skills) {
        const idx = vocabIndex[sk];
        if (idx !== undefined) vec[idx] += 1; // count-based
      }
      // compute L2 norm
      let s = 0;
      for (let i = 0; i < vec.length; i++) s += vec[i] * vec[i];
      const norm = Math.sqrt(s);
      vectors.push(vec);
      norms.push(norm);
    }

    return { userVectors: vectors, userNorms: norms };
  }, [rawUsers, vocabIndex, vocab.length]);

  // --- Create team (keeps members as user ids)
  const createTeam = (name, desc, reqs) => {
    const newTeam = {
      id: Date.now().toString(),
      name,
      description: desc,
      requirements: reqs, // array of normalized skills (strings)
      members: ["u000"], // demo user id
    };
    setTeams((t) => [...t, newTeam]);
    setSelectedTeam(newTeam);
  };

  // --- Suggest users using cosine similarity
  const suggestUsers = (team, topK = 10) => {
    if (!team || !team.requirements || !Array.isArray(team.requirements)) return [];

    // convert team requirements -> indices (only ones in vocab)
    const teamIndices = team.requirements
      .map((s) => normalizeSkill(s, SYNONYMS))
      .map((s) => vocabIndex[s])
      .filter((idx) => idx !== undefined);

    if (teamIndices.length === 0) return [];

    // compute team norm (binary counts here, but supports counts if duplicates present)
    let teamSumSquares = 0;
    // for binary weighting each index contributes 1^2
    teamIndices.forEach((idx) => (teamSumSquares += 1));
    const teamNorm = Math.sqrt(teamSumSquares);

    const results = [];

    for (let i = 0; i < rawUsers.length; i++) {
      const uid = rawUsers[i].id;
      if (team.members.includes(uid)) continue; // skip existing members

      // efficient dot product: iterate only over teamIndices
      let dot = 0;
      const vec = userVectors[i];
      for (let idx of teamIndices) {
        dot += vec[idx] || 0;
      }

      const denom = userNorms[i] * teamNorm;
      const score = denom > 0 ? dot / denom : 0; // cosine sim

      if (score > 0) {
        results.push({
          user: rawUsers[i],
          score,
        });
      }
    }

    // sort descending and return top K
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
  };

  // --- UI components (CreateTeamForm + SuggestedUsers)
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Team (Cosine similarity demo)</h1>

      {loadingUsers && <p>Loading users…</p>}

      {!selectedTeam && <CreateTeamForm onCreate={createTeam} />}

      {selectedTeam && (
        <div>
          <h2 className="font-bold text-xl">{selectedTeam.name}</h2>
          <p className="mb-4">{selectedTeam.description}</p>
          <SuggestedUsers team={selectedTeam} suggestUsers={suggestUsers} />
          <div className="mt-6">
            <button
              className="px-3 py-1 bg-gray-200 rounded"
              onClick={() => setSelectedTeam(null)}
            >
              Create another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- helper components ---------------- */

function CreateTeamForm({ onCreate }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [reqs, setReqs] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    const reqsArr = reqs
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    onCreate(name.trim(), desc.trim(), reqsArr);
  };

  return (
    <div className="p-4 border rounded bg-white shadow max-w-xl">
      <h3 className="font-bold mb-2">Create Team</h3>
      <input
        className="border p-2 mb-2 w-full"
        placeholder="Team Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        className="border p-2 mb-2 w-full"
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <input
        className="border p-2 mb-2 w-full"
        placeholder="Required Skills (comma separated)"
        value={reqs}
        onChange={(e) => setReqs(e.target.value)}
      />
      <button
        className="bg-emerald-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        Create
      </button>
    </div>
  );
}

function SuggestedUsers({ team, suggestUsers }) {
  const matches = suggestUsers(team, 12);

  if (!matches.length) return <p className="mt-4">No matches found yet.</p>;

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Suggested Users</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {matches.map(({ user, score }) => (
          <div key={user.id} className="border p-3 rounded shadow bg-white">
            <h4 className="font-medium">{user.name}</h4>
            <p className="text-sm text-gray-600">{user.skills.join(", ")}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-gray-500">score: {score.toFixed(3)}</span>
              <button className="text-sm px-2 py-1 bg-sky-600 text-white rounded">Invite</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- utilities ---------------- */

function normalizeSkill(s, synonyms = {}) {
  if (!s) return "";
  const t = String(s).toLowerCase().trim();
  return synonyms[t] ?? t;
}
