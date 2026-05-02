import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import nl from "./locales/nl.json";

export const SUPPORTED_LANGUAGES = ["nl"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

i18n.use(initReactI18next).init({
  resources: {
    nl: { translation: nl },
  },
  lng: "nl",
  fallbackLng: "nl",
  interpolation: { escapeValue: false },
  returnObjects: true,
});

export default i18n;
