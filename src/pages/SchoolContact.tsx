import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { Spark } from "@/components/Spark";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(1, "Required").max(100),
  school: z.string().trim().min(1, "Required").max(150),
  country: z.string().trim().min(1, "Required").max(80),
  seats: z.coerce.number().int().min(1).max(100000),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const SchoolContact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: form.get("name"),
      school: form.get("school"),
      country: form.get("country"),
      seats: form.get("seats"),
      email: form.get("email"),
      message: form.get("message") ?? "",
    });
    if (!parsed.success) {
      toast({ title: "Please check the form", description: parsed.error.errors[0]?.message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("school_inquiries").insert({
      name: parsed.data.name,
      school: parsed.data.school,
      country: parsed.data.country,
      seats: parsed.data.seats,
      email: parsed.data.email,
      message: parsed.data.message || null,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Could not send", description: error.message, variant: "destructive" });
      return;
    }
    setDone(true);
    toast({ title: t("schoolForm.success") });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <section className="container py-12 max-w-2xl">
        <div className="text-center mb-8">
          <Spark size={120} mood="happy" />
          <h1 className="font-display text-3xl sm:text-4xl mt-4">{t("schoolForm.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("schoolForm.subtitle")}</p>
        </div>

        {done ? (
          <div className="rounded-3xl bg-success/10 border border-success/30 p-8 text-center">
            <span className="text-5xl" aria-hidden>🎉</span>
            <p className="font-display text-2xl mt-3">{t("schoolForm.success")}</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="rounded-3xl bg-card border border-border shadow-soft p-6 sm:p-8 space-y-5">
            {(["name", "school", "country", "seats", "email"] as const).map((field) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={field} className="font-display">{t(`schoolForm.fields.${field}`)}</Label>
                <Input
                  id={field}
                  name={field}
                  type={field === "email" ? "email" : field === "seats" ? "number" : "text"}
                  required
                  min={field === "seats" ? 1 : undefined}
                  className="h-12 rounded-xl"
                />
              </div>
            ))}
            <div className="space-y-2">
              <Label htmlFor="message" className="font-display">{t("schoolForm.fields.message")}</Label>
              <Textarea id="message" name="message" rows={4} maxLength={1000} className="rounded-xl" />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-14 rounded-full font-display text-base bg-primary hover:bg-primary/90 shadow-soft"
            >
              {submitting ? t("common.loading") : t("schoolForm.submit")}
            </Button>
          </form>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default SchoolContact;
