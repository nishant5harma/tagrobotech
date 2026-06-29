# CMS TagRobotech

Monorepo for the TagRobotech CMS platform.

## Structure

```text
cms-tagrobotech/
├── database/        # SQL schema + seed data
├── backend/         # Express API (auth + admin)
├── admin-panel/     # Next.js admin UI (port 3001)
└── frontend/        # Public Next.js site (port 3000)
```

## Database

**MySQL 8** with four CMS tables plus admin users:

- `pages` — page metadata and hierarchy
- `page_sections` — flexible JSON content blocks
- `media` — uploaded assets
- `page_seo` — per-page SEO (1:1 with pages)
- `admin_users` — CMS login accounts

## Quick Start

### One command — run everything

From the project root:

```bash
npm install
npm run db:migrate   # first time only
npm run db:seed      # first time only
npm run dev
```

This starts **backend** (:4000), **admin panel** (:3001), and **frontend** (:3000) together.

| App | URL |
|-----|-----|
| Frontend | http://localhost:3000 |
| Admin panel | http://localhost:3001/login |
| Backend API | http://localhost:4000/api |

### API health checks

| URL | Description |
|-----|-------------|
| http://localhost:4000/api | API info |
| http://localhost:4000/api/health | Backend + DB health |
| http://localhost:3000/api/health | Same (proxied via frontend) |
| http://localhost:3001/api/health | Same (proxied via admin) |

Healthy response:

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-06-26T..."
}
```

### 1. Start MySQL

Use your **local MySQL** (phpMyAdmin / XAMPP / MAMP on port **3306**).

`backend/.env` is configured for:

```env
DATABASE_URL=mysql://root@127.0.0.1:3306/cms_tagrobotech
```

Create tables and seed:

```bash
cd backend
npm run db:migrate
npm run db:seed
```

Then refresh phpMyAdmin — you should see database **`cms_tagrobotech`**.

**Optional — Docker MySQL** (port 3307):

```bash
docker compose up -d
# DATABASE_URL=mysql://cms:cms_password@127.0.0.1:3307/cms_tagrobotech
```

### 2. Backend API

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API: `http://localhost:4000`

### 3. Admin Panel

```bash
cd admin-panel
cp .env.example .env.local
npm install
npm run dev
```

Admin UI: `http://localhost:3001`

### 4. Public Frontend

```bash
cd frontend
npm install
npm run dev
```

Site: `http://localhost:3000`

## Default Admin Login

| Field    | Value                    |
| -------- | ------------------------ |
| Email    | admin@tagrobotech.com    |
| Password | Admin@123456             |

Change this password before deploying to production.

## API Endpoints

| Method | Path                 | Auth | Description        |
| ------ | -------------------- | ---- | ------------------ |
| GET    | /api                 | No   | API info           |
| GET    | /api/health          | No   | Health check       |
| POST   | /api/auth/login      | No   | Admin login        |
| GET    | /api/auth/me         | Yes  | Current user       |
| GET    | /api/admin/stats     | Yes  | Dashboard counts   |
| GET    | /api/admin/pages     | Yes  | List all pages     |

## Manual DB setup (without Docker)

```bash
mysql -u root -p -e "CREATE DATABASE cms_tagrobotech;"
cd backend && npm run db:migrate && npm run db:seed
```
