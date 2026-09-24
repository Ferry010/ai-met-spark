import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { isDevAdminBypass } from "@/lib/devBypass";

const db = supabase as any;

export interface AdminOverview {
  schools: number;
  teachers: number;
  classes: number;
  classKids: number;
  homeKids: number;
  active7d: number;
  missionsDone: number;
  diplomas: number;
  openRequests: number;
  openInvites: number;
}

export interface AdminSchool {
  id: string;
  name: string;
  city: string | null;
  contactName: string | null;
  contactEmail: string | null;
  notes: string | null;
  createdAt: string;
  teacherCount: number;
  classCount: number;
  kidCount: number;
  avgMissions: number;
  active7d: number;
  openInvites: number;
}

export interface SchoolRequest {
  id: string;
  school_name: string;
  city: string;
  contact_name: string;
  contact_role: string | null;
  contact_email: string;
  class_count: number | null;
  message: string | null;
  status: "new" | "approved" | "rejected";
  organization_id: string | null;
  created_at: string;
}

export interface AdminTeacher {
  userId: string;
  firstName: string | null;
  email: string;
  organizationId: string | null;
  organizationName: string | null;
  classCount: number;
  kidCount: number;
  createdAt: string;
  lastSignInAt: string | null;
}

export interface AdminClass {
  id: string;
  name: string;
  classCode: string | null;
  teacherName: string | null;
  kidCount: number;
  avgMissions: number;
  finished: number;
  diplomas: number;
  lastActive: string | null;
}

export interface TeacherInvite {
  id: string;
  organization_id: string;
  code: string;
  name: string | null;
  email: string;
  created_at: string;
  expires_at: string;
  used_at: string | null;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  school: string;
  message: string | null;
  created_at: string;
}

const n = (v: unknown) => Number(v ?? 0);

const unwrap = async <T,>(p: PromiseLike<{ data: T; error: any }>): Promise<T> => {
  const { data, error } = await p;
  if (error) throw error;
  return data;
};

/** True on localhost without a login: the admin pages show demo data. */
const useDemo = () => {
  const { user } = useAuth();
  return { user, demo: !user && isDevAdminBypass() };
};

export const useAdminOverview = () => {
  const { user, demo } = useDemo();
  return useQuery({
    queryKey: ["admin", "overview", demo],
    enabled: !!user || demo,
    queryFn: async (): Promise<AdminOverview> => {
      if (demo) return DEMO_OVERVIEW;
      const [r] = (await unwrap(db.rpc("admin_overview"))) as any[];
      return {
        schools: n(r?.schools),
        teachers: n(r?.teachers),
        classes: n(r?.classes),
        classKids: n(r?.class_kids),
        homeKids: n(r?.home_kids),
        active7d: n(r?.active_7d),
        missionsDone: n(r?.missions_done),
        diplomas: n(r?.diplomas),
        openRequests: n(r?.open_requests),
        openInvites: n(r?.open_invites),
      };
    },
  });
};

export const useAdminSchools = () => {
  const { user, demo } = useDemo();
  return useQuery({
    queryKey: ["admin", "schools", demo],
    enabled: !!user || demo,
    queryFn: async (): Promise<AdminSchool[]> => {
      if (demo) return DEMO_SCHOOLS;
      const rows = (await unwrap(db.rpc("admin_schools"))) as any[];
      return (rows ?? []).map((r) => ({
        id: r.id,
        name: r.name,
        city: r.city,
        contactName: r.contact_name,
        contactEmail: r.contact_email,
        notes: r.notes,
        createdAt: r.created_at,
        teacherCount: n(r.teacher_count),
        classCount: n(r.class_count),
        kidCount: n(r.kid_count),
        avgMissions: n(r.avg_missions),
        active7d: n(r.active_7d),
        openInvites: n(r.open_invites),
      }));
    },
  });
};

export const useSchoolRequests = () => {
  const { user, demo } = useDemo();
  return useQuery({
    queryKey: ["admin", "requests", demo],
    enabled: !!user || demo,
    queryFn: async (): Promise<SchoolRequest[]> => {
      if (demo) return DEMO_REQUESTS;
      return (await unwrap(db.from("school_requests").select("*").order("created_at", { ascending: false }))) ?? [];
    },
  });
};

export const useAdminTeachers = () => {
  const { user, demo } = useDemo();
  return useQuery({
    queryKey: ["admin", "teachers", demo],
    enabled: !!user || demo,
    queryFn: async (): Promise<AdminTeacher[]> => {
      if (demo) return DEMO_TEACHERS;
      const rows = (await unwrap(db.rpc("admin_teachers"))) as any[];
      return (rows ?? []).map((r) => ({
        userId: r.user_id,
        firstName: r.first_name,
        email: r.email,
        organizationId: r.organization_id,
        organizationName: r.organization_name,
        classCount: n(r.class_count),
        kidCount: n(r.kid_count),
        createdAt: r.created_at,
        lastSignInAt: r.last_sign_in_at,
      }));
    },
  });
};

/** Classes of one school (null = classes that are not linked to a school). */
export const useAdminClasses = (orgId: string | null) => {
  const { user, demo } = useDemo();
  return useQuery({
    queryKey: ["admin", "classes", orgId, demo],
    enabled: !!user || demo,
    queryFn: async (): Promise<AdminClass[]> => {
      if (demo) return orgId ? DEMO_CLASSES : [];
      const rows = (await unwrap(db.rpc("admin_classes", { _org: orgId }))) as any[];
      return (rows ?? []).map((r) => ({
        id: r.id,
        name: r.name,
        classCode: r.class_code,
        teacherName: r.teacher_name,
        kidCount: n(r.kid_count),
        avgMissions: n(r.avg_missions),
        finished: n(r.finished),
        diplomas: n(r.diplomas),
        lastActive: r.last_active,
      }));
    },
  });
};

export const useSchoolInvites = (orgId: string | undefined) => {
  const { user, demo } = useDemo();
  return useQuery({
    queryKey: ["admin", "invites", orgId, demo],
    enabled: !!orgId && (!!user || demo),
    queryFn: async (): Promise<TeacherInvite[]> => {
      if (demo) return DEMO_INVITES;
      return (
        (await unwrap(db.from("teacher_invites").select("*").eq("organization_id", orgId).order("created_at", { ascending: false }))) ?? []
      );
    },
  });
};

export const useContactMessages = () => {
  const { user, demo } = useDemo();
  return useQuery({
    queryKey: ["admin", "messages", demo],
    enabled: !!user || demo,
    queryFn: async (): Promise<ContactMessage[]> => {
      if (demo) return DEMO_MESSAGES;
      return (await unwrap(db.from("school_inquiries").select("id, name, email, school, message, created_at").order("created_at", { ascending: false }).limit(200))) ?? [];
    },
  });
};

/** All admin actions. Every call is checked again on the server (admin role). */
export const useAdminActions = () => {
  const qc = useQueryClient();
  const { demo } = useDemo();
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin"] });
  const guard = () => {
    if (demo) throw new Error("Demo: log in als admin om dit echt te doen.");
  };

  const approveRequest = useMutation({
    mutationFn: async ({ requestId, inviteContact }: { requestId: string; inviteContact: boolean }) => {
      guard();
      const [r] = (await unwrap(db.rpc("admin_approve_request", { _request: requestId, _invite_contact: inviteContact }))) as any[];
      return { organizationId: r.organization_id as string, inviteCode: (r.invite_code ?? null) as string | null };
    },
    onSuccess: refresh,
  });

  const rejectRequest = useMutation({
    mutationFn: async (requestId: string) => {
      guard();
      await unwrap(db.from("school_requests").update({ status: "rejected", handled_at: new Date().toISOString() }).eq("id", requestId));
    },
    onSuccess: refresh,
  });

  const createSchool = useMutation({
    mutationFn: async (s: { name: string; city?: string; contactName?: string; contactEmail?: string }) => {
      guard();
      const row = await unwrap(
        db
          .from("organizations")
          .insert({
            name: s.name.trim(),
            city: s.city?.trim() || null,
            contact_name: s.contactName?.trim() || null,
            contact_email: s.contactEmail?.trim().toLowerCase() || null,
          })
          .select("id")
          .single(),
      );
      return (row as any).id as string;
    },
    onSuccess: refresh,
  });

  const updateNotes = useMutation({
    mutationFn: async ({ orgId, notes }: { orgId: string; notes: string }) => {
      guard();
      await unwrap(db.from("organizations").update({ notes: notes.trim() || null }).eq("id", orgId));
    },
    onSuccess: refresh,
  });

  const createInvite = useMutation({
    mutationFn: async ({ orgId, name, email }: { orgId: string; name: string; email: string }) => {
      guard();
      const row = await unwrap(
        db
          .from("teacher_invites")
          .insert({ organization_id: orgId, name: name.trim() || null, email: email.trim().toLowerCase() })
          .select("*")
          .single(),
      );
      return row as TeacherInvite;
    },
    onSuccess: refresh,
  });

  const revokeInvite = useMutation({
    mutationFn: async (inviteId: string) => {
      guard();
      await unwrap(db.from("teacher_invites").delete().eq("id", inviteId));
    },
    onSuccess: refresh,
  });

  const assignTeacher = useMutation({
    mutationFn: async ({ userId, orgId }: { userId: string; orgId: string }) => {
      guard();
      await unwrap(db.rpc("admin_assign_teacher", { _user: userId, _org: orgId }));
    },
    onSuccess: refresh,
  });

  const removeTeacher = useMutation({
    mutationFn: async (userId: string) => {
      guard();
      await unwrap(db.rpc("admin_remove_teacher", { _user: userId }));
    },
    onSuccess: refresh,
  });

  const deleteSchool = useMutation({
    mutationFn: async (orgId: string) => {
      guard();
      await unwrap(db.rpc("admin_delete_school", { _org: orgId }));
    },
    onSuccess: refresh,
  });

  return {
    approveRequest: approveRequest.mutateAsync,
    rejectRequest: rejectRequest.mutateAsync,
    createSchool: createSchool.mutateAsync,
    updateNotes: updateNotes.mutateAsync,
    createInvite: createInvite.mutateAsync,
    revokeInvite: revokeInvite.mutateAsync,
    assignTeacher: assignTeacher.mutateAsync,
    removeTeacher: removeTeacher.mutateAsync,
    deleteSchool: deleteSchool.mutateAsync,
    busy:
      approveRequest.isPending ||
      rejectRequest.isPending ||
      createSchool.isPending ||
      createInvite.isPending ||
      revokeInvite.isPending ||
      assignTeacher.isPending ||
      removeTeacher.isPending ||
      deleteSchool.isPending,
  };
};

/** The message the admin sends a teacher along with their code. */
export const inviteMessage = (invite: Pick<TeacherInvite, "code" | "name" | "email" | "expires_at">, schoolName: string) => {
  const until = new Date(invite.expires_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
  return [
    `Hoi${invite.name ? ` ${invite.name.split(" ")[0]}` : ""},`,
    "",
    `${schoolName} doet mee met AI met Spark, de gratis AI-school voor kids. Met deze persoonlijke code maak je je leerkracht-account aan:`,
    "",
    invite.code,
    "",
    `1. Ga naar ${window.location.origin}/teacher/start`,
    `2. Vul de code in met dit e-mailadres: ${invite.email}`,
    "3. Maak je klas aan en deel de klassencode met je leerlingen.",
    "",
    `De code is alleen voor jou en werkt tot ${until}.`,
    "",
    "Groet,",
    "Ferry Hoes",
    "AI met Spark",
  ].join("\n");
};

// ---------- Demo data (localhost without a login) ----------
const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();
const DEMO_OVERVIEW: AdminOverview = {
  schools: 2,
  teachers: 4,
  classes: 5,
  classKids: 112,
  homeKids: 38,
  active7d: 64,
  missionsDone: 1290,
  diplomas: 17,
  openRequests: 2,
  openInvites: 1,
};
const DEMO_SCHOOLS: AdminSchool[] = [
  { id: "demo-1", name: "De Regenboog", city: "Utrecht", contactName: "Sanne de Vries", contactEmail: "sanne@regenboog.nl", notes: "Start na de herfstvakantie.", createdAt: daysAgo(40), teacherCount: 3, classCount: 4, kidCount: 91, avgMissions: 9.4, active7d: 52, openInvites: 1 },
  { id: "demo-2", name: "Het Kompas", city: "Zwolle", contactName: "Mo Bakker", contactEmail: "m.bakker@hetkompas.nl", notes: null, createdAt: daysAgo(12), teacherCount: 1, classCount: 1, kidCount: 21, avgMissions: 3.1, active7d: 12, openInvites: 0 },
];
const DEMO_REQUESTS: SchoolRequest[] = [
  { id: "r1", school_name: "OBS De Vlinder", city: "Amersfoort", contact_name: "Eva Jansen", contact_role: "Leerkracht", contact_email: "eva@obsdevlinder.nl", class_count: 2, message: "Wij willen graag met groep 7 en 8 meedoen.", status: "new", organization_id: null, created_at: daysAgo(1) },
  { id: "r2", school_name: "Basisschool 't Anker", city: "Den Helder", contact_name: "Pieter Smit", contact_role: "Directie", contact_email: "directie@tanker.nl", class_count: 6, message: null, status: "new", organization_id: null, created_at: daysAgo(3) },
  { id: "r3", school_name: "Het Kompas", city: "Zwolle", contact_name: "Mo Bakker", contact_role: "ICT-coördinator", contact_email: "m.bakker@hetkompas.nl", class_count: 1, message: null, status: "approved", organization_id: "demo-2", created_at: daysAgo(13) },
];
const DEMO_TEACHERS: AdminTeacher[] = [
  { userId: "t0", firstName: "Joris", email: "joris@gmail.com", organizationId: null, organizationName: null, classCount: 1, kidCount: 0, createdAt: daysAgo(60), lastSignInAt: daysAgo(50) },
  { userId: "t1", firstName: "Sanne", email: "sanne@regenboog.nl", organizationId: "demo-1", organizationName: "De Regenboog", classCount: 2, kidCount: 48, createdAt: daysAgo(39), lastSignInAt: daysAgo(1) },
  { userId: "t2", firstName: "Ahmed", email: "ahmed@regenboog.nl", organizationId: "demo-1", organizationName: "De Regenboog", classCount: 2, kidCount: 43, createdAt: daysAgo(30), lastSignInAt: daysAgo(4) },
  { userId: "t3", firstName: "Mo", email: "m.bakker@hetkompas.nl", organizationId: "demo-2", organizationName: "Het Kompas", classCount: 1, kidCount: 21, createdAt: daysAgo(11), lastSignInAt: daysAgo(2) },
];
const DEMO_CLASSES: AdminClass[] = [
  { id: "c1", name: "Groep 7A", classCode: "SPARK-7Q2M", teacherName: "Sanne", kidCount: 24, avgMissions: 11.2, finished: 5, diplomas: 4, lastActive: daysAgo(0) },
  { id: "c2", name: "Groep 8B", classCode: "SPARK-K9TX", teacherName: "Sanne", kidCount: 24, avgMissions: 14.8, finished: 11, diplomas: 9, lastActive: daysAgo(1) },
  { id: "c3", name: "Groep 6", classCode: "SPARK-3HPD", teacherName: "Ahmed", kidCount: 22, avgMissions: 4.5, finished: 0, diplomas: 0, lastActive: daysAgo(6) },
  { id: "c4", name: "Groep 7B", classCode: "SPARK-W4NE", teacherName: "Ahmed", kidCount: 21, avgMissions: 0, finished: 0, diplomas: 0, lastActive: null },
];
const DEMO_INVITES: TeacherInvite[] = [
  { id: "i1", organization_id: "demo-1", code: "LK-7QXM-3H9P", name: "Lotte Visser", email: "lotte@regenboog.nl", created_at: daysAgo(2), expires_at: daysAgo(-28), used_at: null },
  { id: "i2", organization_id: "demo-1", code: "LK-B2RT-8KWA", name: "Sanne de Vries", email: "sanne@regenboog.nl", created_at: daysAgo(40), expires_at: daysAgo(10), used_at: daysAgo(39) },
];
const DEMO_MESSAGES: ContactMessage[] = [
  { id: "m1", name: "Linda", email: "linda@mail.nl", school: "-", message: "Mijn zoon vindt de missies geweldig! Komen er meer?", created_at: daysAgo(2) },
];
