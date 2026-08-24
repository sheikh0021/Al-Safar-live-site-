import { Header } from "@/components/Header";
import { SignupForm } from "@/components/SignupForm";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ role?: string; next?: string }> }) {
  const params = await searchParams;
  const role = params.role === "guide" ? "guide" : "traveler";
  const next = params.next?.startsWith("/") && !params.next.startsWith("//") ? params.next : undefined;

  return <>
    <Header/>
    <main className="auth-shell">
      <section className="auth-art">
        <div>
          <span className="eyebrow" style={{ color: "#e4c37e" }}>Your journey starts here</span>
          <h1>Travel with faith,<br/>guided with care.</h1>
          <p>Create your secure account to manage packages, bookings and journey details in one place.</p>
        </div>
      </section>
      <section className="auth-form-wrap"><SignupForm initialRole={role} next={next}/></section>
    </main>
  </>;
}
