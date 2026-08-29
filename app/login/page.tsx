import { Header } from "@/components/Header";
import { LoginForm } from "@/components/LoginForm";
import { getTranslations } from "@/lib/i18n-server";

const googleErrors:Record<string,string>={not_configured:"Google login is not configured yet.",cancelled:"Google login was cancelled.",expired:"The Google login request expired. Please try again.",invalid_state:"Google login could not be verified. Please try again.",token_exchange:"Google could not complete authentication. Check the configured callback URL.",unverified:"This Google email could not be verified.",server_error:"Google login failed because of a server or database error."};

export default async function LoginPage({searchParams}:{searchParams:Promise<{role?:string;next?:string;googleError?:string}>}){
  const p=await searchParams; const {locale,t}=await getTranslations();
  const role=p.role==="guide"?"guide":"traveler"; const next=p.next?.startsWith("/")&&!p.next.startsWith("//")?p.next:undefined;
  const googleError=p.googleError?(locale==="hi"?"Google लॉगिन पूरा नहीं हो सका। कृपया फिर प्रयास करें।":locale==="ur"?"Google لاگ اِن مکمل نہیں ہوسکا۔ دوبارہ کوشش کریں۔":googleErrors[p.googleError]):undefined;
  return <><Header/><main className="auth-shell"><section className="auth-art"><div><span className="eyebrow" style={{color:"#e4c37e"}}>{t("login.art","A journey of the heart")}</span><h1>{locale==="hi"?<>हर कदम,<br/>पूरी देखभाल के साथ।</>:locale==="ur"?<>ہر قدم،<br/>پوری دیکھ بھال کے ساتھ۔</>:<>Every step,<br/>held with care.</>}</h1><p>{t("login.artCopy","Access your itinerary, documents, guide details and updates—all in one peaceful place.")}</p></div></section><section className="auth-form-wrap"><LoginForm initialRole={role} next={next} googleError={googleError} locale={locale}/></section></main></>;
}
