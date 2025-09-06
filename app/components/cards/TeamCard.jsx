import { Users, UserPlus, X } from "lucide-react";

export default function TeamCard({
  team_purpose,
  description,
  techstack = [],
  maxMembers,
  participants = [], // array of { name, profile }
  creator, // { name, profile }
  onJoin,
  onReject, // added
}) {
  return (
    <div className="relative bg-[#FFFBDE] shadow-md rounded-2xl p-6 border border-[#90D1CA] w-full">
      {/* ❌ Cross Button (top-right) */}
      {onReject && (
        <button
          onClick={onReject}
          className="absolute top-3 right-3 text-[#90D1CA] hover:text-[#096B68] transition"
        >
          <X size={20} />
        </button>
      )}

      {/* Team Purpose */}
      <h2 className="text-lg font-semibold text-[#096B68] mb-1">
        {team_purpose}
      </h2>

      {/* Created By */}
      {creator && (
        <p className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <img
            src={creator.profile}
            alt={creator.name}
            className="w-6 h-6 rounded-full border border-[#129990]"
          />
          <span>by {creator.name}</span>
        </p>
      )}

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-700 mb-4">{description}</p>
      )}

      {/* Tech Stack Required */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[#096B68] mb-2">
          Required Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {techstack.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-medium bg-[#D8EFE9] text-[#096B68] rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Participants */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[#096B68] mb-2">
          Participants ({participants.length}/{maxMembers})
        </h3>
        <div className="flex -space-x-3">
          {participants.map((p, idx) => (
            <img
              key={idx}
              src={p.profile}
              alt={p.name}
              title={p.name}
              className="w-8 h-8 rounded-full border-2 border-white shadow"
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button
          onClick={onJoin}
          className="flex items-center gap-1 px-4 py-2 bg-[#129990] text-white text-sm font-medium rounded-xl hover:bg-[#096B68] transition"
        >
          <UserPlus size={16} /> Join Team
        </button>
      </div>
    </div>
  );
}
