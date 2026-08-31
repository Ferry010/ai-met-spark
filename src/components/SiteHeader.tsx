import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Spark } from "./Spark";
import { Button } from "@/components/ui/button";

export const SiteHeader = () => {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container flex min-h-14 items-center justify-between gap-2 py-2 md:min-h-16 md:py-0">
        <Link to="/" className="flex items-center gap-2 group min-w-0">
          <Spark size={36} animate={false} />
          <span className="max-w-[150px] truncate font-display text-base font-semibold transition-colors group-hover:text-primary sm:max-w-none sm:text-xl">
            {t("common.appName")}
          </span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <Link to="/dashboard">
            <Button className="font-display rounded-full px-4 sm:px-5 h-10 sm:h-11 text-sm sm:text-base bg-primary hover:bg-primary/90 shadow-soft">
              {t("common.tryFree")} →
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
