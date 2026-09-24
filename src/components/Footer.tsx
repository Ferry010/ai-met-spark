import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Spark } from "./Spark";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="mt-auto border-t-2 border-border">
      <div className="container flex flex-col items-center justify-between gap-6 py-10 md:flex-row">
        <div className="flex items-center gap-3">
          <Spark size={40} animate={false} />
          <div>
            <div className="font-display text-lg">{t("common.appName")}</div>
            <div className="text-sm text-muted-foreground">{t("footer.tagline")}</div>
          </div>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground">
          <Link to="/about" className="hover:text-foreground">{t("footer.about")}</Link>
          <Link to="/scholen/aanmelden" className="hover:text-foreground">Voor scholen</Link>
          <Link to="/privacy" className="hover:text-foreground">{t("footer.privacy")}</Link>
          <Link to="/terms" className="hover:text-foreground">{t("footer.terms")}</Link>
          <Link to="/contact" className="hover:text-foreground">{t("footer.contact")}</Link>
        </nav>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} AI met Spark</p>
      </div>
    </footer>
  );
};

export default Footer;
