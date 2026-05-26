#!/usr/bin/env bash
# Local dev server (Mac browser + iPhone on same Wi‑Fi).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-8000}"
# 0.0.0.0 = reachable from iPhone on LAN; 127.0.0.1 = this Mac only
BIND="${BIND:-0.0.0.0}"

cd "$ROOT"

if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port ${PORT} already in use."
  echo "Stop the old server (Ctrl+C in that terminal), then run this again."
  echo ""
  lsof -nP -iTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true
  exit 1
fi

lan_ip() {
  python3 - <<'PY' 2>/dev/null || true
import socket
try:
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    print(s.getsockname()[0])
    s.close()
except Exception:
    pass
PY
}

IP="$(lan_ip)"
echo "Serving ${ROOT}"
echo "  Mac:     http://127.0.0.1:${PORT}/"
if [[ -n "$IP" ]]; then
  echo "  iPhone:  http://${IP}:${PORT}/  (same Wi‑Fi)"
fi
echo ""
echo "Ctrl+C to stop"
exec python3 -m http.server "$PORT" --bind "$BIND"
