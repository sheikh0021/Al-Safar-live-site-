import Link from "next/link";
import { MoonStar } from "lucide-react";
import { getSession } from "@/lib/auth";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getTranslations } from "@/lib/i18n-server";

export async function Header() {
  const user = await getSession();
  const { locale, t } = await getTranslations();
  return <header className="nav"><div className="container nav-inner">
    <Link href="/" className="brand"><span className="brand-mark"><MoonStar size={19}/></span> AlSafar</Link>
    <nav className="nav-links"><Link href="/#packages">{t("nav.packages","Packages")}</Link><Link href="/#journey">{t("nav.how","How it works")}</Link><Link href="/#about">{t("nav.about","About us")}</Link><LanguageSwitcher locale={locale}/>
      <Link className="btn btn-primary" href={user ? "/dashboard" : "/login"}>{user ? t("nav.dashboard","My dashboard") : t("nav.begin","Begin your journey")}</Link>
    </nav>
  </div></header>;
}
