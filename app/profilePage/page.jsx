"use client";

import { useState, useRef } from "react";
import {
  Edit, Save, X, Plus, Mail, MapPin, Calendar,
  Users, Target, Award, Settings, Globe
} from "lucide-react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Full-stack dev with 3+ years of experience.",
    age: "24",
    location: "San Francisco, CA",
    education: "Computer Science, Stanford",
    experience: "Senior Dev at TechCorp",
  });

  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);

  const [skills, setSkills] = useState(["React", "TypeScript", "Node.js"]);
  const [interests, setInterests] = useState(["Web Dev", "AI/ML"]);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [tab, setTab] = useState("profile");
  const [notifications, setNotifications] = useState({ invites: true, messages: true });
  const [privacy, setPrivacy] = useState({ public: true, skills: true, activity: true });

  const addItem = (list, setList, val) => {
    const v = (val || "").trim();
    if (v && !list.includes(v)) setList([...list, v]);
  };
  const removeItem = (list, setList, val) => setList(list.filter(i => i !== val));

  const stats = [
    { label: "Teams Joined", value: "12", icon: Users },
    { label: "Projects Completed", value: "8", icon: Target },
    { label: "Success Rate", value: "96%", icon: Award },
    { label: "Profile Views", value: "234", icon: Globe },
  ];

  // JS (no TS types) file input handler
  const handleImageChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mt-10 min-h-screen bg-[#FFFBDE] text-[#096B68] p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="relative inline-block">
          <div
            className="w-32 h-32 rounded-full overflow-hidden bg-[#129990] flex items-center justify-center text-white text-4xl font-bold cursor-pointer"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            title="Change profile picture"
          >
            {avatar ? (
              <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              profile.name.split(" ").map(n => n[0]).join("")
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <button className="absolute bottom-0 right-0 bg-[#90D1CA] p-2 rounded-full">
            <Edit size={16} />
          </button>
        </div>

        <h1 className="text-3xl font-bold">{profile.name}</h1>
        <div className="flex justify-center gap-4 text-gray-600 text-sm">
          <span className="flex items-center gap-1"><Mail size={14} />{profile.email}</span>
          <span className="flex items-center gap-1"><MapPin size={14} />{profile.location}</span>
          <span className="flex items-center gap-1"><Calendar size={14} />{profile.age} yrs</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="p-4 rounded-lg bg-white shadow text-center space-y-2">
            <div className="p-2 flex justify-center">{<s.icon size={18} />}</div>
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div>
        <div className="grid grid-cols-3 bg-white rounded-full text-center">
          {["profile", "teams", "settings"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`p-2 rounded-full font-medium ${tab === t ? "bg-[#90D1CA] text-[#096B68]" : ""}`}
            >
              {t === "profile" ? "Profile Info" : t === "teams" ? "Team History" : "Settings"}
            </button>
          ))}
        </div>

        {/* Profile Info */}
        {tab === "profile" && (
          <div className="p-4 bg-white rounded shadow space-y-4 mt-4 rounded-xl">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">Profile Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1 bg-[#096B68] text-white px-3 py-1 rounded"
              >
                {isEditing ? <Save size={14} /> : <Edit size={14} />}
                {isEditing ? "Save" : "Edit"}
              </button>
            </div>

            <input
              className="border p-2 w-full rounded"
              value={profile.name}
              disabled={!isEditing}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
            />

            <textarea
              className="border p-2 w-full rounded min-h-[100px]"
              value={profile.bio}
              disabled={!isEditing}
              onChange={e => setProfile({ ...profile, bio: e.target.value })}
            />

            {/* Skills */}
            <div>
              <p className="font-medium">Skills</p>
              {isEditing && (
                <div className="flex gap-2 mt-1">
                  <input
                    className="border flex-1 p-2 rounded"
                    value={newSkill}
                    placeholder="Add a skill..."
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (addItem(skills, setSkills, newSkill), setNewSkill(""))}
                  />
                  <button
                    onClick={() => (addItem(skills, setSkills, newSkill), setNewSkill(""))}
                    className="bg-[#129990] text-white px-3 rounded"
                    title="Add skill"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map(s => (
                  <span key={s} className="bg-[#90D1CA] px-2 py-1 rounded flex items-center gap-1">
                    {s}
                    {isEditing && (
                      <X
                        size={12}
                        className="cursor-pointer"
                        onClick={() => removeItem(skills, setSkills, s)}
                        title="Remove"
                      />
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <p className="font-medium">Interests</p>
              {isEditing && (
                <div className="flex gap-2 mt-1">
                  <input
                    className="border flex-1 p-2 rounded"
                    value={newInterest}
                    placeholder="Add an interest..."
                    onChange={e => setNewInterest(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (addItem(interests, setInterests, newInterest), setNewInterest(""))}
                  />
                  <button
                    onClick={() => (addItem(interests, setInterests, newInterest), setNewInterest(""))}
                    className="bg-[#129990] text-white px-3 rounded"
                    title="Add interest"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {interests.map(i => (
                  <span key={i} className="border px-2 py-1 rounded flex items-center gap-1">
                    {i}
                    {isEditing && (
                      <X
                        size={12}
                        className="cursor-pointer"
                        onClick={() => removeItem(interests, setInterests, i)}
                        title="Remove"
                      />
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Team History */}
        {tab === "teams" && (
          <div className="p-4 bg-white rounded shadow mt-4 space-y-3 rounded-xl">
            <h2 className="font-semibold">Team History</h2>
            <div className="p-3 border rounded flex items-center justify-between">
              <div>
                <p className="font-medium">SIH Team 2024</p>
                <p className="text-xs text-gray-600">Smart city IoT solutions</p>
              </div>
              <span className="bg-[#90D1CA] px-2 rounded">Active</span>
            </div>
          </div>
        )}

        {/* Settings */}
        {tab === "settings" && (
          <div className="p-4 bg-white rounded shadow mt-4 space-y-4 rounded-xl">
            <h2 className="font-semibold flex items-center gap-2">
              <Settings size={16} /> Account Settings
            </h2>

            <div className="flex justify-between items-center">
              <span>Team invitations</span>
              <input
                type="checkbox"
                checked={notifications.invites}
                onChange={e => setNotifications({ ...notifications, invites: e.target.checked })}
              />
            </div>

            <div className="flex justify-between items-center">
              <span>New messages</span>
              <input
                type="checkbox"
                checked={notifications.messages}
                onChange={e => setNotifications({ ...notifications, messages: e.target.checked })}
              />
            </div>

            <div className="flex justify-between items-center">
              <span>Public profile</span>
              <input
                type="checkbox"
                checked={privacy.public}
                onChange={e => setPrivacy({ ...privacy, public: e.target.checked })}
              />
            </div>

            <div className="flex justify-between items-center">
              <span>Show skills</span>
              <input
                type="checkbox"
                checked={privacy.skills}
                onChange={e => setPrivacy({ ...privacy, skills: e.target.checked })}
              />
            </div>

            <div className="flex justify-between items-center">
              <span>Show activity status</span>
              <input
                type="checkbox"
                checked={privacy.activity}
                onChange={e => setPrivacy({ ...privacy, activity: e.target.checked })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
