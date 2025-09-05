// generate-firestore-users.js
import { writeFileSync } from "fs";

const roles = [
  "Developer",
  "Designer",
  "Project Manager",
  "Data Scientist",
  "Backend Engineer",
  "Frontend Developer",
  "QA Tester",
  "Researcher",
  "Cloud Engineer",
  "Mobile Developer",
  "Full Stack Developer",
  "Business Analyst",
  "Game Developer",
  "Product Manager",
  "DevOps Engineer",
  "Content Writer",
  "Cybersecurity Analyst",
  "AI Engineer",
  "Data Engineer",
  "Marketing Specialist"
];

const skills = [
  "React", "Node.js", "Firebase", "UI/UX", "Figma", "Illustrator", "Agile", "Scrum",
  "Python", "Pandas", "Machine Learning", "Java", "Spring", "SQL", "HTML", "CSS",
  "JavaScript", "Cypress", "Jest", "Manual Testing", "AI", "NLP", "Data Analysis",
  "AWS", "Docker", "Kubernetes", "Flutter", "React Native", "iOS", "Angular", "MongoDB",
  "Excel", "Stakeholder Management", "Unity", "C#", "3D Modeling", "Roadmaps", "Terraform",
  "Copywriting", "Editing", "Pen Testing", "Encryption", "TensorFlow", "PyTorch", "BigQuery",
  "ETL", "Spark", "Social Media", "Branding"
];

const genders = ["Male", "Female", "Other"];

function getRandom(arr, count = 3) {
  return arr.sort(() => 0.5 - Math.random()).slice(0, count);
}

// Firestore-like export
const users = Array.from({ length: 50 }, (_, i) => {
  const id = (i + 1).toString().padStart(3, "0");
  return {
    id: `u${id}`, // Firestore doc ID
    fields: {
      uid: `u${id}`,
      email: `user${id}@example.com`,
      name: `User ${id}`,
      role: roles[Math.floor(Math.random() * roles.length)],
      skills: getRandom(skills, 3),
      gender: genders[Math.floor(Math.random() * genders.length)]
    }
  };
});

// Wrap like Firestore export JSON
const firestoreExport = {
  users: users
};

writeFileSync("firestore-users.json", JSON.stringify(firestoreExport, null, 2));
console.log("✅ Generated firestore-users.json with 50 dummy users");
