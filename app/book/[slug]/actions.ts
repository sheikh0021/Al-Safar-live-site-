"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { packages } from "@/lib/packages";

export type BookingState = { error?: string };
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];

function validateDocument(value: FormDataEntryValue | null, label: string): string | null {
  if (!(value instanceof File) || value.size === 0) return `Please upload your ${label}.`;
  if (value.size > MAX_FILE_SIZE) return `${label} must be smaller than 2 MB.`;
  if (!ALLOWED_FILE_TYPES.includes(value.type)) return `${label} must be a PDF, JPG, or PNG file.`;
  return null;
}

export async function createBooking(_: BookingState, formData: FormData): Promise<BookingState> {
  const hindi=formData.get("locale")==="hi";
  const urdu=formData.get("locale")==="ur";
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "traveler") return { error: hindi?"केवल यात्री खाते पैकेज बुक कर सकते हैं।":urdu?"صرف زائر اکاؤنٹ پیکیج بک کرسکتے ہیں۔":"Only traveler accounts can book a package." };
  const parsed = z.object({
    packageId: z.coerce.number(), travelDate: z.string().min(1),
    travelers: z.coerce.number().int().min(1).max(6), phone: z.string().trim().min(8).max(30),
    passportNumber: z.string().trim().min(6).max(20).regex(/^[A-Za-z0-9]+$/),
    aadhaarNumber: z.string().transform((value) => value.replace(/\s/g, "")).pipe(z.string().regex(/^\d{12}$/)),
    panNumber: z.string().trim().toUpperCase().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/),
    paymentMethod: z.literal("pay_in_office"), locale:z.enum(["en","hi","ur"]).optional()
  }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: hindi?"कृपया यात्रा, दस्तावेज़ और भुगतान का सभी विवरण जाँचें।":urdu?"سفر، دستاویزات اور ادائیگی کی تمام تفصیلات دیکھیں۔":"Please check all journey, document, and payment details." };

  const documents = [[formData.get("passportFile"), "passport document"], [formData.get("aadhaarFile"), "Aadhaar card"], [formData.get("panFile"), "PAN card"]] as const;
  for (const [file, label] of documents) {
    const error = validateDocument(file, label);
    if (error) return { error: hindi?"कृपया सभी आवश्यक दस्तावेज़ PDF, JPG या PNG में और 2 MB से कम आकार में अपलोड करें।":urdu?"تمام ضروری دستاویزات PDF، JPG یا PNG میں اور 2 MB سے کم اپ لوڈ کریں۔":error };
  }
  const pkg = packages.find((item) => item.id === parsed.data.packageId);
  if (!pkg) return { error: hindi?"पैकेज नहीं मिला।":urdu?"پیکیج نہیں ملا۔":"Package not found." };
  const db = getDb();
  if (!db) return { error: hindi?"बुकिंग के लिए MySQL डेटाबेस आवश्यक है। पहले DATABASE_URL कॉन्फ़िगर करें।":urdu?"بکنگ کے لیے MySQL ڈیٹابیس ضروری ہے۔ پہلے DATABASE_URL ترتیب دیں۔":"Booking requires the MySQL database. Please configure DATABASE_URL first." };
  const passportFile = documents[0][0] as File;
  const aadhaarFile = documents[1][0] as File;
  const panFile = documents[2][0] as File;
  const connection = await db.getConnection();
  let bookingId: number | undefined;
  try {
    await connection.execute(`CREATE TABLE IF NOT EXISTS booking_documents (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, booking_id INT UNSIGNED NOT NULL UNIQUE,
      passport_number VARCHAR(20) NOT NULL, aadhaar_number VARCHAR(12) NOT NULL, pan_number VARCHAR(10) NOT NULL,
      passport_file MEDIUMBLOB NOT NULL, passport_file_name VARCHAR(255) NOT NULL, passport_file_type VARCHAR(100) NOT NULL,
      aadhaar_file MEDIUMBLOB NOT NULL, aadhaar_file_name VARCHAR(255) NOT NULL, aadhaar_file_type VARCHAR(100) NOT NULL,
      pan_file MEDIUMBLOB NOT NULL, pan_file_name VARCHAR(255) NOT NULL, pan_file_type VARCHAR(100) NOT NULL,
      payment_method ENUM('pay_in_office') NOT NULL DEFAULT 'pay_in_office', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_document_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
    )`);
    await connection.beginTransaction();
    await connection.execute(
      "INSERT IGNORE INTO package_departures (package_id, travel_date, capacity) VALUES (?, ?, 40)",
      [pkg.id, parsed.data.travelDate],
    );
    const [departureRows] = await connection.execute<import("mysql2").RowDataPacket[]>(
      "SELECT capacity, guide_id FROM package_departures WHERE package_id = ? AND travel_date = ? FOR UPDATE",
      [pkg.id, parsed.data.travelDate],
    );
    const [seatRows] = await connection.execute<import("mysql2").RowDataPacket[]>(
      "SELECT COALESCE(SUM(travelers), 0) AS booked_seats FROM bookings WHERE package_id = ? AND travel_date = ? AND status <> 'cancelled'",
      [pkg.id, parsed.data.travelDate],
    );
    const capacity = Number(departureRows[0]?.capacity || 40);
    const bookedSeats = Number(seatRows[0]?.booked_seats || 0);
    if (bookedSeats + parsed.data.travelers > capacity) {
      await connection.rollback();
      return { error: hindi?`इस प्रस्थान में केवल ${Math.max(0,capacity-bookedSeats)} स्थान बचे हैं।`:urdu?`اس روانگی میں صرف ${Math.max(0,capacity-bookedSeats)} جگہیں باقی ہیں۔`:`Only ${Math.max(0, capacity - bookedSeats)} seats remain for this departure.` };
    }
    const [bookingResult] = await connection.execute<import("mysql2").ResultSetHeader>(
      "INSERT INTO bookings (user_id, package_id, travel_date, travelers, phone, total_price, status, guide_id) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)",
      [user.id, pkg.id, parsed.data.travelDate, parsed.data.travelers, parsed.data.phone, pkg.price * parsed.data.travelers, departureRows[0]?.guide_id || null]
    );
    bookingId = bookingResult.insertId;
    await connection.execute(
      `INSERT INTO booking_documents (booking_id, passport_number, aadhaar_number, pan_number, passport_file, passport_file_name, passport_file_type, aadhaar_file, aadhaar_file_name, aadhaar_file_type, pan_file, pan_file_name, pan_file_type, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pay_in_office')`,
      [bookingId, parsed.data.passportNumber.toUpperCase(), parsed.data.aadhaarNumber, parsed.data.panNumber,
        Buffer.from(await passportFile.arrayBuffer()), passportFile.name, passportFile.type,
        Buffer.from(await aadhaarFile.arrayBuffer()), aadhaarFile.name, aadhaarFile.type,
        Buffer.from(await panFile.arrayBuffer()), panFile.name, panFile.type]
    );
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error("Booking creation failed:", error);
    return { error: hindi?"बुकिंग सहेजी नहीं जा सकी। फिर प्रयास करें या अलसफ़र सहायता से संपर्क करें।":urdu?"بکنگ محفوظ نہیں ہوسکی۔ دوبارہ کوشش کریں یا السفر مدد سے رابطہ کریں۔":"We could not save this booking. Please try again or contact AlSafar support." };
  } finally {
    connection.release();
  }
  redirect(`/booking/confirmation?id=${bookingId}`);
}
