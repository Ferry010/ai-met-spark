import { Link, useNavigate } from "react-router-dom";
import { Flame, Zap, LogOut, Settings, GraduationCap, Map } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useGameStats } from "@/hooks/useGameStats";
import { supabase } from "@/integrations/supabase/client";
import { Spark } from "./Spark";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const AppHeader = () => {
  const { profile, isTeacher, user } = useAuth();
  const { stats, progress } = useGameStats();
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const initial = profile?.first_name?.charAt(0).toUpperCase() ?? "?";

  return (
    <header className="sticky top-0 z-30 bg-night text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4">
        <Link to={isTeacher ? "/teacher" : "/dashboard"} className="flex min-w-0 items-center gap-2">
          <Spark size={36} animate={false} />
          <span className="truncate font-display text-xl">Spark</span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1.5 font-display text-sm" title="Dagen op rij">
            <Flame className="h-4 w-4 text-[#F5709F]" /> {stats.streak_days}
          </span>
          <span className="hidden items-center gap-1 rounded-full bg-white/10 px-2.5 py-1.5 font-display text-sm sm:inline-flex" title="XP">
            <Zap className="h-4 w-4 fill-secondary text-secondary" /> {stats.xp}
          </span>
          <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1.5 font-display text-sm" title="Level">
            Lv {progress.level}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger
              className="press press-secondary ml-1 grid h-10 w-10 place-items-center rounded-full bg-secondary font-display text-secondary-foreground"
              aria-label="Menu"
            >
              {initial}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5">
              {profile?.first_name && (
                <div className="px-3 py-2 text-sm">
                  <div className="font-display">{profile.first_name}</div>
                  <div className="text-xs text-muted-foreground">Level {progress.level} · {stats.xp} XP</div>
                </div>
              )}
              <DropdownMenuItem asChild className="rounded-xl">
                <Link to="/dashboard" className="cursor-pointer">
                  <Map className="mr-2 h-4 w-4" /> Mijn missies
                </Link>
              </DropdownMenuItem>
              {isTeacher && (
                <DropdownMenuItem asChild className="rounded-xl">
                  <Link to="/teacher" className="cursor-pointer">
                    <GraduationCap className="mr-2 h-4 w-4" /> Mijn klas
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild className="rounded-xl">
                <Link to="/account" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" /> Account en klas
                </Link>
              </DropdownMenuItem>
              {user && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer rounded-xl">
                    <LogOut className="mr-2 h-4 w-4" /> Uitloggen
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
