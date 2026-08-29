"use client";
import { usePathname, useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const search = useSearchParams();
  const query = search.toString();
  const next = `${pathname}${query ? `?${query}` : ""}`;
  const options: {code:Locale;label:string}[]=[{code:"en",label:"English"},{code:"hi",label:"हिन्दी"},{code:"ur",label:"اردو"}];
  return <div className="language-switcher" aria-label="Language selector">{options.map(option=><a key={option.code} className={locale===option.code?"active":""} href={`/api/locale?locale=${option.code}&next=${encodeURIComponent(next)}`} hrefLang={option.code}>{option.label}</a>)}</div>;
}
