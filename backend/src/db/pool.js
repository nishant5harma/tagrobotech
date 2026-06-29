import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: true,
});

const db = {
  async query(sql, params = []) {
    const [rows] =
      params.length > 0 ? await pool.execute(sql, params) : await pool.query(sql);

    if (Array.isArray(rows)) {
      return { rows, meta: null };
    }

    return { rows: [], meta: rows };
  },

  async end() {
    await pool.end();
  },
};

export default db;
