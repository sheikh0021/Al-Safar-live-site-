import Link from "next/link";
import { redirect } from "next/navigation";
import type { RowDataPacket } from "mysql2";
import { CalendarDays, Mail, MapPinned, MoonStar, Phone, Users } from "lucide-react";
import { logout } from "@/app/dashboard/actions";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getTranslations } from "@/lib/i18n-server";
import "./guide.css";

export default async function GuideDashboard() {
  const guide = await getSession();
  if (!guide) redirect("/login?role=guide");
  if (guide.role !== "guide") redirect(guide.role === "admin" ? "/admin" : "/dashboard");
  const { locale, t } = await getTranslations();
  const db = getDb();
  let groups: RowDataPacket[] = [];
  if (db) {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT pd.package_id, p.name AS package_name, DATE_FORMAT(pd.travel_date, '%Y-%m-%d') AS travel_date,
        pd.capacity, COALESCE(SUM(CASE WHEN b.status <> 'cancelled' THEN b.travelers ELSE 0 END), 0) AS travelers,
        COUNT(CASE WHEN b.status <> 'cancelled' THEN 1 END) AS bookings
       FROM package_departures pd JOIN packages p ON p.id = pd.package_id
       LEFT JOIN bookings b ON b.package_id = pd.package_id AND b.travel_date = pd.travel_date
       WHERE pd.guide_id = ? GROUP BY pd.package_id, p.name, pd.travel_date, pd.capacity ORDER BY pd.travel_date`,
      [guide.id],
    );
    groups = rows;
  }
  return <main className="dashboard"><header className="nav"><div className="container nav-inner"><Link href="/" className="brand"><span className="brand-mark"><MoonStar size={19}/></span>AlSafar</Link><div className="dashboard-nav-actions"><LanguageSwitcher locale={locale}/><form action={logout}><button className="btn btn-outline">{t("dashboard.logout", "Log out")}</button></form></div></div></header><div className="container"><div className="dash-head"><div><span className="eyebrow">{t("dashboard.guide", "Guide workspace")}</span><h1>{t("dashboard.greeting", "Assalamu alaikum")}, {guide.name.split(" ")[0]}.</h1><p className="muted">Your assigned departure groups appear here as soon as an administrator allots them.</p></div></div><div className="stats"><div className="stat"><span>Assigned groups</span><strong>{groups.length}</strong></div><div className="stat"><span>Total pilgrims</span><strong>{groups.reduce((sum, group) => sum + Number(group.travelers), 0)}</strong></div><div className="stat"><span>Next departure</span><strong>{groups[0]?.travel_date || "—"}</strong></div></div><section className="panel"><div className="panel-title"><h2>My departure groups</h2><span className="status">Live assignments</span></div>{groups.map((group) => <div className="guide-group" key={`${group.package_id}-${group.travel_date}`}><div className="trip-icon"><MapPinned size={20}/></div><div><strong>{group.package_name}</strong><small><CalendarDays size={13}/>{group.travel_date}</small></div><div><strong><Users size={15}/>{Number(group.travelers)} pilgrims</strong><small>{Number(group.bookings)} bookings · capacity {Number(group.capacity)}</small></div></div>)}{!groups.length && <div className="admin-empty">No departure group has been assigned to this guide account yet.</div>}</section><section className="guide-help-card"><div><strong>Need booking information?</strong><p>Contact the AlSafar administrator for traveler-sensitive details and operational updates.</p></div><div><a href="tel:+917771842703"><Phone size={15}/>+91 77718 42703</a><a href="mailto:sheikhrehan2121@gmail.com"><Mail size={15}/>Email administrator</a></div></section></div></main>;
}
