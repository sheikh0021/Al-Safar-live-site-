import Link from "next/link";
import { redirect } from "next/navigation";
import { Download, LayoutDashboard, LogOut, MoonStar, ShieldCheck } from "lucide-react";
import { getAdminSession } from "@/lib/auth";
import { logout } from "@/app/dashboard/actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");
  return <main className="admin-app">
    <header className="admin-topbar"><div className="admin-topbar-inner">
      <Link href="/admin" className="brand"><span className="brand-mark"><MoonStar size={19}/></span>AlSafar <small>Admin</small></Link>
      <nav className="admin-nav"><Link href="/admin"><LayoutDashboard size={16}/>Dashboard</Link><Link href="/admin/export"><Download size={16}/>Export CSV</Link><span><ShieldCheck size={16}/>{admin.name}</span><form action={logout}><button><LogOut size={16}/>Log out</button></form></nav>
    </div></header>
    {children}
  </main>;
}
