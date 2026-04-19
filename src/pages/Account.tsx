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
    const language = String(form.get("language") || "en") as "en" | "nl" | "es";
    const { error } = await supabase.from("profiles").update({
      first_name: String(form.get("first_name") || profile.first_name),
      parent_email: String(form.get("parent_email") || ""),
      language,
    }).eq("id", user.id);
    setBusy(false);
    if (error) {
      toast({ title: "Couldn't save", description: error.message, variant: "destructive" });
      return;
    }
    localStorage.setItem("aisk_lang", language);
    i18n.changeLanguage(language);
    refreshProfile();
    toast({ title: "Saved!" });
  };

  const resetProgress = async () => {
    if (!user) return;
    if (!confirm("Reset all lesson progress? This can't be undone.")) return;
    await supabase.from("user_progress").delete().eq("user_id", user.id);
    await supabase.from("final_test_attempts").delete().eq("user_id", user.id);
    toast({ title: "Progress reset" });
    navigate("/dashboard");
  };

  const deleteAccount = async () => {
    if (!confirm("Delete your account? This permanently removes all data.")) return;
    if (!user) return;
    // Best-effort: client-side sign-out. Full deletion requires service role; ask user to email support.
    await supabase.auth.signOut();
    toast({ title: "Signed out", description: "Email support to fully delete your account." });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8 max-w-xl">
        <h1 className="font-display text-3xl mb-6">Account settings</h1>

        <form onSubmit={save} className="rounded-3xl bg-card border border-border p-6 shadow-soft space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="first_name">First name</Label>
            <Input id="first_name" name="first_name" defaultValue={profile.first_name} maxLength={40} className="h-12 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="parent_email">Parent email</Label>
            <Input id="parent_email" name="parent_email" type="email" defaultValue={profile.parent_email ?? ""} className="h-12 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select name="language" defaultValue={profile.language}>
              <SelectTrigger id="language" className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇬🇧 English</SelectItem>
                <SelectItem value="nl">🇳🇱 Nederlands</SelectItem>
                <SelectItem value="es">🇪🇸 Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={busy} className="w-full h-14 rounded-full font-display bg-primary shadow-soft">
            {busy ? "…" : "Save"}
          </Button>
        </form>

        <div className="rounded-3xl bg-card border border-border p-6 shadow-soft space-y-3">
          <h2 className="font-display text-xl">Danger zone</h2>
          <Button variant="outline" onClick={resetProgress} className="w-full rounded-full font-display border-2">
            Reset all lesson progress
          </Button>
          <Button variant="destructive" onClick={deleteAccount} className="w-full rounded-full font-display">
            Delete account
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Account;
