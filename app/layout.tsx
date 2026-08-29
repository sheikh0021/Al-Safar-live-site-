import type { Metadata } from "next";
import "./globals.css";
import { QuickHelp } from "@/components/QuickHelp";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = { title: "AlSafar — Your Sacred Journey", description: "Thoughtfully designed Hajj and Umrah packages from India." };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return <html lang={locale} dir={locale==="ur"?"rtl":"ltr"}><body>{children}<QuickHelp locale={locale}/></body></html>;
}
