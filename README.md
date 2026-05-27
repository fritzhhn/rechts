# FASCHO NOT FOUND

Leipzig map for documenting and viewing far-right stickers, posters, and related propaganda in public space. Pins are stored in the browser (`localStorage`) for local development — no database required.

From the project folder:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). Click the map to add pins and try the UI.

**Fonts:** Roboto is self-hosted in `fonts/` (Apache 2.0) — see [fonts/README.md](fonts/README.md).

**Images on the map:** UI icons live in `icons/` (SVG). Pin popup photos are **not** stored in the repo — demo pins use Wikimedia Commons URLs defined in `app.js` (`ARCHIVE_IMAGE_URLS`), and new notes save photos as data URLs in `localStorage`.

## Mobile testing

Chrome DevTools “phone” mode only changes **layout size**. It does **not** reproduce real mobile browsers (keyboard resize, input zoom, touch quirks). Use a simulator or a physical device.

1. Start the local server (see above).
2. Open the simulator yourself (Xcode → Simulator, or Android Studio → emulator).
3. In the device browser, open:

| Platform | URL |
|----------|-----|
| iOS Simulator (Safari) | `http://127.0.0.1:8000/` |
| Android emulator (Chrome) | `http://10.0.2.2:8000/` (`10.0.2.2` is your Mac from inside the emulator) |

Edit files on the Mac, then refresh the page in the simulator.

| Inspect | How |
|---------|-----|
| iOS | Mac **Safari** → **Develop** → **Simulator** → your tab |
| Android | Mac **Chrome** → `chrome://inspect` |

### Physical phone (same Wi‑Fi as your Mac)

Listen on all interfaces so the phone can reach your Mac:

```bash
python3 -m http.server 8000 --bind 0.0.0.0
```

On the phone, open `http://<your-mac-lan-ip>:8000/` (find the IP in **System Settings → Network**). The phone needs internet access for the map library and tiles, not only Wi‑Fi to your Mac.

**Web Inspector (iPhone):** **Settings → Apps → Safari → Advanced → Web Inspector** ON, then Mac Safari → **Develop** → your device.
