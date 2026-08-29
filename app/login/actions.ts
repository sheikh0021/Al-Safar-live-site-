"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authenticate } from "@/lib/users";
import { createSession } from "@/lib/auth";

export type LoginState = { error?: string };
export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = z.object({ email:z.string().email(), password:z.string().min(6), role:z.enum(["traveler","guide"]), next:z.string().optional(),locale:z.enum(["en","hi","ur"]).optional() }).safeParse(Object.fromEntries(formData));
  const hindi=formData.get("locale")==="hi";
  const urdu=formData.get("locale")==="ur";
  if (!parsed.success) return { error:hindi?"कृपया सही ईमेल और पासवर्ड दर्ज करें।":urdu?"براہ کرم درست ای میل اور پاس ورڈ درج کریں۔":"Please enter a valid email and password." };
  const user = await authenticate(parsed.data.email, parsed.data.password, parsed.data.role);
  if (!user) return { error:hindi?"ये विवरण इस खाता प्रकार से मेल नहीं खाते।":urdu?"یہ تفصیلات اس اکاؤنٹ کی قسم سے مطابقت نہیں رکھتیں۔":"Those details do not match this account type." };
  await createSession(user);
  const destination = parsed.data.next?.startsWith("/") && !parsed.data.next.startsWith("//") ? parsed.data.next : "/dashboard";
  redirect(destination);
}
