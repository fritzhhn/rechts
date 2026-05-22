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
