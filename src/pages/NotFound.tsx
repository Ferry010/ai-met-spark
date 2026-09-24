import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Spark } from "@/components/Spark";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <Spark size={120} mood="thinking" />
      <p className="mt-6 font-display text-sm text-muted-foreground">Foutje 404</p>
      <h1 className="mb-3 text-4xl sm:text-5xl">Deze pagina bestaat niet</h1>
      <p className="mb-8 max-w-sm text-lg text-muted-foreground">Spark heeft overal gezocht, maar kon hem niet vinden.</p>
      <Button asChild size="lg">
        <Link to="/">Terug naar AI met Spark</Link>
      </Button>
    </div>
  );
};

export default NotFound;
