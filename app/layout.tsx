import type { Metadata } from "next";
import "./globals.css";
import { QuickHelp } from "@/components/QuickHelp";

export const metadata: Metadata = { title: "AlSafar — Your Sacred Journey", description: "Thoughtfully designed Hajj and Umrah packages from India." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<QuickHelp/></body></html>;
}
