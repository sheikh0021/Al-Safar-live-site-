import { notFound, redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { BookingForm } from "@/components/BookingForm";
import { getSession } from "@/lib/auth";
import { packages } from "@/lib/packages";
import { getLocale } from "@/lib/i18n-server";

export default async function BookingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await getSession();
  if (!user) redirect(`/login?next=/book/${slug}`);
  if (user.role !== "traveler") redirect("/dashboard");
  const pkg = packages.find((item) => item.slug === slug);
  if (!pkg) notFound();
  const locale=await getLocale();
  return <><Header/><main className="booking"><div className="container"><BookingForm pkg={pkg} locale={locale}/></div></main></>;
}
