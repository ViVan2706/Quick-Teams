// models/MatchEngine.js

// simple label compatibility mapping
const labelCompatibility = {
  Role: {
    Innovator: ["Executor", "Analyzer", "Leader"],
    Executor: ["Innovator", "Planner"],
    Leader: ["Supporter", "Communicator"],
    Analyzer: ["Innovator", "Researcher"],
    Supporter: ["Leader", "Collaborator"],
  },
  Skills: {
    Technical: ["Creative", "Researcher"],
    Creative: ["Technical", "Planner"],
    Researcher: ["Analyzer", "Technical"],
  },
  WorkStyle: {
    Planner: ["Improviser", "Big-picture thinker"],
    Improviser: ["Planner", "Detail-oriented"],
    "Big-picture thinker": ["Detail-oriented", "Planner"],
    "Detail-oriented": ["Big-picture thinker"],
  },
  Motivation: {
    Achiever: ["Learner", "Impact-driven"],
    "Impact-driven": ["Achiever", "Collaborator"],
    Learner: ["Achiever", "Researcher"],
    "Career-focused": ["Achiever", "Planner"],
    Collaborator: ["Leader", "Supporter"],
  },
};

// cosine similarity helper
function cosineSimilarity(arr1, arr2) {
  const set1 = new Set(arr1.map(v => v.toLowerCase()));
  const set2 = new Set(arr2.map(v => v.toLowerCase()));
  const intersection = [...set1].filter(v => set2.has(v)).length;
  return intersection / Math.sqrt(set1.size * set2.size || 1);
}

// label compatibility score
function labelScore(userLabels, actionCreatorLabels) {
  let score = 0,
    total = 0;

  for (const category in userLabels) {
    const uVals = Array.isArray(userLabels[category])
      ? userLabels[category]
      : [userLabels[category]];

    const aVals = Array.isArray(actionCreatorLabels[category])
      ? actionCreatorLabels[category]
      : [actionCreatorLabels[category]];

    uVals.forEach(u => {
      total++;
      aVals.forEach(a => {
        if (labelCompatibility[category]?.[a]?.includes(u)) {
          score++;
        }
      });
    });
  }
  return total > 0 ? score / total : 0;
}

// main matcher (fetch JSON instead of fs)
export async function MatchUsers(action) {
  const usersRes = await fetch("/users.json");
  const usersData = await usersRes.json();
  const users = usersData.users;

  // get action creator
  const creator = users.find(u => u.user_id === action.user_id);

  const results = users
    .filter(
      u =>
        u.user_id !== action.user_id &&
        !action.user_joined.includes(u.user_id)
    )
    .map(u => {
      const techScore = cosineSimilarity(u.techstack, action.skill_req);
      const hobbyScore = cosineSimilarity(u.hobbies, creator?.hobbies || []);
      const labelCompatibilityScore = labelScore(
        u.labels,
        creator?.labels || {}
      );

      const finalScore =
        techScore * 0.5 + hobbyScore * 0.2 + labelCompatibilityScore * 0.3;

      return {
        ...u, // ✅ full user data
        score: (finalScore * 100).toFixed(2) + "%",
        commonSkills: u.techstack.filter(t =>
          action.skill_req.some(
            req => req.toLowerCase() === t.toLowerCase()
          )
        ),
        commonHobbies: u.hobbies.filter(h =>
          (creator?.hobbies || []).some(
            ch => ch.toLowerCase() === h.toLowerCase()
          )
        ),
        matchedLabels: labelCompatibilityScore,
      };
    })
    .sort((a, b) => parseFloat(b.score) - parseFloat(a.score));

  return { action_id: action.ac_id, matches: results };
}
