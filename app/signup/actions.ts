"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession } from "@/lib/auth";
import { createUser } from "@/lib/users";

export type SignupState = { error?: string };

const signupSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  password: z.string().min(8).max(72)
    .regex(/[A-Za-z]/, "Password must contain a letter.")
    .regex(/[0-9]/, "Password must contain a number."),
  confirmPassword: z.string(),
  role: z.enum(["traveler", "guide"]),
  next: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"]
});

export async function signup(_: SignupState, formData: FormData): Promise<SignupState> {
  const parsed = signupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    if (issue.path.includes("confirmPassword")) return { error: "The two passwords do not match." };
    if (issue.path.includes("password")) return { error: issue.message };
    return { error: "Please complete every field with valid information." };
  }

  try {
    const result = await createUser(
      parsed.data.name,
      parsed.data.email,
      parsed.data.password,
      parsed.data.role
    );
    if ("error" in result) return { error: result.error };
    await createSession(result.user);
  } catch (error) {
    console.error("Account creation failed:", error);
    return { error: "We could not create your account. Please check the database connection and try again." };
  }

  const destination = parsed.data.next?.startsWith("/") && !parsed.data.next.startsWith("//") ? parsed.data.next : "/dashboard";
  redirect(destination);
}
