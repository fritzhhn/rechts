#!/usr/bin/env bash
# Local dev server + open site in iOS Simulator Safari (real Mobile WebKit).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-8000}"

cd "$ROOT"

if ! command -v python3 >/dev/null 2>&1; then
  echo "error: python3 is required." >&2
  exit 1
fi

# shellcheck source=_dev-server.sh
source "${ROOT}/scripts/_dev-server.sh"
# shellcheck source=_dev-ios.sh
source "${ROOT}/scripts/_dev-ios.sh"

ensure_dev_server
trap cleanup_dev_server EXIT INT TERM

launch_ios_dev || true

cat <<EOF

────────────────────────────────────────
  iOS: http://127.0.0.1:${PORT}/
────────────────────────────────────────
  • Edit in Cursor, refresh Simulator Safari
  • Web Inspector: Mac Safari → Develop → Simulator → page
  • Software keyboard: Simulator → I/O → Keyboard → Toggle Software Keyboard
EOF

if [[ "${DEV_SERVER_STARTED:-0}" == 1 ]]; then
  echo "  • Ctrl+C stops the local server"
  echo ""
  wait_dev_server
fi
