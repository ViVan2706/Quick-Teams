"use client";

import { useState } from "react";
import UserCard from "./components/cards/UserCard";

export default function HomePage() {
  const users = [
    {
      name: "Rahul Sharma",
      profile: "https://i.pravatar.cc/150?img=12",
      bio: "Passionate frontend developer, looking to join a hackathon team.",
      techstack: ["React", "Node.js", "TailwindCSS"],
      labels: {
        Role: ["Innovator", "Leader"],
        Skills: ["Technical", "Creative"],
        "Work Style": ["Planner", "Risk-taker"],
        Motivation: ["Achiever", "Impact-driven"],
      },
      hobbies: ["Cricket", "Photography", "Traveling"],
    },
    {
      name: "Ananya Verma",
      profile: "https://i.pravatar.cc/150?img=13",
      bio: "UI/UX enthusiast with a love for design sprints.",
      techstack: ["Figma", "AdobeXD", "CSS"],
      labels: {
        Role: ["Supporter", "Communicator"],
        Skills: ["Creative"],
        "Work Style": ["Detail-oriented"],
        Motivation: ["Collaborator", "Learner"],
      },
      hobbies: ["Drawing", "Music", "Design blogs"],
    },
    {
      name: "Rohit Singh",
      profile: "https://i.pravatar.cc/150?img=14",
      bio: "Backend specialist focusing on scalable APIs.",
      techstack: ["Node.js", "Express", "MongoDB"],
      labels: {
        Role: ["Executor", "Analyzer"],
        Skills: ["Technical"],
        "Work Style": ["Big-picture thinker"],
        Motivation: ["Career-focused"],
      },
      hobbies: ["Coding contests", "Football"],
    },
    {
      name: "Sneha Gupta",
      profile: "https://i.pravatar.cc/150?img=15",
      bio: "Fullstack dev exploring AI integration.",
      techstack: ["React", "Python", "TensorFlow"],
      labels: {
        Role: ["Innovator"],
        Skills: ["Technical", "Researcher"],
        "Work Style": ["Improviser"],
        Motivation: ["Learner", "Impact-driven"],
      },
      hobbies: ["Badminton", "Cooking", "Movies"],
    },
    {
      name: "Vikram Yadav",
      profile: "https://i.pravatar.cc/150?img=16",
      bio: "Cloud computing and DevOps enthusiast.",
      techstack: ["AWS", "Docker", "Kubernetes"],
      labels: {
        Role: ["Analyzer", "Executor"],
        Skills: ["Technical", "Operations"],
        "Work Style": ["Planner"],
        Motivation: ["Achiever"],
      },
      hobbies: ["Gaming", "Traveling"],
    },
    {
      name: "Neha Patel",
      profile: "https://i.pravatar.cc/150?img=17",
      bio: "Frontend wizard who loves animations.",
      techstack: ["React", "GSAP", "Framer Motion"],
      labels: {
        Role: ["Creative", "Supporter"],
        Skills: ["Creative", "Technical"],
        "Work Style": ["Improviser"],
        Motivation: ["Collaborator"],
      },
      hobbies: ["Dance", "Painting"],
    },
    {
      name: "Arjun Mehta",
      profile: "https://i.pravatar.cc/150?img=18",
      bio: "ML engineer passionate about data-driven solutions.",
      techstack: ["Python", "Pandas", "Scikit-learn"],
      labels: {
        Role: ["Analyzer"],
        Skills: ["Technical", "Researcher"],
        "Work Style": ["Detail-oriented"],
        Motivation: ["Learner"],
      },
      hobbies: ["Chess", "Running"],
    },
    {
      name: "Ishita Roy",
      profile: "https://i.pravatar.cc/150?img=19",
      bio: "Game developer with a knack for Unity projects.",
      techstack: ["Unity", "C#", "Blender"],
      labels: {
        Role: ["Innovator", "Leader"],
        Skills: ["Creative", "Technical"],
        "Work Style": ["Improviser"],
        Motivation: ["Achiever"],
      },
      hobbies: ["Gaming", "Story writing"],
    },
    {
      name: "Karan Malhotra",
      profile: "https://i.pravatar.cc/150?img=20",
      bio: "Cybersecurity researcher and ethical hacker.",
      techstack: ["Python", "Metasploit", "Wireshark"],
      labels: {
        Role: ["Executor"],
        Skills: ["Technical", "Researcher"],
        "Work Style": ["Safe-player"],
        Motivation: ["Career-focused"],
      },
      hobbies: ["Hacking challenges", "Motorcycling"],
    },
    {
      name: "Priya Nair",
      profile: "https://i.pravatar.cc/150?img=21",
      bio: "Data analyst who enjoys uncovering insights.",
      techstack: ["SQL", "Excel", "Tableau"],
      labels: {
        Role: ["Analyzer", "Supporter"],
        Skills: ["Researcher", "Business"],
        "Work Style": ["Planner"],
        Motivation: ["Impact-driven"],
      },
      hobbies: ["Reading", "Yoga"],
    },
  ];

  const [visibleUsers, setVisibleUsers] = useState(users.slice(0, 4));
  const [currentIndex, setCurrentIndex] = useState(4);

  const handleReject = (index) => {
    const updatedUsers = [...visibleUsers];
    updatedUsers.splice(index, 1);

    if (currentIndex < users.length) {
      updatedUsers.push(users[currentIndex]);
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

      {/* User Card Deck */}
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
