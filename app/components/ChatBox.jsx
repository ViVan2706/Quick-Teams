"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Send, CheckCheck } from "lucide-react";

// Dummy global message store
const initialMessages = [
  // Direct chat with Alex
  {
    convoId: "c1",
    messageId: "m1",
    senderId: "u1",
    senderName: "Alex Morgan",
    text: "Hey, excited to connect 🚀",
    timestamp: "2025-09-05T14:12:00Z",
    status: "seen",
  },
  {
    convoId: "c1",
    messageId: "m2",
    senderId: "you",
    senderName: "You",
    text: "Hi Alex! Glad to have you here 🙌",
    timestamp: "2025-09-05T14:14:00Z",
    status: "delivered",
  },
  {
    convoId: "c1",
    messageId: "m3",
    senderId: "u1",
    senderName: "Alex Morgan",
    text: "I want to join your project.",
    timestamp: "2025-09-05T14:16:00Z",
    status: "seen",
  },

  // Group chat: SIH Team 2024
  {
    convoId: "c2",
    messageId: "m1",
    senderId: "u2",
    senderName: "Sarah",
    text: "Let's meet tomorrow at 3!",
    timestamp: "2025-09-05T13:00:00Z",
    status: "seen",
  },
  {
    convoId: "c2",
    messageId: "m2",
    senderId: "u3",
    senderName: "Mike",
    text: "Sounds good to me 👍",
    timestamp: "2025-09-05T13:02:00Z",
    status: "seen",
  },
  {
    convoId: "c2",
    messageId: "m3",
    senderId: "you",
    senderName: "You",
    text: "Perfect, see you all then 🚀",
    timestamp: "2025-09-05T13:05:00Z",
    status: "sent",
  },

  // Group chat: Web Dev Squad
  {
    convoId: "c3",
    messageId: "m1",
    senderId: "u4",
    senderName: "Mike",
    text: "Check out this new framework!",
    timestamp: "2025-09-05T12:45:00Z",
    status: "delivered",
  },
  {
    convoId: "c3",
    messageId: "m2",
    senderId: "you",
    senderName: "You",
    text: "Nice, share the link here 🔗",
    timestamp: "2025-09-05T12:50:00Z",
    status: "sent",
  },
];

export default function ChatBox({ chat, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Filter messages for this convo
  useEffect(() => {
    const msgs = initialMessages.filter((m) => m.convoId === chat.convoId);
    setMessages(msgs);
  }, [chat]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      convoId: chat.convoId,
      messageId: `m${Date.now()}`,
      senderId: "you",
      senderName: "You",
      text: input,
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  // Format datetime to hh:mm
  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-300 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-[#096B68] hover:text-[#129990] transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="font-semibold text-[#096B68]">{chat.name}</h2>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FFFBDE]">
        {messages.map((msg) => (
          <div
            key={msg.messageId}
            className={`flex ${
              msg.senderId === "you" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl shadow-sm max-w-xs text-sm relative ${
                msg.senderId === "you"
                  ? "bg-[#129990] text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}
            >
              {/* Group chat sender */}
              {chat.type === "group" && msg.senderId !== "you" && (
                <p className="text-xs font-semibold text-[#096B68] mb-1">
                  {msg.senderName}
                </p>
              )}

              {msg.text}

              {/* Timestamp & status */}
              <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1 justify-end">
                {formatTime(msg.timestamp)}
                {msg.senderId === "you" && (
                  <CheckCheck
                    size={12}
                    className={
                      msg.status === "seen"
                        ? "text-blue-500"
                        : msg.status === "delivered"
                        ? "text-gray-500"
                        : "text-gray-400"
                    }
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 p-3 border-t border-gray-300 bg-white">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#129990] text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-[#129990] text-white px-4 py-2 rounded-lg hover:bg-[#096B68] transition"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
