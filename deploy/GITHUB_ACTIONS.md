# GitHub Actions deployment

Pushing to `main` runs `.github/workflows/deploy.yml` and updates the live EC2 server.

## One-time GitHub secrets

In your repo: **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Value |
|--------|--------|
| `EC2_HOST` | `13.234.29.101` |
| `EC2_USER` | `ubuntu` |
| `EC2_SSH_KEY` | Full contents of `tagrobotech.pem` (including `-----BEGIN` / `-----END` lines) |

## One-time server setup

The server must already have the first deploy (MySQL, nginx, systemd). If not, SSH in and run:

```bash
cd ~/tagrobotech
chmod +x deploy/install.sh
PUBLIC_HOST=13.234.29.101 ./deploy/install.sh
```

## How it works

1. You push to `main` on GitHub.
2. GitHub Actions SSHs into EC2.
3. `git pull` + `deploy/update.sh` runs:
   - `npm install` in backend, admin-panel, frontend
   - database migrations
   - production builds
   - `systemctl restart` for all app services

## Manual deploy trigger

GitHub → **Actions** → **Deploy to AWS EC2** → **Run workflow**

## Notes

- `backend/.env` on the server is **not** overwritten by the pipeline.
- First push after adding secrets will deploy automatically.
- Check the Actions tab if a deploy fails.
