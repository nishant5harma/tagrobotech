import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import pool from "../db/pool.js";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.resolve(__dirname, "../../../database/migrations");
const MIGRATIONS_TABLE = "_schema_migrations";

async function ensureDatabase() {
  const url = new URL(process.env.DATABASE_URL.replace("mysql://", "http://"));
  const database = url.pathname.replace(/^\//, "");

  const connection = await mysql.createConnection({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username || "root"),
    password: decodeURIComponent(url.password || ""),
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await connection.end();
}

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      filename VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

async function getAppliedMigrationNames() {
  const result = await pool.query(`SELECT filename FROM ${MIGRATIONS_TABLE}`);
  return new Set(result.rows.map((row) => row.filename));
}

async function hasExistingCmsSchema() {
  const checks = await Promise.all(
    ["pages", "media", "admin_users", "page_sections", "page_seo", "site_settings", "leads"].map(
      async (table) => {
        const result = await pool.query(
          `SELECT COUNT(*) AS count
           FROM information_schema.tables
           WHERE table_schema = DATABASE() AND table_name = ?`,
          [table]
        );
        return Number(result.rows[0]?.count ?? 0) > 0;
      }
    )
  );

  return checks.some(Boolean);
}

async function markMigrationsAsApplied(files) {
  for (const file of files) {
    await pool.query(
      `INSERT IGNORE INTO ${MIGRATIONS_TABLE} (filename) VALUES (?)`,
      [file]
    );
  }
}

async function migrate() {
  await ensureDatabase();
  await ensureMigrationsTable();

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  let applied = await getAppliedMigrationNames();
  if (applied.size === 0 && (await hasExistingCmsSchema())) {
    console.log("Existing schema detected; bootstrapping migration history.");
    await markMigrationsAsApplied(files);
    applied = await getAppliedMigrationNames();
  }

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`Skipped: ${file} (already applied)`);
      continue;
    }
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    await pool.query(sql);
    await pool.query(
      `INSERT INTO ${MIGRATIONS_TABLE} (filename) VALUES (?)`,
      [file]
    );
    console.log(`Migrated: ${file}`);
  }

  console.log("Schema migrated successfully");
  await pool.end();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
