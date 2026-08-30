import { Languages, MapPin, Phone, Save, UserRoundCheck } from "lucide-react";
import { updateGuideProfile } from "@/app/admin/actions";
import { getAdminGuides } from "@/lib/admin";

export default async function AdminGuidesPage() {
  const guides = await getAdminGuides();
  return <div className="admin-container">
    <section className="admin-heading"><div><span className="eyebrow">Registered guide accounts</span><h1>Local guide directory</h1><p>Add the basic operational details used when assigning one guide to a departure group.</p></div></section>
    <div className="admin-guide-grid">{guides.map((guide) => <article className="admin-panel admin-guide-card" key={guide.id}>
      <div className="admin-guide-card-head"><span><UserRoundCheck/></span><div><strong>{guide.name}</strong><small>{guide.email}</small><small>{Number(guide.assigned_groups)} assigned group{Number(guide.assigned_groups) === 1 ? "" : "s"}</small></div></div>
      <form action={updateGuideProfile} className="admin-guide-form"><input type="hidden" name="guideId" value={guide.id}/><label>Guide name<input name="name" defaultValue={guide.name} required minLength={2}/></label><div className="admin-guide-fields"><label><Phone size={14}/>Phone<input name="phone" defaultValue={guide.phone || ""} placeholder="+91…"/></label><label><MapPin size={14}/>Home city<input name="city" defaultValue={guide.city || ""} placeholder="Delhi, Lucknow…"/></label></div><div className="admin-guide-fields"><label><Languages size={14}/>Languages<input name="languages" defaultValue={guide.languages || ""} placeholder="Hindi, Urdu, English"/></label><label>Experience (years)<input name="experienceYears" type="number" min={0} max={80} defaultValue={guide.experience_years ?? ""}/></label></div><label>Internal guide notes<textarea name="notes" defaultValue={guide.notes || ""} placeholder="Certification, availability or operating notes"/></label><button className="btn btn-primary"><Save size={15}/>Save guide details</button></form>
    </article>)}{!guides.length && <section className="admin-panel admin-empty">No local guide accounts exist yet. A guide must first create a guide account through the normal signup page.</section>}</div>
  </div>;
}
