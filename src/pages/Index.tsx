import { useEffect, useState } from "react";
import LanguageSelect from "./LanguageSelect";
import Landing from "./Landing";

/**
 * Index gates on first-visit language selection.
 * If no language is stored, show the language picker; otherwise show the landing page.
 */
const Index = () => {
  const [ready, setReady] = useState(false);
  const [hasLang, setHasLang] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setHasLang(!!localStorage.getItem("aisk_lang"));
    setReady(true);
  }, []);

  if (!ready) return null;
  return hasLang ? <Landing /> : <LanguageSelect />;
};

export default Index;
