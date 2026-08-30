USE alsafar;

-- Reference SQL for a fresh one-time migration. For existing databases and safe
-- reruns, use `npm run db:migrate-admin`; the script checks information_schema
-- before adding every column.

ALTER TABLE users
  MODIFY COLUMN role ENUM('traveler', 'guide', 'admin') NOT NULL;

ALTER TABLE bookings
  MODIFY COLUMN status ENUM('pending','documents_review','confirmed','payment_received','completed','cancelled') DEFAULT 'pending',
  ADD COLUMN payment_status ENUM('pending','received') NOT NULL DEFAULT 'pending' AFTER guide_id,
  ADD COLUMN payment_received_at DATETIME NULL AFTER payment_status,
  ADD COLUMN payment_received_by INT UNSIGNED NULL AFTER payment_received_at,
  ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

ALTER TABLE booking_documents
  ADD COLUMN passport_status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending' AFTER payment_method,
  ADD COLUMN aadhaar_status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending' AFTER passport_status,
  ADD COLUMN pan_status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending' AFTER aadhaar_status,
  ADD COLUMN review_notes TEXT NULL AFTER pan_status,
  ADD COLUMN reviewed_by INT UNSIGNED NULL AFTER review_notes,
  ADD COLUMN reviewed_at DATETIME NULL AFTER reviewed_by;

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
  guide_id INT UNSIGNED NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_package_departure (package_id, travel_date),
  CONSTRAINT fk_departure_package FOREIGN KEY (package_id) REFERENCES packages(id)
);

CREATE TABLE IF NOT EXISTS guide_profiles (
  user_id INT UNSIGNED PRIMARY KEY,
  phone VARCHAR(30) NULL,
  city VARCHAR(100) NULL,
  languages VARCHAR(255) NULL,
  experience_years SMALLINT UNSIGNED NULL,
  notes TEXT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_guide_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
