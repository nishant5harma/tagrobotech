import { Router } from "express";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import pool from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { upload, UPLOAD_DIR } from "../lib/upload.js";

const router = Router();

router.use(requireAuth);

function removeUploadedFile(fileUrl) {
  if (!fileUrl?.startsWith("/uploads/")) return;
  const filePath = path.join(UPLOAD_DIR, path.basename(fileUrl));
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

function withFileStatus(row) {
  if (!row) return row;
  if (!row.file_url?.startsWith("/uploads/")) {
    return { ...row, file_exists: true };
  }
  const filePath = path.join(UPLOAD_DIR, path.basename(row.file_url));
  return { ...row, file_exists: fs.existsSync(filePath) };
}

async function clearMediaReferences(mediaId) {
  await pool.query(`UPDATE page_seo SET og_image_id = NULL WHERE og_image_id = ?`, [mediaId]);
  await pool.query(`UPDATE clients SET media_id = NULL WHERE media_id = ?`, [mediaId]);

  const sections = await pool.query(
    `SELECT id, data FROM page_sections
     WHERE data LIKE ? OR data LIKE ? OR data LIKE ? OR data LIKE ? OR data LIKE ?`,
    [
      `%"image_id":"${mediaId}"%`,
      `%"image_id": "${mediaId}"%`,
      `%"video_id":"${mediaId}"%`,
      `%"media_id":"${mediaId}"%`,
      `%"media_id": "${mediaId}"%`,
    ]
  );

  for (const section of sections.rows) {
    let data = section.data;
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch {
        continue;
      }
    }

    let changed = false;
    if (data?.image_id === mediaId) {
      data.image_id = null;
      changed = true;
    }
    if (data?.video_id === mediaId) {
      data.video_id = null;
      changed = true;
    }
    if (data?.background_media_id === mediaId) {
      data.background_media_id = null;
      changed = true;
    }
    if (data?.dashboard_media_id === mediaId) {
      data.dashboard_media_id = null;
      changed = true;
    }

    if (Array.isArray(data?.items)) {
      data.items = data.items.map((item) => {
        if (item?.media_id === mediaId) {
          changed = true;
          return { ...item, media_id: null };
        }
        return item;
      });
    }

    if (changed) {
      await pool.query(`UPDATE page_sections SET data = ? WHERE id = ?`, [
        JSON.stringify(data),
        section.id,
      ]);
    }
  }
}

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, original_name, file_name, file_url, mime_type, file_size, width, height, alt_text, created_at
       FROM media
       ORDER BY created_at DESC`
    );
    res.json({ media: result.rows.map(withFileStatus) });
  } catch (error) {
    console.error("Media list error:", error);
    res.status(500).json({ error: "Failed to load media" });
  }
});

router.post("/upload", (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || "Upload failed" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const mediaId = crypto.randomUUID();
    const file_url = `/uploads/${req.file.filename}`;
    const alt_text = req.body.alt_text?.trim() || null;

    try {
      await pool.query(
        `INSERT INTO media (id, original_name, file_name, file_url, mime_type, file_size, alt_text, uploaded_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          mediaId,
          req.file.originalname,
          req.file.filename,
          file_url,
          req.file.mimetype,
          req.file.size,
          alt_text,
          req.user?.id || null,
        ]
      );

      const result = await pool.query(`SELECT * FROM media WHERE id = ?`, [mediaId]);
      res.status(201).json({ media: withFileStatus(result.rows[0]) });
    } catch (error) {
      removeUploadedFile(file_url);
      console.error("Upload media error:", error);
      res.status(500).json({ error: "Failed to save media" });
    }
  });
});

router.post("/", async (req, res) => {
  const { original_name, file_name, file_url, mime_type, file_size, width, height, alt_text } =
    req.body;

  if (!file_url?.trim()) {
    return res.status(400).json({ error: "file_url is required" });
  }

  const mediaId = crypto.randomUUID();
  const name = file_name?.trim() || original_name?.trim() || "untitled";

  try {
    await pool.query(
      `INSERT INTO media (id, original_name, file_name, file_url, mime_type, file_size, width, height, alt_text, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        mediaId,
        original_name?.trim() || name,
        name,
        file_url.trim(),
        mime_type || null,
        file_size || null,
        width || null,
        height || null,
        alt_text?.trim() || null,
        req.user?.id || null,
      ]
    );

    const result = await pool.query(`SELECT * FROM media WHERE id = ?`, [mediaId]);
    res.status(201).json({ media: withFileStatus(result.rows[0]) });
  } catch (error) {
    console.error("Create media error:", error);
    res.status(500).json({ error: "Failed to create media" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const existing = await pool.query(`SELECT file_url FROM media WHERE id = ?`, [req.params.id]);
    if (!existing.rows[0]) {
      return res.status(404).json({ error: "Media not found" });
    }

    const fileUrl = existing.rows[0].file_url;

    await clearMediaReferences(req.params.id);

    const result = await pool.query(`DELETE FROM media WHERE id = ?`, [req.params.id]);
    if (!result.meta?.affectedRows) {
      return res.status(404).json({ error: "Media not found" });
    }

    if (fileUrl) {
      removeUploadedFile(fileUrl);
    }

    res.json({ message: "Media deleted" });
  } catch (error) {
    console.error("Delete media error:", error);
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        error: "This file is still in use on a page. Remove it from SEO or sections first.",
      });
    }
    res.status(500).json({ error: "Failed to delete media" });
  }
});

export default router;
