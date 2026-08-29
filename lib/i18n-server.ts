import { cookies } from "next/headers";
import { translate, type Locale } from "@/lib/i18n";

export async function getLocale(): Promise<Locale> {
  return (await cookies()).get("alsafar_locale")?.value === "hi" ? "hi" : "en";
}

export async function getTranslations() {
  const locale = await getLocale();
  return { locale, t: (key: string, fallback: string) => translate(locale, key, fallback) };
}
