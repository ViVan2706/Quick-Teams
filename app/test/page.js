import { MatchUsers } from "../../models/MatchEngine";

export default async function Page() {
  const action = {
    "ac_id": "a001",
    "user_id": "u101",
    "team_name": "AI Innovators",
    "team_purpose": "Build AI-powered productivity tools",
    "description": "We are creating a smart assistant for productivity apps.",
    "team_size": 5,
    "skill_req": ["python", "machine learning", "react", "nodejs"],
    "user_joined": ["u101"],
    "status": "pending",
    "created_at": "2025-09-06T10:00:00Z"
  }; // pick one action
  const results = await MatchUsers(action);

  return (
    
    <pre className="text-black">{JSON.stringify(results, null, 2)}</pre>
  );
}