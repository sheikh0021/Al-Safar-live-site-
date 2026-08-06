import mysql from "mysql2/promise";

let pool: mysql.Pool | undefined;

export function getDb() {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) pool = mysql.createPool({ uri: process.env.DATABASE_URL, connectionLimit: 10 });
  return pool;
}
