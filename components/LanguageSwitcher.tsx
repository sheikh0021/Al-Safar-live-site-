"use client";
import { Languages } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const search = useSearchParams();
  const query = search.toString();
  const next = `${pathname}${query ? `?${query}` : ""}`;
  const target = locale === "en" ? "hi" : "en";
  return <a className="language-switcher" href={`/api/locale?locale=${target}&next=${encodeURIComponent(next)}`} aria-label={locale === "en" ? "हिन्दी में देखें" : "View in English"}><Languages size={16}/>{locale === "en" ? "हिन्दी" : "English"}</a>;
}
