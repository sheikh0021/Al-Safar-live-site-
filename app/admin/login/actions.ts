"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession } from "@/lib/auth";
import { authenticate } from "@/lib/users";

export type AdminLoginState = { error?: string };

export async function adminLogin(_: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
  const parsed = z.object({ email: z.string().trim().email(), password: z.string().min(8) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter a valid administrator email and password." };
  try {
    const user = await authenticate(parsed.data.email, parsed.data.password, "admin");
    if (!user) return { error: "These details do not match an administrator account." };
    await createSession(user);
  } catch (error) {
    console.error("Administrator login failed:", error);
    return { error: "The administrator database is unavailable. Check DATABASE_URL and run the admin migration." };
  }
  redirect("/admin");
}
