import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spark } from "@/components/Spark";
import { useToast } from "@/hooks/use-toast";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    // Supabase puts recovery tokens in the URL hash after redirect
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setValid(true);
      }
    });

    // Also try to parse the hash manually if already present on mount
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setValid(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = form.get("password") as string;
    const confirm = form.get("confirm_password") as string;

    if (!password || password.length < 8) {
      toast({ title: "Wachtwoord te kort", description: "Gebruik minimaal 8 tekens.", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Wachtwoorden komen niet overeen", description: "Probeer het opnieuw.", variant: "destructive" });
      return;
    }

    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);

    if (error) {
      toast({ title: "Opslaan mislukt", description: error.message, variant: "destructive" });
      return;
    }

    setDone(true);
    toast({ title: "Wachtwoord opgeslagen!" });
    setTimeout(() => navigate("/auth"), 2500);
  };

  return (
    <main className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center px-4 py-6 sm:py-10">
      <Link to="/" className="absolute top-4 left-4 text-sm font-display text-foreground/70 hover:text-foreground">← Home</Link>

      <div className="text-center mb-6 mt-8 sm:mt-0">
        <div className="scale-75 sm:scale-100 inline-block">
          <Spark size={120} mood="happy" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl mt-3">
          Nieuw wachtwoord
        </h1>
      </div>

      <div className="w-full max-w-md bg-card rounded-3xl shadow-pop border border-border p-5 sm:p-6">
        {done ? (
          <div className="text-center space-y-4">
            <div className="mx-auto h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl">
              ✓
            </div>
            <h2 className="font-display text-xl">Klaar!</h2>
            <p className="text-muted-foreground text-sm">
              Je wachtwoord is gewijzigd. We sturen je zo door naar het inlogscherm.
            </p>
            <Button asChild className="rounded-full font-display shadow-soft">
              <Link to="/auth">Nu inloggen</Link>
            </Button>
          </div>
        ) : !valid ? (
          <div className="text-center space-y-4">
            <div className="mx-auto h-14 w-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-2xl">
              ✋
            </div>
            <h2 className="font-display text-xl">Link verlopen of ongeldig</h2>
            <p className="text-muted-foreground text-sm">
              Deze link is niet meer geldig. Vraag een nieuwe resetlink aan.
            </p>
            <Button asChild className="rounded-full font-display shadow-soft">
              <Link to="/forgot-password">Nieuwe link aanvragen</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Kies een nieuw wachtwoord voor je account.
            </p>
            <div className="space-y-2">
              <Label htmlFor="password">Nieuw wachtwoord <span className="text-muted-foreground text-xs">(8+ tekens)</span></Label>
              <Input id="password" name="password" type="password" required minLength={8} className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm_password">Herhaal wachtwoord</Label>
              <Input id="confirm_password" name="confirm_password" type="password" required minLength={8} className="h-12 rounded-xl" />
            </div>
            <Button type="submit" disabled={busy} className="w-full h-14 rounded-full font-display text-base shadow-soft">
              {busy ? "…" : "Wachtwoord opslaan"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <Link to="/auth" className="underline hover:text-foreground">Terug naar inloggen</Link>
            </p>
          </form>
        )}
      </div>
    </main>
  );
};

export default ResetPassword;
