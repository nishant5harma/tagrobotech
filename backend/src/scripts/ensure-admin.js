import crypto from "crypto";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import pool from "../db/pool.js";

dotenv.config();

const DEFAULT_EMAIL = "admin@tagrobotech.com";
const DEFAULT_PASSWORD = "Admin@123456";
const DEFAULT_NAME = "CMS Admin";

async function ensureAdmin() {
  const email = (process.env.ADMIN_EMAIL || DEFAULT_EMAIL).toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;
  const name = process.env.ADMIN_NAME || DEFAULT_NAME;

  const existing = await pool.query(`SELECT id FROM admin_users WHERE email = ?`, [email]);

  if (existing.rows.length > 0) {
    console.log(`Admin user already exists: ${email}`);
    await pool.end();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const id = crypto.randomUUID();

  await pool.query(
    `INSERT INTO admin_users (id, email, password_hash, name, is_active)
     VALUES (?, ?, ?, ?, TRUE)`,
    [id, email, passwordHash, name]
  );

  console.log(`Created admin user: ${email}`);
  await pool.end();
}

ensureAdmin().catch((error) => {
  console.error("Ensure admin failed:", error);
  process.exit(1);
});
