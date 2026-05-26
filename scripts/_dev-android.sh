# Android emulator helpers (source from dev-android.sh / dev-mobile.sh).

ANDROID_EMULATOR_HOST="10.0.2.2"

find_android_sdk() {
  local sdk=""
  if [[ -n "${ANDROID_HOME:-}" && -d "${ANDROID_HOME}/emulator" ]]; then
    sdk="$ANDROID_HOME"
  elif [[ -n "${ANDROID_SDK_ROOT:-}" && -d "${ANDROID_SDK_ROOT}/emulator" ]]; then
    sdk="$ANDROID_SDK_ROOT"
  elif [[ -d "${HOME}/Library/Android/sdk/emulator" ]]; then
    sdk="${HOME}/Library/Android/sdk"
  fi
  if [[ -n "$sdk" ]]; then
    echo "$sdk"
    return 0
  fi
  return 1
}

android_sdk_path() {
  find_android_sdk || {
    echo "error: Android SDK not found." >&2
    echo "  Install Android Studio, then set ANDROID_HOME or use the default SDK at:" >&2
    echo "  ~/Library/Android/sdk" >&2
    exit 1
  }
}

android_bin() {
  local sdk
  sdk="$(android_sdk_path)"
  export PATH="${sdk}/emulator:${sdk}/platform-tools:${sdk}/cmdline-tools/latest/bin:${PATH}"
}

require_android_tools() {
  android_bin
  if ! command -v adb >/dev/null 2>&1; then
    echo "error: adb not found. Install Android SDK Platform-Tools in Android Studio." >&2
    exit 1
  fi
  if ! command -v emulator >/dev/null 2>&1; then
    echo "error: emulator not found. Install Android Emulator in Android Studio." >&2
    exit 1
  fi
}

pick_android_avd() {
  if [[ -n "${ANDROID_AVD:-}" ]]; then
    echo "$ANDROID_AVD"
    return
  fi
  local first
  first="$(emulator -list-avds 2>/dev/null | head -1 || true)"
  if [[ -n "$first" ]]; then
    echo "$first"
  fi
}

android_emulator_ready() {
  adb devices 2>/dev/null | grep -qE '^emulator-[0-9]+\s+device$'
}

wait_for_android_emulator() {
  local tries=0
  local max=90
  echo "Waiting for Android emulator (adb) …"
  while (( tries < max )); do
    if android_emulator_ready; then
      return 0
    fi
    adb wait-for-device >/dev/null 2>&1 || true
    sleep 2
    tries=$((tries + 1))
  done
  echo "warning: emulator did not report ready in time." >&2
  return 1
}

boot_android_emulator() {
  local avd="$1"
  if android_emulator_ready; then
    echo "Android emulator already running."
    return 0
  fi
  echo "Starting Android emulator (${avd}) …"
  emulator -avd "$avd" -no-snapshot-load >/dev/null 2>&1 &
  wait_for_android_emulator || true
}

open_android_emulator_url() {
  local url="$1"
  adb wait-for-device >/dev/null 2>&1 || true
  if adb shell am start -a android.intent.action.VIEW -d "$url" com.android.chrome >/dev/null 2>&1; then
    return 0
  fi
  if adb shell am start -a android.intent.action.VIEW -d "$url" >/dev/null 2>&1; then
    return 0
  fi
  echo "Could not open URL in Chrome. In the emulator browser, go to:"
  echo "  ${url}"
  return 1
}

launch_android_dev() {
  local port="${PORT:-8000}"
  local url="http://${ANDROID_EMULATOR_HOST}:${port}/"

  require_android_tools

  local avd
  avd="$(pick_android_avd || true)"
  if [[ -z "${avd:-}" ]]; then
    echo "warning: no Android Virtual Device (AVD). Create one in Android Studio → Device Manager." >&2
    return 1
  fi

  boot_android_emulator "$avd"
  open_android_emulator_url "$url" || true
  echo "Android: ${url}"
}
