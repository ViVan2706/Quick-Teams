"use client";

import { X, Users } from "lucide-react";

export default function ChatSidebar({ onClose }) {
  // Example data
  const requests = [
    { id: 1, name: "Alex Morgan", message: "Wants to join your Robotics ...", avatar: "AM", isNew: true },
  ];

  const groupChats = [
    { id: 1, name: "SIH Team 2024", message: "Sarah: Let's meet tomorrow at 3...", unread: 2 },
    { id: 2, name: "Web Dev Squad", message: "Mike: Check out this new framework!", unread: 0 },
  ];

  return (
    <aside className="fixed top-16 right-0 w-80 h-[calc(100vh-64px)] bg-[#FFFBDE] shadow-lg border-l-4 border-[#096B68] p-6 flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[#096B68] font-bold text-lg">Messages</h2>
        <button onClick={onClose} className="text-[#096B68] hover:text-[#129990] transition">
          <X size={20} />
        </button>
      </div>

      {/* Requests */}
      <div>
        <h3 className="text-[#096B68] font-semibold text-sm mb-2">Requests</h3>
        <div className="space-y-3">
          {requests.map((req) => (
            <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-white shadow-sm cursor-pointer hover:bg-[#90D1CA]/20 transition">
              {/* Avatar */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#90D1CA] flex items-center justify-center font-bold text-[#096B68]">
                  {req.avatar}
                </div>
                <div>
                  <p className="font-semibold text-[#096B68]">{req.name}</p>
                  <p className="text-xs text-gray-500 truncate">{req.message}</p>
                </div>
              </div>
              {req.isNew && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  New
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Group Chats */}
      <div>
        <h3 className="text-[#096B68] font-semibold text-sm mb-2">Group Chats</h3>
        <div className="space-y-3">
          {groupChats.map((chat) => (
            <div key={chat.id} className="flex items-center justify-between p-3 rounded-lg bg-white shadow-sm cursor-pointer hover:bg-[#90D1CA]/20 transition">
              {/* Icon + Chat info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#90D1CA] flex items-center justify-center text-white">
                  <Users size={18} />
                </div>
                <div>
                  <p className="font-semibold text-[#096B68]">{chat.name}</p>
                  <p className="text-xs text-gray-500 truncate">{chat.message}</p>
                </div>
              </div>
              {chat.unread > 0 && (
                <span className="bg-[#129990] text-white text-xs font-bold px-2 py-1 rounded-full">
                  {chat.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
