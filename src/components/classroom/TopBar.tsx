import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Settings, GraduationCap } from "lucide-react";
import { teacher } from "@/data/classroomMock";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";

export const TopBar = () => {
  const navigate = useNavigate();
  const initial = teacher.firstName.charAt(0);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/teacher/login");
  };

  return (
    <header className="border-b border-classroom-border bg-classroom-surface">
      <div className="container max-w-7xl flex items-center justify-between h-16 px-4 md:px-8">
        <Link to="/teacher" className="flex items-center gap-2">
          <span className="grid place-items-center h-8 w-8 rounded-lg bg-classroom-teal text-white">
            <GraduationCap className="h-4 w-4" />
          </span>
          <span className="font-fraunces text-lg font-semibold text-classroom-teal">
            AI Smart Classroom
          </span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-classroom-bg transition-colors">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-classroom-dark leading-tight">
                {teacher.firstName}
              </div>
              <div className="text-xs text-classroom-muted leading-tight">{teacher.school}</div>
            </div>
            <div className="grid place-items-center h-9 w-9 rounded-full bg-classroom-amber/20 text-classroom-amber font-semibold">
              {initial}
            </div>
            <ChevronDown className="h-4 w-4 text-classroom-muted" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => navigate("/teacher/class/settings")}>
              <Settings className="h-4 w-4 mr-2" /> Klasinstellingen
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Uitloggen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
