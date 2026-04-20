import { ReactNode } from "react";
import { TopBar } from "./TopBar";

interface ClassroomLayoutProps {
  children: ReactNode;
  hideTopBar?: boolean;
}

export const ClassroomLayout = ({ children, hideTopBar }: ClassroomLayoutProps) => {
  return (
    <div className="classroom-theme min-h-screen">
      {!hideTopBar && <TopBar />}
      <main className="container max-w-7xl py-8 px-4 md:px-8">{children}</main>
    </div>
  );
};
