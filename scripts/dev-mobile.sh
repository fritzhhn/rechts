#!/usr/bin/env bash
# One dev server + iOS Simulator and Android emulator side by side.
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
# shellcheck source=_dev-android.sh
source "${ROOT}/scripts/_dev-android.sh"

ensure_dev_server
trap cleanup_dev_server EXIT INT TERM

ios_ok=0
android_ok=0

if launch_ios_dev; then
  ios_ok=1
fi

echo ""

if launch_android_dev; then
  android_ok=1
fi

cat <<EOF

════════════════════════════════════════
  Mobile dev (one server, port ${PORT})
════════════════════════════════════════
  iOS:     http://127.0.0.1:${PORT}/
  Android: http://${ANDROID_EMULATOR_HOST}:${PORT}/

  • Edit in Cursor, refresh both browsers
  • iOS inspect:    Mac Safari → Develop → Simulator
  • Android inspect: Mac Chrome → chrome://inspect

EOF

if [[ "$ios_ok" != 1 ]]; then
  echo "  ⚠ iOS: install Xcode + simulator, then: make ios"
fi
if [[ "$android_ok" != 1 ]]; then
  echo "  ⚠ Android: install Android Studio + AVD, then: make android"
fi

if [[ "${DEV_SERVER_STARTED:-0}" == 1 ]]; then
  echo "  • Ctrl+C stops the local server"
  echo ""
  wait_dev_server
else
  echo "  • Server already running in another terminal"
fi
