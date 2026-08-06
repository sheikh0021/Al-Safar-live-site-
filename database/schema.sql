CREATE DATABASE IF NOT EXISTS alsafar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE alsafar;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('traveler', 'guide') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS packages (
  id INT UNSIGNED PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  tier ENUM('Basic', 'Standard', 'Premium', 'Deluxe') NOT NULL,
  price_inr INT UNSIGNED NOT NULL,
  duration_days SMALLINT UNSIGNED NOT NULL,
  description TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS bookings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  package_id INT UNSIGNED NOT NULL,
  travel_date DATE NOT NULL,
  travelers SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  phone VARCHAR(30) NOT NULL,
  total_price INT UNSIGNED NOT NULL,
  status ENUM('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  guide_id INT UNSIGNED NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_booking_package FOREIGN KEY (package_id) REFERENCES packages(id),
  CONSTRAINT fk_booking_guide FOREIGN KEY (guide_id) REFERENCES users(id)
);
