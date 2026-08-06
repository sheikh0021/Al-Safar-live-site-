"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authenticate } from "@/lib/users";
import { createSession } from "@/lib/auth";

export type LoginState = { error?: string };
export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = z.object({ email:z.string().email(), password:z.string().min(6), role:z.enum(["traveler","guide"]) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error:"Please enter a valid email and password." };
  const user = await authenticate(parsed.data.email, parsed.data.password, parsed.data.role);
  if (!user) return { error:"Those details do not match this account type." };
  await createSession(user); redirect("/dashboard");
}
