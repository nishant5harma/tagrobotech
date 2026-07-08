import crypto from "crypto";
import fs from "fs";
import path from "path";
import multer from "multer";

const uploadDir = path.resolve(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

function slugifyFileBaseName(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "file";
}

function buildStoredFileName(originalName, preferredName) {
  const sourceName = preferredName?.trim() || originalName;
  const parsed = path.parse(sourceName);
  const originalExt = path.extname(originalName).toLowerCase();
  const preferredExt = parsed.ext.toLowerCase();
  const ext = preferredExt || originalExt;
  const base = slugifyFileBaseName(parsed.name || path.parse(originalName).name);
  return `${base}-${crypto.randomBytes(4).toString("hex")}${ext}`;
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const name = buildStoredFileName(file.originalname, req.body?.file_name);
    cb(null, name);
  },
});

const allowedPattern = /\.(jpe?g|png|gif|webp|svg|mp4|webm)$/i;

export const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (allowedPattern.test(file.originalname)) {
      cb(null, true);
      return;
    }
    cb(new Error("Only images (jpg, png, gif, webp, svg) and videos (mp4, webm) are allowed"));
  },
});

export const UPLOAD_DIR = uploadDir;
export { buildStoredFileName, slugifyFileBaseName };
