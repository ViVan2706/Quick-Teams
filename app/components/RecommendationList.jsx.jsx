"use client";

import { useMemo } from "react";

function normalizeSkill(s, synonyms = {}) {
  if (!s) return "";
  const t = String(s).toLowerCase().trim();
  return synonyms[t] ?? t;
}

/**
 * useRecommendations
 * 
 * @param {Array} users - [{ id, name, skills: [] }]
 * @param {Object} synonyms - map of synonyms { js: "javascript" }
 * @param {Object} team - team object { requirements: [], members: [] }
 * @param {Number} topK - number of recommendations
 * 
 * @returns {Array} matches - [{ user, score }]
 */
export default function useRecommendations(users, synonyms, team, topK = 10) {
  // --- Build vocab ---
  const vocab = useMemo(() => {
    const set = new Set();
    users.forEach((u) => u.skills.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [users]);

  const vocabIndex = useMemo(() => {
    const m = {};
    vocab.forEach((s, i) => (m[s] = i));
    return m;
  }, [vocab]);

  // --- Precompute user vectors + norms ---
  const { userVectors, userNorms } = useMemo(() => {
    const vectors = [];
    const norms = [];
    for (let u of users) {
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
  }, [users, vocabIndex, vocab.length]);

  // --- Suggestion logic ---
  return useMemo(() => {
    if (!team?.requirements) return [];

    const teamIndices = team.requirements
      .map((s) => normalizeSkill(s, synonyms))
      .map((s) => vocabIndex[s])
      .filter((idx) => idx !== undefined);

    if (!teamIndices.length) return [];

    let teamSumSquares = 0;
    teamIndices.forEach(() => (teamSumSquares += 1));
    const teamNorm = Math.sqrt(teamSumSquares);

    const results = [];
    for (let i = 0; i < users.length; i++) {
      const uid = users[i].id;
      if (team.members?.includes(uid)) continue;

      let dot = 0;
      const vec = userVectors[i];
      for (let idx of teamIndices) dot += vec[idx] || 0;

      const denom = userNorms[i] * teamNorm;
      const score = denom > 0 ? dot / denom : 0;

      if (score > 0) results.push({ user: users[i], score });
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
  }, [team, users, synonyms, vocabIndex, userVectors, userNorms, topK]);
}
