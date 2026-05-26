# Shared dev HTTP server (source from dev-*.sh, do not run directly).
# After ensure_dev_server: DEV_SERVER_PID, DEV_SERVER_STARTED (0|1).

ensure_dev_server() {
  PORT="${PORT:-8000}"
  DEV_SERVER_PID=""
  DEV_SERVER_STARTED=0

  if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "Using existing server on port ${PORT}."
    return 0
  fi

  echo "Starting python3 -m http.server ${PORT} on 127.0.0.1 …"
  python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &
  DEV_SERVER_PID=$!
  DEV_SERVER_STARTED=1
  sleep 0.3

  if ! lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "error: could not start server on port ${PORT}." >&2
    exit 1
  fi
}

cleanup_dev_server() {
  if [[ "${DEV_SERVER_STARTED:-0}" == 1 ]] && [[ -n "${DEV_SERVER_PID:-}" ]]; then
    kill "$DEV_SERVER_PID" 2>/dev/null || true
    wait "$DEV_SERVER_PID" 2>/dev/null || true
  fi
}

wait_dev_server() {
  if [[ "${DEV_SERVER_STARTED:-0}" == 1 ]] && [[ -n "${DEV_SERVER_PID:-}" ]]; then
    wait "$DEV_SERVER_PID" 2>/dev/null || true
  fi
}
