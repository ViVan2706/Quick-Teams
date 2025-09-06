"use client";

import TeamCard from "../components/cards/TeamCard";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FindTeamEngine } from "../../models/FindTeamEngine"; // adjust path

export default function Test() {
  const searchParams = useSearchParams();
  const findActionId = searchParams.get("facid"); // get findAction ID from URL

  const [matches, setMatches] = useState([]);
  const [users, setUsers] = useState([]);
  const [visibleMatches, setVisibleMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!findActionId) return;

    async function fetchData() {
      try {
        // fetch users.json
        const resUsers = await fetch("/users.json");
        const usersData = await resUsers.json();
        setUsers(usersData.users);

        // fetch findactions.json
        const resFindActions = await fetch("/findactions.json");
        const findActionsData = await resFindActions.json();

        // get the specific findAction
        const findAction = findActionsData.findActions.find(
          (f) => f.facid === findActionId
        );
        console.log("Fetched findAction:", findAction);

        if (!findAction) {
          console.error("FindAction not found for id:", findActionId);
          return;
        }

        // call FindTeamEngine to get matched teams
        const results = await FindTeamEngine(findAction);
        console.log("Matches returned:", results);

        const matchedTeams = await FindTeamEngine(findAction);
        setMatches(matchedTeams);
        setVisibleMatches(matchedTeams.slice(0, 4));
        setCurrentIndex(4);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    }

    fetchData();
  }, [findActionId]);

  const handleReject = (index) => {
    const updatedMatches = [...visibleMatches];
    updatedMatches.splice(index, 1);

    if (currentIndex < matches.length) {
      updatedMatches.push(matches[currentIndex]);
      setCurrentIndex(currentIndex + 1);
    }

    setVisibleMatches(updatedMatches);
  };

  console.log("Visible Matches:", visibleMatches);

  return (
    <>
      <h1 className="text-2xl font-bold text-[#096B68] mb-4">
        Matched Teams
      </h1>
      <p className="mb-6 text-[#129990]">
        Based on your team request, these are the best matches 🚀
      </p>

      {/* Team Card Deck */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleMatches.map((team, index) => (
          
          <TeamCard
            key={index}
            team_purpose={team.team_purpose}
            description={team.description}
            techstack={team.techstack}
            maxMembers={team.maxMembers}
            creator={team.creator}
            participants={team.participants}
            onJoin={() => alert(`Request to join ${team.team_name}`)}
            onReject={() => handleReject(index)}
          />
        ))}
      </div>
    </>
  );
}
