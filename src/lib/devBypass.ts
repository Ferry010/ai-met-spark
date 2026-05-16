/**
 * Dev/preview-only admin bypass.
 *
 * Returns true on:
 *  - Vite dev mode (import.meta.env.DEV) — i.e. `npm run dev` / localhost
 *  - Lovable preview hosts (*.lovable.app / *.lovableproject.com / sandbox.lovable.dev)
 *
 * On a published custom domain or production build this is always false,
 * so route protection and role checks behave normally.
 *
 * NOTE: this only relaxes the client-side route guard. Supabase RLS is not
 * affected — admin pages that fetch protected data still require a real login.
 */
export const isDevAdminBypass = (): boolean => {
  if (typeof window === "undefined") return false;
  if (import.meta.env.DEV) return true;
  const host = window.location.hostname;
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".lovable.app") ||
    host.endsWith(".lovableproject.com") ||
    host.endsWith(".lovable.dev")
  );
};
