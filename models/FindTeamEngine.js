// models/FindTeamEngine.js

// Main simple FindTeamEngine function
export async function FindTeamEngine(findAction) {
  // Fetch all actions
  const res = await fetch("/actions.json");
  const data = await res.json();
  const actions = data.actions;

  console.log("Finteamengine, actions : ",actions);

  // Fetch all users
  const usersRes = await fetch("/users.json");
  const usersData = await usersRes.json();
  const users = usersData.users;
  console.log("Finteamengine, users : ",users);

  // Filter actions that are joinable and not created by the findAction user
  const potentialActions = actions.filter(
    a =>
      a.status === "pending" &&
      a.user_id !== findAction.uid // exclude actions created by this user
  );
  console.log("Finteamengine, potential actions : ",potentialActions);
  // Map potential actions to a simpler structure
  const results = potentialActions.map(action => {
    const creator = users.find(u => u.user_id === action.user_id);
    const participants = users.filter(u => action.user_joined.includes(u.user_id));

    return {
      action_id: action.ac_id,
      team_name: action.team_name,
      skill_req: action.skill_req,
      team_purpose: action.team_purpose,
      description: action.description,
      maxMembers: action.team_size,
      participants: participants.map(p => ({ name: p.name, profile: p.profile })),
      creator: creator ? { name: creator.name, profile: creator.profile } : null,
    };
  });
  console.log("Finteamengine, Results : ",results);
    // Optional: filter further by purpose if needed
    // Prioritize purpose-matching teams first, then add the rest
  const filteredResults = results.filter(r =>
    r.team_purpose.toLowerCase().includes(findAction.purpose.toLowerCase())
  );

  const nonFilteredResults = results.filter(
    r => !r.team_purpose.toLowerCase().includes(findAction.purpose.toLowerCase())
  );

  // Merge them: filtered first, then non-filtered
  const finalResults = [...filteredResults, ...nonFilteredResults];

  return finalResults;

}
