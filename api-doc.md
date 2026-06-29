# TagRobotech CMS API

Base URL (local): `http://localhost:4000`

Frontend and admin proxies: `http://localhost:3000/api/*` and `http://localhost:3001/api/*` rewrite to the backend.

Uploaded files: `http://localhost:4000/uploads/<filename>` (also proxied as `/uploads/*` on admin).

---

## Authentication

Admin page/section/media routes require a JWT.

```http
POST /api/auth/login
Content-Type: application/json
```

**Request**
```json
{
  "email": "admin@tagrobotech.com",
  "password": "Admin@123456"
}
```

**Response `200`**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "b1000000-0000-4000-8000-000000000001",
    "email": "admin@tagrobotech.com",
    "name": "CMS Admin"
  }
}
```

Send the token on protected routes:

```http
Authorization: Bearer <token>
```

> **Frontend note:** Page/section endpoints are currently admin-protected. For the public site, fetch page data server-side (Next.js `fetch` in a Server Component or Route Handler) or add a dedicated public `GET /api/pages/:slug` endpoint later.

---

## Hero section overview

The home page hero is stored as a `page_sections` row with:

| Field | Type | Description |
|-------|------|-------------|
| `section_type` | `"hero"` | Identifies the hero block |
| `position` | `number` | Sort order on the page |
| `is_active` | `0 \| 1` | `1` = render on frontend |
| `data` | `object` | Hero content (schema below) |

### Hero `data` schema

```ts
type HeroSectionData = {
  background_type: "image" | "video";

  // Background — use one path depending on background_type
  image_id: string | null;      // media UUID when background_type = "image"
  video_url: string | null;     // direct URL (mp4/webm) when background_type = "video"
  video_id: string | null;      // optional media UUID for uploaded video

  tagline: string;              // e.g. "RFID • IoT • Asset Tracking • Automation"
  badge: string;                // e.g. "Industry pioneer"
  heading: string;              // main heading (dark text)
  heading_accent: string;       // orange accent part of heading
  description: string;

  primary_button: {
    text: string;
    link: string;               // e.g. "/contact"
  };
  secondary_button: {
    text: string;
    link: string;               // e.g. "#services"
  };

  stats: Array<{
    value: string;                // e.g. "500+"
    label: string;                // e.g. "Projects Delivered"
  }>;
};
```

### Legacy fields (still readable, prefer new shape)

Older hero rows may only have:

```json
{
  "heading": "Welcome to TagRobotech",
  "description": "...",
  "button_text": "Contact Us",
  "button_link": "/contact",
  "image_id": "a1000000-0000-4000-8000-000000000001"
}
```

Map on the frontend:

| Legacy | New field |
|--------|-----------|
| `button_text` | `primary_button.text` |
| `button_link` | `primary_button.link` |
| `image_id` (no `background_type`) | `background_type: "image"` |

---

## Get page with hero section

Load a page and all its sections (including hero).

```http
GET /api/admin/pages/:pageId
Authorization: Bearer <token>
```

**Home page ID (seed):** `c1000000-0000-4000-8000-000000000001`  
**Home slug:** `/`

### Response `200`

```json
{
  "page": {
    "id": "c1000000-0000-4000-8000-000000000001",
    "title": "Home",
    "slug": "/",
    "page_type": "page",
    "status": "published",
    "parent_page_id": null,
    "sort_order": 0,
    "created_at": "2026-06-26T10:12:35.000Z",
    "updated_at": "2026-06-26T10:12:35.000Z"
  },
  "sections": [
    {
      "id": "8d44659a-7147-11f1-aaf9-827159b12169",
      "page_id": "c1000000-0000-4000-8000-000000000001",
      "section_type": "hero",
      "position": 1,
      "is_active": 1,
      "data": {
        "background_type": "video",
        "image_id": null,
        "video_url": "https://www.tagrobotech.com/videos/hero.mp4",
        "video_id": null,
        "tagline": "RFID • IoT • Asset Tracking • Automation",
        "badge": "Industry pioneer",
        "heading": "Transform Assets Into",
        "heading_accent": "Real-Time Intelligence",
        "description": "The first to bring integrated tag, robotics & technology tracking to enterprises. We help enterprises automate inventory, asset tracking, and operations using RFID, BLE, IoT, and AI-powered technologies.",
        "primary_button": {
          "text": "Get free consultation",
          "link": "/contact"
        },
        "secondary_button": {
          "text": "Explore solutions",
          "link": "#services"
        },
        "stats": [
          { "value": "500+", "label": "Projects Delivered" },
          { "value": "99%", "label": "Tracking Accuracy" },
          { "value": "Worldwide", "label": "Support & Service" }
        ]
      },
      "created_at": "2026-06-26T10:12:35.000Z",
      "updated_at": "2026-06-26T10:57:35.000Z"
    }
  ],
  "seo": {
    "id": "...",
    "page_id": "c1000000-0000-4000-8000-000000000001",
    "meta_title": "TagRobotech | Asset Auditing Solutions",
    "meta_description": "...",
    "robots": "index,follow",
    "og_image_id": "a1000000-0000-4000-8000-000000000001"
  }
}
```

### Find the hero section in code

```ts
const hero = sections.find(
  (s) => s.section_type === "hero" && s.is_active
);

if (hero) {
  const data = hero.data; // HeroSectionData
}
```

### Errors

| Status | Body |
|--------|------|
| `401` | `{ "error": "Unauthorized" }` |
| `404` | `{ "error": "Page not found" }` |

---

## Update hero section

```http
PUT /api/admin/pages/:pageId/sections/:sectionId
Authorization: Bearer <token>
Content-Type: application/json
```

**Request body** — send only fields you want to change, or the full `data` object:

```json
{
  "is_active": true,
  "data": {
    "background_type": "video",
    "image_id": null,
    "video_url": "https://www.tagrobotech.com/videos/hero.mp4",
    "video_id": null,
    "tagline": "RFID • IoT • Asset Tracking • Automation",
    "badge": "Industry pioneer",
    "heading": "Transform Assets Into",
    "heading_accent": "Real-Time Intelligence",
    "description": "The first to bring integrated tag, robotics & technology tracking to enterprises...",
    "primary_button": {
      "text": "Get free consultation",
      "link": "/contact"
    },
    "secondary_button": {
      "text": "Explore solutions",
      "link": "#services"
    },
    "stats": [
      { "value": "500+", "label": "Projects Delivered" },
      { "value": "99%", "label": "Tracking Accuracy" },
      { "value": "Worldwide", "label": "Support & Service" }
    ]
  }
}
```

### Response `200`

```json
{
  "section": {
    "id": "8d44659a-7147-11f1-aaf9-827159b12169",
    "page_id": "c1000000-0000-4000-8000-000000000001",
    "section_type": "hero",
    "position": 1,
    "is_active": 1,
    "data": {
      "background_type": "video",
      "video_url": "https://www.tagrobotech.com/videos/hero.mp4",
      "heading": "Transform Assets Into",
      "heading_accent": "Real-Time Intelligence"
    },
    "created_at": "2026-06-26T10:12:35.000Z",
    "updated_at": "2026-06-26T11:00:00.000Z"
  }
}
```

### Create a new hero section

```http
POST /api/admin/pages/:pageId/sections
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "section_type": "hero",
  "is_active": true,
  "data": {
    "background_type": "video",
    "video_url": "https://www.tagrobotech.com/videos/hero.mp4",
    "tagline": "RFID • IoT • Asset Tracking • Automation",
    "badge": "Industry pioneer",
    "heading": "Transform Assets Into",
    "heading_accent": "Real-Time Intelligence",
    "description": "...",
    "primary_button": { "text": "Get free consultation", "link": "/contact" },
    "secondary_button": { "text": "Explore solutions", "link": "#services" },
    "stats": [
      { "value": "500+", "label": "Projects Delivered" },
      { "value": "99%", "label": "Tracking Accuracy" },
      { "value": "Worldwide", "label": "Support & Service" }
    ]
  }
}
```

If `data` is omitted, the API uses default hero content (see `backend/src/lib/sections.js`).

**Response `201`**
```json
{
  "section": { "...": "same shape as GET section" }
}
```

---

## Resolve hero background media

Hero `data` stores **media IDs**, not full URLs. Resolve them via the media API.

### List media

```http
GET /api/admin/media
Authorization: Bearer <token>
```

**Response `200`**
```json
{
  "media": [
    {
      "id": "ba0f1592-0cb8-4ccf-a38c-4d70b8e0333e",
      "original_name": "hero.webp",
      "file_name": "1782471441875-5f0c88b77ae7.jpeg",
      "file_url": "/uploads/1782471441875-5f0c88b77ae7.jpeg",
      "mime_type": "image/jpeg",
      "file_size": 28585,
      "width": null,
      "height": null,
      "alt_text": "TagRobotech hero banner",
      "created_at": "2026-06-26T10:57:21.000Z"
    }
  ]
}
```

### Upload media (admin)

```http
POST /api/admin/media/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

| Field | Type | Required |
|-------|------|----------|
| `file` | file | yes — jpg, png, gif, webp, svg, mp4, webm (max 25MB) |
| `alt_text` | string | no |

**Response `201`**
```json
{
  "media": {
    "id": "ba0f1592-0cb8-4ccf-a38c-4d70b8e0333e",
    "file_url": "/uploads/1782471441875-5f0c88b77ae7.jpeg",
    "mime_type": "image/jpeg",
    "alt_text": null
  }
}
```

Use the returned `id` as `image_id` or `video_id` in hero `data`.

### Build absolute URL for frontend

```ts
const API_BASE = process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:4000";

function resolveMediaUrl(fileUrl: string): string {
  if (fileUrl.startsWith("http")) return fileUrl;
  return `${API_BASE}${fileUrl}`;
}

// Hero background helpers
function getHeroBackground(hero: HeroSectionData, mediaById: Map<string, MediaItem>) {
  if (hero.background_type === "video") {
    if (hero.video_id) {
      const item = mediaById.get(hero.video_id);
      return { type: "video" as const, src: resolveMediaUrl(item?.file_url ?? hero.video_url ?? "") };
    }
    return { type: "video" as const, src: hero.video_url ?? "" };
  }

  if (hero.image_id) {
    const item = mediaById.get(hero.image_id);
    return {
      type: "image" as const,
      src: resolveMediaUrl(item?.file_url ?? ""),
      alt: item?.alt_text ?? "",
    };
  }

  return null;
}
```

---

## Frontend mapping → `HeroSection` component

Example mapping from API `data` to your existing `HeroSection.tsx` UI:

| UI element | API field |
|------------|-----------|
| Background video | `background_type === "video"` → `video_url` or media from `video_id` |
| Background image | `background_type === "image"` → media `file_url` from `image_id` |
| Top tagline line | `tagline` |
| Orange pill badge | `badge` |
| `<h1>` dark part | `heading` |
| `<h1>` orange span | `heading_accent` |
| Paragraph | `description` |
| Primary CTA | `primary_button.text`, `primary_button.link` |
| Secondary CTA | `secondary_button.text`, `secondary_button.link` |
| Bottom stats row | `stats[].value`, `stats[].label` |

### Example React usage (server component)

```ts
// app/page.tsx — fetch from CMS (server-side)
const res = await fetch(
  `${process.env.CMS_API_URL}/api/admin/pages/c1000000-0000-4000-8000-000000000001`,
  {
    headers: { Authorization: `Bearer ${process.env.CMS_API_TOKEN}` },
    next: { revalidate: 60 },
  }
);

const { sections } = await res.json();
const heroSection = sections.find(
  (s: { section_type: string; is_active: number }) =>
    s.section_type === "hero" && s.is_active
);

const hero = heroSection?.data;
```

```tsx
// components/CmsHeroSection.tsx
export function CmsHeroSection({ data }: { data: HeroSectionData }) {
  return (
    <section>
      {data.background_type === "video" ? (
        <video src={data.video_url!} autoPlay muted loop playsInline />
      ) : null}

      <p>{data.tagline}</p>
      <span>{data.badge}</span>

      <h1>
        {data.heading}{" "}
        <span className="text-[#f97316]">{data.heading_accent}</span>
      </h1>

      <p>{data.description}</p>

      <a href={data.primary_button.link}>{data.primary_button.text}</a>
      <a href={data.secondary_button.link}>{data.secondary_button.text}</a>

      <div>
        {data.stats.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
```

---

## Related endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/admin/pages` | List all pages |
| `POST` | `/api/admin/pages` | Create page `{ title, slug }` |
| `PUT` | `/api/admin/pages/:id` | Update page metadata |
| `DELETE` | `/api/admin/pages/:id/sections/:sectionId` | Remove a section |
| `GET` | `/api/admin/media` | List media library |
| `DELETE` | `/api/admin/media/:id` | Delete media file |

---

## Default hero `data` (new sections)

When `POST .../sections` is called with `section_type: "hero"` and no `data`:

```json
{
  "background_type": "video",
  "image_id": null,
  "video_url": "https://www.tagrobotech.com/videos/hero.mp4",
  "video_id": null,
  "tagline": "RFID • IoT • Asset Tracking • Automation",
  "badge": "Industry pioneer",
  "heading": "Transform Assets Into",
  "heading_accent": "Real-Time Intelligence",
  "description": "The first to bring integrated tag, robotics & technology tracking to enterprises. We help enterprises automate inventory, asset tracking, and operations using RFID, BLE, IoT, and AI-powered technologies.",
  "primary_button": { "text": "Get free consultation", "link": "/contact" },
  "secondary_button": { "text": "Explore solutions", "link": "#services" },
  "stats": [
    { "value": "500+", "label": "Projects Delivered" },
    { "value": "99%", "label": "Tracking Accuracy" },
    { "value": "Worldwide", "label": "Support & Service" }
  ]
}
```
