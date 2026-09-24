import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, School, Home, Check, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Spark } from "@/components/Spark";
import { useToast } from "@/hooks/use-toast";
import { isValidUsername, loginEmailFor, normalizeUsername } from "@/lib/kidAccounts";
import { cn } from "@/lib/utils";

const SHOW_GOOGLE = import.meta.env.VITE_ENABLE_GOOGLE === "true";
const AGES = [8, 9, 10, 11, 12, 13];

type Path = "class" | "home";

export const Auth = () => {
  const [search] = useSearchParams();
  const [tab, setTab] = useState<"login" | "signup">(search.get("mode") === "signup" ? "signup" : "login");
  const [path, setPath] = useState<Path | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard", { replace: true });
    });
  }, [navigate]);

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Brand panel (desktop) */}
      <aside className="hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <Link to="/" className="flex items-center gap-2 font-display text-xl">
          <Spark size={40} animate={false} /> AI met Spark
        </Link>
        <div>
          <Spark size={140} mood="happy" waving />
          <h1 className="mt-6 text-5xl leading-[0.95] text-primary-foreground">Word slim met AI.</h1>
          <p className="mt-4 max-w-md text-lg opacity-90">18 korte missies vol mini-games. Altijd gratis, zonder reclame en zonder chat met een echte AI.</p>
        </div>
        <p className="text-sm opacity-80">Voor kids van 9 tot 12 jaar</p>
      </aside>

      <main className="flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground lg:hidden">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>

          <div className="mb-6 grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1">
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "h-11 rounded-xl font-display transition-colors",
                  tab === t ? "bg-card text-foreground shadow-[0_2px_0_hsl(var(--border))]" : "text-muted-foreground",
                )}
              >
                {t === "login" ? "Inloggen" : "Account maken"}
              </button>
            ))}
          </div>

          {tab === "login" ? (
            <LoginForm />
          ) : path === null ? (
            <ChoosePath onChoose={setPath} />
          ) : (
            <SignupForm path={path} onBack={() => setPath(null)} />
          )}

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Leerkracht?{" "}
            <Link to="/teacher/start" className="font-medium text-primary hover:underline">
              Ga naar het leerkrachtenportaal
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

const LoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const identifier = String(form.get("identifier") ?? "").trim();
    const password = String(form.get("password") ?? "");
    if (!identifier || !password) return;
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmailFor(identifier), password });
    setBusy(false);
    if (error) {
      toast({ title: "Dat klopt niet helemaal", description: "Check je gebruikersnaam en wachtwoord.", variant: "destructive" });
      return;
    }
    navigate("/dashboard");
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <h2 className="text-3xl">Welkom terug!</h2>
      <div className="space-y-2">
        <Label htmlFor="identifier">Gebruikersnaam</Label>
        <Input id="identifier" name="identifier" autoComplete="username" autoCapitalize="none" required className="h-12 rounded-xl text-base" />
        <p className="text-xs text-muted-foreground">Ouders en leerkrachten vullen hier hun e-mailadres in.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Wachtwoord</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required className="h-12 rounded-xl text-base" />
      </div>
      <Button type="submit" size="lg" disabled={busy} className="mt-2 w-full">
        {busy ? "…" : "Inloggen"}
      </Button>
      <Link to="/forgot-password" className="text-center text-sm text-muted-foreground hover:text-foreground hover:underline">
        Wachtwoord vergeten?
      </Link>
      {SHOW_GOOGLE && (
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/dashboard` } })}
        >
          Verder met Google
        </Button>
      )}
    </form>
  );
};

const ChoosePath = ({ onChoose }: { onChoose: (p: Path) => void }) => (
  <div className="flex flex-col gap-3">
    <h2 className="mb-1 text-3xl">Hoe begin je?</h2>
    <button type="button" onClick={() => onChoose("class")} className="press tile flex items-center gap-4 p-5 text-left hover:bg-muted/50">
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-safe text-safe-foreground">
        <School className="h-7 w-7" />
      </span>
      <span>
        <span className="block font-display text-xl">Ik heb een klassencode</span>
        <span className="text-sm text-muted-foreground">Je juf of meester gaf je een code.</span>
      </span>
    </button>
    <button type="button" onClick={() => onChoose("home")} className="press tile flex items-center gap-4 p-5 text-left hover:bg-muted/50">
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-smart text-smart-foreground">
        <Home className="h-7 w-7" />
      </span>
      <span>
        <span className="block font-display text-xl">Ik speel thuis</span>
        <span className="text-sm text-muted-foreground">Samen met een ouder of verzorger.</span>
      </span>
    </button>
  </div>
);

const SignupForm = ({ path, onBack }: { path: Path; onBack: () => void }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [className, setClassName] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkCode = async (code: string) => {
    setClassName(null);
    if (!code.trim()) return;
    const { data } = await supabase.rpc("validate_class_code", { _code: code.trim().toUpperCase() });
    const row = Array.isArray(data) ? data[0] : null;
    if (row?.school_name) setClassName(row.school_name);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const firstName = String(form.get("first_name") ?? "").trim();
    const age = Number(form.get("age"));
    const username = normalizeUsername(String(form.get("username") ?? ""));
    const password = String(form.get("password") ?? "");
    const code = String(form.get("class_code") ?? "").trim().toUpperCase();
    const parentEmail = String(form.get("parent_email") ?? "").trim();

    if (!firstName) return setError("Vul je voornaam in.");
    if (!isValidUsername(username)) return setError("Je gebruikersnaam heeft 3 tot 20 tekens: letters, cijfers, punt, streepje of _.");
    if (password.length < 6) return setError("Je wachtwoord heeft minstens 6 tekens.");
    if (path === "class" && !code) return setError("Vul de klassencode in.");
    if (path === "home" && !/^\S+@\S+\.\S+$/.test(parentEmail)) return setError("Vul het e-mailadres van je ouder in.");
    if (path === "home" && !consent) return setError("Een ouder moet toestemming geven.");

    setBusy(true);
    try {
      if (path === "class") {
        const { data } = await supabase.rpc("validate_class_code", { _code: code });
        if (!Array.isArray(data) || data.length === 0) return setError("Die klassencode kennen we niet. Check hem nog eens.");
      }
      const { data: free } = await (supabase as any).rpc("username_available", { _username: username });
      if (free === false) return setError("Die gebruikersnaam is al bezet. Kies een andere.");

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: loginEmailFor(username),
        password,
        options: {
          data: {
            first_name: firstName,
            age,
            username,
            language: "nl",
            class_code: path === "class" ? code : null,
            parent_email: path === "home" ? parentEmail : null,
            parent_consent: path === "home" ? "true" : null,
          },
        },
      });
      if (signUpError) {
        if (/registered|exists/i.test(signUpError.message)) return setError("Die gebruikersnaam is al bezet. Kies een andere.");
        return setError(signUpError.message);
      }
      if (!data.session) {
        toast({ title: "Bijna klaar", description: "Log nu in met je gebruikersnaam en wachtwoord." });
        return;
      }
      toast({ title: `Welkom, ${firstName}!` });
      navigate("/dashboard");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <button type="button" onClick={onBack} className="inline-flex w-fit items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Terug
      </button>
      <h2 className="text-3xl">{path === "class" ? "Doe mee met je klas" : "Maak je account"}</h2>

      {path === "class" && (
        <div className="space-y-2">
          <Label htmlFor="class_code">Klassencode</Label>
          <Input
            id="class_code"
            name="class_code"
            placeholder="SPARK-7K2Q"
            onBlur={(e) => checkCode(e.currentTarget.value)}
            className="h-12 rounded-xl text-base uppercase"
            autoCapitalize="characters"
          />
          {className && (
            <p className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-sm font-medium text-success-dark">
              <Check className="h-4 w-4" /> Je komt in klas {className}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-[1fr_110px] gap-3">
        <div className="space-y-2">
          <Label htmlFor="first_name">Voornaam</Label>
          <Input id="first_name" name="first_name" maxLength={40} className="h-12 rounded-xl text-base" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">Leeftijd</Label>
          <select id="age" name="age" defaultValue={10} className="h-12 w-full rounded-xl border border-input bg-background px-3 text-base">
            {AGES.map((a) => (
              <option key={a} value={a}>
                {a} jaar
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Kies een gebruikersnaam</Label>
        <Input id="username" name="username" autoComplete="username" autoCapitalize="none" placeholder="bijv. sam.speurneus" className="h-12 rounded-xl text-base" />
        <p className="text-xs text-muted-foreground">Gebruik niet je achternaam. Je hebt geen e-mailadres nodig.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Wachtwoord (minstens 6 tekens)</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" className="h-12 rounded-xl text-base" />
      </div>

      {path === "home" && (
        <div className="rounded-2xl border-2 border-smart bg-smart-soft p-4">
          <div className="mb-3 flex items-center gap-2 font-display text-lg">
            <ShieldCheck className="h-5 w-5" /> Voor je ouder of verzorger
          </div>
          <div className="mb-3 space-y-2">
            <Label htmlFor="parent_email">E-mailadres van de ouder</Label>
            <Input id="parent_email" name="parent_email" type="email" className="h-12 rounded-xl bg-card text-base" />
          </div>
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug">
            <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} className="mt-0.5" />
            <span>
              Ik ben de ouder of verzorger en geef toestemming dat mijn kind AI met Spark gebruikt. We bewaren alleen een
              gebruikersnaam, voornaam, leeftijd, dit e-mailadres en de voortgang.{" "}
              <Link to="/privacy" className="underline" target="_blank">
                Privacy
              </Link>
            </span>
          </label>
        </div>
      )}

      {error && <p className="rounded-xl bg-destructive-soft px-3 py-2 text-sm font-medium text-destructive-dark">{error}</p>}

      <Button type="submit" size="lg" disabled={busy} className="mt-1 w-full">
        {busy ? "…" : "Account maken"}
      </Button>
    </form>
  );
};

export default Auth;
