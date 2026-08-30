import type { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

const documentColumns = {
  passport: { file: "passport_file", name: "passport_file_name", mime: "passport_file_type" },
  aadhaar: { file: "aadhaar_file", name: "aadhaar_file_name", mime: "aadhaar_file_type" },
  pan: { file: "pan_file", name: "pan_file_name", mime: "pan_file_type" },
} as const;

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string; type: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
  const { id: rawId, type } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id < 1 || !(type in documentColumns)) return NextResponse.json({ error: "Document not found." }, { status: 404 });
  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
  const columns = documentColumns[type as keyof typeof documentColumns];
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT ${columns.file} AS file_data, ${columns.name} AS file_name, ${columns.mime} AS file_type FROM booking_documents WHERE booking_id = ? LIMIT 1`,
    [id],
  );
  if (!rows[0]?.file_data) return NextResponse.json({ error: "Document not found." }, { status: 404 });
  const fileName = String(rows[0].file_name || `${type}-${id}`).replace(/[\r\n"\\/]/g, "-");
  const body = new Uint8Array(rows[0].file_data as Buffer);
  return new NextResponse(body, {
    headers: {
      "content-type": String(rows[0].file_type || "application/octet-stream"),
      "content-disposition": `inline; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      "cache-control": "private, no-store, max-age=0",
      "x-content-type-options": "nosniff",
    },
  });
}
