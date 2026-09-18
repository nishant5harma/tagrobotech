/**
 * One-time (safe, idempotent) repair for article_body / rich_text sections
 * whose HTML was saved as escaped source (&lt;p&gt;...). Never truncates or seeds.
 *
 * Usage: node src/scripts/repair-escaped-html.js
 */
import "dotenv/config";
import pool from "../db/pool.js";
import { sanitizeCmsHtml } from "../lib/cms-html.js";

async function main() {
  const result = await pool.query(
    `SELECT id, section_type, data
     FROM page_sections
     WHERE section_type IN ('article_body', 'rich_text')`
  );

  let updated = 0;
  for (const row of result.rows) {
    let data = row.data;
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch {
        continue;
      }
    }
    if (!data || typeof data !== "object") continue;

    const original = String(data.content ?? "");
    if (!/&lt;\s*\/?\s*[a-zA-Z!]/.test(original) && !/SEO Metadata/i.test(original)) {
      continue;
    }

    const repaired = sanitizeCmsHtml(original);
    if (repaired === original) continue;

    const next = { ...data, content: repaired };
    await pool.query(`UPDATE page_sections SET data = ? WHERE id = ?`, [
      JSON.stringify(next),
      row.id,
    ]);
    updated += 1;
    console.log(`Repaired ${row.section_type} section ${row.id} (${original.length} → ${repaired.length} chars)`);
  }

  // Fix known typo on solar gencos blog if present
  const typo = await pool.query(
    `UPDATE pages
     SET industry = 'Fixed Asset'
     WHERE slug = 'fixed-asset-verification-solar-gencos'
       AND industry = 'Fixed Aseet'`
  );
  const typoCount = typo.meta?.affectedRows ?? 0;
  if (typoCount > 0) {
    console.log("Fixed industry typo on fixed-asset-verification-solar-gencos");
  }

  console.log(`Done. Updated ${updated} section(s).`);
  await pool.end();
}

main().catch(async (err) => {
  console.error(err);
  try {
    await pool.end();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
