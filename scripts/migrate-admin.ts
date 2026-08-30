import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2";

const statements = [
  "ALTER TABLE users MODIFY COLUMN role ENUM('traveler', 'guide', 'admin') NOT NULL",
  "ALTER TABLE bookings MODIFY COLUMN status ENUM('pending','documents_review','confirmed','payment_received','completed','cancelled') DEFAULT 'pending'",
  `CREATE TABLE IF NOT EXISTS booking_documents (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, booking_id INT UNSIGNED NOT NULL UNIQUE,
    passport_number VARCHAR(20) NOT NULL, aadhaar_number VARCHAR(12) NOT NULL, pan_number VARCHAR(10) NOT NULL,
    passport_file MEDIUMBLOB NOT NULL, passport_file_name VARCHAR(255) NOT NULL, passport_file_type VARCHAR(100) NOT NULL,
    aadhaar_file MEDIUMBLOB NOT NULL, aadhaar_file_name VARCHAR(255) NOT NULL, aadhaar_file_type VARCHAR(100) NOT NULL,
    pan_file MEDIUMBLOB NOT NULL, pan_file_name VARCHAR(255) NOT NULL, pan_file_type VARCHAR(100) NOT NULL,
    payment_method ENUM('pay_in_office') NOT NULL DEFAULT 'pay_in_office', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_document_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS booking_notes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, booking_id INT UNSIGNED NOT NULL,
    admin_id INT UNSIGNED NOT NULL, note TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_note_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    CONSTRAINT fk_note_admin FOREIGN KEY (admin_id) REFERENCES users(id)
  )`,
  `CREATE TABLE IF NOT EXISTS booking_audit_log (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, booking_id INT UNSIGNED NOT NULL,
    admin_id INT UNSIGNED NOT NULL, action VARCHAR(80) NOT NULL, details TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    CONSTRAINT fk_audit_admin FOREIGN KEY (admin_id) REFERENCES users(id)
  )`,
  `CREATE TABLE IF NOT EXISTS package_departures (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, package_id INT UNSIGNED NOT NULL,
    travel_date DATE NOT NULL, capacity SMALLINT UNSIGNED NOT NULL DEFAULT 40,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_package_departure (package_id, travel_date),
    CONSTRAINT fk_departure_package FOREIGN KEY (package_id) REFERENCES packages(id)
  )`,
];

const columns = [
  { table: "bookings", name: "payment_status", definition: "ENUM('pending','received') NOT NULL DEFAULT 'pending' AFTER guide_id" },
  { table: "bookings", name: "payment_received_at", definition: "DATETIME NULL AFTER payment_status" },
  { table: "bookings", name: "payment_received_by", definition: "INT UNSIGNED NULL AFTER payment_received_at" },
  { table: "bookings", name: "updated_at", definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at" },
  { table: "booking_documents", name: "passport_status", definition: "ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending' AFTER payment_method" },
  { table: "booking_documents", name: "aadhaar_status", definition: "ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending' AFTER passport_status" },
  { table: "booking_documents", name: "pan_status", definition: "ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending' AFTER aadhaar_status" },
  { table: "booking_documents", name: "review_notes", definition: "TEXT NULL AFTER pan_status" },
  { table: "booking_documents", name: "reviewed_by", definition: "INT UNSIGNED NULL AFTER review_notes" },
  { table: "booking_documents", name: "reviewed_at", definition: "DATETIME NULL AFTER reviewed_by" },
] as const;

async function addColumnWhenMissing(connection: mysql.Connection, table: string, name: string, definition: string) {
  const [existing] = await connection.execute<RowDataPacket[]>(
    `SELECT 1 FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ? LIMIT 1`,
    [table, name],
  );
  if (existing.length === 0) {
    await connection.execute(`ALTER TABLE \`${table}\` ADD COLUMN \`${name}\` ${definition}`);
  }
}

async function main() {
  const url = process.env.DATABASE_URL;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "AlSafar Administrator";

  if (!url) throw new Error("DATABASE_URL is missing.");
  if (!email || !password) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required.");
  if (password.length < 12) throw new Error("ADMIN_PASSWORD must contain at least 12 characters.");

  const connection = await mysql.createConnection(url);
  try {
    await connection.query("USE alsafar");
    await connection.execute(statements[0]);
    await connection.execute(statements[1]);
    await connection.execute(statements[2]);
    for (const column of columns) {
      await addColumnWhenMissing(connection, column.table, column.name, column.definition);
    }
    for (const statement of statements.slice(3)) await connection.execute(statement);

    const passwordHash = await bcrypt.hash(password, 12);
    await connection.execute(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES (?, ?, ?, 'admin')
       ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash), role = 'admin'`,
      [name, email, passwordHash],
    );
    console.log(`Admin dashboard migration completed. Administrator: ${email}`);
  } finally {
    await connection.end();
  }
}

main().catch((error: unknown) => {
  console.error("Admin dashboard migration failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
