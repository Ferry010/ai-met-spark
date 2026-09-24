import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Spark } from "./Spark";
import { Button } from "@/components/ui/button";
import { TEACHER_ENTRY } from "@/lib/links";
import { cn } from "@/lib/utils";

/**
 * Public site header. `night` sits transparent over a dark hero (the landing
 * page); the default is a paper bar that sticks to the top.
 */
export const SiteHeader = ({ tone = "paper" }: { tone?: "paper" | "night" }) => {
  const { t } = useTranslation();
  const night = tone === "night";
  const link = cn(
    "hidden rounded-xl px-3 py-2 text-sm font-medium md:inline-flex",
    night ? "text-on-dark hover:text-white" : "text-muted-foreground hover:text-foreground",
  );
  return (
    <header
      className={cn(
        "z-30",
        night ? "absolute inset-x-0 top-0" : "sticky top-0 border-b-2 border-border bg-background/90 backdrop-blur",
      )}
    >
      <div className={cn("container flex items-center justify-between gap-2", night ? "h-20 sm:h-24" : "h-16")}>
        <Link to="/" className={cn("flex min-w-0 items-center gap-2", night && "text-white")}>
          <Spark size={night ? 42 : 36} animate={false} />
          <span className="truncate font-display text-xl">{t("common.appName")}</span>
        </Link>
        <nav className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link to={TEACHER_ENTRY} className={link}>
            Voor leerkrachten
          </Link>
          <Link to="/about" className={link}>
            Over Spark
          </Link>
          <Button asChild variant="ghost" className={cn("hidden sm:inline-flex", night && "text-white hover:bg-white/10")}>
            <Link to="/auth">{t("common.login")}</Link>
          </Button>
          <Button asChild variant={night ? "secondary" : "default"}>
            <Link to="/auth?mode=signup">{t("common.tryFree")}</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
