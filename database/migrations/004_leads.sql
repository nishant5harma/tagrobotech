CREATE TABLE IF NOT EXISTS leads (
    id CHAR(36) PRIMARY KEY,
    form_type VARCHAR(50) NOT NULL DEFAULT 'contact',
    name VARCHAR(255) NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NULL,
    message TEXT NULL,
    source_page VARCHAR(255) NULL,
    source_label VARCHAR(255) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'new',
    metadata JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_leads_status (status),
    INDEX idx_leads_created_at (created_at),
    INDEX idx_leads_form_type (form_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
