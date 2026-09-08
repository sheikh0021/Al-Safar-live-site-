import Link from "next/link";
import { MoonStar } from "lucide-react";
import { getTranslations } from "@/lib/i18n-server";

export async function Footer() {
  const { t } = await getTranslations();
  return (
    <footer className="footer" id="about">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand"><span className="brand-mark"><MoonStar size={19}/></span> AlSafar</div>
            <p>{t("footer.copy", "Guiding Indian pilgrims toward journeys of faith, comfort and peace.")}</p>
          </div>
          <div className="footer-links">
            <div>
              <strong>{t("footer.explore", "Explore")}</strong>
              <Link href="/#packages">{t("nav.packages", "Packages")}</Link>
              <Link href="/login">{t("footer.traveler", "Traveler login")}</Link>
              <Link href="/login?role=guide">{t("footer.guide", "Guide login")}</Link>
            </div>
            <div>
              <strong>{t("footer.support", "Support")}</strong>
              <a href="tel:+917771842703">+91 77718 42703</a>
              <a href="https://wa.me/917771842703" target="_blank" rel="noopener noreferrer">{t("footer.whatsapp", "WhatsApp")}</a>
              <a href="mailto:sheikhrehan2121@gmail.com">sheikhrehan2121@gmail.com</a>
              <span>{t("footer.hours", "Mon–Sat, 9am–7pm")}</span>
            </div>
          </div>
          <div className="creator-credit">
            <span className="eyebrow">{t("footer.created", "Created by")}</span>
            <strong className="creator-name">Sheikh Rehan</strong>
            <p>{t("footer.founder", "Founder of AlSafar")}</p>
          </div>
        </div>
        <div className="copyright">
          <span>{t("footer.made", "© 2026 AlSafar Travel Services. Made with love by Sheikh Rehan.")}</span>
        </div>
      </div>
    </footer>
  );
}
