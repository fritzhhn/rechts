# Rechts map

Map for anonymously sharing and viewing experiences.

## Visual / UI work (no database)

Pins are stored in your browser (`localStorage`) only. No PHP or MySQL needed.

From the project folder:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). Click the map to add pins and try the UI.

**Fonts:** Roboto is self-hosted in `fonts/` (Apache 2.0) — see [fonts/README.md](fonts/README.md).

## Mobile testing (iOS + Android)

Chrome DevTools “phone” mode only changes **layout size**. It does **not** reproduce real mobile browsers (keyboard resize, input zoom, touch quirks). Use simulators instead.

### Both platforms at once (recommended)

```bash
chmod +x scripts/*.sh   # first time only
make mobile
# or: ./scripts/dev-mobile.sh
```

Starts **one** local server, boots **iOS Simulator** (Safari) and the **Android emulator** (Chrome), and opens the app in both. Edit in Cursor, refresh each device.

| Platform | URL in the device |
|----------|-------------------|
| iOS Simulator | `http://127.0.0.1:8000/` |
| Android emulator | `http://10.0.2.2:8000/` |

| Inspect | How |
|---------|-----|
| iOS | Mac **Safari** → **Develop** → **Simulator** |
| Android | Mac **Chrome** → `chrome://inspect` |

Or run one platform only: `make ios` · `make android`

---

## iOS Safari testing (keyboard, zoom, touch)

### Prerequisites (once)

1. Install **Xcode** from the App Store (includes **Simulator**). Command Line Tools alone are **not** enough (`simctl` is missing).
2. Open **Xcode** once → accept the license → **Settings → Platforms** → install an **iOS** simulator runtime.
3. Point the active developer tools at Xcode (required if you only had CLT before):

   ```bash
   sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
   ```

4. In **Mac Safari**: Settings → Advanced → enable **Show features for web developers** (for Web Inspector).

### Simulator workflow (recommended day-to-day)

From the project folder:

```bash
chmod +x scripts/*.sh   # first time only
./scripts/dev-ios.sh
# or: make ios
```

This starts `python3 -m http.server` on port **8000** (if not already running), boots an **iPhone simulator**, and opens `http://127.0.0.1:8000/` in **Simulator Safari**. Edit files in Cursor, then refresh the simulator — **no git push required**.

| Simulator menu | Use |
|----------------|-----|
| **I/O → Keyboard → Toggle Software Keyboard** | On-screen iOS keyboard |
| **I/O → Keyboard → Connect Hardware Keyboard** | Uncheck to force software keyboard |

**Web Inspector:** Mac Safari → **Develop** → **Simulator** → your tab (Console, Network, DOM).

Optional:

```bash
PORT=8000 SIM_DEVICE="<simulator-udid>" ./scripts/dev-ios.sh
```

List simulators: `xcrun simctl list devices available`

---

## Android Chrome testing

### Prerequisites (once)

1. Install **[Android Studio](https://developer.android.com/studio)**.
2. **Device Manager** → **Create device** → pick a phone (e.g. Pixel) → use a **Google Play** system image (includes Chrome).
3. Optional: `export ANDROID_HOME="$HOME/Library/Android/sdk"` in your shell profile.

### Emulator workflow

```bash
./scripts/dev-android.sh
# or: make android
```

Opens `http://10.0.2.2:8000/` in the emulator (that address is your Mac from inside Android).

Optional: pick a specific AVD:

```bash
ANDROID_AVD="Pixel_8_API_35" make android
```

List AVDs: `emulator -list-avds` (after Android Studio SDK is installed).

**Web Inspector:** Mac Chrome → `chrome://inspect` → **inspect** on your tab.

### Physical iPhone (most accurate)

```bash
./scripts/dev.sh              # terminal 1: server (listens on Wi‑Fi, not only localhost)
./scripts/dev-device-url.sh   # prints http://192.168.x.x:8000 for the phone
```

Stop any old server first if you changed scripts (`Ctrl+C`). The server must **not** be started with `python3 -m http.server 8000` alone on `127.0.0.1` — use `./scripts/dev.sh` so the iPhone can connect.

On the iPhone: **Settings → Apps → Safari → Advanced → Web Inspector** ON. Connect USB (or Wi‑Fi debugging in Xcode). Mac Safari → **Develop** → **[your iPhone]** → the page.

### Desktop-only

```bash
./scripts/dev.sh
```
