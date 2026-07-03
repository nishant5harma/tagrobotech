import { Router } from "express";
import crypto from "crypto";
import pool from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { normalizeSlug } from "../lib/slug.js";
import { defaultSectionData } from "../lib/sections.js";

const router = Router();
const PAGE_TYPES = new Set([
  "page",
  "resource",
  "feature",
  "solution",
  "service",
  "blog",
  "case_study",
]);

function parseSectionRow(row) {
  if (!row || typeof row.data !== "string") return row;
  try {
    return { ...row, data: JSON.parse(row.data) };
  } catch {
    return { ...row, data: {} };
  }
}

function parseSeoRow(row) {
  if (!row) return row;
  if (typeof row.schema_json === "string") {
    try {
      return { ...row, schema_json: JSON.parse(row.schema_json) };
    } catch {
      return { ...row, schema_json: null };
    }
  }
  return row;
}

function parsePageRow(row) {
  if (!row) return row;
  return {
    ...row,
    published_at: row.published_at ?? null,
  };
}

function sanitizeText(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const normalized = String(value).trim();
  return normalized || null;
}

function sanitizePageType(value) {
  const pageType = String(value ?? "page").trim();
  if (!PAGE_TYPES.has(pageType)) return null;
  return pageType;
}

function sanitizeHtmlContent(value) {
  return String(value ?? "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

function sanitizeSectionData(sectionType, data) {
  if (!data || typeof data !== "object") return data;

  if (sectionType === "rich_text" || sectionType === "article_body") {
    return {
      ...data,
      heading: sanitizeText(data.heading) ?? "",
      content: sanitizeHtmlContent(data.content),
    };
  }

  return data;
}

router.use(requireAuth);

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, slug, page_type, status, excerpt, featured_image_id, published_at,
              author_name, client_name, industry, sort_order, created_at, updated_at
       FROM pages
       ORDER BY sort_order ASC, title ASC`
    );
    res.json({ pages: result.rows.map(parsePageRow) });
  } catch (error) {
    console.error("Pages list error:", error);
    res.status(500).json({ error: "Failed to load pages" });
  }
});

router.post("/", async (req, res) => {
  const {
    title,
    slug,
    page_type = "page",
    status = "draft",
    excerpt,
    featured_image_id,
    published_at,
    author_name,
    client_name,
    industry,
  } = req.body;

  if (!title?.trim() || !slug?.trim()) {
    return res.status(400).json({ error: "Title and slug are required" });
  }

  const normalizedSlug = normalizeSlug(slug);
  if (!normalizedSlug) {
    return res.status(400).json({ error: "Invalid slug" });
  }

  const normalizedPageType = sanitizePageType(page_type);
  if (!normalizedPageType) {
    return res.status(400).json({ error: "Invalid page type" });
  }

  const pageId = crypto.randomUUID();

  try {
    const existing = await pool.query(`SELECT id FROM pages WHERE slug = ?`, [normalizedSlug]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "A page with this slug already exists" });
    }

    await pool.query(
      `INSERT INTO pages (
        id, title, slug, page_type, status, excerpt, featured_image_id, published_at,
        author_name, client_name, industry
      )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        pageId,
        title.trim(),
        normalizedSlug,
        normalizedPageType,
        status || "draft",
        sanitizeText(excerpt) ?? null,
        featured_image_id || null,
        published_at || null,
        sanitizeText(author_name) ?? null,
        sanitizeText(client_name) ?? null,
        sanitizeText(industry) ?? null,
      ]
    );

    await pool.query(
      `INSERT INTO page_seo (id, page_id, meta_title, robots)
       VALUES (?, ?, ?, 'index,follow')`,
      [crypto.randomUUID(), pageId, title.trim()]
    );

    const result = await pool.query(`SELECT * FROM pages WHERE id = ?`, [pageId]);
    res.status(201).json({ page: parsePageRow(result.rows[0]) });
  } catch (error) {
    console.error("Create page error:", error);
    res.status(500).json({ error: "Failed to create page" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const pageResult = await pool.query(`SELECT * FROM pages WHERE id = ?`, [req.params.id]);
    const page = parsePageRow(pageResult.rows[0]);

    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    const [sectionsResult, seoResult] = await Promise.all([
      pool.query(
        `SELECT id, page_id, section_type, position, is_active, data, created_at, updated_at
         FROM page_sections
         WHERE page_id = ?
         ORDER BY position ASC, created_at ASC`,
        [req.params.id]
      ),
      pool.query(`SELECT * FROM page_seo WHERE page_id = ?`, [req.params.id]),
    ]);

    res.json({
      page,
      sections: sectionsResult.rows.map(parseSectionRow),
      seo: seoResult.rows[0] ? parseSeoRow(seoResult.rows[0]) : null,
    });
  } catch (error) {
    console.error("Get page error:", error);
    res.status(500).json({ error: "Failed to load page" });
  }
});

router.put("/:id/seo", async (req, res) => {
  const {
    meta_title,
    meta_description,
    meta_keywords,
    canonical_url,
    robots,
    og_title,
    og_description,
    og_image_id,
    schema_json,
  } = req.body;

  try {
    const pageResult = await pool.query(`SELECT id FROM pages WHERE id = ?`, [req.params.id]);
    if (!pageResult.rows[0]) {
      return res.status(404).json({ error: "Page not found" });
    }

    const seoResult = await pool.query(`SELECT id FROM page_seo WHERE page_id = ?`, [req.params.id]);
    let seoId = seoResult.rows[0]?.id;

    if (!seoId) {
      seoId = crypto.randomUUID();
      await pool.query(
        `INSERT INTO page_seo (id, page_id, meta_title, robots)
         VALUES (?, ?, ?, 'index,follow')`,
        [seoId, req.params.id, meta_title?.trim() || null]
      );
    }

    const updates = [];
    const values = [];

    if (meta_title !== undefined) {
      updates.push("meta_title = ?");
      values.push(meta_title?.trim() || null);
    }
    if (meta_description !== undefined) {
      updates.push("meta_description = ?");
      values.push(meta_description?.trim() || null);
    }
    if (meta_keywords !== undefined) {
      updates.push("meta_keywords = ?");
      values.push(meta_keywords?.trim() || null);
    }
    if (canonical_url !== undefined) {
      updates.push("canonical_url = ?");
      values.push(canonical_url?.trim() || null);
    }
    if (robots !== undefined) {
      updates.push("robots = ?");
      values.push(robots?.trim() || "index,follow");
    }
    if (og_title !== undefined) {
      updates.push("og_title = ?");
      values.push(og_title?.trim() || null);
    }
    if (og_description !== undefined) {
      updates.push("og_description = ?");
      values.push(og_description?.trim() || null);
    }
    if (og_image_id !== undefined) {
      updates.push("og_image_id = ?");
      values.push(og_image_id || null);
    }
    if (schema_json !== undefined) {
      updates.push("schema_json = ?");
      values.push(schema_json ? JSON.stringify(schema_json) : null);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(seoId);
    await pool.query(`UPDATE page_seo SET ${updates.join(", ")} WHERE id = ?`, values);

    const result = await pool.query(`SELECT * FROM page_seo WHERE id = ?`, [seoId]);
    res.json({ seo: parseSeoRow(result.rows[0]) });
  } catch (error) {
    console.error("Update SEO error:", error);
    res.status(500).json({ error: "Failed to update SEO" });
  }
});

router.put("/:id", async (req, res) => {
  const {
    title,
    slug,
    page_type,
    status,
    sort_order,
    excerpt,
    featured_image_id,
    published_at,
    author_name,
    client_name,
    industry,
  } = req.body;

  try {
    const pageResult = await pool.query(`SELECT * FROM pages WHERE id = ?`, [req.params.id]);
    if (!pageResult.rows[0]) {
      return res.status(404).json({ error: "Page not found" });
    }

    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push("title = ?");
      values.push(title.trim());
    }
    if (slug !== undefined) {
      const normalizedSlug = normalizeSlug(slug);
      if (!normalizedSlug) {
        return res.status(400).json({ error: "Invalid slug" });
      }
      const dup = await pool.query(`SELECT id FROM pages WHERE slug = ? AND id != ?`, [
        normalizedSlug,
        req.params.id,
      ]);
      if (dup.rows.length > 0) {
        return res.status(409).json({ error: "A page with this slug already exists" });
      }
      updates.push("slug = ?");
      values.push(normalizedSlug);
    }
    if (page_type !== undefined) {
      const normalizedPageType = sanitizePageType(page_type);
      if (!normalizedPageType) {
        return res.status(400).json({ error: "Invalid page type" });
      }
      updates.push("page_type = ?");
      values.push(normalizedPageType);
    }
    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }
    if (excerpt !== undefined) {
      updates.push("excerpt = ?");
      values.push(sanitizeText(excerpt));
    }
    if (featured_image_id !== undefined) {
      updates.push("featured_image_id = ?");
      values.push(featured_image_id || null);
    }
    if (published_at !== undefined) {
      updates.push("published_at = ?");
      values.push(published_at || null);
    }
    if (author_name !== undefined) {
      updates.push("author_name = ?");
      values.push(sanitizeText(author_name));
    }
    if (client_name !== undefined) {
      updates.push("client_name = ?");
      values.push(sanitizeText(client_name));
    }
    if (industry !== undefined) {
      updates.push("industry = ?");
      values.push(sanitizeText(industry));
    }
    if (sort_order !== undefined) {
      updates.push("sort_order = ?");
      values.push(sort_order);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(req.params.id);
    await pool.query(`UPDATE pages SET ${updates.join(", ")} WHERE id = ?`, values);

    const result = await pool.query(`SELECT * FROM pages WHERE id = ?`, [req.params.id]);
    res.json({ page: parsePageRow(result.rows[0]) });
  } catch (error) {
    console.error("Update page error:", error);
    res.status(500).json({ error: "Failed to update page" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(`DELETE FROM pages WHERE id = ?`, [req.params.id]);
    if (!result.meta?.affectedRows) {
      return res.status(404).json({ error: "Page not found" });
    }
    res.json({ message: "Page deleted" });
  } catch (error) {
    console.error("Delete page error:", error);
    res.status(500).json({ error: "Failed to delete page" });
  }
});

// Sections
router.post("/:id/sections", async (req, res) => {
  const { section_type, position, is_active = true, data } = req.body;

  if (!section_type?.trim()) {
    return res.status(400).json({ error: "section_type is required" });
  }

  try {
    const pageResult = await pool.query(`SELECT id FROM pages WHERE id = ?`, [req.params.id]);
    if (!pageResult.rows[0]) {
      return res.status(404).json({ error: "Page not found" });
    }

    let pos = position;
    if (pos === undefined || pos === null) {
      const maxPos = await pool.query(
        `SELECT COALESCE(MAX(position), 0) AS max_pos FROM page_sections WHERE page_id = ?`,
        [req.params.id]
      );
      pos = Number(maxPos.rows[0].max_pos) + 1;
    }

    const sectionData = sanitizeSectionData(section_type, data ?? defaultSectionData(section_type));
    const sectionId = crypto.randomUUID();

    await pool.query(
      `INSERT INTO page_sections (id, page_id, section_type, position, is_active, data)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [sectionId, req.params.id, section_type, pos, is_active, JSON.stringify(sectionData)]
    );

    const result = await pool.query(`SELECT * FROM page_sections WHERE id = ?`, [sectionId]);
    res.status(201).json({ section: parseSectionRow(result.rows[0]) });
  } catch (error) {
    console.error("Create section error:", error);
    res.status(500).json({ error: "Failed to create section" });
  }
});

router.put("/:id/sections/reorder", async (req, res) => {
  const { section_ids: sectionIds } = req.body;

  if (!Array.isArray(sectionIds) || sectionIds.length === 0) {
    return res.status(400).json({ error: "section_ids array is required" });
  }

  try {
    const pageResult = await pool.query(`SELECT id FROM pages WHERE id = ?`, [req.params.id]);
    if (!pageResult.rows[0]) {
      return res.status(404).json({ error: "Page not found" });
    }

    const existing = await pool.query(
      `SELECT id FROM page_sections WHERE page_id = ? ORDER BY position ASC, created_at ASC`,
      [req.params.id]
    );
    const existingIds = existing.rows.map((row) => row.id);

    if (sectionIds.length !== existingIds.length) {
      return res.status(400).json({ error: "section_ids must include every section on this page" });
    }

    const existingSet = new Set(existingIds);
    for (const id of sectionIds) {
      if (!existingSet.has(id)) {
        return res.status(400).json({ error: "Invalid section id in reorder list" });
      }
    }

    const unique = new Set(sectionIds);
    if (unique.size !== sectionIds.length) {
      return res.status(400).json({ error: "Duplicate section ids in reorder list" });
    }

    for (let index = 0; index < sectionIds.length; index += 1) {
      await pool.query(`UPDATE page_sections SET position = ? WHERE id = ? AND page_id = ?`, [
        index + 1,
        sectionIds[index],
        req.params.id,
      ]);
    }

    const sectionsResult = await pool.query(
      `SELECT id, page_id, section_type, position, is_active, data, created_at, updated_at
       FROM page_sections
       WHERE page_id = ?
       ORDER BY position ASC, created_at ASC`,
      [req.params.id]
    );

    res.json({ sections: sectionsResult.rows.map(parseSectionRow) });
  } catch (error) {
    console.error("Reorder sections error:", error);
    res.status(500).json({ error: "Failed to reorder sections" });
  }
});

router.put("/:id/sections/:sectionId", async (req, res) => {
  const { section_type, position, is_active, data } = req.body;

  try {
    const existing = await pool.query(
      `SELECT * FROM page_sections WHERE id = ? AND page_id = ?`,
      [req.params.sectionId, req.params.id]
    );
    if (!existing.rows[0]) {
      return res.status(404).json({ error: "Section not found" });
    }

    const updates = [];
    const values = [];

    if (section_type !== undefined) {
      updates.push("section_type = ?");
      values.push(section_type);
    }
    if (position !== undefined) {
      updates.push("position = ?");
      values.push(position);
    }
    if (is_active !== undefined) {
      updates.push("is_active = ?");
      values.push(is_active);
    }
    if (data !== undefined) {
      updates.push("data = ?");
      values.push(JSON.stringify(sanitizeSectionData(section_type ?? existing.rows[0].section_type, data)));
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(req.params.sectionId);
    await pool.query(`UPDATE page_sections SET ${updates.join(", ")} WHERE id = ?`, values);

    const result = await pool.query(`SELECT * FROM page_sections WHERE id = ?`, [req.params.sectionId]);
    res.json({ section: parseSectionRow(result.rows[0]) });
  } catch (error) {
    console.error("Update section error:", error);
    res.status(500).json({ error: "Failed to update section" });
  }
});

router.delete("/:id/sections/:sectionId", async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM page_sections WHERE id = ? AND page_id = ?`,
      [req.params.sectionId, req.params.id]
    );
    if (!result.meta?.affectedRows) {
      return res.status(404).json({ error: "Section not found" });
    }
    res.json({ message: "Section deleted" });
  } catch (error) {
    console.error("Delete section error:", error);
    res.status(500).json({ error: "Failed to delete section" });
  }
});

export default router;
