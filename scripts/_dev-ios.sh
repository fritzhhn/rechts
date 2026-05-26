# iOS Simulator helpers (source from dev-ios.sh / dev-mobile.sh).

require_ios_simulator() {
  if ! command -v xcrun >/dev/null 2>&1; then
    echo "error: Xcode Command Line Tools required (xcode-select --install)." >&2
    exit 1
  fi
  if ! xcrun simctl help >/dev/null 2>&1; then
    echo "error: iOS Simulator needs full Xcode (not only Command Line Tools)." >&2
    echo "  sudo xcode-select -s /Applications/Xcode.app/Contents/Developer" >&2
    exit 1
  fi
}

pick_simulator_udid() {
  if [[ -n "${SIM_DEVICE:-}" ]]; then
    echo "$SIM_DEVICE"
    return
  fi
  xcrun simctl list devices available -j 2>/dev/null | python3 - <<'PY' || true
import json, sys
try:
    data = json.load(sys.stdin)
except Exception:
    sys.exit(1)
candidates = []
for runtime, devices in data.get("devices", {}).items():
    if "iOS" not in runtime and "iphone" not in runtime.lower():
        continue
    for d in devices:
        if not d.get("isAvailable", True):
            continue
        name = d.get("name", "")
        if "iPhone" in name:
            candidates.append((runtime, name, d["udid"]))
if not candidates:
    sys.exit(1)
candidates.sort(reverse=True)
for _, name, udid in candidates:
    if "Pro" in name or "15" in name or "16" in name or "17" in name:
        print(udid)
        sys.exit(0)
print(candidates[0][2])
PY
}

boot_ios_simulator() {
  local udid="$1"
  if xcrun simctl list devices booted 2>/dev/null | grep -q "(Booted)"; then
    echo "iOS Simulator already running."
    open -a Simulator 2>/dev/null || true
    return 0
  fi
  echo "Booting iOS Simulator (${udid}) …"
  xcrun simctl boot "$udid" 2>/dev/null || true
  open -a Simulator 2>/dev/null || true
  sleep 2
}

open_ios_simulator_url() {
  local url="$1"
  if xcrun simctl openurl booted "$url" 2>/dev/null; then
    return 0
  fi
  echo "Could not open URL in Simulator Safari. Open manually:"
  echo "  ${url}"
  return 1
}

launch_ios_dev() {
  local port="${PORT:-8000}"
  local url="http://127.0.0.1:${port}/"

  require_ios_simulator

  local udid
  udid="$(pick_simulator_udid || true)"
  if [[ -z "${udid:-}" ]]; then
    echo "warning: no iOS simulator found. Install one in Xcode → Settings → Platforms." >&2
    return 1
  fi

  boot_ios_simulator "$udid"
  open_ios_simulator_url "$url" || true
  echo "iOS: ${url}"
}
