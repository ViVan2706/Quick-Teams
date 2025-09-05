import { MessageCircle, X, Check } from "lucide-react";

export default function UserCard({
  name,
  profile,
  bio,
  techstack = [],
  labels = {}, // one label from each category
  hobbies = [],
  onReject,
}) {
  // Flatten label values into a single array
  const allLabels = Object.values(labels);

  return (
    <div className="relative bg-[#FFFBDE] shadow-md rounded-2xl p-6 border border-[#90D1CA] w-full">
      {/* ❌ Cross Button (top-right) */}
      <button
        onClick={onReject}
        className="absolute top-3 right-3 text-[#90D1CA] hover:text-[#096B68] transition"
      >
        <X size={20} />
      </button>

      {/* Top: Profile + Name */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={profile}
          alt={name}
          className="w-14 h-14 rounded-full border-2 border-[#129990]"
        />
        <h2 className="text-lg font-semibold text-[#096B68]">{name}</h2>
      </div>

      {/* Bio */}
      <p className="text-sm text-gray-700 mb-3">{bio}</p>

      {/* Labels (Role + Skill + Work Style + Motivation) */}
      <div className="flex flex-wrap gap-2 mb-4">
        {allLabels.map((label, index) => (
          <span
            key={index}
            className="px-3 py-1 text-xs font-medium bg-[#90D1CA] text-[#096B68] rounded-full"
          >
            {label}
          </span>
        ))}
      </div>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-2 mb-4">
        {techstack.map((tech, index) => (
          <span
            key={index}
            className="px-3 py-1 text-xs font-medium bg-[#D8EFE9] text-[#096B68] rounded-full"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Hobbies */}
      {hobbies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {hobbies.map((hobby, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-medium bg-[#FFE5A0] text-[#096B68] rounded-full"
            >
              {hobby}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <button className="flex items-center gap-1 px-4 py-2 bg-[#129990] text-white text-sm font-medium rounded-xl hover:bg-[#096B68] transition">
          <MessageCircle size={16} /> Chat
        </button>
        <button className="flex items-center gap-1 px-4 py-2 bg-[#129990] text-white text-sm font-medium rounded-xl hover:bg-[#096B68] transition">
          <Check size={16} /> Request
        </button>
      </div>
    </div>
  );
}
