import { Link } from "react-router-dom";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const TeacherLogin = () => {
  return (
    <div className="classroom-theme min-h-screen flex flex-col">
      <main className="flex-1 grid place-items-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2">
              <span className="grid place-items-center h-9 w-9 rounded-lg bg-classroom-teal text-white">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="font-fraunces text-xl font-semibold text-classroom-teal">
                AI Smart Classroom
              </span>
            </div>
            <div className="h-10 w-10 rounded-full bg-classroom-amber/30 grid place-items-center text-classroom-amber text-lg" aria-hidden>
              ✦
            </div>
          </div>

          <div className="rounded-xl border border-classroom-border bg-classroom-surface p-8">
            <h1 className="font-fraunces text-2xl text-classroom-dark mb-2">
              Welkom terug, juf of meester.
            </h1>
            <p className="text-classroom-muted text-sm mb-6">
              Log in om de voortgang van je klas te bekijken.
            </p>

            <div className="space-y-3">
              <Button
                asChild
                className="w-full h-11 bg-classroom-teal hover:bg-classroom-teal-dark text-white rounded-lg"
              >
                <Link to="/auth?teacher=1">Inloggen met e-mail</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full h-11 border-classroom-border text-classroom-dark rounded-lg"
              >
                <Link to="/teacher">Bekijk demo dashboard</Link>
              </Button>
            </div>

            <p className="text-sm text-classroom-muted mt-6 text-center">
              Nog geen account?{" "}
              <Link to="/schools/contact" className="text-classroom-teal font-medium hover:underline">
                Start gratis met je klas
              </Link>
            </p>
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-classroom-muted flex items-center justify-center gap-2">
        <ShieldCheck className="h-4 w-4 text-classroom-success" />
        Veilig voor AVG en kerndoelen 2027 ✓
      </footer>
    </div>
  );
};

export default TeacherLogin;
