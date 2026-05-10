import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  getBackgroundAudioEnabled,
  getBackgroundAudioVolume,
  setBackgroundAudioEnabled,
  setBackgroundAudioVolume,
} from "@/lib/backgroundAudio";
import { useUserProgress } from "@/hooks/useUserProgress";

export const Account = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [backgroundAudioEnabled, setBackgroundAudioEnabledState] = useState(() => getBackgroundAudioEnabled());
  const [backgroundAudioVolume, setBackgroundAudioVolumeState] = useState(() => getBackgroundAudioVolume());

  if (!profile) return null;

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const form = new FormData(e.currentTarget);
    const ageRaw = String(form.get("age") || "").trim();
    const parentEmailRaw = String(form.get("parent_email") || "").trim();
    setBusy(true);
    const { error } = await supabase.from("profiles").update({
      first_name: String(form.get("first_name") || profile.first_name),
      age: ageRaw === "" ? null : Number(ageRaw),
      parent_email: parentEmailRaw === "" ? null : parentEmailRaw,
      language: "nl",
    }).eq("id", user.id);
    setBusy(false);
    if (error) {
      toast({ title: "Kon niet opslaan", description: error.message, variant: "destructive" });
      return;
    }
    refreshProfile();
    toast({ title: "Opgeslagen!" });
  };

  const requestPasswordReset = async () => {
    if (!user?.email) return;
    setResetting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/auth`,
    });
    setResetting(false);
    if (error) {
      toast({ title: "Kon mail niet sturen", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Mail verstuurd", description: "Check je inbox voor de resetlink." });
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
    if (!confirm("Account verwijderen? Dit wist permanent al je voortgang en je diploma.")) return;
    setDeleting(true);
    const { error } = await supabase.functions.invoke("delete-account");
    if (error) {
      setDeleting(false);
      toast({ title: "Kon account niet verwijderen", description: error.message, variant: "destructive" });
      return;
    }
    await supabase.auth.signOut();
    toast({ title: "Account verwijderd" });
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
            <Label htmlFor="age">Leeftijd</Label>
            <Input id="age" name="age" type="number" min={4} max={18} defaultValue={profile.age ?? ""} className="h-12 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="parent_email">E-mail van je ouder</Label>
            <Input id="parent_email" name="parent_email" type="email" defaultValue={profile.parent_email ?? ""} placeholder="ouder@voorbeeld.nl" className="h-12 rounded-xl" />
            <p className="text-xs text-muted-foreground">Hier sturen we updates over voltooide werelden en je diploma.</p>
          </div>
          <Button type="submit" disabled={busy} className="w-full h-14 rounded-full font-display bg-primary shadow-soft">
            {busy ? "…" : "Opslaan"}
          </Button>
        </form>

        <section className="rounded-3xl bg-card border border-border p-6 shadow-soft space-y-3 mb-6">
          <h2 className="font-display text-xl">Wachtwoord</h2>
          <p className="text-sm text-muted-foreground">We sturen een resetlink naar {user?.email}.</p>
          <Button variant="outline" onClick={requestPasswordReset} disabled={resetting} className="w-full rounded-full font-display border-2">
            {resetting ? "…" : "Stuur resetlink"}
          </Button>
        </section>

        <section className="rounded-3xl bg-card border border-border p-6 shadow-soft space-y-5 mb-6">
          <div>
            <h2 className="font-display text-xl">Audio-instellingen</h2>
            <p className="text-sm text-muted-foreground mt-1">Beheer de achtergrondmuziek voor student-schermen en menu&apos;s.</p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <Label htmlFor="background-audio-enabled">Achtergrondmuziek</Label>
              <p className="text-sm text-muted-foreground">Speelt door op dashboard, werelden en account.</p>
            </div>
            <Switch
              id="background-audio-enabled"
              checked={backgroundAudioEnabled}
              onCheckedChange={(checked) => {
                setBackgroundAudioEnabledState(checked);
                setBackgroundAudioEnabled(checked);
              }}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="background-audio-volume">Volume</Label>
              <span className="text-sm text-muted-foreground">{Math.round(backgroundAudioVolume * 100)}%</span>
            </div>
            <Slider
              id="background-audio-volume"
              min={0}
              max={100}
              step={1}
              value={[Math.round(backgroundAudioVolume * 100)]}
              disabled={!backgroundAudioEnabled}
              onValueChange={([value]) => {
                const nextVolume = (value ?? 0) / 100;
                setBackgroundAudioVolumeState(nextVolume);
                setBackgroundAudioVolume(nextVolume);
              }}
            />
          </div>
        </section>

        <div className="rounded-3xl bg-card border border-border p-6 shadow-soft space-y-3">
          <h2 className="font-display text-xl">Gevarenzone</h2>
          <Button variant="outline" onClick={resetProgress} className="w-full rounded-full font-display border-2">
            Alle lesvoortgang resetten
          </Button>
          <Button variant="destructive" onClick={deleteAccount} disabled={deleting} className="w-full rounded-full font-display">
            {deleting ? "…" : "Account verwijderen"}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Account;
