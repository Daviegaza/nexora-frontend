#!/usr/bin/env bash
set -e
for p in /tmp/nexora-backend.pid /tmp/nexora-frontend.pid; do
  if [ -f "$p" ]; then
    pid=$(cat "$p")
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" && echo "killed $(basename $p .pid) ($pid)"
    fi
    rm -f "$p"
  fi
done
cd /home/davie/WebstormProjects/nexora-backend && docker compose -f docker/docker-compose.yml down
