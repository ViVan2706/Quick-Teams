"use client";

import { Users, Calendar, Crown } from "lucide-react";

export default function MyGroupsPage() {
  const teams = [
    {
      id: 1,
      name: "SIH Team 2024",
      crown: true,
      category: "Smart India Hackathon",
      members: 4,
      date: "March 15, 2025",
      status: "Active",
      statusCount: 3,
      description:
        "Building IoT solutions for smart city management. Our goal is to create an integrated platform for traffic monitoring, waste management, and energy optimization.",
      progress: 65,
      skills: ["React", "Python", "IoT", "MongoDB"],
      avatars: ["YA", "NP", "ER", "RK"],
      lastActive: "2 hours ago",
    },
    {
      id: 2,
      name: "Web Dev Squad",
      crown: false,
      category: "Learning & Projects",
      members: 4,
      date: "Ongoing",
      status: "Active",
      description:
        "A collaborative group focused on building modern web applications and learning new technologies together.",
      progress: 40,
      skills: ["React", "Node.js", "Vue.js", "Design"],
      avatars: ["SV", "MC", "YL", "C"],
      lastActive: "1 day ago",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFBDE] p-4 sm:p-6 mt-10">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-center text-[#096B68] mb-2">
        My Teams
      </h1>
      <p className="text-center text-gray-700 mb-8 text-sm sm:text-base">
        Manage your collaborations and track project progress
      </p>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-5 sm:p-6 flex flex-col 
                       transform transition duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-[#129990] cursor-pointer"
          >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-[#096B68] flex items-center gap-2">
                {team.name} {team.crown && <Crown size={18} />}
              </h2>
              <div className="flex items-center gap-2">
                <span className="bg-[#129990] text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                  {team.status}
                </span>
                {team.statusCount && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                    {team.statusCount}
                  </span>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-600 mt-2">
              <span className="flex items-center gap-1">
                <Users size={14} /> {team.members} members
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {team.date}
              </span>
            </div>

            {/* Description */}
            <p className="mt-3 text-gray-700 text-sm leading-relaxed">
              {team.description}
            </p>

            {/* Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                <span>Progress</span>
                <span>{team.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                <div
                  className="h-2 rounded-full bg-[#129990]"
                  style={{ width: `${team.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Skills */}
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

            {/* Avatars + Time */}
            <div className="flex justify-between items-center mt-5 flex-wrap gap-3">
              <div className="flex -space-x-2">
                {team.avatars.map((a, i) => (
                  <span
                    key={i}
                    className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-[#90D1CA] text-xs sm:text-sm font-bold text-white border-2 border-white"
                  >
                    {a}
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500">{team.lastActive}</span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button className="flex-1 bg-[#FFFBDE] text-[#096B68] border border-[#129990] hover:bg-[#90D1CA] px-4 py-2 rounded-lg font-medium shadow-sm transition text-sm sm:text-base">
                Chat
              </button>
              <button className="flex-1 bg-[#129990] text-white hover:bg-[#096B68] px-4 py-2 rounded-lg font-medium shadow-sm transition text-sm sm:text-base">
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
