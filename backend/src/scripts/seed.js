import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../db/pool.js";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.resolve(__dirname, "../../../database/seed.sql");

async function seed() {
  await pool.query(`
    SET FOREIGN_KEY_CHECKS = 0;
    TRUNCATE TABLE page_seo;
    TRUNCATE TABLE page_sections;
    TRUNCATE TABLE pages;
    TRUNCATE TABLE media;
    TRUNCATE TABLE admin_users;
    SET FOREIGN_KEY_CHECKS = 1;
  `);

  const sql = fs.readFileSync(seedPath, "utf8");
  await pool.query(sql);
  console.log("Database seeded successfully");
  await pool.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
