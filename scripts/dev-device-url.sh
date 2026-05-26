#!/usr/bin/env bash
# Print a URL your physical iPhone can use (same Wi‑Fi as this Mac).
set -euo pipefail

PORT="${PORT:-8000}"

lan_ip() {
  python3 - <<'PY'
import socket
try:
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    print(s.getsockname()[0])
    s.close()
except Exception:
    raise SystemExit(1)
PY
}

ip="$(lan_ip 2>/dev/null || ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || true)"

if [[ -z "$ip" ]]; then
  echo "Could not detect LAN IP. Use Settings → Wi‑Fi → your network → IP on the Mac." >&2
  exit 1
fi

listen="$(lsof -nP -iTCP:"$PORT" -sTCP:LISTEN 2>/dev/null | head -1 || true)"
if [[ -z "$listen" ]]; then
  echo "No server on port ${PORT} yet."
  echo "Start one in another terminal:"
  echo "  cd $(cd "$(dirname "$0")/.." && pwd) && ./scripts/dev.sh"
  echo ""
elif echo "$listen" | grep -q "127.0.0.1:${PORT}"; then
  echo "Server is only listening on 127.0.0.1 (iPhone cannot connect)."
  echo "Stop it (Ctrl+C) and start again:"
  echo "  ./scripts/dev.sh"
  echo ""
fi

echo "http://${ip}:${PORT}/"
echo ""
echo "iPhone: open that URL in Safari (same Wi‑Fi as this Mac)."
echo "If it fails: System Settings → Network → Firewall → allow incoming for Python, or turn firewall off briefly."
