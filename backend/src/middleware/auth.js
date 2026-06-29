import pool from "../db/pool.js";
import { verifyToken } from "../lib/jwt.js";

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const token = header.slice(7);

  try {
    const decoded = verifyToken(token);
    const result = await pool.query(
      `SELECT id, email, name, is_active
       FROM admin_users
       WHERE id = ?`,
      [decoded.sub]
    );

    const user = result.rows[0];

    if (!user || !user.is_active) {
      return res.status(401).json({ error: "Invalid or inactive account" });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
