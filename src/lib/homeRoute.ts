import { supabase } from "@/integrations/supabase/client";

/** Where someone lands after logging in: admin → /admin, teacher → /teacher, kids → /dashboard. */
export const homeRouteFor = async (userId: string): Promise<string> => {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const roles = (data ?? []).map((r: any) => r.role as string);
  if (roles.includes("admin")) return "/admin";
  if (roles.includes("teacher")) return "/teacher";
  return "/dashboard";
};
