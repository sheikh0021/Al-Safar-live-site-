import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

const packages = [
  [1, "essential-umrah", "Essential Umrah", "Basic", 85000, 10, "An affordable journey with all pilgrimage essentials."],
  [2, "serene-journey", "Serene Journey", "Standard", 120000, 14, "Balanced comfort and carefully planned transfers."],
  [3, "royal-pilgrimage", "Royal Pilgrimage", "Premium", 149999, 15, "Luxury hotels and private guidance."],
  [4, "signature-alsafar", "Signature AlSafar", "Deluxe", 219999, 18, "Our finest door-to-door pilgrimage experience."],
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is missing. Copy .env.example to .env.local first.");
  }

  const connection = await mysql.createConnection(url);

  try {
    // Railway's public connection URL may omit a default database.
    // The schema creates `alsafar`, so select it explicitly before inserting rows.
    await connection.query("USE alsafar");

    const travelerPassword = await bcrypt.hash("pilgrim123", 12);
    const guidePassword = await bcrypt.hash("guide123", 12);

    await connection.execute(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'traveler'), (?, ?, ?, 'guide') ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash)",
      ["Ayaan Khan", "traveler@alsafar.com", travelerPassword, "Yusuf Ali", "guide@alsafar.com", guidePassword],
    );

    for (const packageRow of packages) {
      await connection.execute(
        "INSERT INTO packages (id, slug, name, tier, price_inr, duration_days, description) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), tier = VALUES(tier), price_inr = VALUES(price_inr), duration_days = VALUES(duration_days), description = VALUES(description)",
        packageRow,
      );
    }

    console.log("AlSafar database seeded successfully.");
  } finally {
    await connection.end();
  }
}

main().catch((error: unknown) => {
  console.error("AlSafar database seed failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
