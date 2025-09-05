"use client";

import { useState } from "react";
import Header from "./components/header";
import Sidebar from "./components/left-sidebar";
import ChatSidebar from "./components/right-sidebar";

export default function LayoutClient({ children }) {
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
        {showSidebar && <Sidebar />}

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>

        {/* Right Sidebar */}
        {showChat && <ChatSidebar onClose={() => setShowChat(false)} />}
      </div>
    </div>
  );
}
