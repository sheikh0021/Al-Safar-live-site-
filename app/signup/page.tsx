import { Header } from "@/components/Header";
import { SignupForm } from "@/components/SignupForm";
import { getTranslations } from "@/lib/i18n-server";

const googleErrors: Record<string, string> = { not_configured: "Google signup is not configured yet.", cancelled: "Google signup was cancelled.", expired: "The Google signup request expired. Please try again.", invalid_state: "Google signup could not be verified. Please try again.", token_exchange: "Google could not complete authentication. Check the configured callback URL.", unverified: "This Google email could not be verified.", server_error: "Google signup failed because of a server or database error." };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ role?: string; next?: string; googleError?: string }> }) {
  const params = await searchParams;
  const {locale,t}=await getTranslations();
  const role = params.role === "guide" ? "guide" : "traveler";
  const next = params.next?.startsWith("/") && !params.next.startsWith("//") ? params.next : undefined;
  const googleError = params.googleError ? googleErrors[params.googleError] : undefined;

  return <>
    <Header/>
    <main className="auth-shell">
      <section className="auth-art">
        <div>
          <span className="eyebrow" style={{ color: "#e4c37e" }}>{t("signup.art","Your journey starts here")}</span>
          <h1>{locale==="hi"?<>आस्था के साथ यात्रा,<br/>देखभाल के साथ मार्गदर्शन।</>:<>Travel with faith,<br/>guided with care.</>}</h1>
          <p>{t("signup.artCopy","Create your secure account to manage packages, bookings and journey details in one place.")}</p>
        </div>
      </section>
      <section className="auth-form-wrap"><SignupForm initialRole={role} next={next} googleError={googleError} locale={locale}/></section>
    </main>
  </>;
}
