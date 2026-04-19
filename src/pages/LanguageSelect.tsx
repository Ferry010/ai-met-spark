import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Spark } from "@/components/Spark";
import { Button } from "@/components/ui/button";
import i18n, { type Language } from "@/i18n";

const LANGS: { code: Language; flag: string; label: string; greeting: string }[] = [
  { code: "en", flag: "🇬🇧", label: "English", greeting: "Choose your language" },
  { code: "nl", flag: "🇳🇱", label: "Nederlands", greeting: "Kies je taal" },
  { code: "es", flag: "🇪🇸", label: "Español", greeting: "Elige tu idioma" },
];

export const LanguageSelectPage = () => {
  const [picked, setPicked] = useState(false);

  // If user already chose a language before, skip this screen.
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("aisk_lang")) {
      setPicked(true);
    }
  }, []);

  if (picked) return <Navigate to="/" replace />;

  const choose = (code: Language) => {
    localStorage.setItem("aisk_lang", code);
    i18n.changeLanguage(code);
    setPicked(true);
  };

  return (
    <main className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center px-6 py-10">
      <div className="text-center mb-8">
        <Spark size={140} mood="happy" />
      </div>

      <h1 className="font-display text-3xl sm:text-5xl text-center text-foreground mb-2">
        {LANGS.map((l) => l.greeting).join(" · ")}
      </h1>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-3xl">
        {LANGS.map((l) => (
          <Button
            key={l.code}
            onClick={() => choose(l.code)}
            className="h-auto min-h-[160px] flex flex-col items-center justify-center gap-3 rounded-3xl bg-card hover:bg-card text-foreground shadow-soft hover:shadow-pop transition-bounce hover:-translate-y-1 hover:scale-[1.02] border-2 border-transparent hover:border-primary p-6"
            aria-label={l.label}
          >
            <span className="text-7xl" aria-hidden>{l.flag}</span>
            <span className="font-display text-2xl">{l.label}</span>
          </Button>
        ))}
      </div>

      <p className="mt-12 text-sm text-muted-foreground">You can change this anytime in settings.</p>
    </main>
  );
};

export default LanguageSelectPage;
