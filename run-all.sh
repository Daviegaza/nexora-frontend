#!/usr/bin/env bash
# NEXORA AI — one-shot orchestrator: db + backend + frontend
# Usage: ./run-all.sh
set -euo pipefail

FRONTEND="/home/davie/WebstormProjects/nexora-frontend"
BACKEND="/home/davie/WebstormProjects/nexora-backend"

color() { printf "\033[1;%sm%s\033[0m\n" "$1" "$2"; }
log()   { color 36 "→ $*"; }
ok()    { color 32 "✓ $*"; }
warn()  { color 33 "! $*"; }

# ── 1. Backend env ────────────────────────────────────────────────────────
log "Backend env setup"
cd "$BACKEND"
if [ ! -f .env ]; then
  cp .env.example .env
  # generate strong JWT secrets
  ACCESS=$(openssl rand -hex 48)
  REFRESH=$(openssl rand -hex 48)
  sed -i "s|^JWT_ACCESS_SECRET=.*|JWT_ACCESS_SECRET=${ACCESS}|" .env
  sed -i "s|^JWT_REFRESH_SECRET=.*|JWT_REFRESH_SECRET=${REFRESH}|" .env
  ok "Generated .env with random JWT secrets"
else
  ok "Reusing existing .env"
fi

# ── 2. Postgres + Redis via docker ────────────────────────────────────────
log "Starting Postgres + Redis"
docker compose -f docker/docker-compose.yml up -d
until docker compose -f docker/docker-compose.yml exec -T postgres pg_isready -U nexora >/dev/null 2>&1; do
  sleep 1
done
ok "Postgres ready on :5432"

# ── 3. Backend deps + Prisma + seed ───────────────────────────────────────
if [ ! -d node_modules ]; then
  log "Installing backend deps"
  npm install --legacy-peer-deps --no-audit --no-fund
fi
log "Prisma generate + migrate + seed"
npx prisma generate
npx prisma migrate deploy 2>/dev/null || npx prisma migrate dev --name init --skip-seed
npm run seed || warn "Seed already applied"

# ── 4. Boot backend in background ─────────────────────────────────────────
log "Starting backend on :4000"
nohup npm run dev > /tmp/nexora-backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > /tmp/nexora-backend.pid
until curl -fsS http://localhost:4000/health >/dev/null 2>&1; do sleep 0.5; done
ok "Backend live → http://localhost:4000  ·  Swagger UI → http://localhost:4000/docs"

# ── 5. Frontend ───────────────────────────────────────────────────────────
cd "$FRONTEND"
if [ ! -d node_modules ]; then
  log "Installing frontend deps"
  npm install --legacy-peer-deps --no-audit --no-fund
fi
log "Starting frontend on :5173"
nohup npm run dev > /tmp/nexora-frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > /tmp/nexora-frontend.pid

ok "Frontend → http://localhost:5173"
echo ""
color 35 "═══════════════════════════════════════════════════════════════════"
color 35 "  NEXORA AI is running."
color 35 "  Frontend:  http://localhost:5173"
color 35 "  Backend:   http://localhost:4000   (docs: /docs)"
color 35 "  Database:  postgresql://nexora:nexora@localhost:5432/nexora"
color 35 ""
color 35 "  Login:     owner@nexora.co.ke  /  demo1234"
color 35 ""
color 35 "  Stop:      ./stop-all.sh   (or kill PIDs in /tmp/nexora-*.pid)"
color 35 "  Logs:      tail -f /tmp/nexora-backend.log /tmp/nexora-frontend.log"
color 35 "═══════════════════════════════════════════════════════════════════"
