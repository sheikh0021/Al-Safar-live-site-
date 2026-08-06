import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2";
import { getDb } from "@/lib/db";
import type { Role, SessionUser } from "@/lib/types";

const demoUsers = [
  { id: 1, name: "Ayaan Khan", email: "traveler@alsafar.com", password: "pilgrim123", role: "traveler" as Role },
  { id: 2, name: "Yusuf Ali", email: "guide@alsafar.com", password: "guide123", role: "guide" as Role }
];

export async function authenticate(email: string, password: string, role: Role): Promise<SessionUser | null> {
  const db = getDb();
  if (!db) {
    const user = demoUsers.find((item) => item.email === email.toLowerCase() && item.password === password && item.role === role);
    return user ? { id: user.id, name: user.name, email: user.email, role: user.role } : null;
  }
  const [rows] = await db.execute<RowDataPacket[]>(
    "SELECT id, name, email, password_hash, role FROM users WHERE email = ? AND role = ? LIMIT 1", [email.toLowerCase(), role]
  );
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
