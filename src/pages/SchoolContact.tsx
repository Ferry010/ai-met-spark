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
  name: z.string().trim().min(1, "Vul je naam in.").max(100),
  email: z.string().trim().email("Dat e-mailadres klopt niet.").max(255),
  school: z.string().trim().max(150),
  message: z.string().trim().min(1, "Schrijf je bericht.").max(1000),
});

const FIELDS = [
  { id: "name", type: "text", required: true },
  { id: "email", type: "email", required: true },
  { id: "school", type: "text", required: false },
] as const;

export const SchoolContact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: form.get("name") ?? "",
      email: form.get("email") ?? "",
      school: form.get("school") ?? "",
      message: form.get("message") ?? "",
    });
    if (!parsed.success) {
      toast({ title: "Check het formulier even", description: parsed.error.errors[0]?.message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    // The inquiries table still has school/country/seats columns from the old school form.
    const { error } = await supabase.from("school_inquiries").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      school: parsed.data.school || "-",
      country: "NL",
      seats: 1,
      message: parsed.data.message,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: t("schoolForm.error"), variant: "destructive" });
      return;
    }
    setDone(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <section className="container max-w-2xl py-8 sm:py-12">
        <div className="mb-8 text-center">
          <Spark size={96} mood="happy" />
          <h1 className="mt-4 text-4xl sm:text-5xl">{t("schoolForm.title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("schoolForm.subtitle")}</p>
        </div>

        {done ? (
          <div className="tile border-success bg-success-soft p-8 text-center">
            <span className="text-5xl" aria-hidden>
              🎉
            </span>
            <p className="mt-3 font-display text-2xl">{t("schoolForm.success")}</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="tile space-y-5 p-6 sm:p-8">
            {FIELDS.map((f) => (
              <div key={f.id} className="space-y-2">
                <Label htmlFor={f.id} className="font-display">
                  {t(`schoolForm.fields.${f.id}`)}
                </Label>
                <Input id={f.id} name={f.id} type={f.type} required={f.required} className="h-12 rounded-xl" />
              </div>
            ))}
            <div className="space-y-2">
              <Label htmlFor="message" className="font-display">
                {t("schoolForm.fields.message")}
              </Label>
              <Textarea id="message" name="message" rows={5} maxLength={1000} required className="rounded-xl" />
            </div>
            <Button type="submit" size="lg" disabled={submitting} className="w-full">
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
