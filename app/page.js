"use client";

import { useState } from "react";
import Header from "./components/header";
import Sidebar from "./components/left-sidebar";
import ChatSidebar from "./components/right-sidebar";
import UserCard from "./components/cards/UserCard";

export default function HomePage() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const users = [
    {
      name: "Rahul Sharma",
      profile: "https://i.pravatar.cc/150?img=12",
      bio: "Passionate frontend developer, looking to join a hackathon team.",
      techstack: ["React", "Node.js", "TailwindCSS"],
    },
    {
      name: "Ananya Verma",
      profile: "https://i.pravatar.cc/150?img=13",
      bio: "UI/UX enthusiast with a love for design sprints.",
      techstack: ["Figma", "AdobeXD", "CSS"],
    },
    {
      name: "Rohit Singh",
      profile: "https://i.pravatar.cc/150?img=14",
      bio: "Backend specialist focusing on scalable APIs.",
      techstack: ["Node.js", "Express", "MongoDB"],
    },
    {
      name: "Sneha Gupta",
      profile: "https://i.pravatar.cc/150?img=15",
      bio: "Fullstack dev exploring AI integration.",
      techstack: ["React", "Python", "TensorFlow"],
    },
    {
      name: "Vikram Yadav",
      profile: "https://i.pravatar.cc/150?img=16",
      bio: "Cloud computing and DevOps enthusiast.",
      techstack: ["AWS", "Docker", "Kubernetes"],
    },
    {
      name: "Neha Patel",
      profile: "https://i.pravatar.cc/150?img=17",
      bio: "Frontend wizard who loves animations.",
      techstack: ["React", "GSAP", "Framer Motion"],
    },
    {
      name: "Arjun Mehta",
      profile: "https://i.pravatar.cc/150?img=18",
      bio: "ML engineer passionate about data-driven solutions.",
      techstack: ["Python", "Pandas", "Scikit-learn"],
    },
    {
      name: "Ishita Roy",
      profile: "https://i.pravatar.cc/150?img=19",
      bio: "Game developer with a knack for Unity projects.",
      techstack: ["Unity", "C#", "Blender"],
    },
    {
      name: "Karan Malhotra",
      profile: "https://i.pravatar.cc/150?img=20",
      bio: "Cybersecurity researcher and ethical hacker.",
      techstack: ["Python", "Metasploit", "Wireshark"],
    },
    {
      name: "Priya Nair",
      profile: "https://i.pravatar.cc/150?img=21",
      bio: "Data analyst who enjoys uncovering insights.",
      techstack: ["SQL", "Excel", "Tableau"],
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
    <div className="flex flex-col h-screen bg-[#FFFBDE]">
      {/* Header */}
      <Header
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        onToggleChat={() => setShowChat(!showChat)}
      />

      <div className="flex flex-1 relative">
        {/* Left Sidebar */}
        {showSidebar && <Sidebar />}

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
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
        </main>

        {/* Right Sidebar (Chat) */}
        {showChat && <ChatSidebar onClose={() => setShowChat(false)} />}
      </div>
    </div>
  );
}
