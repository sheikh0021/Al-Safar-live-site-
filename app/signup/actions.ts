"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession } from "@/lib/auth";
import { createUser } from "@/lib/users";

export type SignupState = { error?: string };

function databaseSignupError(error: unknown): string {
  const code = typeof error === "object" && error !== null && "code" in error
    ? String(error.code)
    : "";

  if (code === "ER_ACCESS_DENIED_ERROR") {
    return "The database rejected the configured username or password. Please update DATABASE_URL in Vercel and redeploy.";
  }
  if (code === "ER_BAD_DB_ERROR" || code === "ER_NO_DB_ERROR") {
    return "The configured database was not found or selected. DATABASE_URL in Vercel must end with /alsafar.";
  }
  if (code === "ER_NO_SUCH_TABLE") {
    return "The database is connected, but the users table is missing. Run database/schema.sql on the Railway database.";
  }
  if (["ENOTFOUND", "ETIMEDOUT", "ECONNREFUSED", "PROTOCOL_CONNECTION_LOST"].includes(code)) {
    return "The live server could not reach Railway MySQL. Check that Vercel uses Railway’s public connection URL, then redeploy.";
  }
  return "We could not create your account because the live database configuration failed. Check Vercel’s DATABASE_URL and deployment logs.";
}

const signupSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  password: z.string().min(8).max(72)
    .regex(/[A-Za-z]/, "Password must contain a letter.")
    .regex(/[0-9]/, "Password must contain a number."),
  confirmPassword: z.string(),
  role: z.enum(["traveler", "guide"]),
  next: z.string().optional(), locale: z.enum(["en","hi","ur"]).optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"]
});

export async function signup(_: SignupState, formData: FormData): Promise<SignupState> {
  const hindi=formData.get("locale")==="hi";
  const urdu=formData.get("locale")==="ur";
  const parsed = signupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    if (issue.path.includes("confirmPassword")) return { error: hindi?"दोनों पासवर्ड मेल नहीं खाते।":urdu?"دونوں پاس ورڈ ایک جیسے نہیں ہیں۔":"The two passwords do not match." };
    if (issue.path.includes("password")) return { error: hindi?"पासवर्ड में कम से कम 8 अक्षर, एक अक्षर और एक संख्या होनी चाहिए।":urdu?"پاس ورڈ میں کم از کم 8 حروف، ایک حرف اور ایک عدد ہونا چاہیے۔":issue.message };
    return { error: hindi?"कृपया सभी फ़ील्ड में सही जानकारी भरें।":urdu?"براہ کرم تمام خانوں میں درست معلومات درج کریں۔":"Please complete every field with valid information." };
  }

  try {
    const result = await createUser(
      parsed.data.name,
      parsed.data.email,
      parsed.data.password,
      parsed.data.role
    );
    if ("error" in result) return { error: hindi?"इस ईमेल से खाता पहले से मौजूद हो सकता है या डेटाबेस उपलब्ध नहीं है।":urdu?"اس ای میل سے اکاؤنٹ پہلے سے موجود ہوسکتا ہے یا ڈیٹابیس دستیاب نہیں ہے۔":result.error };
    await createSession(result.user);
  } catch (error) {
    console.error("Account creation failed:", error);
    return { error: hindi?"खाता नहीं बन सका। कृपया डेटाबेस कॉन्फ़िगरेशन जाँचें और फिर प्रयास करें।":urdu?"اکاؤنٹ نہیں بن سکا۔ ڈیٹابیس کی ترتیب دیکھ کر دوبارہ کوشش کریں۔":databaseSignupError(error) };
  }

  const destination = parsed.data.next?.startsWith("/") && !parsed.data.next.startsWith("//") ? parsed.data.next : "/dashboard";
  redirect(destination);
}
