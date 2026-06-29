import crypto from "crypto";
import fs from "fs";
import path from "path";
import multer from "multer";

const uploadDir = path.resolve(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
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
