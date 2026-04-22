import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
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
import { LogOut, Settings, GraduationCap, ShieldCheck } from "lucide-react";

export const AppHeader = () => {
  const { profile, isTeacher, isAdmin } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container flex min-h-14 items-center justify-between gap-2 py-2 md:min-h-16 md:py-0">
        <Link to={isTeacher ? "/teacher" : "/dashboard"} className="flex items-center gap-2 min-w-0">
          <Spark size={36} animate={false} />
          <span className="max-w-[150px] truncate font-display text-base font-semibold sm:max-w-none sm:text-xl">AI met Spark</span>
        </Link>
        <div className="flex items-center gap-2 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full font-display gap-2 h-10 sm:h-11 px-2 sm:px-3">
                <span className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {profile?.first_name?.charAt(0).toUpperCase() ?? "?"}
                </span>
                <span className="hidden sm:inline max-w-[100px] truncate">{profile?.first_name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl w-52">
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
