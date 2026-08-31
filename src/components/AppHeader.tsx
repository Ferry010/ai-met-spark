import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGameStats } from "@/hooks/useGameStats";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Spark } from "./Spark";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, GraduationCap, ShieldCheck, RotateCcw, Home } from "lucide-react";
import { GameGlyph } from "@/components/game/GameGlyph";

export const AppHeader = () => {
  const { profile, isTeacher, isAdmin, user } = useAuth();
  const { stats, progress, reset: resetStats } = useGameStats();
  const { resetProgress } = useUserProgress();
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const startOver = async () => {
    if (!window.confirm("Wil je opnieuw beginnen? Je sterren en punten op dit apparaat worden gewist.")) return;
    await Promise.all([resetProgress(), resetStats()]);
    navigate("/dashboard");
  };

  // Show the game stats for everyone playing (not for teachers).
  const showStats = !isTeacher;

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container flex min-h-14 items-center justify-between gap-2 py-2 md:min-h-16 md:py-0">
        <Link to={isTeacher ? "/teacher" : "/dashboard"} className="flex items-center gap-2 min-w-0">
          <Spark size={36} animate={false} />
          <span className="max-w-[150px] truncate font-display text-base font-semibold sm:max-w-none sm:text-xl">AI met Spark</span>
        </Link>
        <div className="flex items-center gap-2 shrink-0">
          {showStats && (
            <>
              <div className="hidden sm:inline-flex items-center gap-1 rounded-full border-2 border-[hsl(36_60%_28%)] bg-gradient-to-br from-[hsl(48_100%_72%)] to-[hsl(36_100%_50%)] text-[hsl(30_60%_18%)] px-2.5 py-1 font-display text-xs shadow-soft animate-coin-shine">
                <GameGlyph name="gem" size={14} /> Lv {progress.level}
              </div>
              {stats.streak_days > 0 && (
                <div className="inline-flex items-center gap-1 rounded-full border-2 border-foreground/30 bg-[hsl(0_100%_71%)] text-white px-2.5 py-1 font-display text-xs shadow-soft">
                  <GameGlyph name="flame" size={14} /> {stats.streak_days}
                </div>
              )}
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full font-display gap-2 h-10 sm:h-11 px-2 sm:px-3">
                <span className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {user ? profile?.first_name?.charAt(0).toUpperCase() ?? "?" : "☰"}
                </span>
                {user && <span className="hidden sm:inline max-w-[100px] truncate">{profile?.first_name}</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl w-52">
              <DropdownMenuItem asChild className="rounded-xl">
                <Link to="/dashboard" className="cursor-pointer">
                  <Home className="h-4 w-4 mr-2" /> Naar de kaart
                </Link>
              </DropdownMenuItem>

              {user ? (
                <>
                  {isTeacher && (
                    <DropdownMenuItem asChild className="rounded-xl">
                      <Link to="/teacher" className="cursor-pointer">
                        <GraduationCap className="h-4 w-4 mr-2" /> Dashboard leerkracht
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isAdmin && (
                    <DropdownMenuItem asChild className="rounded-xl">
                      <Link to="/admin/lessons" className="cursor-pointer">
                        <ShieldCheck className="h-4 w-4 mr-2" /> Beheer lessen
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild className="rounded-xl">
                    <Link to="/account" className="cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" /> Accountinstellingen
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="rounded-xl cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" /> Uitloggen
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={startOver} className="rounded-xl cursor-pointer">
                    <RotateCcw className="h-4 w-4 mr-2" /> Opnieuw beginnen
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="rounded-xl">
                    <Link to="/teacher/login" className="cursor-pointer">
                      <GraduationCap className="h-4 w-4 mr-2" /> Voor leerkrachten
                    </Link>
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
