import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Eye, X, Baby, GraduationCap, Users, School } from "lucide-react";
import { cn } from "@/lib/utils";

const HIDE_KEY = "admin-view-switcher-hidden";

interface ViewItem {
  to: string;
  label: string;
  Icon: typeof Eye;
  match: (path: string) => boolean;
}

const VIEWS: ViewItem[] = [
  { to: "/dashboard", label: "Leerling", Icon: Baby, match: (p) => p === "/dashboard" || p.startsWith("/world") || p.startsWith("/lesson") },
  { to: "/teacher", label: "Leerkracht", Icon: GraduationCap, match: (p) => p.startsWith("/teacher") },
  { to: "/admin/preview/parent", label: "Ouder", Icon: Users, match: (p) => p.startsWith("/admin/preview/parent") },
  { to: "/admin/preview/school", label: "School", Icon: School, match: (p) => p.startsWith("/admin/preview/school") },
];

export const AdminViewSwitcher = () => {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setHidden(sessionStorage.getItem(HIDE_KEY) === "1");
  }, []);

  if (loading || !isAdmin || hidden) return null;
  if (location.pathname === "/auth" || location.pathname === "/" || location.pathname === "/teacher/login") return null;

  const hide = () => {
    sessionStorage.setItem(HIDE_KEY, "1");
    setHidden(true);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-3">
      <div className="flex items-center gap-2 rounded-full bg-foreground/95 text-background backdrop-blur-md px-3 py-2 shadow-pop border border-foreground/20">
        <div className="flex items-center gap-1.5 pl-1 pr-2 text-xs font-display opacity-90 border-r border-background/20">
          <Eye className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Bekijk als</span>
        </div>
        <div className="flex items-center gap-1">
          {VIEWS.map((v) => {
            const active = v.match(location.pathname);
            return (
              <Link
                key={v.to}
                to={v.to}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-display transition-colors",
                  active ? "bg-background text-foreground" : "text-background/80 hover:bg-background/10",
                )}
              >
                <v.Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{v.label}</span>
              </Link>
            );
          })}
        </div>
        <button
          onClick={hide}
          className="ml-1 p-1.5 rounded-full text-background/60 hover:text-background hover:bg-background/10 transition-colors"
          aria-label="Verberg balk"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default AdminViewSwitcher;
