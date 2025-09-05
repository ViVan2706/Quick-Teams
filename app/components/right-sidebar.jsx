'use client';

import { FaTimes, FaUser, FaUsers } from 'react-icons/fa';

export default function RightSidebar({ isOpen, onClose }) {
  const chatMessages = [
    { id: 1, sender: 'Alex Morgan', message: 'Wants to join your Robotics Team...', type: 'request', avatar: 'AM' },
    { id: 2, sender: 'SIH Team 2024', message: 'Sarah: Let\'s meet tomorrow at 3...', type: 'chat', avatar: 'SIH', newMessages: 2 },
    { id: 3, sender: 'Web Dev Squad', message: 'Mike: Check out this new framework!', type: 'chat', avatar: 'WD' },
  ];

  return (
    <div
      className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-6 transform transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-700">Messages</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <FaTimes />
        </button>
      </div>

      {/* Requests Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-500 mb-2">Requests</h3>
        {chatMessages.filter(m => m.type === 'request').map(msg => (
          <div key={msg.id} className="p-3 mb-2 flex items-center space-x-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-700">{msg.avatar}</div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{msg.sender}</p>
              <p className="text-sm text-gray-500 truncate">{msg.message}</p>
            </div>
            <span className="text-xs font-bold text-white bg-red-500 px-2 py-1 rounded-full">New</span>
          </div>
        ))}
      </div>

      {/* Group Chats Section */}
      <div>
        <h3 className="font-semibold text-gray-500 mb-2">Group Chats</h3>
        {chatMessages.filter(m => m.type === 'chat').map(msg => (
          <div key={msg.id} className="p-3 mb-2 flex items-center space-x-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <div className={`w-8 h-8 rounded-full bg-accent-2 text-white flex items-center justify-center text-xs font-bold`}>
              <FaUsers />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{msg.sender}</p>
              <p className="text-sm text-gray-500 truncate">{msg.message}</p>
            </div>
            {msg.newMessages && (
              <span className="text-xs font-bold text-white bg-blue-500 px-2 py-1 rounded-full">{msg.newMessages}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}