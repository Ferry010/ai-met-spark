import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export const CookieBanner = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("aisk_cookies_ok")) setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-2 left-2 right-2 md:left-auto md:right-6 md:bottom-4 md:max-w-md z-40 animate-pop-in">
      <div className="bg-card border border-border rounded-2xl shadow-pop p-4 flex flex-col sm:flex-row items-start gap-3">
        <span className="text-2xl shrink-0" aria-hidden>🍪</span>
        <div className="flex-1">
          <p className="text-sm text-foreground/90">{t("cookies.message")}</p>
        </div>
        <Button
          size="sm"
          className="rounded-full font-display w-full sm:w-auto"
          onClick={() => {
            localStorage.setItem("aisk_cookies_ok", "1");
            setShow(false);
          }}
        >
          {t("cookies.accept")}
        </Button>
      </div>
    </div>
  );
};

export default CookieBanner;
