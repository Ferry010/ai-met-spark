import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Spark } from "./Spark";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, GraduationCap } from "lucide-react";

export const AppHeader = () => {
  const { profile, isTeacher } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border/60">
      <div className="container h-16 flex items-center justify-between gap-4">
        <Link to={isTeacher ? "/teacher" : "/dashboard"} className="flex items-center gap-2">
          <Spark size={40} animate={false} />
          <span className="font-display text-xl font-semibold">AI Smart Kids</span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full font-display gap-2">
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
                    <GraduationCap className="h-4 w-4 mr-2" /> Teacher dashboard
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild className="rounded-xl">
                <Link to="/account" className="cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" /> Account settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="rounded-xl cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
