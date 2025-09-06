"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const QUESTIONS = [
  {
    id: 1,
    text: "In a new team project, what’s the first thing you usually do?",
    options: [
      "Suggest a structure and divide tasks",
      "Wait to see what others want to do",
      "Start working on what I know best",
      "Brainstorm wild ideas for the project"
    ]
  },
  {
    id: 2,
    text: "Which type of task excites you the most in a project?",
    options: [
      "Coding or solving technical problems",
      "Designing visuals, logos, or stories",
      "Coordinating people and planning timelines",
      "Researching trends and gathering insights"
    ]
  },
  {
    id: 3,
    text: "How do you usually approach deadlines?",
    options: [
      "Create a schedule and stick to it",
      "Adjust as things change along the way",
      "Focus on accuracy, even if it’s slower",
      "Think about long-term impact, not just the date"
    ]
  },
  {
    id: 4,
    text: "Why do you usually join a team activity/project?",
    options: [
      "To learn new skills or knowledge",
      "To achieve something meaningful",
      "To meet people and enjoy teamwork",
      "To build my portfolio or career"
    ]
  },
  {
    id: 5,
    text: "If conflicts arise in your team, how do you handle them?",
    options: [
      "Take initiative and mediate the discussion",
      "Support whichever side needs balance",
      "Stay quiet but focus on finishing my part",
      "Propose creative alternatives to solve it"
    ]
  },
  {
    id: 6,
    text: "When working on a big idea, what role do you naturally take?",
    options: [
      "Organizing the plan and leading",
      "Helping the team stay positive and connected",
      "Breaking down details and executing tasks",
      "Pushing for innovation and experimentation"
    ]
  },
  {
    id: 7,
    text: "What’s your biggest strength in group work?",
    options: [
      "Logical problem-solving",
      "Clear communication",
      "Creativity and imagination",
      "Consistency in delivering work"
    ]
  },
  {
    id: 8,
    text: "What frustrates you the most in a team project?",
    options: [
      "Lack of structure or unclear goals",
      "People not getting along",
      "Work not being completed on time",
      "No room for new or bold ideas"
    ]
  },
  {
    id: 9,
    text: "If the project is failing, what’s your first reaction?",
    options: [
      "Step up and try to reorganize things",
      "Motivate the team and keep spirits up",
      "Stick to my tasks and finish them anyway",
      "Suggest a different or creative direction"
    ]
  },
  {
    id: 10,
    text: "What motivates you to keep contributing to a project?",
    options: [
      "Learning and growing",
      "Winning or achieving success",
      "Collaboration and teamwork",
      "Making an impact in the real world"
    ]
  }
];

export default function QuizPage() {
  const [answers, setAnswers] = useState({});
  const router = useRouter();

  const handleChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    const formatted = QUESTIONS.map(q => ({
      question: q.text,
      answer: answers[q.id] || ""
    }));

    try {
      const res = await fetch("/api/generatelabels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: formatted })
      });

      const data = await res.json();

      if (data.labels) {
        localStorage.setItem("labels", JSON.stringify(data.labels));
        router.push("/profilePage");
      } else {
        alert("Failed to generate labels.");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="p-12 max-w-2xl mx-auto space-y-6 bg-[#FFFBDE] min-h-screen">
      <h2 className="text-2xl font-bold text-[#096B68]">Label Quizz</h2>

      {QUESTIONS.map(q => (
        <div key={q.id} className="space-y-3">
          <p className="font-semibold text-[#096B68]">{q.text}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleChange(q.id, opt)}
                className={`rounded-lg p-3 text-left transition border shadow-sm
                  ${
                    answers[q.id] === opt
                      ? "bg-[#129990] text-white border-[#129990]"
                      : "bg-white text-[#096B68] hover:bg-[#90D1CA]/20"
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="w-full bg-[#096B68] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#075E5C] transition"
      >
        Submit Quiz
      </button>
    </div>
  );
}
