import { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useAdminOverview } from "@/hooks/useAdmin";
import { isDevAdminBypass } from "@/lib/devBypass";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Overzicht", end: true },
  { to: "/admin/aanvragen", label: "Aanvragen", badge: "requests" as const },
  { to: "/admin/scholen", label: "Scholen" },
  { to: "/admin/leerkrachten", label: "Leerkrachten" },
  { to: "/admin/berichten", label: "Berichten" },
];

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: overview } = useAdminOverview();
  const demo = !user && isDevAdminBypass();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="classroom-theme min-h-screen">
      <header className="border-b border-classroom-border bg-classroom-surface">
        <div className="container flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-classroom-dark text-white">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span className="font-display text-lg">Spark admin</span>
          </Link>
          <button type="button" onClick={logout} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-classroom-muted hover:bg-classroom-bg">
            <LogOut className="h-4 w-4" /> Uitloggen
          </button>
        </div>
        <nav className="container flex max-w-7xl gap-1 overflow-x-auto px-4 md:px-8" aria-label="Admin">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium",
                  isActive ? "border-primary text-primary" : "border-transparent text-classroom-muted hover:text-classroom-dark",
                )
              }
            >
              {item.label}
              {item.badge === "requests" && !!overview?.openRequests && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-xs text-accent-foreground">
                  {overview.openRequests}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="container max-w-7xl px-4 py-6 md:px-8 md:py-8">
        {demo && (
          <div className="mb-4 rounded-xl bg-secondary-soft px-4 py-2 text-sm text-secondary-foreground">
            Voorbeeldgegevens: je bent niet ingelogd, dit zie je alleen bij lokaal testen. Knoppen doen niets.
          </div>
        )}
        {children}
      </main>
    </div>
  );
};
