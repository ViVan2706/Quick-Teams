"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Sidebar() {
  const [createdTeams, setCreatedTeams] = useState([]);
  const [joinedTeams, setJoinedTeams] = useState([]);
  const [actions, setActions] = useState([]);
  const [findActions, setFindActions] = useState([]); // ✅ store findactions.json
  const searchParams = useSearchParams();
  const selectedActionId = searchParams.get("action_id");
  const selectedFindActionId = searchParams.get("facid");

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

        // load actions.json (for created teams)
        const res2 = await fetch("/actions.json");
        const data2 = await res2.json();
        if (data2?.actions) {
          setActions(data2.actions);
        }

        // load findactions.json (for joined teams)
        const res3 = await fetch("/findactions.json");
        const data3 = await res3.json();
        if (data3?.findActions) {
          setFindActions(data3.findActions);
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
      <h2 className="text-[#096B68] font-semibold text-sm uppercase">
        Team Actions
      </h2>

      {/* Create + Find */}
      <div className="space-y-4">
        <Link href="/create">
          <button className="mb-2 w-full flex flex-col items-start gap-1 px-4 py-3 rounded-lg border border-[#90D1CA] hover:bg-[#90D1CA]/20 transition">
            <div className="flex items-center gap-2 text-[#096B68] font-medium">
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

      {/* Joined Teams (from findactions.json) */}
     {/* Joined Teams (from findactions.json) */}
      <div className="space-y-3">
        <h2 className="text-[#096B68] font-semibold text-sm uppercase">
          Join Logs
        </h2>
        <ul className="space-y-2">
          {findActions.length > 0 ? (
            findActions
              // only items created by user u101 (and optionally status === 'joined')
              .filter((fa) => (fa.uid ?? fa.user_id) === "u101")
              // .filter((fa) => fa.status === "joined") // ← enable if you want only joined
              .map((fa) => {
                const facid = fa.facid ?? fa.fac_id;
                const label =
                  fa.title ??
                  fa.team_name ??
                  fa.team_purpose ??
                  fa.purpose ??
                  facid;

                return (
                  <Link key={facid} href={`/join/results?facid=${facid}`}>
                    <li
                      className={`px-3 py-2 my-2 rounded-lg font-medium cursor-pointer transition ${
                        facid === selectedFindActionId
                          ? "bg-[#096B68] text-white"
                          : "bg-[#90D1CA] text-[#096B68] hover:bg-[#129990] hover:text-white"
                      }`}
                    >
                      {label}
                    </li>
                  </Link>
                );
              })
          ) : (
            <p className="text-xs text-gray-500">No joined teams yet</p>
          )}
        </ul>
      </div>

      {/* Created Teams (from actions.json) */}
      <div className="space-y-3">
        <h2 className="text-[#096B68] font-semibold text-sm uppercase">
          Create Logs
        </h2>
        <ul className="space-y-2">
          {actions.length > 0 ? (
            actions
              .filter((action) => action.user_id === "u101") // ✅ only created by u101
              .map((action) => (
                <Link
                  key={action.ac_id}
                  href={`/create/results?action_id=${action.ac_id}`}
                >
                  <li
                    className={`px-3 py-2 my-2 rounded-lg font-medium cursor-pointer transition ${
                      action.ac_id === selectedActionId
                        ? "bg-[#096B68] text-white"
                        : "bg-[#90D1CA] text-[#096B68] hover:bg-[#129990] hover:text-white"
                    }`}
                  >
                    {action.title || action.team_name}
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
