import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Spark } from "./Spark";
import { StarSky } from "./scenes";
import { TEACHER_ENTRY } from "@/lib/links";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="relative mt-auto overflow-hidden bg-night text-on-dark">
      <StarSky seed={3} count={70} />
      <div className="container relative flex flex-col gap-8 py-12 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Spark size={44} animate={false} />
          <div>
            <div className="font-display text-xl text-white">{t("common.appName")}</div>
            <div className="text-sm">{t("footer.tagline")}</div>
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <Link to="/about" className="hover:text-white">{t("footer.about")}</Link>
          <Link to={TEACHER_ENTRY} className="hover:text-white">Voor leerkrachten</Link>
          <Link to="/privacy" className="hover:text-white">{t("footer.privacy")}</Link>
          <Link to="/terms" className="hover:text-white">{t("footer.terms")}</Link>
          <Link to="/contact" className="hover:text-white">{t("footer.contact")}</Link>
        </nav>
      </div>
      <div className="container relative pb-8 text-xs opacity-80">© {new Date().getFullYear()} AI met Spark</div>
    </footer>
  );
};

export default Footer;
