
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function TeamDetail() {
  const { id } = useParams(); // get id from URL
  const [team, setTeam] = useState(null);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await fetch("/requirements.json");
        const data = await res.json();

        if (data?.teamRequirements) {
          const found = data.teamRequirements.find((t) => t.id === id);
          setTeam(found || null);
        }
      } catch (err) {
        console.error("Failed to fetch team detail:", err);
      }
    }
    fetchTeam();
  }, [id]);

  if (!team) {
    return <p className="p-6">Loading team details...</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[#096B68] mb-4">{team.title}</h1>
      <p className="text-gray-700 mb-2">{team.description}</p>

      <div className="mb-3">
        <span className="font-semibold text-[#096B68]">Status: </span>
        <span className="px-2 py-1 rounded bg-gray-200 text-sm">{team.status}</span>
      </div>

      <div>
        <span className="font-semibold text-[#096B68]">Skills Required: </span>
        <ul className="list-disc list-inside mt-1">
          {team.skills?.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Created at: {new Date(team.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
  