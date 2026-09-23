import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spark } from "@/components/Spark";
import { useToast } from "@/hooks/use-toast";
import { School } from "lucide-react";

export const ForgotPassword = () => {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    if (!email) return;

    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);

    if (error) {
      toast({ title: "Er ging iets mis", description: error.message, variant: "destructive" });
      return;
    }

    setSent(true);
    toast({ title: "E-mail verstuurd!", description: "Check je inbox voor de resetlink." });
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-6 sm:py-10">
      <Link to="/" className="absolute top-4 left-4 text-sm font-display text-foreground/70 hover:text-foreground">← Home</Link>

      <div className="text-center mb-6 mt-8 sm:mt-0">
        <div className="scale-75 sm:scale-100 inline-block">
          <Spark size={120} mood="happy" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl mt-3">
          Wachtwoord vergeten?
        </h1>
      </div>

      <div className="w-full max-w-md mb-4 flex gap-3 rounded-2xl bg-safe-soft p-4 text-sm">
        <School className="h-5 w-5 shrink-0 text-safe-dark" />
        <p>
          <strong>Log je in met een gebruikersnaam?</strong> Vraag je juf of meester om een nieuw wachtwoord. Die kan dat voor je
          instellen in het klasoverzicht.
        </p>
      </div>

      <div className="w-full max-w-md tile p-5 sm:p-6">
        {sent ? (
          <div className="text-center space-y-4">
            <div className="mx-auto h-14 w-14 rounded-full bg-success-soft text-success-dark flex items-center justify-center text-2xl">
              ✉
            </div>
            <h2 className="font-display text-xl">E-mail verstuurd!</h2>
            <p className="text-muted-foreground text-sm">
              We hebben een link gestuurd naar je inbox. Klik op de link in de e-mail om een nieuw wachtwoord in te stellen.
            </p>
            <Button asChild>
              <Link to="/auth">Terug naar inloggen</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Ouders en leerkrachten: vul je e-mailadres in en we sturen je een link om je wachtwoord opnieuw in te stellen.
            </p>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" required className="h-12 rounded-xl" />
            </div>
            <Button type="submit" disabled={busy} size="lg" className="w-full">
              {busy ? "…" : "Stuur resetlink"}
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

export default ForgotPassword;
