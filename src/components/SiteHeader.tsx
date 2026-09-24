import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Spark } from "./Spark";
import { Button } from "@/components/ui/button";

export const SiteHeader = () => {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-30 border-b-2 border-border bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-2">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <Spark size={36} animate={false} />
          <span className="truncate font-display text-xl">{t("common.appName")}</span>
        </Link>
        <nav className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link to="/scholen/aanmelden" className="hidden rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground md:inline-flex">
            Voor leerkrachten
          </Link>
          <Link to="/about" className="hidden rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground md:inline-flex">
            Over Spark
          </Link>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/auth">{t("common.login")}</Link>
          </Button>
          <Button asChild>
            <Link to="/auth?mode=signup">{t("common.tryFree")}</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
