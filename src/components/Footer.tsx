import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Spark } from "./Spark";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border/60 bg-background/60 backdrop-blur-sm mt-20">
      <div className="container pt-8 pb-4 text-center">
        <p className="font-display text-base text-foreground/80">{t("footer.tagline")}</p>
      </div>
      <div className="container pb-10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex items-center gap-3">
          <Spark size={44} animate={false} />
          <span className="font-display text-lg">{t("common.appName")}</span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-muted-foreground">
          <Link to="/about" className="hover:text-foreground transition-colors">{t("footer.about")}</Link>
          <Link to="/privacy" className="hover:text-foreground transition-colors">{t("footer.privacy")}</Link>
          <Link to="/terms" className="hover:text-foreground transition-colors">{t("footer.terms")}</Link>
          <Link to="/schools/contact" className="hover:text-foreground transition-colors">{t("footer.contact")}</Link>
        </nav>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} · {t("footer.rights")}</p>
      </div>
    </footer>
  );
};

export default Footer;
