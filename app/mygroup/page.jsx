"use client";

import { useEffect, useState } from "react";
import { Users, Calendar, Crown } from "lucide-react";

const DEFAULT_USER_ID = "u102"; // change to see completed teams for different user

const toId = (v) => String(v ?? "").trim().toLowerCase();

function pickAvatarUrl(user) {
  const url =
    user?.profile || user?.avatar || user?.image || user?.photo || user?.picture;
  if (!url) return "/default-avatar.png";
  if (/^https?:|^data:|^blob:/.test(url)) return url;
  return url.startsWith("/") ? url : `/${url}`;
}

export default function MyGroupsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [actsRes, usersRes] = await Promise.all([
          fetch("/actions.json", { cache: "no-store" }),
          fetch("/users.json", { cache: "no-store" }),
        ]);

        const actionsData = await actsRes.json();
        const usersData = await usersRes.json();

        const actions = Array.isArray(actionsData)
          ? actionsData
          : actionsData.actions || [];

        const users = Array.isArray(usersData)
          ? usersData
          : usersData.users || [];

        const userMap = new Map();
        for (const u of users) {
          const idKey = toId(u.user_id ?? u.id ?? u.userId);
          userMap.set(idKey, u);
        }

        const wantedId = toId(DEFAULT_USER_ID);

        const completedTeams = actions.filter((t) => {
          const status = String(t.status ?? "").toLowerCase();
          if (status !== "completed") return false;

          const owner = toId(t.user_id);
          const joined = Array.isArray(t.user_joined)
            ? t.user_joined.map((id) => toId(id))
            : [];

          return owner === wantedId || joined.includes(wantedId);
        });

        const uiTeams = completedTeams.map((t, idx) => {
          const owner = toId(t.user_id);
          const creatorUser = userMap.get(owner);
          const memberUsers = (t.user_joined || [])
            .map((id) => userMap.get(toId(id)))
            .filter(Boolean);

          const avatars = [
            ...(creatorUser ? [creatorUser] : []),
            ...memberUsers,
          ].map((u) => ({
            id: toId(u.user_id),
            name: u.name,
            profile: pickAvatarUrl(u),
          }));

          return {
            id: t.ac_id ?? `team-${idx}`,
            name: t.team_name ?? `Team ${idx + 1}`,
            crown: true,
            category: t.team_purpose ?? "",
            members: t.team_size ?? avatars.length,
            date: t.created_at
              ? new Date(t.created_at).toLocaleDateString()
              : "",
            status: t.status,
            description: t.description ?? "",
            progress: 100,
            skills: Array.isArray(t.skill_req) ? t.skill_req : [],
            avatars,
            lastActive: "Recently",
          };
        });

        setTeams(uiTeams);
      } catch (err) {
        console.error("Error loading teams:", err);
        setTeams([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFBDE] p-4 sm:p-6 mt-12">
      <h1 className="text-3xl font-bold text-center text-[#096B68] mb-8">
        My Completed Teams
      </h1>

      {loading && <p className="text-center text-gray-600 mb-6">Loading…</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {!loading && teams.length === 0 ? (
          <p className="text-center text-gray-600 col-span-2">
            No completed teams found.
          </p>
        ) : (
          teams.map((team) => (
            <div
              key={team.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sm:p-8 flex flex-col 
                         transform transition duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-[#129990] cursor-pointer"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-[#096B68] flex items-center gap-2">
                  {team.name} {team.crown && <Crown size={18} />}
                </h2>
                <span className="bg-[#129990] text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                  {team.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-600 mt-2">
                <span className="flex items-center gap-1">
                  <Users size={14} /> {team.members} members
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> {team.date}
                </span>
              </div>

              <p className="mt-3 text-gray-700 text-sm leading-relaxed">
                {team.description}
              </p>

              <div className="mt-4">
                <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                  <span>Progress</span>
                  <span>{team.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                  <div
                    className="h-2 rounded-full bg-[#129990]"
                    style={{ width: `${team.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {team.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-[#FFFBDE] text-[#096B68] px-2 sm:px-3 py-1 rounded-full text-xs border border-[#129990]"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center mt-5 flex-wrap gap-3">
                <div className="flex -space-x-2">
                  {team.avatars.map((user, i) => (
                    <img
                      key={i}
                      src={user.profile}
                      alt={user.name}
                      title={user.name}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">{team.lastActive}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button className="flex-1 bg-[#FFFBDE] text-[#096B68] border border-[#129990] hover:bg-[#90D1CA] px-4 py-2 rounded-lg font-medium shadow-sm transition text-sm sm:text-base">
                  Chat
                </button>
                <button className="flex-1 bg-[#129990] text-white hover:bg-[#096B68] px-4 py-2 rounded-lg font-medium shadow-sm transition text-sm sm:text-base">
                  Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
