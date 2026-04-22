import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import i18n from "@/i18n";

export const Account = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  if (!profile) return null;

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const form = new FormData(e.currentTarget);
    setBusy(true);
    const language = String(form.get("language") || "nl") as "en" | "nl" | "es";
    const { error } = await supabase.from("profiles").update({
      first_name: String(form.get("first_name") || profile.first_name),
      language,
    }).eq("id", user.id);
    setBusy(false);
    if (error) {
      toast({ title: "Kon niet opslaan", description: error.message, variant: "destructive" });
      return;
    }
    localStorage.setItem("aisk_lang", language);
    i18n.changeLanguage(language);
    refreshProfile();
    toast({ title: "Opgeslagen!" });
  };

  const resetProgress = async () => {
    if (!user) return;
    if (!confirm("Alle lesvoortgang resetten? Dit kan niet ongedaan worden.")) return;
    await supabase.from("user_progress").delete().eq("user_id", user.id);
    await supabase.from("final_test_attempts").delete().eq("user_id", user.id);
    toast({ title: "Voortgang gereset" });
    navigate("/dashboard");
  };

  const deleteAccount = async () => {
    if (!confirm("Account verwijderen? Dit wist permanent alle data.")) return;
    if (!user) return;
    await supabase.auth.signOut();
    toast({ title: "Uitgelogd", description: "Mail support om je account volledig te verwijderen." });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6 md:py-8 max-w-xl">
        <h1 className="font-display text-2xl sm:text-3xl mb-6">Accountinstellingen</h1>

        <form onSubmit={save} className="rounded-3xl bg-card border border-border p-6 shadow-soft space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="first_name">Voornaam</Label>
            <Input id="first_name" name="first_name" defaultValue={profile.first_name} maxLength={40} className="h-12 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Taal</Label>
            <Select name="language" defaultValue={profile.language}>
              <SelectTrigger id="language" className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="nl">🇳🇱 Nederlands</SelectItem>
                <SelectItem value="en">🇬🇧 English</SelectItem>
                <SelectItem value="es">🇪🇸 Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={busy} className="w-full h-14 rounded-full font-display bg-primary shadow-soft">
            {busy ? "…" : "Opslaan"}
          </Button>
        </form>

        <div className="rounded-3xl bg-card border border-border p-6 shadow-soft space-y-3">
          <h2 className="font-display text-xl">Gevarenzone</h2>
          <Button variant="outline" onClick={resetProgress} className="w-full rounded-full font-display border-2">
            Alle lesvoortgang resetten
          </Button>
          <Button variant="destructive" onClick={deleteAccount} className="w-full rounded-full font-display">
            Account verwijderen
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Account;
