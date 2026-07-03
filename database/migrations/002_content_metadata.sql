ALTER TABLE pages
  ADD COLUMN excerpt TEXT NULL AFTER status,
  ADD COLUMN featured_image_id CHAR(36) NULL AFTER excerpt,
  ADD COLUMN published_at TIMESTAMP NULL AFTER featured_image_id,
  ADD COLUMN author_name VARCHAR(255) NULL AFTER published_at,
  ADD COLUMN client_name VARCHAR(255) NULL AFTER author_name,
  ADD COLUMN industry VARCHAR(255) NULL AFTER client_name,
  ADD CONSTRAINT fk_pages_featured_image FOREIGN KEY (featured_image_id) REFERENCES media(id);

CREATE INDEX idx_pages_type_status_published_at
  ON pages(page_type, status, published_at);
