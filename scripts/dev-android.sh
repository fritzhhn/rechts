#!/usr/bin/env bash
# Local dev server + open site in Android emulator Chrome.
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
# shellcheck source=_dev-android.sh
source "${ROOT}/scripts/_dev-android.sh"

ensure_dev_server
trap cleanup_dev_server EXIT INT TERM

launch_android_dev || true

cat <<EOF

────────────────────────────────────────
  Android: http://${ANDROID_EMULATOR_HOST}:${PORT}/
────────────────────────────────────────
  • Edit in Cursor, refresh Chrome in the emulator
  • Web Inspector: Mac Chrome → chrome://inspect → your tab
  • On-screen keyboard: emulator ⋯ → Settings, or toggle keyboard icon
  • Use 10.0.2.2 (not 127.0.0.1) — that is your Mac from the emulator
EOF

if [[ "${DEV_SERVER_STARTED:-0}" == 1 ]]; then
  echo "  • Ctrl+C stops the local server"
  echo ""
  wait_dev_server
fi
