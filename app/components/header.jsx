"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, MessageCircle, User } from "lucide-react";

export default function Header({ onToggleSidebar, onToggleChat }) {
  const [notifications] = useState(3);

  return (
    <header className="w-full bg-[#FFFBDE] shadow-md px-6 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Menu button controls sidebar */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg bg-[#90D1CA] hover:bg-[#129990] text-white transition"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-xl font-bold text-[#096B68]">MyWebPage</h1>
      </div>

      {/* Middle Section - Navigation */}
      <nav className="flex gap-6">
        <Link
          href="/"
          className="text-[#129990] font-medium hover:text-[#096B68] transition"
        >
          Home
        </Link>
        <Link
          href="/groups"
          className="text-[#129990] font-medium hover:text-[#096B68] transition"
        >
          My Groups
        </Link>
      </nav>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        {/* Chat with Notification */}
        <div className="relative">
          <button
            onClick={onToggleChat} // 👈 Controls Chat Sidebar
            className="p-2 rounded-full bg-[#90D1CA] hover:bg-[#129990] text-white transition"
          >
            <MessageCircle size={20} />
          </button>
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#096B68] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {notifications}
            </span>
          )}
        </div>

        {/* Profile */}
        <button className="p-2 rounded-full bg-[#129990] hover:bg-[#096B68] text-white transition">
          <User size={20} />
        </button>
      </div>
    </header>
  );
}
