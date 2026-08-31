import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ALL_LESSONS } from "@/content/lessons";

const ORDERED_LESSON_IDS = ALL_LESSONS.map((l) => l.id);
const TOTAL_LESSONS = ORDERED_LESSON_IDS.length;

export interface TeacherClass {
  school_id: string;
  class_name: string;
  class_code: string | null;
  student_count: number;
}

export interface ClassStudentRow {
  id: string;
  firstName: string;
  lessonsCompleted: number;
  /** 1-based position of the next lesson to do (or TOTAL_LESSONS when finished). */
  currentLesson: number;
  stars: number;
  xp: number;
  level: number;
  lastActive: string | null;
}

const classKey = (uid?: string) => ["teacher-class", uid ?? "none"] as const;
const rosterKey = (schoolId?: string) => ["class-roster", schoolId ?? "none"] as const;

/**
 * Teacher-side data: the teacher's own class (via my_teacher_class) plus the
 * live progress of the students who joined it. RLS guarantees a teacher only
 * ever sees their own class's students.
 */
export const useClassroom = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const classQuery = useQuery({
    queryKey: classKey(user?.id),
    enabled: !!user,
    queryFn: async (): Promise<TeacherClass | null> => {
      const { data, error } = await (supabase as any).rpc("my_teacher_class");
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      if (!row) return null;
      return {
        school_id: row.school_id,
        class_name: row.class_name,
        class_code: row.class_code,
        student_count: Number(row.student_count ?? 0),
      };
    },
  });

  const schoolId = classQuery.data?.school_id;

  const rosterQuery = useQuery({
    queryKey: rosterKey(schoolId),
    enabled: !!schoolId,
    queryFn: async (): Promise<ClassStudentRow[]> => {
      const db = supabase as any;
      const [students, progress, stats] = await Promise.all([
        db.rpc("list_students_in_my_school"),
        db.from("user_progress").select("user_id, lesson_id, stars, completed_at"),
        db.from("user_stats").select("user_id, xp, level, last_played_date"),
      ]);
      if (students.error) throw students.error;

      const progressByUser = new Map<string, { ids: Set<string>; stars: number; last: string | null }>();
      (progress.data ?? []).forEach((r: any) => {
        const cur = progressByUser.get(r.user_id) ?? { ids: new Set<string>(), stars: 0, last: null };
        cur.ids.add(r.lesson_id);
        cur.stars += r.stars ?? 0;
        if (!cur.last || (r.completed_at && r.completed_at > cur.last)) cur.last = r.completed_at;
        progressByUser.set(r.user_id, cur);
      });

      const statsByUser = new Map<string, { xp: number; level: number }>();
      (stats.data ?? []).forEach((r: any) => {
        statsByUser.set(r.user_id, { xp: r.xp ?? 0, level: r.level ?? 1 });
      });

      return ((students.data ?? []) as any[])
        .map((s): ClassStudentRow => {
          const p = progressByUser.get(s.id);
          const done = p ? p.ids.size : 0;
          const nextIdx = ORDERED_LESSON_IDS.findIndex((id) => !p?.ids.has(id));
          const st = statsByUser.get(s.id);
          return {
            id: s.id,
            firstName: s.first_name,
            lessonsCompleted: done,
            currentLesson: nextIdx === -1 ? TOTAL_LESSONS : nextIdx + 1,
            stars: p?.stars ?? 0,
            xp: st?.xp ?? 0,
            level: st?.level ?? 1,
            lastActive: p?.last ?? null,
          };
        })
        .sort((a, b) => b.lessonsCompleted - a.lessonsCompleted || a.firstName.localeCompare(b.firstName));
    },
  });

  const students = rosterQuery.data ?? [];
  const overallPct =
    students.length > 0
      ? Math.round(
          (students.reduce((sum, s) => sum + s.lessonsCompleted, 0) / (students.length * TOTAL_LESSONS)) * 100,
        )
      : 0;

  const createClass = useMutation({
    mutationFn: async (className: string): Promise<TeacherClass> => {
      const { data, error } = await (supabase as any).rpc("create_teacher_class", { _class_name: className });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      return {
        school_id: row.school_id,
        class_name: className,
        class_code: row.class_code,
        student_count: 0,
      };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: classKey(user?.id) }),
  });

  return {
    class: classQuery.data ?? null,
    isLoading: classQuery.isLoading || (!!schoolId && rosterQuery.isLoading),
    students,
    overallPct,
    totalLessons: TOTAL_LESSONS,
    createClass: createClass.mutateAsync,
    isCreating: createClass.isPending,
  };
};
