#!/usr/bin/env bash
# Shared helpers for deploy scripts. Source this file; do not execute directly.

backup_database() {
  local app_dir="${1:-${APP_DIR:-/home/ubuntu/tagrobotech}}"
  local env_file="${app_dir}/backend/.env"
  local backup_dir="${app_dir}/backups/db"
  local keep_count="${DB_BACKUP_KEEP:-10}"

  if [ ! -f "$env_file" ]; then
    echo "==> Skipping DB backup: ${env_file} not found"
    return 0
  fi

  # shellcheck disable=SC1090
  set -a
  # shellcheck disable=SC1091
  source "$env_file"
  set +a

  if [ -z "${DATABASE_URL:-}" ]; then
    echo "==> Skipping DB backup: DATABASE_URL missing"
    return 0
  fi

  local db_url="${DATABASE_URL#mysql://}"
  local creds="${db_url%%@*}"
  local host_db="${db_url#*@}"
  local db_user="${creds%%:*}"
  local db_pass="${creds#*:}"
  local host_port="${host_db%%/*}"
  local db_name="${host_db#*/}"
  db_name="${db_name%%\?*}"
  local db_host="${host_port%%:*}"
  local db_port="${host_port#*:}"
  if [ "$db_port" = "$host_port" ]; then
    db_port="3306"
  fi

  if [ -z "$db_name" ] || [ -z "$db_user" ]; then
    echo "==> Skipping DB backup: could not parse DATABASE_URL"
    return 0
  fi

  if ! command -v mysqldump >/dev/null 2>&1; then
    echo "==> Skipping DB backup: mysqldump not installed"
    return 0
  fi

  mkdir -p "$backup_dir"
  local stamp
  stamp="$(date +%Y%m%d-%H%M%S)"
  local outfile="${backup_dir}/${db_name}-${stamp}.sql.gz"

  echo "==> Backing up database ${db_name} -> ${outfile}"
  if MYSQL_PWD="${db_pass}" mysqldump \
    --host="${db_host}" \
    --port="${db_port}" \
    --user="${db_user}" \
    --single-transaction \
    --routines \
    --triggers \
    --events \
    --default-character-set=utf8mb4 \
    "${db_name}" | gzip -c > "${outfile}"; then
    echo "==> DB backup complete ($(du -h "${outfile}" | awk '{print $1}'))"
  else
    rm -f "${outfile}"
    echo "==> ERROR: DB backup failed; aborting deploy to protect data"
    return 1
  fi

  # Keep only the newest N backups
  local extras
  extras="$(ls -1t "${backup_dir}"/*.sql.gz 2>/dev/null | tail -n +"$((keep_count + 1))" || true)"
  if [ -n "${extras}" ]; then
    echo "==> Pruning old DB backups (keeping ${keep_count})"
    # shellcheck disable=SC2086
    rm -f ${extras}
  fi
}

cms_has_existing_pages() {
  local app_dir="${1:-${APP_DIR:-/home/ubuntu/tagrobotech}}"
  local env_file="${app_dir}/backend/.env"

  if [ ! -f "$env_file" ]; then
    return 1
  fi

  # shellcheck disable=SC1090
  set -a
  # shellcheck disable=SC1091
  source "$env_file"
  set +a

  if [ -z "${DATABASE_URL:-}" ]; then
    return 1
  fi

  local db_url="${DATABASE_URL#mysql://}"
  local creds="${db_url%%@*}"
  local host_db="${db_url#*@}"
  local db_user="${creds%%:*}"
  local db_pass="${creds#*:}"
  local host_port="${host_db%%/*}"
  local db_name="${host_db#*/}"
  db_name="${db_name%%\?*}"
  local db_host="${host_port%%:*}"
  local db_port="${host_port#*:}"
  if [ "$db_port" = "$host_port" ]; then
    db_port="3306"
  fi

  if ! command -v mysql >/dev/null 2>&1; then
    return 1
  fi

  local count
  count="$(MYSQL_PWD="${db_pass}" mysql \
    --host="${db_host}" \
    --port="${db_port}" \
    --user="${db_user}" \
    --batch \
    --skip-column-names \
    --database="${db_name}" \
    -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'pages';" 2>/dev/null || echo "0")"

  if [ "${count}" = "0" ]; then
    return 1
  fi

  local pages
  pages="$(MYSQL_PWD="${db_pass}" mysql \
    --host="${db_host}" \
    --port="${db_port}" \
    --user="${db_user}" \
    --batch \
    --skip-column-names \
    --database="${db_name}" \
    -e "SELECT COUNT(*) FROM pages;" 2>/dev/null || echo "0")"

  [ "${pages}" -gt 0 ]
}
