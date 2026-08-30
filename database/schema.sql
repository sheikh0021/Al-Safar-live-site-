CREATE DATABASE IF NOT EXISTS alsafar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE alsafar;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('traveler', 'guide', 'admin') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS oauth_accounts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  provider VARCHAR(30) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_oauth_provider_account (provider, provider_account_id),
  CONSTRAINT fk_oauth_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
  status ENUM('pending','documents_review','confirmed','payment_received','completed','cancelled') DEFAULT 'pending',
  guide_id INT UNSIGNED NULL,
  payment_status ENUM('pending','received') NOT NULL DEFAULT 'pending',
  payment_received_at DATETIME NULL,
  payment_received_by INT UNSIGNED NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_booking_package FOREIGN KEY (package_id) REFERENCES packages(id),
  CONSTRAINT fk_booking_guide FOREIGN KEY (guide_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS booking_documents (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id INT UNSIGNED NOT NULL UNIQUE,
  passport_number VARCHAR(20) NOT NULL,
  aadhaar_number VARCHAR(12) NOT NULL,
  pan_number VARCHAR(10) NOT NULL,
  passport_file MEDIUMBLOB NOT NULL,
  passport_file_name VARCHAR(255) NOT NULL,
  passport_file_type VARCHAR(100) NOT NULL,
  aadhaar_file MEDIUMBLOB NOT NULL,
  aadhaar_file_name VARCHAR(255) NOT NULL,
  aadhaar_file_type VARCHAR(100) NOT NULL,
  pan_file MEDIUMBLOB NOT NULL,
  pan_file_name VARCHAR(255) NOT NULL,
  pan_file_type VARCHAR(100) NOT NULL,
  payment_method ENUM('pay_in_office') NOT NULL DEFAULT 'pay_in_office',
  passport_status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  aadhaar_status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  pan_status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  review_notes TEXT NULL,
  reviewed_by INT UNSIGNED NULL,
  reviewed_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_document_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS booking_notes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id INT UNSIGNED NOT NULL,
  admin_id INT UNSIGNED NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_note_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  CONSTRAINT fk_note_admin FOREIGN KEY (admin_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS booking_audit_log (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id INT UNSIGNED NOT NULL,
  admin_id INT UNSIGNED NOT NULL,
  action VARCHAR(80) NOT NULL,
  details TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  CONSTRAINT fk_audit_admin FOREIGN KEY (admin_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS package_departures (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  package_id INT UNSIGNED NOT NULL,
  travel_date DATE NOT NULL,
  capacity SMALLINT UNSIGNED NOT NULL DEFAULT 40,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_package_departure (package_id, travel_date),
  CONSTRAINT fk_departure_package FOREIGN KEY (package_id) REFERENCES packages(id)
);
