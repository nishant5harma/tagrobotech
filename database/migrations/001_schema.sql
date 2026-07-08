-- CMS core tables (MySQL 8)
CREATE TABLE IF NOT EXISTS pages (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    page_type VARCHAR(50) DEFAULT 'page',
    status VARCHAR(20) DEFAULT 'draft',
    parent_page_id CHAR(36) NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_pages_slug (slug),
    CONSTRAINT fk_pages_parent FOREIGN KEY (parent_page_id) REFERENCES pages(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS media (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    original_name VARCHAR(255),
    file_name VARCHAR(255),
    file_url TEXT NOT NULL,
    mime_type VARCHAR(100),
    file_size BIGINT,
    width INT,
    height INT,
    alt_text TEXT,
    uploaded_by CHAR(36) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS page_sections (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    page_id CHAR(36) NOT NULL,
    section_type VARCHAR(100) NOT NULL,
    position INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_page_sections_page FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS page_seo (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    page_id CHAR(36) NOT NULL,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    canonical_url TEXT,
    robots VARCHAR(100) DEFAULT 'index,follow',
    og_title VARCHAR(255),
    og_description TEXT,
    og_image_id CHAR(36) NULL,
    schema_json JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_page_seo_page_id (page_id),
    CONSTRAINT fk_page_seo_page FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
    CONSTRAINT fk_page_seo_og_image FOREIGN KEY (og_image_id) REFERENCES media(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_admin_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_page_sections_page_id ON page_sections(page_id);
CREATE INDEX idx_page_sections_position ON page_sections(page_id, position);
CREATE INDEX idx_page_seo_page_id ON page_seo(page_id);
