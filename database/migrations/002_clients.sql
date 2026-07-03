-- Client logos carousel (additive migration)

CREATE TABLE IF NOT EXISTS client_carousel_settings (
    id TINYINT PRIMARY KEY DEFAULT 1,
    heading VARCHAR(500) NOT NULL DEFAULT 'Trusted by leading enterprises — industry pioneers since day one',
    subtext VARCHAR(255) NOT NULL DEFAULT 'and more...',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO client_carousel_settings (id) VALUES (1);

CREATE TABLE IF NOT EXISTS clients (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    media_id CHAR(36) NULL,
    website_url TEXT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_clients_media FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET @idx_clients_sort_exists := (
  SELECT COUNT(*)
  FROM information_schema.statistics
  WHERE table_schema = DATABASE()
    AND table_name = 'clients'
    AND index_name = 'idx_clients_sort'
);
SET @idx_clients_sort_sql := IF(
  @idx_clients_sort_exists = 0,
  'CREATE INDEX idx_clients_sort ON clients(sort_order, created_at)',
  'SELECT 1'
);
PREPARE idx_clients_sort_stmt FROM @idx_clients_sort_sql;
EXECUTE idx_clients_sort_stmt;
DEALLOCATE PREPARE idx_clients_sort_stmt;
