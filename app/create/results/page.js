"use client";

import { useEffect, useState } from "react";
import UserCard from "./../../components/cards/UserCard";
import { MatchUsers } from "./../../../models/MatchEngine"; 
import { useSearchParams } from "next/navigation";

export default function Result() {
  const searchParams = useSearchParams();
  const action_id = searchParams.get("action_id"); // get from query string
  const [matches, setMatches] = useState([]);
  const [visibleUsers, setVisibleUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!action_id) return; // wait for param

    async function fetchMatches() {
      try {
        const res = await fetch("/actions.json");
        const data = await res.json();

        const action = data.actions.find(a => a.ac_id === action_id);

        if (!action) {
          console.error(`Action with id ${action_id} not found.`);
          return;
        }

        const result = await MatchUsers(action);
        setMatches(result.matches);
        setVisibleUsers(result.matches.slice(0, 4));
        setCurrentIndex(4);
      } catch (err) {
        console.error("Error fetching matches:", err);
      }
    }

    fetchMatches();
  }, [action_id]);

  const handleReject = (index) => {
    const updatedUsers = [...visibleUsers];
    updatedUsers.splice(index, 1);

    if (currentIndex < matches.length) {
      updatedUsers.push(matches[currentIndex]);
      setCurrentIndex(currentIndex + 1);
    }

    setVisibleUsers(updatedUsers);
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-[#096B68] mb-4">
        Welcome to Quick Teams
      </h1>
      <p className="mb-6 text-[#129990]">
        Build or find your hackathon / project teammates here 🚀
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleUsers.map((user, index) => (
          <UserCard
            key={index}
            {...user}
            onReject={() => handleReject(index)}
          />
        ))}
      </div>
    </>
  );
}
