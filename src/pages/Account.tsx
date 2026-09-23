import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { School, Check, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useGameStats } from "@/hooks/useGameStats";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { isKidEmail } from "@/lib/kidAccounts";
import {
  getBackgroundAudioEnabled,
  getBackgroundAudioVolume,
  setBackgroundAudioEnabled,
  setBackgroundAudioVolume,
} from "@/lib/backgroundAudio";

export const Account = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { resetProgress } = useUserProgress();
  const { reset: resetStats } = useGameStats();
  const { toast } = useToast();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState("");
  const [audioOn, setAudioOn] = useState(() => getBackgroundAudioEnabled());
  const [volume, setVolume] = useState(() => getBackgroundAudioVolume());

  const schoolId = profile?.school_id;
  const { data: myClass } = useQuery({
    queryKey: ["my-class", schoolId],
    enabled: !!schoolId,
    queryFn: async () => {
      const { data } = await supabase.from("schools").select("name").eq("id", schoolId!).maybeSingle();
      return data?.name ?? null;
    },
  });

  if (!profile || !user) return null;

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({ first_name: String(form.get("first_name") || profile.first_name).trim() })
      .eq("id", user.id);
    setBusy(false);
    if (error) return toast({ title: "Kon niet opslaan", description: error.message, variant: "destructive" });
    refreshProfile();
    toast({ title: "Opgeslagen" });
  };

  const joinClass = async () => {
    if (!code.trim()) return;
    setBusy(true);
    const { data, error } = await (supabase as any).rpc("join_class", { _code: code.trim().toUpperCase() });
    setBusy(false);
    if (error) return toast({ title: "Die code kennen we niet", description: "Check de klassencode nog eens.", variant: "destructive" });
    const row = Array.isArray(data) ? data[0] : data;
    setCode("");
    await refreshProfile();
    qc.invalidateQueries({ queryKey: ["my-class"] });
    toast({ title: `Je zit nu in klas ${row?.class_name ?? ""}` });
  };

  const leaveClass = async () => {
    if (!confirm("Wil je deze klas verlaten? Je juf of meester ziet je voortgang dan niet meer.")) return;
    const { error } = await (supabase as any).rpc("leave_class");
    if (error) return toast({ title: "Dat lukte niet", description: error.message, variant: "destructive" });
    await refreshProfile();
    toast({ title: "Je hebt de klas verlaten" });
  };

  const startOver = async () => {
    if (!confirm("Alle voortgang wissen? Je sterren, XP en missies beginnen opnieuw. Dit kan niet ongedaan worden.")) return;
    await Promise.all([resetProgress(), resetStats(), supabase.from("final_test_attempts").delete().eq("user_id", user.id)]);
    qc.invalidateQueries();
    toast({ title: "Je begint opnieuw" });
    navigate("/dashboard");
  };

  const deleteAccount = async () => {
    if (!confirm("Account verwijderen? Al je voortgang en je diploma worden voor altijd gewist.")) return;
    await supabase.storage.from("certificates").remove([`${user.id}/diploma.pdf`]).catch(() => {});
    const { error } = await (supabase as any).rpc("delete_my_account");
    if (error) return toast({ title: "Kon account niet verwijderen", description: error.message, variant: "destructive" });
    await supabase.auth.signOut();
    toast({ title: "Account verwijderd" });
    navigate("/");
  };

  const kid = isKidEmail(user.email);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-xl px-4 py-8">
        <h1 className="mb-6 text-4xl">Account en klas</h1>

        <section className="tile mb-5 p-6">
          <h2 className="mb-1 text-xl">Jij</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            {kid ? (
              <>
                Je gebruikersnaam is <strong className="text-foreground">{profile.username ?? user.email?.split("@")[0]}</strong>.
              </>
            ) : (
              <>Je logt in met {user.email}.</>
            )}
          </p>
          <form onSubmit={save} className="flex gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="first_name">Voornaam</Label>
              <Input id="first_name" name="first_name" defaultValue={profile.first_name} maxLength={40} className="h-12 rounded-xl" />
            </div>
            <Button type="submit" disabled={busy} className="self-end">
              Opslaan
            </Button>
          </form>
        </section>

        <section className="tile mb-5 p-6">
          <h2 className="mb-1 flex items-center gap-2 text-xl">
            <School className="h-5 w-5" /> Mijn klas
          </h2>
          {schoolId ? (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-success-soft px-4 py-3">
              <span className="inline-flex items-center gap-2 font-medium text-success-dark">
                <Check className="h-5 w-5" /> {myClass ?? "Je zit in een klas"}
              </span>
              <Button variant="ghost" size="sm" onClick={leaveClass}>
                <LogOut className="h-4 w-4" /> Verlaten
              </Button>
            </div>
          ) : (
            <>
              <p className="mb-3 text-sm text-muted-foreground">Heb je een klassencode van je juf of meester? Vul hem hier in.</p>
              <div className="flex gap-3">
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="SPARK-7K2Q"
                  className="h-12 flex-1 rounded-xl uppercase"
                  autoCapitalize="characters"
                />
                <Button onClick={joinClass} disabled={busy || !code.trim()}>
                  Doe mee
                </Button>
              </div>
            </>
          )}
        </section>

        {kid ? (
          <section className="tile mb-5 p-6">
            <h2 className="mb-1 text-xl">Wachtwoord vergeten?</h2>
            <p className="text-sm text-muted-foreground">
              Zit je in een klas? Je juf of meester kan een nieuw wachtwoord voor je instellen.
            </p>
          </section>
        ) : null}

        <section className="tile mb-5 space-y-5 p-6">
          <h2 className="text-xl">Muziek</h2>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="audio">Achtergrondmuziek</Label>
            <Switch
              id="audio"
              checked={audioOn}
              onCheckedChange={(v) => {
                setAudioOn(v);
                setBackgroundAudioEnabled(v);
              }}
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="volume">Volume</Label>
              <span className="text-sm text-muted-foreground">{Math.round(volume * 100)}%</span>
            </div>
            <Slider
              id="volume"
              min={0}
              max={100}
              step={1}
              value={[Math.round(volume * 100)]}
              disabled={!audioOn}
              onValueChange={([v]) => {
                const next = (v ?? 0) / 100;
                setVolume(next);
                setBackgroundAudioVolume(next);
              }}
            />
          </div>
        </section>

        <section className="tile space-y-3 p-6">
          <h2 className="text-xl">Opnieuw beginnen of stoppen</h2>
          <Button variant="outline" onClick={startOver} className="w-full">
            Alle voortgang wissen
          </Button>
          <Button variant="destructive" onClick={deleteAccount} className="w-full">
            Account verwijderen
          </Button>
        </section>
      </main>
    </div>
  );
};

export default Account;
