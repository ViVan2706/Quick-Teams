"use client";
import { demoUser } from "@/app/lib/demoUser";

export default function HomePage() {
  const user = demoUser;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Welcome {user.name} 👋</h1>
      <p>Your role: {user.role}</p>
      <button className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg">
        Find a Team
      </button>
      <button className="mt-4 ml-2 px-4 py-2 bg-sky-600 text-white rounded-lg">
        Create a Team
      </button>
    </div>
  );
}
