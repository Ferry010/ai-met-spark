import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Spark } from "./Spark";
import { Button } from "@/components/ui/button";

export const SiteHeader = () => {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border/60">
      <div className="container h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <Spark size={40} animate={false} />
          <span className="font-display text-xl font-semibold group-hover:text-primary transition-colors">
            {t("common.appName")}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/pricing" className="hidden sm:inline-flex">
            <Button variant="ghost" className="font-display">€14</Button>
          </Link>
          <Link to="/auth">
            <Button className="font-display rounded-full px-5 h-11 bg-primary hover:bg-primary/90 shadow-soft">
              {t("common.login")}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
