import bcrypt from "bcryptjs";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
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

export type CreateUserResult =
  | { user: SessionUser }
  | { error: string };

export async function createUser(
  name: string,
  email: string,
  password: string,
  role: Role
): Promise<CreateUserResult> {
  const db = getDb();
  if (!db) {
    return { error: "Account creation needs a MySQL connection. Add DATABASE_URL to .env.local and try again." };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const [existing] = await db.execute<RowDataPacket[]>(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [normalizedEmail]
  );
  if (existing.length > 0) {
    return { error: "An account with this email already exists. Please sign in instead." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  try {
    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [name.trim(), normalizedEmail, passwordHash, role]
    );
    return {
      user: { id: result.insertId, name: name.trim(), email: normalizedEmail, role }
    };
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "ER_DUP_ENTRY") {
      return { error: "An account with this email already exists. Please sign in instead." };
    }
    throw error;
  }
}
