import pool from "../db/pool.js";

export async function getHealthStatus() {
  try {
    await pool.query("SELECT 1");
    return {
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    };
  } catch {
    return {
      status: "error",
      database: "disconnected",
      timestamp: new Date().toISOString(),
    };
  }
}
