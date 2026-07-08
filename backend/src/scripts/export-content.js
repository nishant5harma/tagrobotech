import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../db/pool.js";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath =
  process.argv[2] || path.resolve(__dirname, "../../../database/content-export.json");

async function exportContent() {
  const [pages, sections, seo, media] = await Promise.all([
    pool.query("SELECT * FROM pages ORDER BY sort_order, title"),
    pool.query("SELECT * FROM page_sections ORDER BY page_id, position"),
    pool.query("SELECT * FROM page_seo"),
    pool.query("SELECT * FROM media"),
  ]);

  const payload = {
    pages: pages.rows,
    sections: sections.rows,
    seo: seo.rows,
    media: media.rows,
  };

  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2));
  console.log(
    `Exported ${payload.media.length} media, ${payload.pages.length} pages, ${payload.sections.length} sections, ${payload.seo.length} seo rows to ${outputPath}`
  );
  await pool.end();
}

exportContent().catch((error) => {
  console.error("Export failed:", error);
  process.exit(1);
});
