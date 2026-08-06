import Link from "next/link";
import { MoonStar } from "lucide-react";
import { getSession } from "@/lib/auth";

export async function Header() {
  const user = await getSession();
  return <header className="nav"><div className="container nav-inner">
    <Link href="/" className="brand"><span className="brand-mark"><MoonStar size={19}/></span> AlSafar</Link>
    <nav className="nav-links"><Link href="/#packages">Packages</Link><Link href="/#journey">How it works</Link><Link href="/#about">About us</Link>
      <Link className="btn btn-primary" href={user ? "/dashboard" : "/login"}>{user ? "My dashboard" : "Begin your journey"}</Link>
    </nav>
  </div></header>;
}
