import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, type Language } from "@/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LABELS: Record<Language, { flag: string; label: string }> = {
  en: { flag: "🇬🇧", label: "English" },
  nl: { flag: "🇳🇱", label: "Nederlands" },
  es: { flag: "🇪🇸", label: "Español" },
};

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const current = (i18n.resolvedLanguage as Language) || "en";
  const change = (lng: Language) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("aisk_lang", lng);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="rounded-full gap-1 font-body">
          <Globe className="h-4 w-4" />
          <span aria-hidden>{LABELS[current].flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl">
        {SUPPORTED_LANGUAGES.map((lng) => (
          <DropdownMenuItem key={lng} onClick={() => change(lng)} className="rounded-xl gap-2 cursor-pointer">
            <span aria-hidden>{LABELS[lng].flag}</span>
            <span>{LABELS[lng].label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
