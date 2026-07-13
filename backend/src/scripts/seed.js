import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../db/pool.js";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.resolve(__dirname, "../../../database/seed.sql");

async function tableExists(tableName) {
  const result = await pool.query(
    `SELECT COUNT(*) AS count
     FROM information_schema.tables
     WHERE table_schema = DATABASE() AND table_name = ?`,
    [tableName]
  );
  return Number(result.rows[0]?.count ?? 0) > 0;
}

async function countRows(tableName) {
  if (!(await tableExists(tableName))) return 0;
  const result = await pool.query(`SELECT COUNT(*) AS count FROM \`${tableName}\``);
  return Number(result.rows[0]?.count ?? 0);
}

async function seed() {
  const force = process.env.FORCE_SEED === "true";
  const pageCount = await countRows("pages");
  const mediaCount = await countRows("media");
  const sectionCount = await countRows("page_sections");

  if (!force && (pageCount > 0 || mediaCount > 0 || sectionCount > 0)) {
    console.error(
      [
        "Refusing to seed: existing CMS content detected.",
        `pages=${pageCount}, media=${mediaCount}, page_sections=${sectionCount}`,
        "Seed truncates pages/media/sections and would wipe live content.",
        "If you really want to wipe and reseed, set FORCE_SEED=true",
      ].join("\n")
    );
    await pool.end();
    process.exit(1);
  }

  if (force) {
    console.warn("FORCE_SEED=true — wiping and reseeding CMS tables.");
  }

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
