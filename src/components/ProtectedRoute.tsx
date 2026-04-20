import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Spark } from "./Spark";

interface ProtectedProps {
  children: React.ReactNode;
  requireRole?: "teacher" | "admin";
}

export const ProtectedRoute = ({ children, requireRole }: ProtectedProps) => {
  const { user, roles, loading } = useAuth();
  const [waited, setWaited] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setWaited(true), 200);
    return () => clearTimeout(t);
  }, []);

  if (loading || !waited) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <Spark size={120} />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (requireRole && !roles.includes(requireRole) && !roles.includes("admin")) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
