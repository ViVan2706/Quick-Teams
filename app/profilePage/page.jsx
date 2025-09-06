"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Edit, Save, X, Plus, Mail, MapPin, Calendar,
  Users, Target, Award, Settings, Globe
} from "lucide-react";

const ICONS = { Users, Target, Award, Globe };

export default function Profile() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);

  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);

  // local input states
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const [tab, setTab] = useState("profile");
  const [notifications, setNotifications] = useState({ invites: true, messages: true });
  const [privacy, setPrivacy] = useState({ public: true, skills: true, activity: true });

  // fetch user.json on mount
  useEffect(() => {
    fetch("/userdata.json")
      .then(res => res.json())
      .then(data => {
        setProfile(data);
      })
      .catch(err => console.error("Error loading user.json:", err));
  }, []);

  if (!profile) {
    return <div className="p-6 text-center">Loading profile...</div>;
  }

  // helpers
  const addItem = (list, setList, val) => {
    const v = (val || "").trim();
    if (!v) return;
    if (list.includes(v)) return;
    setList([...list, v]);
  };
  const removeItem = (list, setList, val) => setList(list.filter(i => i !== val));

  // handlers for updating nested profile state
  const updateProfileField = (field, value) =>
    setProfile({ ...profile, [field]: value });

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
        {profile.stats.map((s, i) => {
          const Icon = ICONS[s.icon] || Globe;
          return (
            <div key={i} className="p-4 rounded-lg bg-white shadow text-center space-y-2">
              <div className="p-2 flex justify-center"><Icon size={18} /></div>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          );
        })}
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
  <div className="p-4 bg-white rounded-xl shadow space-y-4 mt-4">
    <div className="flex justify-between items-center">
      <h2 className="font-semibold">Profile Information</h2>
      <button
        onClick={() => setIsEditing(!isEditing)}
        className="flex items-center gap-1 bg-[#096B68] text-white px-3 py-1 rounded-lg"
      >
        {isEditing ? <Save size={14} /> : <Edit size={14} />}
        {isEditing ? "Save" : "Edit"}
      </button>
    </div>

    {/* Name */}
    <label className="block font-medium">Name</label>
    <input
      className="border p-2 w-full rounded-xl"
      value={profile.name}
      disabled={!isEditing}
      onChange={e => updateProfileField("name", e.target.value)}
    />

    {/* Bio */}
    <label className="block font-medium">Bio</label>
    <textarea
      className="border p-2 w-full rounded-xl min-h-[100px]"
      value={profile.bio}
      disabled={!isEditing}
      onChange={e => updateProfileField("bio", e.target.value)}
    />

    {/* Education */}
    <label className="block font-medium">Education</label>
    <input
      className="border p-2 w-full rounded-xl"
      value={profile.education}
      disabled={!isEditing}
      onChange={e => updateProfileField("education", e.target.value)}
    />

    {/* Experience */}
    <label className="block font-medium">Experience</label>
    <input
      className="border p-2 w-full rounded-xl"
      value={profile.experience}
      disabled={!isEditing}
      onChange={e => updateProfileField("experience", e.target.value)}
    />

    {/* Labels */}
<div className="bg-white p-4 rounded-xl shadow">
  <p className="font-semibold flex items-center justify-between">
    Labels
    <button
      onClick={() => router.push("/quiz")}
      className="text-sm bg-[#096B68] text-white px-3 py-1 rounded-lg"
    >
      Take Quiz
    </button>
  </p>

  <div className="flex gap-2 mt-2 flex-wrap">
    {profile.labels?.length > 0 ? (
      profile.labels.map((lab, i) => (
        <span
          key={i}
          className="bg-[#FFE5A0] text-[#096B68] px-3 py-1 rounded-full"
        >
          {lab}
        </span>
      ))
    ) : (
      <p className="text-gray-500 text-sm">No labels yet</p>
    )}
  </div>
</div>

    {/* Skills */}
    <div>
      <p className="font-medium">Skills</p>
      {isEditing && (
        <div className="flex gap-2 mt-1">
          <input
            className="border flex-1 p-2 rounded-xl"
            value={newSkill}
            placeholder="Add a skill..."
            onChange={e => setNewSkill(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                updateProfileField("skills", [...profile.skills, newSkill]);
                setNewSkill("");
              }
            }}
          />
          <button
            onClick={() => {
              updateProfileField("skills", [...profile.skills, newSkill]);
              setNewSkill("");
            }}
            className="bg-[#129990] text-white px-3 rounded-lg"
          >
            <Plus size={14} />
          </button>
        </div>
      )}
      <div className="flex flex-wrap gap-2 mt-2">
        {profile.skills.map(s => (
          <span key={s} className="bg-[#90D1CA] px-2 py-1 rounded-xl flex items-center gap-1">
            {s}
            {isEditing && (
              <X
                size={12}
                className="cursor-pointer"
                onClick={() =>
                  updateProfileField("skills", profile.skills.filter(sk => sk !== s))
                }
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
            className="border flex-1 p-2 rounded-xl"
            value={newInterest}
            placeholder="Add an interest..."
            onChange={e => setNewInterest(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                updateProfileField("interests", [...profile.interests, newInterest]);
                setNewInterest("");
              }
            }}
          />
          <button
            onClick={() => {
              updateProfileField("interests", [...profile.interests, newInterest]);
              setNewInterest("");
            }}
            className="bg-[#129990] text-white px-3 rounded-lg"
          >
            <Plus size={14} />
          </button>
        </div>
      )}
      <div className="flex flex-wrap gap-2 mt-2">
        {profile.interests.map(i => (
          <span key={i} className="border px-2 py-1 rounded-xl flex items-center gap-1">
            {i}
            {isEditing && (
              <X
                size={12}
                className="cursor-pointer"
                onClick={() =>
                  updateProfileField("interests", profile.interests.filter(it => it !== i))
                }
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
          <div className="p-4 bg-white rounded-xl shadow mt-4 space-y-3">
            <h2 className="font-semibold">Team History</h2>
            <div className="p-3 border rounded-xl flex items-center justify-between">
              <div>
                <p className="font-medium">SIH Team 2024</p>
                <p className="text-xs text-gray-600">Smart city IoT solutions</p>
              </div>
              <span className="bg-[#90D1CA] px-2 rounded-lg">Active</span>
            </div>
          </div>
        )}

        {/* Settings */}
        {tab === "settings" && (
          <div className="p-4 bg-white rounded-xl shadow mt-4 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Settings size={16} /> Account Settings
            </h2>

            <div className="flex justify-between items-center">
              <label>Team invitations</label>
              <input
                type="checkbox"
                checked={notifications.invites}
                onChange={e => setNotifications({ ...notifications, invites: e.target.checked })}
              />
            </div>

            <div className="flex justify-between items-center">
              <label>New messages</label>
              <input
                type="checkbox"
                checked={notifications.messages}
                onChange={e => setNotifications({ ...notifications, messages: e.target.checked })}
              />
            </div>

            <div className="flex justify-between items-center">
              <label>Public profile</label>
              <input
                type="checkbox"
                checked={privacy.public}
                onChange={e => setPrivacy({ ...privacy, public: e.target.checked })}
              />
            </div>

            <div className="flex justify-between items-center">
              <label>Show skills</label>
              <input
                type="checkbox"
                checked={privacy.skills}
                onChange={e => setPrivacy({ ...privacy, skills: e.target.checked })}
              />
            </div>

            <div className="flex justify-between items-center">
              <label>Show activity status</label>
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
