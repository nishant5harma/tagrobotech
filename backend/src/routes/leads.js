import { Router } from "express";
import crypto from "crypto";
import pool from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { isValidLeadStatus, parseLeadRow } from "../lib/leads.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const status = String(req.query.status ?? "").trim();
  const formType = String(req.query.form_type ?? "").trim();
  const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "100"), 10) || 100, 1), 500);
  const offset = Math.max(parseInt(String(req.query.offset ?? "0"), 10) || 0, 0);

  const conditions = [];
  const params = [];

  if (status) {
    conditions.push("status = ?");
    params.push(status);
  }

  if (formType) {
    conditions.push("form_type = ?");
    params.push(formType);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    const result = await pool.query(
      `SELECT id, form_type, name, email, phone, message, source_page, source_label, status, metadata, created_at, updated_at
       FROM leads
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT ${limit} OFFSET ${offset}`,
      params
    );

    res.json({
      leads: result.rows.map(parseLeadRow),
    });
  } catch (error) {
    console.error("List leads error:", error);
    res.status(500).json({ error: "Failed to load leads" });
  }
});

router.patch("/:id", requireAuth, async (req, res) => {
  const { status } = req.body ?? {};

  if (!isValidLeadStatus(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const existing = await pool.query(`SELECT id FROM leads WHERE id = ?`, [req.params.id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Lead not found" });
    }

    await pool.query(`UPDATE leads SET status = ? WHERE id = ?`, [status, req.params.id]);

    const result = await pool.query(
      `SELECT id, form_type, name, email, phone, message, source_page, source_label, status, metadata, created_at, updated_at
       FROM leads WHERE id = ?`,
      [req.params.id]
    );

    res.json({ lead: parseLeadRow(result.rows[0]) });
  } catch (error) {
    console.error("Update lead error:", error);
    res.status(500).json({ error: "Failed to update lead" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const existing = await pool.query(`SELECT id FROM leads WHERE id = ?`, [req.params.id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Lead not found" });
    }

    await pool.query(`DELETE FROM leads WHERE id = ?`, [req.params.id]);
    res.json({ message: "Lead deleted" });
  } catch (error) {
    console.error("Delete lead error:", error);
    res.status(500).json({ error: "Failed to delete lead" });
  }
});

export default router;
