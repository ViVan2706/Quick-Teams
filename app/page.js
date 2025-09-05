"use client";

import { useState } from "react";
import Header from "./components/header";
import Sidebar from "./components/left-sidebar";
import ChatSidebar from "./components/right-sidebar";

export default function HomePage() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        onToggleChat={() => setShowChat(!showChat)}
      />

      <div className="flex flex-1 relative">
        {/* Left Sidebar */}
        {showSidebar && (
          <Sidebar />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold text-[#096B68]">Welcome to MyWebPage</h1>
          <p className="mt-2 text-[#129990]">
            This is your main content area. Toggle the left sidebar with the menu button
            and the right chat sidebar with the chat button in the header.
          </p>
        </main>

        {/* Right Sidebar (Chat) */}
        {showChat && (
          <ChatSidebar onClose={() => setShowChat(false)} />
        )}
      </div>
    </div>
  );
}
