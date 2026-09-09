import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { answerHelpChat, hasHelpAiKey } from "@/lib/help-ai";

const schema = z.object({
  message: z.string().trim().min(1).max(800),
  locale: z.enum(["en", "hi", "ur"]).default("en"),
  history: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().max(4000),
  })).max(12).optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
});

export async function GET() {
  return NextResponse.json({ ai: hasHelpAiKey() });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please type a shorter, valid question." }, { status: 400 });
  }

  const result = await answerHelpChat({
    message: parsed.data.message,
    locale: parsed.data.locale,
    history: parsed.data.history,
    latitude: parsed.data.latitude,
    longitude: parsed.data.longitude,
  });

  return NextResponse.json(result);
}
