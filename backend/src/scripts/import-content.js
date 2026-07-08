import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../db/pool.js";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function toMysqlDateTime(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 19).replace("T", " ");
}

async function importContent(filePath) {
  const payload = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const { pages = [], sections = [], seo = [], media = [] } = payload;

  await pool.query("SET FOREIGN_KEY_CHECKS = 0");

  for (const row of media) {
    await pool.query(
      `INSERT INTO media (id, original_name, file_name, file_url, mime_type, file_size, width, height, alt_text, uploaded_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         original_name = VALUES(original_name),
         file_name = VALUES(file_name),
         file_url = VALUES(file_url),
         mime_type = VALUES(mime_type),
         file_size = VALUES(file_size),
         width = VALUES(width),
         height = VALUES(height),
         alt_text = VALUES(alt_text)`,
      [
        row.id,
        row.original_name,
        row.file_name,
        row.file_url,
        row.mime_type,
        row.file_size ?? null,
        row.width ?? null,
        row.height ?? null,
        row.alt_text ?? null,
        row.uploaded_by ?? null,
        toMysqlDateTime(row.created_at) ?? toMysqlDateTime(new Date()),
      ]
    );
  }

  for (const row of pages) {
    await pool.query(
      `INSERT INTO pages (
        id, title, slug, page_type, status, excerpt, featured_image_id, published_at,
        author_name, client_name, industry, parent_page_id, sort_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        slug = VALUES(slug),
        page_type = VALUES(page_type),
        status = VALUES(status),
        excerpt = VALUES(excerpt),
        featured_image_id = VALUES(featured_image_id),
        published_at = VALUES(published_at),
        author_name = VALUES(author_name),
        client_name = VALUES(client_name),
        industry = VALUES(industry),
        parent_page_id = VALUES(parent_page_id),
        sort_order = VALUES(sort_order),
        updated_at = VALUES(updated_at)`,
      [
        row.id,
        row.title,
        row.slug,
        row.page_type ?? "page",
        row.status ?? "draft",
        row.excerpt ?? null,
        row.featured_image_id ?? null,
        row.published_at ?? null,
        row.author_name ?? null,
        row.client_name ?? null,
        row.industry ?? null,
        row.parent_page_id ?? null,
        row.sort_order ?? 0,
        toMysqlDateTime(row.created_at) ?? toMysqlDateTime(new Date()),
        toMysqlDateTime(row.updated_at) ?? toMysqlDateTime(new Date()),
      ]
    );
  }

  for (const row of sections) {
    const data =
      typeof row.data === "string" ? row.data : JSON.stringify(row.data ?? {});
    await pool.query(
      `INSERT INTO page_sections (id, page_id, section_type, position, is_active, data, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         page_id = VALUES(page_id),
         section_type = VALUES(section_type),
         position = VALUES(position),
         is_active = VALUES(is_active),
         data = VALUES(data),
         updated_at = VALUES(updated_at)`,
      [
        row.id,
        row.page_id,
        row.section_type,
        row.position ?? 0,
        row.is_active ?? true,
        data,
        toMysqlDateTime(row.created_at) ?? toMysqlDateTime(new Date()),
        toMysqlDateTime(row.updated_at) ?? toMysqlDateTime(new Date()),
      ]
    );
  }

  for (const row of seo) {
    const schemaJson =
      row.schema_json === null || row.schema_json === undefined
        ? null
        : typeof row.schema_json === "string"
          ? row.schema_json
          : JSON.stringify(row.schema_json);

    await pool.query(
      `INSERT INTO page_seo (
        id, page_id, meta_title, meta_description, meta_keywords, canonical_url,
        robots, og_title, og_description, og_image_id, schema_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        meta_title = VALUES(meta_title),
        meta_description = VALUES(meta_description),
        meta_keywords = VALUES(meta_keywords),
        canonical_url = VALUES(canonical_url),
        robots = VALUES(robots),
        og_title = VALUES(og_title),
        og_description = VALUES(og_description),
        og_image_id = VALUES(og_image_id),
        schema_json = VALUES(schema_json),
        updated_at = VALUES(updated_at)`,
      [
        row.id,
        row.page_id,
        row.meta_title ?? null,
        row.meta_description ?? null,
        row.meta_keywords ?? null,
        row.canonical_url ?? null,
        row.robots ?? "index,follow",
        row.og_title ?? null,
        row.og_description ?? null,
        row.og_image_id ?? null,
        schemaJson,
        toMysqlDateTime(row.created_at) ?? toMysqlDateTime(new Date()),
        toMysqlDateTime(row.updated_at) ?? toMysqlDateTime(new Date()),
      ]
    );
  }

  await pool.query("SET FOREIGN_KEY_CHECKS = 1");

  console.log(
    `Imported content: ${media.length} media, ${pages.length} pages, ${sections.length} sections, ${seo.length} seo rows`
  );
  await pool.end();
}

const filePath = process.argv[2] || path.resolve(__dirname, "../../../database/content-export.json");

importContent(filePath).catch((error) => {
  console.error("Import failed:", error);
  process.exit(1);
});
