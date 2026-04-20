// Mock data for AI Smart Classroom teacher dashboard (iteration 1).
// Replace with Supabase queries in iteration 2.

export type ClassroomWorldId = 1 | 2 | 3;

export interface ClassroomStudent {
  id: string;
  firstName: string;
  age: 9 | 10 | 11;
  // index 0..23 of last completed lesson (-1 = not started)
  lessonsCompleted: number;
  // current lesson the student is working on (1..24)
  currentLesson: number;
  // hex-like seed for avatar color
  colorSeed: number;
  // optional: stuck on a lesson (>=3 attempts)
  stuckOnLesson?: number;
}

export interface ClassroomTeacher {
  firstName: string;
  fullName: string;
  school: string;
  city: string;
}

export interface ClassroomActivity {
  id: string;
  studentName: string;
  type: "badge" | "lesson_completed" | "stuck" | "started_world" | "perfect_score";
  text: string;
  whenLabel: string;
  warning?: boolean;
}

export const teacher: ClassroomTeacher = {
  firstName: "Marieke",
  fullName: "Marieke van der Berg",
  school: "OBS De Regenboog",
  city: "Rotterdam",
};

export const className = "Groep 7A";
export const classCode = "GROEP7A-MOL";

// 28 first names, ages 9-11
const NAMES = [
  "Sam", "Jesse", "Mila", "Noah", "Sara", "Emma", "Liam", "Luna",
  "Daan", "Julia", "Finn", "Tess", "Max", "Fleur", "Bram", "Sophie",
  "Lucas", "Nova", "Thijs", "Lisa", "Jayden", "Anna", "Owen", "Nina",
  "Milan", "Rosa", "Kai", "Amber",
] as const;

// Distribute progress per spec:
//  - 4 finished World 1 (lessons 1-8 done, currently on 9)
//  - 15 mid-World 1 (lessons 3-7)
//  - 9 on lesson 1 or 2
function buildStudents(): ClassroomStudent[] {
  return NAMES.map((name, i) => {
    const age = (9 + (i % 3)) as 9 | 10 | 11;
    let lessonsCompleted: number;
    let currentLesson: number;
    if (i < 4) {
      lessonsCompleted = 8;
      currentLesson = 9;
    } else if (i < 19) {
      // mid world 1: between lesson 3 and 7
      currentLesson = 3 + ((i - 4) % 5);
      lessonsCompleted = currentLesson - 1;
    } else {
      currentLesson = 1 + ((i - 19) % 2);
      lessonsCompleted = currentLesson - 1;
    }
    return {
      id: `s_${i + 1}`,
      firstName: name,
      age,
      lessonsCompleted,
      currentLesson,
      colorSeed: (name.charCodeAt(0) * 31 + i * 7) % 360,
      stuckOnLesson: name === "Noah" ? 5 : undefined,
    };
  });
}

export const students: ClassroomStudent[] = buildStudents();

// Lessons per world (1-8, 9-16, 17-24)
export function lessonsInWorld(worldId: ClassroomWorldId): number[] {
  const start = (worldId - 1) * 8 + 1;
  return Array.from({ length: 8 }, (_, i) => start + i);
}

export function worldProgress(worldId: ClassroomWorldId) {
  const lessons = lessonsInWorld(worldId);
  const totalSlots = students.length * lessons.length;
  let done = 0;
  // bar: how many students are currently on each lesson of this world
  const perLesson = lessons.map((lessonNumber) => {
    const studentsOnLesson = students.filter((s) => s.currentLesson === lessonNumber).length;
    const studentsCompleted = students.filter((s) => s.lessonsCompleted >= lessonNumber).length;
    done += studentsCompleted;
    return { lesson: lessonNumber, current: studentsOnLesson, completed: studentsCompleted };
  });
  return {
    perLesson,
    completedAvg: Math.round((done / totalSlots) * 100),
    studentsFinishedWorld: students.filter((s) => s.lessonsCompleted >= worldId * 8).length,
    lessonsDoneByClass: perLesson.filter((p) => p.completed === students.length).length,
  };
}

export function overallClassProgressPct(): number {
  const total = students.length * 24;
  const done = students.reduce((sum, s) => sum + s.lessonsCompleted, 0);
  return Math.round((done / total) * 100);
}

export const recentActivity: ClassroomActivity[] = [
  {
    id: "a1",
    studentName: "Jesse",
    type: "badge",
    text: "Jesse, badge Schild van Waakzaamheid verdiend",
    whenLabel: "2 min geleden",
  },
  {
    id: "a2",
    studentName: "Mila",
    type: "lesson_completed",
    text: "Mila, voltooide les 7",
    whenLabel: "14 min geleden",
  },
  {
    id: "a3",
    studentName: "Noah",
    type: "stuck",
    text: "Noah, 3e poging op les 5",
    whenLabel: "1 uur geleden",
    warning: true,
  },
  {
    id: "a4",
    studentName: "Sara",
    type: "lesson_completed",
    text: "Sara, startte les 4",
    whenLabel: "2 uur geleden",
  },
  {
    id: "a5",
    studentName: "Sam",
    type: "lesson_completed",
    text: "Sam, voltooide les 2",
    whenLabel: "3 uur geleden",
  },
  {
    id: "a6",
    studentName: "Luna",
    type: "perfect_score",
    text: "Luna, 100% score op quiz les 6",
    whenLabel: "4 uur geleden",
  },
];

export const WORLDS: { id: ClassroomWorldId; name: string; tagline: string; emoji: string }[] = [
  { id: 1, name: "VEILIG", tagline: "Blijf veilig online en bescherm je geheimen", emoji: "🛡️" },
  { id: 2, name: "SLIM", tagline: "Stel kritische vragen aan AI", emoji: "🧭" },
  { id: 3, name: "STERKER", tagline: "Gebruik AI als tutor, niet als snelweg", emoji: "⭐" },
];

// Lightweight lesson titles for the world detail view
export const lessonTitles: Record<number, string> = {
  1: "Wat is AI eigenlijk?",
  2: "AI in jouw dag",
  3: "Spot de nep, plaatjes",
  4: "Spot de nep, stemmen",
  5: "Phishing en oplichting",
  6: "Wat is privé en wat niet?",
  7: "Wachtwoorden als een pro",
  8: "Schild van Waakzaamheid",
  9: "AI maakt fouten",
  10: "Bron of bedenksel?",
  11: "WIE-WAT-HOE methode",
  12: "Goede prompts schrijven",
  13: "Hallucinaties herkennen",
  14: "Vergelijk twee antwoorden",
  15: "Stel betere vervolgvragen",
  16: "Kompas der Wijsheid",
  17: "AI als tutor, niet als afkijker",
  18: "Maak je eigen leerplan",
  19: "AI helpt met taal",
  20: "AI helpt met rekenen",
  21: "Brainstorm met AI",
  22: "Eerlijk werken met AI",
  23: "Toon je eigen denken",
  24: "Ster van de Doorzetter",
};
