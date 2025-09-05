"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Sidebar() {
  const [createdTeams, setCreatedTeams] = useState([]);
  const [joinedTeams, setJoinedTeams] = useState([]);
  const [actions, setActions] = useState([]);
  const searchParams = useSearchParams();
  const selectedActionId = searchParams.get("action_id");

  useEffect(() => {
    async function fetchHistory() {
      try {
        // load requirements.json
        const res1 = await fetch("/requirements.json");
        const data1 = await res1.json();

        if (data1?.teamRequirements) {
          const created = data1.teamRequirements.filter(
            (item) => item.status === "created"
          );
          const joined = data1.teamRequirements.filter(
            (item) => item.status === "joined"
          );

          setCreatedTeams(created);
          setJoinedTeams(joined);
        }

        // load actions.json
        const res2 = await fetch("/actions.json");
        const data2 = await res2.json();
        if (data2?.actions) {
          setActions(data2.actions);
        }
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    }

    fetchHistory();
  }, []);

  return (
    <aside className="w-64 h-full bg-[#FFFBDE] shadow-lg flex flex-col p-6 space-y-6 border-l-4 border-r-4 border-[#096B68] mt-16">
      {/* Section Title */}
      <h2 className="text-[#096B68] font-semibold text-sm uppercase ">
        Team Actions
      </h2>

      {/* Create + Find */}
      <div className="space-y-4 ">
        <Link href="/create">
          <button className="mb-2 w-full flex flex-col items-start gap-1 px-4 py-3 rounded-lg border border-[#90D1CA] hover:bg-[#90D1CA]/20 transition">
            <div className="flex items-center gap-2 text-[#096B68] font-medium ">
              <PlusCircle size={18} />
              Create a Team
            </div>
            <span className="text-xs text-[#129990]">
              Start your own project
            </span>
          </button>
        </Link>
        <Link href={"/join"}>
          <button className="w-full flex flex-col items-start gap-1 px-4 py-3 rounded-lg border border-[#129990] hover:bg-[#129990]/20 transition">
            <div className="flex items-center gap-2 text-[#096B68] font-medium">
              <Search size={18} />
              Find a Team
            </div>
            <span className="text-xs text-[#129990]">Join existing teams</span>
          </button>
        </Link>
      </div>

      {/* Joined Teams */}
      <div className="space-y-3">
        <h2 className="text-[#096B68] font-semibold text-sm uppercase">
          Joined Teams
        </h2>
        <ul className="space-y-2">
          {joinedTeams.length > 0 ? (
            joinedTeams.map((team) => (
              <Link key={team.id} href={`/team/${team.id}`}>
                <li className="px-3 my-2 py-2 rounded-lg bg-[#90D1CA] text-[#096B68] font-medium hover:bg-[#129990] hover:text-white cursor-pointer transition">
                  {team.title}
                </li>
              </Link>
            ))
          ) : (
            <p className="text-xs text-gray-500">No joined teams yet</p>
          )}
        </ul>
      </div>

      {/* Created Teams (from actions.json) */}
      <div className="space-y-3">
        <h2 className="text-[#129990] font-semibold text-sm uppercase">
          Created Teams
        </h2>
        <ul className="space-y-2">
          {actions.length > 0 ? (
            actions.map((action) => (
              <Link
                key={action.ac_id}
                href={`/create/results?action_id=${action.ac_id}`}
              >
                <li
                  className={`px-3 py-2 my-2 rounded-lg font-medium cursor-pointer transition ${
                    action.ac_id === selectedActionId
                      ? "bg-[#096B68] text-white"
                      : "bg-[#129990] text-white"
                  }`}
                >
                  {action.title || `${action.team_purpose}`}
                </li>
              </Link>
            ))
          ) : (
            <p className="text-xs text-gray-500">No created teams yet</p>
          )}
        </ul>
      </div>
    </aside>
  );
}
