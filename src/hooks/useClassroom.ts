import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ALL_MISSIONS } from "@/content/missions";
import { isDevAdminBypass } from "@/lib/devBypass";

const MISSION_IDS = ALL_MISSIONS.map((m) => m.id);
export const TOTAL_MISSIONS = MISSION_IDS.length;
const INACTIVE_DAYS = 7;
const SELECTED_KEY = "teacher.selectedClass";

export interface TeacherClass {
  school_id: string;
  class_name: string;
  class_code: string | null;
  student_count: number;
}

export interface ClassStudentRow {
  id: string;
  firstName: string;
  username: string | null;
  schoolId: string;
  /** Best stars per mission id (missing = not done). */
  stars: Record<string, number>;
  done: number;
  totalStars: number;
  xp: number;
  level: number;
  lastActive: string | null;
  /** Why this student may need a hand, if at all. */
  attention: string | null;
}

const db = supabase as any;

const attentionFor = (s: Omit<ClassStudentRow, "attention">): string | null => {
  if (!s.lastActive) return "Nog niet begonnen";
  const days = (Date.now() - new Date(s.lastActive).getTime()) / 86_400_000;
  if (s.done < TOTAL_MISSIONS && days > INACTIVE_DAYS) return `${Math.floor(days)} dagen niet gespeeld`;
  if (s.done >= 3 && s.totalStars / s.done < 1.6) return "Veel missies met 1 ster";
  return null;
};

/**
 * Teacher-side data: the teacher's classes, the live progress of the students
 * in the selected class, and class actions. RLS guarantees a teacher only
 * ever sees students who joined one of their own classes.
 */
export const useClassroom = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const demo = !user && isDevAdminBypass();

  const classesQuery = useQuery({
    queryKey: ["teacher-classes", user?.id ?? (demo ? "demo" : "none")],
    enabled: !!user || demo,
    queryFn: async (): Promise<TeacherClass[]> => {
      if (demo) return DEMO_CLASSES;
      const { data, error } = await db.rpc("my_classes");
      if (error) throw error;
      return ((data ?? []) as any[]).map((r) => ({
        school_id: r.school_id,
        class_name: r.class_name,
        class_code: r.class_code,
        student_count: Number(r.student_count ?? 0),
      }));
    },
  });

  const classes = classesQuery.data ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(SELECTED_KEY);
    } catch {
      return null;
    }
  });
  const selected = classes.find((c) => c.school_id === selectedId) ?? classes[0] ?? null;

  useEffect(() => {
    if (!selected) return;
    try {
      localStorage.setItem(SELECTED_KEY, selected.school_id);
    } catch {}
  }, [selected]);

  const rosterQuery = useQuery({
    queryKey: ["class-roster", user?.id ?? (demo ? "demo" : "none")],
    enabled: classes.length > 0,
    queryFn: async (): Promise<ClassStudentRow[]> => {
      if (demo) return DEMO_STUDENTS;
      const [students, progress, stats] = await Promise.all([
        db.rpc("list_students_in_my_school"),
        db.from("user_progress").select("user_id, lesson_id, stars, completed_at"),
        db.from("user_stats").select("user_id, xp, level"),
      ]);
      if (students.error) throw students.error;

      const byUser = new Map<string, { stars: Record<string, number>; last: string | null }>();
      (progress.data ?? []).forEach((r: any) => {
        const cur = byUser.get(r.user_id) ?? { stars: {}, last: null };
        if (MISSION_IDS.includes(r.lesson_id)) cur.stars[r.lesson_id] = Math.max(cur.stars[r.lesson_id] ?? 0, r.stars ?? 0);
        if (!cur.last || r.completed_at > cur.last) cur.last = r.completed_at;
        byUser.set(r.user_id, cur);
      });
      const statsByUser = new Map<string, { xp: number; level: number }>();
      (stats.data ?? []).forEach((r: any) => statsByUser.set(r.user_id, { xp: r.xp ?? 0, level: r.level ?? 1 }));

      return ((students.data ?? []) as any[]).map((s) => {
        const p = byUser.get(s.id) ?? { stars: {}, last: null };
        const values = Object.values(p.stars);
        const st = statsByUser.get(s.id);
        const row = {
          id: s.id,
          firstName: s.first_name,
          username: s.username ?? null,
          schoolId: s.school_id,
          stars: p.stars,
          done: values.length,
          totalStars: values.reduce((a, b) => a + b, 0),
          xp: st?.xp ?? 0,
          level: st?.level ?? 1,
          lastActive: p.last,
        };
        return { ...row, attention: attentionFor(row) };
      });
    },
  });

  const students = useMemo(
    () =>
      (rosterQuery.data ?? [])
        .filter((s) => s.schoolId === selected?.school_id)
        .sort((a, b) => b.done - a.done || a.firstName.localeCompare(b.firstName)),
    [rosterQuery.data, selected?.school_id],
  );

  const overallPct = students.length
    ? Math.round((students.reduce((a, s) => a + s.done, 0) / (students.length * TOTAL_MISSIONS)) * 100)
    : 0;

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["teacher-classes"] });
    qc.invalidateQueries({ queryKey: ["class-roster"] });
  };

  const createFirstClass = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await db.rpc("create_teacher_class", { _class_name: name });
      if (error) throw error;
    },
    onSuccess: refresh,
  });

  const createClass = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await db.rpc("create_class", { _class_name: name });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      return row?.school_id as string | undefined;
    },
    onSuccess: (id) => {
      if (id) setSelectedId(id);
      refresh();
    },
  });

  const resetPassword = useMutation({
    mutationFn: async ({ studentId, password }: { studentId: string; password: string }) => {
      if (demo) return;
      const { error } = await db.rpc("teacher_reset_student_password", { _student: studentId, _password: password });
      if (error) throw error;
    },
  });

  const removeStudent = useMutation({
    mutationFn: async (studentId: string) => {
      if (demo) return;
      const { error } = await db.rpc("teacher_remove_student", { _student: studentId });
      if (error) throw error;
    },
    onSuccess: refresh,
  });

  return {
    demo,
    classes,
    class: selected,
    selectClass: setSelectedId,
    students,
    overallPct,
    totalMissions: TOTAL_MISSIONS,
    isLoading: classesQuery.isLoading || (classes.length > 0 && rosterQuery.isLoading),
    createFirstClass: createFirstClass.mutateAsync,
    isCreating: createFirstClass.isPending || createClass.isPending,
    createClass: createClass.mutateAsync,
    resetPassword: resetPassword.mutateAsync,
    removeStudent: removeStudent.mutateAsync,
  };
};

// ---------- Demo data (local development only) ----------

const DEMO_CLASSES: TeacherClass[] = [
  { school_id: "demo-7a", class_name: "Groep 7A", class_code: "SPARK-7K2Q", student_count: 8 },
  { school_id: "demo-8b", class_name: "Groep 8B", class_code: "SPARK-M3X9", student_count: 0 },
];

const demoStudent = (i: number, name: string, done: number, daysAgo: number | null, low = false): ClassStudentRow => {
  const stars: Record<string, number> = {};
  MISSION_IDS.slice(0, done).forEach((id, k) => (stars[id] = low ? 1 : ((i + k) % 3) + 1));
  const values = Object.values(stars);
  const row = {
    id: `demo-${i}`,
    firstName: name,
    username: `${name.toLowerCase()}.${10 + i}`,
    schoolId: "demo-7a",
    stars,
    done,
    totalStars: values.reduce((a, b) => a + b, 0),
    xp: done * 120,
    level: Math.max(1, Math.floor(done / 3) + 1),
    lastActive: daysAgo === null ? null : new Date(Date.now() - daysAgo * 86_400_000).toISOString(),
  };
  return { ...row, attention: attentionFor(row) };
};

const DEMO_STUDENTS: ClassStudentRow[] = [
  demoStudent(1, "Sam", 18, 0),
  demoStudent(2, "Mila", 14, 1),
  demoStudent(3, "Noah", 11, 0),
  demoStudent(4, "Lina", 9, 2),
  demoStudent(5, "Daan", 6, 12),
  demoStudent(6, "Yara", 5, 1, true),
  demoStudent(7, "Finn", 2, 3),
  demoStudent(8, "Sara", 0, null),
];
