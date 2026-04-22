import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Spark } from "./Spark";
import { Button } from "@/components/ui/button";

export const SiteHeader = () => {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border/60">
      <div className="container h-14 md:h-16 flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2 group min-w-0">
          <Spark size={36} animate={false} />
          <span className="font-display text-base sm:text-xl font-semibold group-hover:text-primary transition-colors truncate">
            {t("common.appName")}
          </span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <Link to="/auth" className="hidden sm:inline-flex">
            <Button variant="ghost" className="font-display">
              {t("common.login")}
            </Button>
          </Link>
          <Link to="/auth?mode=signup">
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
