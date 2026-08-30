import Link from "next/link";
import { redirect } from "next/navigation";
import { MoonStar, ShieldCheck } from "lucide-react";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { getSession } from "@/lib/auth";

export default async function AdminLoginPage() {
  const user = await getSession();
  if (user?.role === "admin") redirect("/admin");
  return <main className="admin-login-page">
    <header className="admin-login-header"><Link href="/" className="brand"><span className="brand-mark"><MoonStar size={19}/></span>AlSafar</Link></header>
    <div className="admin-login-shell">
      <section className="admin-login-copy"><ShieldCheck size={35}/><span className="eyebrow">AlSafar operations</span><h1>Care for every booking, from one place.</h1><p>This private area is for authorized AlSafar staff only.</p></section>
      <section className="admin-login-card"><AdminLoginForm/></section>
    </div>
  </main>;
}
