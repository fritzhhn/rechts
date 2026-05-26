/* global maplibregl */

const STORAGE_KEY = "rechts-notes:v1";
const LANG_STORAGE_KEY = "rechts-lang";

const MARKER_PIN_COLOR = "#9bd545";

/**
 * Documentary photos (Wikimedia Commons) for demo pins — far-right stickers/posters, critical context.
 * @see https://commons.wikimedia.org
 */
/** Wikimedia thumbs verified to load (others 404/429). */
const ARCHIVE_IMAGE_URLS = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Wahlplakat_2013_AfD_01.JPG/500px-Wahlplakat_2013_AfD_01.JPG",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Bundestagswahlkampf_Plakat_AfD_Aachen_6205.jpg/330px-Bundestagswahlkampf_Plakat_AfD_Aachen_6205.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/AfD_Adbusting-Wenn_AfD_die_Antwort_sein_soll%2C_wie_dumm_war_dann_bitte_die_Frage.jpg/500px-AfD_Adbusting-Wenn_AfD_die_Antwort_sein_soll%2C_wie_dumm_war_dann_bitte_die_Frage.jpg",
];

const LOCAL_DEMO_IMAGE_URL = "img/test.png";

/** @type {{ id: string, de: string, en: string }[]} */
const NOTE_CATEGORIES = [
  { id: "sticker", de: "Sticker & Aufkleber", en: "Stickers & decals" },
  { id: "poster", de: "Plakate & Banner", en: "Posters & banners" },
  { id: "graffiti", de: "Graffiti & Tags", en: "Graffiti & tags" },
  { id: "stencil", de: "Stencils", en: "Stencils" },
  { id: "advertising", de: "Werbung", en: "Advertising" },
];

const DEFAULT_NOTE_CATEGORY = NOTE_CATEGORIES[0].id;

/** @type {{ id: string, de: string, en: string }[]} */
const NOTE_TAGS = [
  { id: "afd", de: "AfD", en: "AfD" },
  { id: "nazi-symbol", de: "NS-Symbolik", en: "Nazi symbols" },
  { id: "identitarian", de: "Identitär", en: "Identitarian" },
  { id: "reichsflagge", de: "Reichsflagge", en: "Reich flag" },
  { id: "antisemitic", de: "Antisemitisch", en: "Antisemitic" },
  { id: "xenophobic", de: "Rassismus", en: "Racism" },
  { id: "homophobic", de: "Queerfeindlich", en: "Anti-LGBTQ+" },
  { id: "conspiracy", de: "Verschwörung", en: "Conspiracy" },
];

/** @type {string|null} null = show all */
let archiveCategoryFilter = null;

/** @type {Set<string>} */
const archiveTagFilters = new Set();

const SEED_NOTES = [
  { note: "Augustusplatz", lng: 12.3795, lat: 51.3382 },
  { note: "Clara-Zetkin-Park", lng: 12.3558, lat: 51.3336 },
  { note: "Hauptbahnhof", lng: 12.3812, lat: 51.3455 },
  { note: "Südvorstadt", lng: 12.3689, lat: 51.3188 },
  { note: "Plagwitz", lng: 12.3214, lat: 51.3481 },
  { note: "Connewitz", lng: 12.3867, lat: 51.3112 },
  { note: "Gohlis", lng: 12.3654, lat: 51.3521 },
  { note: "Lindenau", lng: 12.3341, lat: 51.3412 },
  { note: "Reudnitz", lng: 12.4023, lat: 51.3289 },
  { note: "Schleußig", lng: 12.3428, lat: 51.3245 },
  { note: "Möckern", lng: 12.3571, lat: 51.3568 },
  { note: "Paunsdorf", lng: 12.4362, lat: 51.3456 },
  { note: "Waldstraßenviertel", lng: 12.3718, lat: 51.3442 },
  { note: "Zentrum-Ost", lng: 12.3912, lat: 51.3368 },
  { note: "Grünau", lng: 12.2918, lat: 51.3234 },
];

const SEED_PLACE_NAMES = new Set(SEED_NOTES.map((s) => s.note));

const EXTRA_SEEDS_STORAGE_KEY = "rechts-extra-seeds:v1";
const RANDOM_SEED_STORAGE_KEY = "rechts-random-seeds-25:v1";

/** 25 extra demo pins around Leipzig (one-time migration). */
const RANDOM_SEED_NOTES = [
  { note: "Engelsdorf", lng: 12.4342, lat: 51.3267 },
  { note: "Miltitz", lng: 12.2521, lat: 51.3412 },
  { note: "Böhlitz-Ehrenberg", lng: 12.2841, lat: 51.3589 },
  { note: "Mockau-Nord", lng: 12.4123, lat: 51.3789 },
  { note: "Mockau-Süd", lng: 12.4056, lat: 51.3712 },
  { note: "Thekla", lng: 12.4289, lat: 51.3723 },
  { note: "Seehausen", lng: 12.3891, lat: 51.3812 },
  { note: "Eutritzsch", lng: 12.3912, lat: 51.3654 },
  { note: "Stötteritz", lng: 12.4123, lat: 51.3123 },
  { note: "Probsteheida", lng: 12.4234, lat: 51.2989 },
  { note: "Meusdorf", lng: 12.4456, lat: 51.2912 },
  { note: "Liebertwolkwitz", lng: 12.4678, lat: 51.2789 },
  { note: "Baalsdorf", lng: 12.4512, lat: 51.3012 },
  { note: "Holzhausen", lng: 12.4567, lat: 51.3234 },
  { note: "Dölitz", lng: 12.3789, lat: 51.3012 },
  { note: "Kleinzschocher", lng: 12.3234, lat: 51.3012 },
  { note: "Großzschocher", lng: 12.3123, lat: 51.2989 },
  { note: "Knautkleeberg", lng: 12.3012, lat: 51.3123 },
  { note: "Burghausen", lng: 12.2678, lat: 51.3234 },
  { note: "Rückmarsdorf", lng: 12.2567, lat: 51.3312 },
  { note: "Lützschena", lng: 12.2789, lat: 51.3789 },
  { note: "Lößen", lng: 12.3234, lat: 51.3678 },
  { note: "Hartmannsdorf", lng: 12.4123, lat: 51.3567 },
  { note: "Knautnaundorf", lng: 12.2891, lat: 51.2789 },
  { note: "Markkleeberg-Ost", lng: 12.2789, lat: 51.2612 },
];

/** Menu section nav labels (match h2 headlines in menu content). */
const MENU_NAV_SECTIONS = {
  de: [
    { sectionId: "about", label: "About" },
    { sectionId: "code-of-conduct", label: "Code of Conduct" },
    { sectionId: "imprint", label: "Impressum" },
    { sectionId: "privacy-policy", label: "Privacy Policy / Datenschutzerklärung" },
    { sectionId: "terms-of-use", label: "Terms of Use / Nutzungsbedingungen" },
  ],
  en: [
    { sectionId: "about-en", label: "About" },
    { sectionId: "code-of-conduct-en", label: "Code of Conduct" },
    { sectionId: "imprint-en", label: "Imprint" },
    { sectionId: "privacy-policy-en", label: "Privacy Policy" },
    { sectionId: "terms-of-use-en", label: "Terms of Use" },
  ],
};

/** @type {string|null} */
let menuActiveSectionId = null;

/** "de" | "en" */
let currentLang = "de";

const $ = (id) => document.getElementById(id);
/** @type {HTMLButtonElement|null} */
let hamburgerBtn = null;
/** @type {HTMLElement|null} */
let menuOverlay = null;
/** @type {HTMLButtonElement|null} */
let archiveBtn = null;
/** @type {HTMLElement|null} */
let archiveOverlay = null;
/** @type {string|null} */
let selectedArchiveNoteId = null;

/** Called after adding markers so pin colors stay in sync */
let updateMarkerPinColorsFn = null;

/** @type {{id:string, note:string, lng:number, lat:number, createdAt:number, imageUrl?:string}[]} */
let notes = [];
/** @type {maplibregl.Map} */
let map;

const LEIPZIG_MASK_SOURCE_ID = "leipzig-outside-mask";
const LEIPZIG_MASK_LAYER_ID = "leipzig-outside-mask";
let leipzigMaskGeoJson = null;
/** @type {number[][]|null} Leipzig city ring [lng, lat][] for hit-testing */
let leipzigCityRing = null;

/** Padding around Leipzig for pan limits (degrees); larger = can move further from the city. */
const LEIPZIG_VIEW_PADDING = { lng: 0.45, lat: 0.4 };

/** Screen inset when fitting Leipzig for max zoom-out (full city + a little margin). */
const LEIPZIG_FIT_PADDING_PX = 56;

const LEIPZIG_VIEW_BOUNDS_FALLBACK = /** @type {[[number, number], [number, number]]} */ ([
  [11.6, 50.75],
  [13.1, 51.9],
]);

const LEIPZIG_CITY_BOUNDS_FALLBACK = /** @type {[[number, number], [number, number]]} */ ([
  [12.22, 51.17],
  [12.58, 51.46],
]);

/** List-only archive + slide-in detail on narrow or short viewports. */
const ARCHIVE_COMPACT_MQ = "(max-width: 600px), (max-height: 520px)";

function getLeipzigViewBounds() {
  const ring = leipzigCityRing;
  if (!ring?.length) return LEIPZIG_VIEW_BOUNDS_FALLBACK;
  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  for (const [lng, lat] of ring) {
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }
  return /** @type {[[number, number], [number, number]]} */ ([
    [minLng - LEIPZIG_VIEW_PADDING.lng, minLat - LEIPZIG_VIEW_PADDING.lat],
    [maxLng + LEIPZIG_VIEW_PADDING.lng, maxLat + LEIPZIG_VIEW_PADDING.lat],
  ]);
}

function getLeipzigViewCenter(bounds = getLeipzigViewBounds()) {
  return [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2];
}

/** Tight bbox of Leipzig city (no pan padding) — used for max zoom-out. */
function getLeipzigCityBounds() {
  const ring = leipzigCityRing;
  if (!ring?.length) return LEIPZIG_CITY_BOUNDS_FALLBACK;
  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  for (const [lng, lat] of ring) {
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }
  return /** @type {[[number, number], [number, number]]} */ ([
    [minLng, minLat],
    [maxLng, maxLat],
  ]);
}

/**
 * Set minZoom so the widest zoom-out shows all of Leipzig (+ padding) for this viewport.
 * Pan limits (maxBounds) stay wide; only zoom is capped.
 */
function syncMinZoomToFitLeipzig() {
  if (!map || typeof map.fitBounds !== "function") return;
  const bounds = getLeipzigCityBounds();
  const center = map.getCenter();
  const zoom = map.getZoom();
  const bearing = map.getBearing();
  map.fitBounds(bounds, {
    padding: LEIPZIG_FIT_PADDING_PX,
    duration: 0,
    maxZoom: typeof map.getMaxZoom === "function" ? map.getMaxZoom() : 18,
  });
  const minZoom = map.getZoom();
  map.jumpTo({ center, zoom, bearing, duration: 0 });
  map.setMinZoom(minZoom);
  // Do not force zoom-in here (e.g. iOS keyboard shrink would trap the map zoomed in).
  if (!isAddNoteFormOpen() && zoom < minZoom) map.setZoom(minZoom);
}

function isAddNoteFormOpen() {
  return addNotePopup != null || isAddNoteMobileSheetOpen();
}

function lockMapLayoutForAddNote() {
  document.documentElement.style.setProperty("--locked-vh", `${window.innerHeight}px`);
  document.body.classList.add("add-note-lock-layout");
}

function unlockMapLayoutForAddNote() {
  document.body.classList.remove("add-note-lock-layout");
  document.documentElement.style.removeProperty("--locked-vh");
}

function resetPageScrollAfterKeyboard() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

/** Outside-city mask: muted grey-pink from title rgb(250, 52, 147), low opacity. */
function getLeipzigMaskFillColor() {
  return "rgba(196, 168, 178, 0.42)";
}

function buildOutsideLeipzigMaskGeoJson(ring) {
  const viewBounds = getLeipzigViewBounds();
  const [[minLng, minLat], [maxLng, maxLat]] = viewBounds;
  const outerMargin = { lng: 0.4, lat: 0.35 };
  const outer = [
    [minLng - outerMargin.lng, minLat - outerMargin.lat],
    [maxLng + outerMargin.lng, minLat - outerMargin.lat],
    [maxLng + outerMargin.lng, maxLat + outerMargin.lat],
    [minLng - outerMargin.lng, maxLat + outerMargin.lat],
    [minLng - outerMargin.lng, minLat - outerMargin.lat],
  ];
  const hole = [...ring].reverse();
  return {
    type: "Feature",
    properties: { name: "outside-leipzig" },
    geometry: { type: "Polygon", coordinates: [outer, hole] },
  };
}

function removeLeipzigOutsideMask() {
  if (!map?.getStyle) return;
  try {
    if (map.getLayer(LEIPZIG_MASK_LAYER_ID)) map.removeLayer(LEIPZIG_MASK_LAYER_ID);
    if (map.getSource(LEIPZIG_MASK_SOURCE_ID)) map.removeSource(LEIPZIG_MASK_SOURCE_ID);
  } catch (_) {}
}

async function loadLeipzigCityRing() {
  if (leipzigCityRing) return leipzigCityRing;
  const res = await fetch("./data/leipzig-city-boundary.geojson");
  if (!res.ok) throw new Error(`Leipzig boundary GeoJSON ${res.status}`);
  const feature = await res.json();
  leipzigCityRing = feature.geometry.coordinates[0];
  return leipzigCityRing;
}

/** Ray-casting point-in-polygon for Leipzig city boundary. */
function isInsideLeipzig(lngLat) {
  const ring = leipzigCityRing;
  if (!ring || ring.length < 3) return true;
  const x = lngLat.lng;
  const y = lngLat.lat;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

async function loadLeipzigMaskGeoJson() {
  if (leipzigMaskGeoJson) return leipzigMaskGeoJson;
  await loadLeipzigCityRing();
  leipzigMaskGeoJson = buildOutsideLeipzigMaskGeoJson(leipzigCityRing);
  return leipzigMaskGeoJson;
}

async function ensureLeipzigBoundaryData() {
  await loadLeipzigCityRing();
  if (!leipzigMaskGeoJson) {
    leipzigMaskGeoJson = buildOutsideLeipzigMaskGeoJson(leipzigCityRing);
  }
}

async function applyLeipzigOutsideMask() {
  if (!map?.getStyle?.()) return;
  try {
    await ensureLeipzigBoundaryData();
    const data = leipzigMaskGeoJson;
    removeLeipzigOutsideMask();
    map.addSource(LEIPZIG_MASK_SOURCE_ID, { type: "geojson", data });
    map.addLayer({
      id: LEIPZIG_MASK_LAYER_ID,
      type: "fill",
      source: LEIPZIG_MASK_SOURCE_ID,
      paint: {
        "fill-color": getLeipzigMaskFillColor(),
        "fill-opacity": 1,
      },
    });
  } catch (err) {
    console.warn("Could not apply Leipzig outside mask:", err);
  }
}

function updateLeipzigMaskTheme() {
  if (!map?.getLayer?.(LEIPZIG_MASK_LAYER_ID)) return;
  map.setPaintProperty(LEIPZIG_MASK_LAYER_ID, "fill-color", getLeipzigMaskFillColor());
}

/** @type {Map<string, maplibregl.Marker>} */
const markersById = new Map();
/** @type {{lng:number, lat:number}|null} */
let pendingPoint = null;
/** @type {maplibregl.Marker|null} */
let previewMarker = null;
/** @type {maplibregl.Marker|null} */
let pendingSubmitMarker = null;
/** @type {string|null} */
let cachedPin1Svg = null;
/** @type {string|null} */
let cachedPin2Svg = null;
/** @type {string|null} */
let cachedPin3Svg = null;
/** @type {string|null} */
let cachedPin4Svg = null;
/** Raw pointer.svg for page cursor (unmodified). */
let cachedPointerRaw = null;

/** pin4.svg viewBox (preview placement pin) */
const PIN4_VIEWBOX = { w: 952.11, h: 2010.04 };

/** pointer.svg — hotspot at top-left (0, 0) */
const POINTER_CURSOR_VIEWBOX = { w: 850.39, h: 850.39 };
const POINTER_CURSOR_WIDTH = 22; /* 32px − 30% */
/** @type {maplibregl.Popup|null} */
let addNotePopup = null;
/** @type {HTMLElement|null} */
let addNoteMobileSheetEl = null;
/** Map view to restore after mobile keyboard / iOS input zoom (add-note popup). */
let addNoteSavedMapView = null;
/** @type {(() => void)|null} */
let addNoteVisualViewportHandler = null;
/** @type {maplibregl.Popup|null} */
let openMarkerPopup = null;
/** @type {string|null} */
let openMarkerPopupId = null;

function namespaceSvgClasses(svgText, prefix) {
  if (!svgText || typeof svgText !== "string") return svgText;
  // Avoid SVG <style> class name collisions across multiple inline SVGs.
  return svgText
    .replaceAll('class="st0"', `class="${prefix}-st0"`)
    .replaceAll(".st0", `.${prefix}-st0`)
    .replaceAll('class="cls-1"', `class="${prefix}-cls-1"`)
    .replaceAll(".cls-1", `.${prefix}-cls-1`);
}

/** Force marker pin fill color so inline SVG &lt;style&gt; doesn't override our CSS. */
function setMarkerFill(svgText, fillHex) {
  if (!svgText || typeof svgText !== "string") return svgText;
  return svgText.replace(
    /fill:\s*#?[0-9a-fA-F]{3,8}/g,
    `fill: ${fillHex.startsWith("#") ? fillHex : "#" + fillHex}`
  );
}

let statusClearTimer = null;

/**
 * @param {string} msg
 * @param {{ variant?: "default" | "mapUi"; autoDismiss?: boolean }} [options]
 */
function setStatus(msg, options = {}) {
  const el = document.getElementById("appStatus");
  if (statusClearTimer) {
    clearTimeout(statusClearTimer);
    statusClearTimer = null;
  }
  if (el) {
    el.textContent = msg || "";
    el.hidden = !msg;
    el.classList.toggle("appStatus--mapUi", options.variant === "mapUi");
  }
  if (msg && options.autoDismiss) {
    statusClearTimer = window.setTimeout(() => setStatus(""), 4500);
  }
  if (msg) console.warn(msg);
}

/** Release stuck :hover/focus on touch devices after tapping map chrome buttons. */
function releaseMapControlButton(btn) {
  if (btn && typeof btn.blur === "function") btn.blur();
}

function isWebglSupported() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (n) =>
          n &&
          typeof n.id === "string" &&
          typeof n.note === "string" &&
          typeof n.lng === "number" &&
          typeof n.lat === "number" &&
          (typeof n.createdAt === "number" || typeof n.createdAt === "undefined"),
      )
      .map((n) => {
        // Back-compat: older notes didn't store createdAt.
        // Try to infer from id prefix (makeId() starts with Date.now()).
        let createdAt = Date.now();
        if (typeof n.createdAt === "number") createdAt = n.createdAt;
        else {
          const prefix = String(n.id).split("-")[0];
          const inferred = Number(prefix);
          if (Number.isFinite(inferred) && inferred > 0) createdAt = inferred;
        }
        const out = { ...n, createdAt };
        if (typeof n.imageUrl === "string" && n.imageUrl) out.imageUrl = n.imageUrl;
        out.category = normalizeNoteCategory(n.category);
        return out;
      })
      .slice(0, 500);
  } catch {
    return [];
  }
}

function saveNotes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (err) {
    console.error("saveNotes failed:", err);
    throw err;
  }
}

function seedDemoNotesIfEmpty() {
  if (notes.length > 0) return;
  const now = Date.now();
  notes = SEED_NOTES.map((seed, i) => ({
    id: makeId(),
    placeName: seed.note,
    note: seedNoteDescription(seed.note, currentLang),
    lng: seed.lng,
    lat: seed.lat,
    createdAt: now - i * 60000,
    imageUrl: ARCHIVE_IMAGE_URLS[i % ARCHIVE_IMAGE_URLS.length],
    category: NOTE_CATEGORIES[i % NOTE_CATEGORIES.length].id,
    tags: pickSeedTags(i),
  }));
  saveNotes();
}

function pickRandomArchiveImageUrl() {
  const pool = LOCAL_DEMO_IMAGE_URL
    ? [...ARCHIVE_IMAGE_URLS, LOCAL_DEMO_IMAGE_URL]
    : ARCHIVE_IMAGE_URLS;
  return pool[Math.floor(Math.random() * pool.length)];
}

function normalizeNoteImageUrl(url) {
  if (!url || url.startsWith("data:")) return url;
  if (url === LOCAL_DEMO_IMAGE_URL || ARCHIVE_IMAGE_URLS.includes(url)) return url;
  return pickRandomArchiveImageUrl();
}

function bindImageFallback(img, getFallbackUrl = pickRandomArchiveImageUrl) {
  img.addEventListener("error", () => {
    const fallback = getFallbackUrl();
    if (fallback && img.src !== fallback) {
      img.src = fallback;
    }
  }, { once: true });
}

/** Assign documentary demo images to pins missing imageUrl (or still on local test.png). */
function ensureDemoImagesOnNotes() {
  let changed = false;
  notes.forEach((n, i) => {
    const next = normalizeNoteImageUrl(n.imageUrl);
    if (!n.imageUrl || n.imageUrl !== next) {
      n.imageUrl = next || ARCHIVE_IMAGE_URLS[i % ARCHIVE_IMAGE_URLS.length];
      changed = true;
    }
  });
  if (changed) saveNotes();
}

/** Add 10 extra demo pins for users who already had the original five seeds. */
function ensureExtraSeedNotes() {
  try {
    if (localStorage.getItem(EXTRA_SEEDS_STORAGE_KEY)) return;
    } catch {
    return;
  }
  const existing = new Set(notes.map((n) => `${n.note}|${n.lng}|${n.lat}`));
  const now = Date.now();
  let added = 0;
  SEED_NOTES.slice(5).forEach((seed, i) => {
    const key = `${seed.note}|${seed.lng}|${seed.lat}`;
    if (existing.has(key)) return;
    notes.push({
      id: makeId(),
      placeName: seed.note,
      note: seedNoteDescription(seed.note, currentLang),
      lng: seed.lng,
      lat: seed.lat,
      createdAt: now - (5 + i) * 60000,
      imageUrl: ARCHIVE_IMAGE_URLS[(5 + i) % ARCHIVE_IMAGE_URLS.length],
      category: NOTE_CATEGORIES[(5 + i) % NOTE_CATEGORIES.length].id,
      tags: pickSeedTags(5 + i),
    });
    added++;
  });
  if (added) saveNotes();
  try {
    localStorage.setItem(EXTRA_SEEDS_STORAGE_KEY, "1");
  } catch (_) {}
}

/** Add 25 random demo pins (random category + tags, one-time migration). */
function ensureRandomSeedNotes() {
  try {
    if (localStorage.getItem(RANDOM_SEED_STORAGE_KEY)) return;
  } catch {
    return;
  }
  const existing = new Set(
    notes.map((n) => `${n.placeName || n.note}|${n.lng}|${n.lat}`)
  );
  const now = Date.now();
  let added = 0;
  RANDOM_SEED_NOTES.forEach((seed, i) => {
    const key = `${seed.note}|${seed.lng}|${seed.lat}`;
    if (existing.has(key)) return;
    notes.push({
      id: makeId(),
      placeName: seed.note,
      note: seedNoteDescription(seed.note, currentLang),
      lng: seed.lng,
      lat: seed.lat,
      createdAt: now - (20 + i) * 120000,
      imageUrl: ARCHIVE_IMAGE_URLS[(i + 1) % ARCHIVE_IMAGE_URLS.length],
      category: pickRandomCategoryForSeed(i),
      tags: pickRandomTagsForSeed(i),
    });
    added++;
  });
  if (added) saveNotes();
  try {
    localStorage.setItem(RANDOM_SEED_STORAGE_KEY, "1");
  } catch (_) {}
}

function seedNoteDescription(placeName, lang) {
  return lang === "de"
    ? `Dokumentierter rechter Aufkleber bei ${placeName}.`
    : `Documented far-right sticker at ${placeName}.`;
}

function pickSeedTags(index) {
  const a = NOTE_TAGS[index % NOTE_TAGS.length].id;
  const b = NOTE_TAGS[(index + 3) % NOTE_TAGS.length].id;
  return a === b ? [a] : [a, b];
}

/** Deterministic 0..1 from index (stable random category/tags per pin). */
function seededUnit(index, salt = 0) {
  const x = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function pickRandomCategoryForSeed(index) {
  const i = Math.floor(seededUnit(index, 1) * NOTE_CATEGORIES.length);
  return NOTE_CATEGORIES[i % NOTE_CATEGORIES.length].id;
}

function pickRandomTagsForSeed(index) {
  const count = 1 + Math.floor(seededUnit(index, 2) * 3);
  const order = NOTE_TAGS.map((_, i) => i);
  for (let j = order.length - 1; j > 0; j--) {
    const k = Math.floor(seededUnit(index, 3 + j) * (j + 1));
    [order[j], order[k]] = [order[k], order[j]];
  }
  return order.slice(0, count).map((i) => NOTE_TAGS[i].id);
}

function distanceMeters(lng1, lat1, lng2, lat2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Nearest known Leipzig label from seed/demo pins (offline fallback). */
function guessPlaceNameFromNearbySeeds(lng, lat) {
  /** @type {{ lng: number, lat: number, name: string }[]} */
  const refs = [];
  const add = (lngR, latR, name) => {
    const label = (name || "").trim();
    if (label) refs.push({ lng: lngR, lat: latR, name: label });
  };
  SEED_NOTES.forEach((s) => add(s.lng, s.lat, s.note));
  RANDOM_SEED_NOTES.forEach((s) => add(s.lng, s.lat, s.note));
  notes.forEach((n) => add(n.lng, n.lat, n.placeName));
  let bestName = null;
  let bestD = Infinity;
  for (const r of refs) {
    const d = distanceMeters(lng, lat, r.lng, r.lat);
    if (d < bestD) {
      bestD = d;
      bestName = r.name;
    }
  }
  if (bestName && bestD <= 2500) return bestName;
  return null;
}

function pickAddressPlaceName(address) {
  if (!address || typeof address !== "object") return null;
  return (
    address.suburb ||
    address.neighbourhood ||
    address.city_district ||
    address.quarter ||
    address.village ||
    address.hamlet ||
    address.road ||
    null
  );
}

async function reverseGeocodePlaceName(lng, lat) {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lng));
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("zoom", "17");
  url.searchParams.set("addressdetails", "1");
  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "Accept-Language": currentLang === "de" ? "de" : "en",
    },
  });
  if (!res.ok) throw new Error(`reverse geocode ${res.status}`);
  const data = await res.json();
  return pickAddressPlaceName(data.address);
}

async function resolvePlaceNameForPoint(lng, lat) {
  const near = guessPlaceNameFromNearbySeeds(lng, lat);
  try {
    const geo = await reverseGeocodePlaceName(lng, lat);
    if (geo) return geo;
  } catch (err) {
    console.warn("Place lookup failed, using nearby label:", err);
  }
  return near || "Leipzig";
}

function formatNotePlaceName(note) {
  const place = (note.placeName || "").trim();
  if (place) return place;
  const legacy = (note.note || "").trim();
  if (SEED_PLACE_NAMES.has(legacy)) return legacy;
  return "—";
}

function getPopupBodyText(note) {
  return (note.note || "").trim();
}

function formatMarkerPopupMeta(note) {
  const place = formatNotePlaceName(note);
  const date = formatNoteDate(note.createdAt);
  const placeLabel = place === "—" ? "" : place;
  if (placeLabel && date) return `${placeLabel} · ${date}`;
  return placeLabel || date || "";
}

function normalizeNoteTags(tags) {
  if (!Array.isArray(tags)) return [];
  return tags.filter((id) => NOTE_TAGS.some((t) => t.id === id));
}

function getTagLabel(tagId, lang = currentLang) {
  const tag = NOTE_TAGS.find((t) => t.id === tagId);
  if (!tag) return tagId;
  return lang === "en" ? tag.en : tag.de;
}

function formatNoteTagsDisplay(note, lang = currentLang) {
  const tags = normalizeNoteTags(note.tags);
  if (!tags.length) return "—";
  return tags.map((id) => getTagLabel(id, lang)).join(", ");
}

/** Split legacy seed rows (place stored in note) into placeName + description text. */
function ensureNotePlaceAndText() {
  let changed = false;
  notes.forEach((n, i) => {
    const t = (n.note || "").trim();
    if (SEED_PLACE_NAMES.has(t) && !n.placeName) {
      n.placeName = t;
      n.note = seedNoteDescription(t, currentLang);
      changed = true;
    } else if (n.placeName && SEED_PLACE_NAMES.has(n.placeName) && (!t || t === n.placeName)) {
      n.note = seedNoteDescription(n.placeName, currentLang);
      changed = true;
    }
    if (
      !n.placeName &&
      typeof n.lng === "number" &&
      typeof n.lat === "number" &&
      !Number.isNaN(n.lng) &&
      !Number.isNaN(n.lat)
    ) {
      const guessed = guessPlaceNameFromNearbySeeds(n.lng, n.lat);
      if (guessed) {
        n.placeName = guessed;
        changed = true;
      }
    }
    const tags = normalizeNoteTags(n.tags);
    const isSeed =
      (n.placeName && SEED_PLACE_NAMES.has(n.placeName)) || SEED_PLACE_NAMES.has(t);
    if (!tags.length && isSeed) {
      n.tags = pickSeedTags(i);
      changed = true;
    } else if (n.tags && tags.length !== n.tags.length) {
      n.tags = tags;
      changed = true;
    }
  });
  if (changed) saveNotes();
}

function normalizeNoteCategory(category) {
  const id = typeof category === "string" ? category : "";
  return NOTE_CATEGORIES.some((c) => c.id === id) ? id : DEFAULT_NOTE_CATEGORY;
}

function getCategoryLabel(categoryId, lang = currentLang) {
  const cat = NOTE_CATEGORIES.find((c) => c.id === normalizeNoteCategory(categoryId));
  if (!cat) return "—";
  return lang === "en" ? cat.en : cat.de;
}

function ensureNoteCategories() {
  let changed = false;
  notes.forEach((n, i) => {
    const next = normalizeNoteCategory(n.category);
    if (n.category !== next) {
      n.category = next;
      changed = true;
    } else if (!n.category) {
      n.category = NOTE_CATEGORIES[i % NOTE_CATEGORIES.length].id;
      changed = true;
    }
  });
  if (changed) saveNotes();
}

function formatNoteDate(createdAt) {
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return "";
  const locale = currentLang === "de" ? "de-DE" : "en-GB";
  return d.toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" });
}

/** Raise marker above siblings in the map overlay (hover stacking). */
function bringMarkerWrapperToFront(markerEl) {
  const wrapper = markerEl.closest(".maplibregl-marker");
  if (wrapper?.parentElement) wrapper.parentElement.appendChild(wrapper);
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/** Build CSS cursor from pointer.svg; top-left of image at cursor tip. */
function buildPointerCursorCSSValue(svgText) {
  const h = Math.round(
    (POINTER_CURSOR_WIDTH * POINTER_CURSOR_VIEWBOX.h) /
      POINTER_CURSOR_VIEWBOX.w,
  );
  const sized = svgText.replace(
    /<svg\b/,
    `<svg width="${POINTER_CURSOR_WIDTH}" height="${h}"`,
  );
  const url = `data:image/svg+xml,${encodeURIComponent(sized)}`;
  return `url("${url}") 0 0, auto`;
}

function applyAppCursor() {
  if (!cachedPointerRaw) return;
  const cursor = buildPointerCursorCSSValue(cachedPointerRaw);
  document.documentElement.style.setProperty("--cursor-pointer", cursor);
  if (map && map.getCanvas) {
    map.getCanvas().style.cursor = cursor;
  }
}

// Preload SVG files and cache them
async function loadSvgFiles() {
  try {
    const [pin1Response, pin2Response, pin3Response, pin4Response, pointerResponse] =
      await Promise.all([
      fetch("icons/pin1.svg"),
      fetch("icons/pin2.svg"),
      fetch("icons/pin3.svg"),
      fetch("icons/pin4.svg"),
      fetch("icons/pointer.svg"),
    ]);
    
    if (pin1Response.ok) {
      cachedPin1Svg = setMarkerFill(
        namespaceSvgClasses(await pin1Response.text(), "pin1"),
        "#cd1719"
      );
    } else {
      console.warn("Failed to load icons/pin1.svg, using fallback");
      cachedPin1Svg = null;
    }
    
    if (pin2Response.ok) {
      cachedPin2Svg = setMarkerFill(
        namespaceSvgClasses(await pin2Response.text(), "pin2"),
        "#cd1719"
      );
    } else {
      console.warn("Failed to load icons/pin2.svg, using fallback");
      cachedPin2Svg = null;
    }

    if (pin3Response.ok) {
      const pin3Text = await pin3Response.text();
      cachedPin3Svg = setMarkerFill(
        namespaceSvgClasses(pin3Text, "pin3"),
        "#000"
      );
    } else {
      console.warn("Failed to load icons/pin3.svg, using fallback");
      cachedPin3Svg = null;
    }

    if (pointerResponse.ok) {
      cachedPointerRaw = await pointerResponse.text();
      applyAppCursor();
    } else {
      console.warn("Failed to load icons/pointer.svg, using fallback");
      cachedPointerRaw = null;
    }

    if (pin4Response.ok) {
      cachedPin4Svg = namespaceSvgClasses(await pin4Response.text(), "pin4");
    } else {
      console.warn("Failed to load icons/pin4.svg, using fallback");
      cachedPin4Svg = null;
    }
  } catch (error) {
    console.error("Error loading SVG files:", error);
    // If fetch fails (e.g., file:// protocol), use embedded fallback
    cachedPin1Svg = null;
    cachedPin2Svg = null;
    cachedPin3Svg = null;
    cachedPin4Svg = null;
    cachedPointerRaw = null;
  }
}

/** @param {HTMLElement} markerEl */
function setMarkerHoverLayers(markerEl, hovered) {
  const pin1Layer = markerEl.querySelector('[data-marker-layer="default"]');
  const pin2Layer = markerEl.querySelector('[data-marker-layer="hover"]');
  if (!pin1Layer || !pin2Layer) return;
  pin1Layer.style.opacity = hovered ? "0" : "1";
  pin2Layer.style.opacity = hovered ? "1" : "0";
  markerEl.classList.toggle("mapMarker--emphasized", !!hovered);
}

function clearAllMarkerEmphasis() {
  const container = map?.getContainer?.();
  if (!container) return;
  container.querySelectorAll('[data-marker="true"]').forEach((el) => setMarkerHoverLayers(el, false));
}

/** Green (hover) pin for the note popup open or add-note placement in progress. */
function syncActiveMarkerEmphasis() {
  clearAllMarkerEmphasis();
  if (pendingSubmitMarker) {
    setMarkerHoverLayers(pendingSubmitMarker.getElement(), true);
    bringMarkerWrapperToFront(pendingSubmitMarker.getElement());
    return;
  }
  if (openMarkerPopupId && markersById.has(openMarkerPopupId)) {
    const el = markersById.get(openMarkerPopupId).getElement();
    setMarkerHoverLayers(el, true);
    bringMarkerWrapperToFront(el);
  }
}

function createCustomMarkerElement() {
  const pinSvg =
    cachedPin4Svg ||
    cachedPin1Svg ||
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.23 20.24" style="width: 100%; height: 100%; display: block;"><polygon points="9.07 5.66 10.24 1.43 2.04 0 1.19 2.51 6.47 3.52 6.2 4.36 0 6.2 0 9.59 4.55 11.47 4.62 20.24 9.09 10.34 9.13 7.62 6.56 7.62 9.07 5.66"/></svg>`;
  const pinHoverSvg = cachedPin4Svg || cachedPin2Svg || pinSvg;
  
  // Outer container - MapLibre controls this for positioning
  // DO NOT apply transforms to this element!
  const el = document.createElement("div");
  el.style.display = "block";
  el.style.userSelect = "none";
  el.style.pointerEvents = "auto";
  
  const markerWidth = 32;
  const markerHeight = cachedPin4Svg
    ? Math.round((markerWidth * PIN4_VIEWBOX.h) / PIN4_VIEWBOX.w)
    : Math.round((markerWidth * 20.23) / 10.24);
  
  el.style.width = `${markerWidth}px`;
  el.style.height = `${markerHeight}px`;
  
  // Inner container - we can change SVG content here without affecting MapLibre's positioning
  const inner = document.createElement("div");
  inner.style.width = "100%";
  inner.style.height = "100%";
  inner.style.transition = "opacity 0.3s ease";
  inner.style.position = "relative";
  
  // Create two layers for smooth crossfade transition
  const pin1Layer = document.createElement("div");
  pin1Layer.style.width = "100%";
  pin1Layer.style.height = "100%";
  pin1Layer.style.position = "absolute";
  pin1Layer.style.top = "0";
  pin1Layer.style.left = "0";
  pin1Layer.style.transition = "opacity 0.3s ease";
  pin1Layer.style.opacity = "1";
  pin1Layer.setAttribute("data-marker-layer", "default");
  pin1Layer.innerHTML = pinSvg;
  
  const pin2Layer = document.createElement("div");
  pin2Layer.style.width = "100%";
  pin2Layer.style.height = "100%";
  pin2Layer.style.position = "absolute";
  pin2Layer.style.top = "0";
  pin2Layer.style.left = "0";
  pin2Layer.style.transition = "opacity 0.3s ease";
  pin2Layer.style.opacity = "0";
  pin2Layer.setAttribute("data-marker-layer", "hover");
  pin2Layer.innerHTML = pinHoverSvg;
  
  inner.appendChild(pin1Layer);
  inner.appendChild(pin2Layer);
  el.appendChild(inner);
  
  const showHover = () => {
    setMarkerHoverLayers(el, true);
    bringMarkerWrapperToFront(el);
  };
  const hideHover = () => setMarkerHoverLayers(el, false);

  // Hover crossfade; pointerleave covers missed mouseleave when the map captures the pointer
  el.addEventListener("mouseenter", showHover);
  el.addEventListener("mouseleave", hideHover);
  el.addEventListener("pointerleave", hideHover);
  el.addEventListener("pointercancel", hideHover);
  
  el.setAttribute("data-marker", "true");
  
  return el;
}

/** Preview pin for "preview" placement (first click); no hover. */
function createPreviewMarkerElement() {
  const previewSvg = cachedPin4Svg || cachedPin3Svg || cachedPin1Svg || "";
  const el = document.createElement("div");
  el.style.display = "block";
  el.style.userSelect = "none";
  el.style.pointerEvents = "auto";
  const markerWidth = 32;
  const markerHeight = Math.round(
    (markerWidth * PIN4_VIEWBOX.h) / PIN4_VIEWBOX.w,
  );
  const hitboxExtraBottom = 12;
  el.style.width = `${markerWidth}px`;
  el.style.height = `${markerHeight}px`;
  el.style.position = "relative";
  const inner = document.createElement("div");
  inner.style.width = "100%";
  inner.style.height = "100%";
  inner.innerHTML = previewSvg;
  el.appendChild(inner);
  const hitExtension = document.createElement("div");
  hitExtension.setAttribute("data-preview-marker", "true");
  hitExtension.style.position = "absolute";
  hitExtension.style.left = "0";
  hitExtension.style.right = "0";
  hitExtension.style.bottom = `-${hitboxExtraBottom}px`;
  hitExtension.style.height = `${hitboxExtraBottom}px`;
  hitExtension.style.pointerEvents = "auto";
  el.appendChild(hitExtension);
  el.setAttribute("data-preview-marker", "true");
  return el;
}

const MAX_NOTE_CHARS = 3000;
/** Target size after resize/compress (stored as JPEG data URL in localStorage). */
const MAX_IMAGE_FILE_BYTES = 800_000;
const MAX_IMAGE_INPUT_BYTES = 30 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1600;
/** @type {string|null} Data URL or path (e.g. img/test.png) for the note being created. */
let pendingImageUrl = null;

/** Translations for add-note popup (placeholder and consent sentence). */
const POPUP_I18N = {
  de: {
    placeholder: "max. 500 Wörter ..",
    consentBeforeTerms: "Durch das Absenden akzeptiere ich die ",
    consentBetweenTermsCoc: ", den ",
    consentBetweenCocPrivacy: " und die ",
    consentEnd: ".",
    termsOfUse: "Terms of Use",
    codeOfConduct: "Code of Conduct",
    privacyPolicy: "Privacy Policy",
    termsId: "terms-of-use",
    cocId: "code-of-conduct",
    privacyId: "privacy-policy",
    categoryLabel: "Kategorie",
    tagsLabel: "Tags",
    submitLabel: "Hinzufügen",
    contentRequired: "Bitte Text oder ein Bild hinzufügen.",
    tagsRequired: "Bitte mindestens ein Tag wählen.",
    contentHint: "Text oder Bild — mindestens eines.",
    categoryHint: "Kategorie ist Pflicht.",
    tagsHint: "Mindestens ein Tag wählen.",
    addPhoto: "Bild hinzufügen",
    photoSelected: "Bild ausgewählt — tippen zum Ersetzen",
    photoTooLarge: "Bild konnte nicht verkleinert werden. Bitte ein anderes Foto wählen.",
    photoReadError: "Bild konnte nicht gelesen werden.",
    photoLoading: "Bild wird vorbereitet…",
    zoomImage: "Bild zoomen (Trackpad oder Pinch)",
    outsideCity: "Beiträge können nur innerhalb der Leipziger Stadtgrenze gesetzt werden.",
  },
  en: {
    placeholder: "max. 500 words ..",
    consentBeforeTerms: "By submitting I accept the ",
    consentBetweenTermsCoc: ", the ",
    consentBetweenCocPrivacy: " and the ",
    consentEnd: ".",
    termsOfUse: "Terms of Use",
    codeOfConduct: "Code of Conduct",
    privacyPolicy: "Privacy Policy",
    termsId: "terms-of-use-en",
    cocId: "code-of-conduct-en",
    privacyId: "privacy-policy-en",
    categoryLabel: "Category",
    tagsLabel: "Tags",
    submitLabel: "Add",
    contentRequired: "Please add text or a picture.",
    tagsRequired: "Please select at least one tag.",
    contentHint: "Text or picture — at least one required.",
    categoryHint: "Category is required.",
    tagsHint: "Select at least one tag.",
    addPhoto: "Add a picture",
    photoSelected: "Photo added — tap to replace",
    photoTooLarge: "Could not shrink this image. Try another photo.",
    photoReadError: "Could not read image.",
    photoLoading: "Preparing image…",
    zoomImage: "Zoom image (trackpad or pinch)",
    outsideCity: "Notes can only be placed inside the Leipzig city boundary.",
  },
};

const INLINE_IMAGE_ZOOM_MAX = 6;

/**
 * Pan/zoom inside a fixed-size viewport (popup thumbnail). Wheel + pinch; drag when zoomed.
 * @param {HTMLElement} viewport
 * @param {HTMLImageElement} img
 */
function bindInlineZoomableImage(viewport, img) {
  if (viewport.dataset.zoomBound === "1") return;
  viewport.dataset.zoomBound = "1";
  img.classList.add("zoomableImage");
  img.draggable = false;
  img.style.transformOrigin = "center center";
  const t = POPUP_I18N[currentLang] || POPUP_I18N.de;
  viewport.setAttribute("aria-label", t.zoomImage);
  viewport.setAttribute("role", "group");

  let scale = 1;
  let tx = 0;
  let ty = 0;
  /** @type {{startX:number,startY:number,baseTx:number,baseTy:number,pid:number}|null} */
  let drag = null;
  /** @type {Map<number, {x:number,y:number}>} */
  const pointers = new Map();
  let pinchStartDist = 0;
  let pinchStartScale = 1;

  const applyTransform = () => {
    img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    viewport.classList.toggle("is-zoomed", scale > 1);
  };

  const clampPan = () => {
    if (scale <= 1) return;
    const rect = viewport.getBoundingClientRect();
    const maxX = (rect.width * (scale - 1)) / 2;
    const maxY = (rect.height * (scale - 1)) / 2;
    tx = Math.min(maxX, Math.max(-maxX, tx));
    ty = Math.min(maxY, Math.max(-maxY, ty));
  };

  const zoomAt = (factor, clientX, clientY) => {
    const rect = viewport.getBoundingClientRect();
    const px = clientX - rect.left - rect.width / 2;
    const py = clientY - rect.top - rect.height / 2;
    const next = Math.min(INLINE_IMAGE_ZOOM_MAX, Math.max(1, scale * factor));
    const ratio = next / scale;
    tx = px - (px - tx) * ratio;
    ty = py - (py - ty) * ratio;
    scale = next;
    if (scale <= 1) {
      scale = 1;
      tx = 0;
      ty = 0;
    }
    clampPan();
    applyTransform();
  };

  const syncPinchBaseline = () => {
    if (pointers.size !== 2) {
      pinchStartDist = 0;
      return;
    }
    const pts = [...pointers.values()];
    pinchStartDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
    pinchStartScale = scale;
  };

  const stopMapGesture = (e) => e.stopPropagation();

  viewport.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
      zoomAt(factor, e.clientX, e.clientY);
    },
    { passive: false },
  );

  viewport.addEventListener("dblclick", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (scale > 1) {
      scale = 1;
      tx = 0;
      ty = 0;
      applyTransform();
    } else {
      zoomAt(2, e.clientX, e.clientY);
    }
  });

  viewport.addEventListener("pointerdown", (e) => {
    stopMapGesture(e);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    syncPinchBaseline();
    if (pointers.size === 1 && scale > 1) {
      drag = { startX: e.clientX, startY: e.clientY, baseTx: tx, baseTy: ty, pid: e.pointerId };
      viewport.setPointerCapture(e.pointerId);
      viewport.classList.add("is-dragging");
    }
  });

  viewport.addEventListener("pointermove", (e) => {
    stopMapGesture(e);
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size >= 2) {
      drag = null;
      viewport.classList.remove("is-dragging");
      const pts = [...pointers.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (pinchStartDist > 0 && dist > 0) {
        const midX = (pts[0].x + pts[1].x) / 2;
        const midY = (pts[0].y + pts[1].y) / 2;
        const next = Math.min(INLINE_IMAGE_ZOOM_MAX, Math.max(1, pinchStartScale * (dist / pinchStartDist)));
        const factor = next / scale;
        scale = next;
        const rect = viewport.getBoundingClientRect();
        const px = midX - rect.left - rect.width / 2;
        const py = midY - rect.top - rect.height / 2;
        tx = px - (px - tx) * factor;
        ty = py - (py - ty) * factor;
        if (scale <= 1) {
          scale = 1;
          tx = 0;
          ty = 0;
        }
        clampPan();
        applyTransform();
      }
      return;
    }

    if (drag && e.pointerId === drag.pid) {
      tx = drag.baseTx + (e.clientX - drag.startX);
      ty = drag.baseTy + (e.clientY - drag.startY);
      clampPan();
      applyTransform();
    }
  });

  const endPointer = (e) => {
    stopMapGesture(e);
    pointers.delete(e.pointerId);
    syncPinchBaseline();
    if (drag && e.pointerId === drag.pid) {
      drag = null;
      viewport.classList.remove("is-dragging");
      try {
        viewport.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  };

  viewport.addEventListener("pointerup", endPointer);
  viewport.addEventListener("pointercancel", endPointer);
}

const ARCHIVE_IMAGE_MOBILE_MQ = window.matchMedia("(max-width: 600px)");

/** @returns {boolean} */
function closeImageLightbox() {
  const lb = $("imageLightbox");
  if (!lb || !lb.classList.contains("open")) return false;
  lb.classList.remove("open");
  lb.setAttribute("aria-hidden", "true");
  lb.hidden = true;
  document.body.classList.remove("imageLightboxOpen");
  const img = /** @type {HTMLImageElement|null} */ ($("imageLightboxImg"));
  if (img) img.removeAttribute("src");
  return true;
}

function openImageLightbox(src) {
  const lb = $("imageLightbox");
  const img = /** @type {HTMLImageElement|null} */ ($("imageLightboxImg"));
  if (!lb || !img || !src) return;
  img.src = src;
  lb.hidden = false;
  lb.classList.add("open");
  lb.setAttribute("aria-hidden", "false");
  document.body.classList.add("imageLightboxOpen");
  updateImageLightboxLabels();
}

function updateImageLightboxLabels() {
  const lb = $("imageLightbox");
  if (!lb) return;
  const de = currentLang === "de";
  lb.setAttribute(
    "aria-label",
    de ? "Bildvorschau — tippen zum Schließen" : "Image preview — tap to close",
  );
}

function initImageLightbox() {
  const lb = $("imageLightbox");
  const img = /** @type {HTMLImageElement|null} */ ($("imageLightboxImg"));
  if (!lb || !img) return;
  updateImageLightboxLabels();
  lb.addEventListener("click", () => closeImageLightbox());
}

/**
 * Archive detail image: inline zoom on desktop; tap → fullscreen on narrow viewports.
 * @param {HTMLElement} viewport
 * @param {HTMLImageElement} img
 */
function bindArchiveDetailImage(viewport, img) {
  if (ARCHIVE_IMAGE_MOBILE_MQ.matches) {
    bindArchiveDetailImageFullscreen(viewport, img);
  } else {
    bindInlineZoomableImage(viewport, img);
  }
}

/**
 * @param {HTMLElement} viewport
 * @param {HTMLImageElement} img
 */
function bindArchiveDetailImageFullscreen(viewport, img) {
  if (viewport.dataset.archiveFullscreenBound === "1") return;
  viewport.dataset.archiveFullscreenBound = "1";
  viewport.classList.add("archiveDetailImageViewport--tapFullscreen");
  viewport.setAttribute(
    "aria-label",
    currentLang === "de" ? "Bild im Vollbild öffnen" : "Open image fullscreen",
  );
  viewport.setAttribute("role", "button");
  viewport.tabIndex = 0;

  /** @type {{x:number,y:number,t:number}|null} */
  let tapStart = null;
  const stopMapGesture = (e) => e.stopPropagation();

  viewport.addEventListener("pointerdown", (e) => {
    stopMapGesture(e);
    tapStart = { x: e.clientX, y: e.clientY, t: Date.now() };
  });

  viewport.addEventListener("pointerup", (e) => {
    stopMapGesture(e);
    if (!tapStart) return;
    const moved = Math.hypot(e.clientX - tapStart.x, e.clientY - tapStart.y);
    const dt = Date.now() - tapStart.t;
    tapStart = null;
    if (moved > 12 || dt > 450) return;
    const src = img.currentSrc || img.src;
    if (src) openImageLightbox(src);
  });

  viewport.addEventListener("pointercancel", () => {
    tapStart = null;
  });

  viewport.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const src = img.currentSrc || img.src;
      if (src) openImageLightbox(src);
    }
  });
}

function dataUrlByteLength(dataUrl) {
  const base64 = dataUrl.split(",")[1] || "";
  return Math.ceil((base64.length * 3) / 4);
}

function loadImageFromObjectUrl(objectUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("decode"));
    img.src = objectUrl;
  });
}

/**
 * Resize and compress to JPEG so iPhone photos and large desktop files work in localStorage.
 * @param {File} file
 * @returns {Promise<string>} data URL
 */
async function compressImageFileToDataUrl(file) {
  if (!file || !file.type.startsWith("image/")) {
    throw new Error("not-image");
  }
  if (file.size > MAX_IMAGE_INPUT_BYTES) {
    throw new Error("too-large-input");
  }
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImageFromObjectUrl(objectUrl);
    const w0 = img.naturalWidth;
    const h0 = img.naturalHeight;
    if (!w0 || !h0) throw new Error("invalid-dimensions");

    let maxSide = MAX_IMAGE_DIMENSION;
    for (let attempt = 0; attempt < 10; attempt++) {
      const scale = Math.min(1, maxSide / Math.max(w0, h0));
      const w = Math.max(1, Math.round(w0 * scale));
      const h = Math.max(1, Math.round(h0 * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) throw new Error("no-canvas");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);

      let quality = 0.88;
      let dataUrl = canvas.toDataURL("image/jpeg", quality);
      while (dataUrlByteLength(dataUrl) > MAX_IMAGE_FILE_BYTES && quality > 0.42) {
        quality -= 0.08;
        dataUrl = canvas.toDataURL("image/jpeg", quality);
      }
      if (dataUrlByteLength(dataUrl) <= MAX_IMAGE_FILE_BYTES) {
        return dataUrl;
      }
      maxSide = Math.floor(maxSide * 0.72);
      if (maxSide < 320) break;
    }
    throw new Error("too-large-output");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function createPopupDivider() {
  const divider = document.createElement("hr");
  divider.className = "markerPopupDivider";
  divider.setAttribute("aria-hidden", "true");
  return divider;
}

function setAddNoteFieldError(fieldError, textarea, show, message) {
  if (!fieldError || !textarea) return;
  const t = POPUP_I18N[currentLang] || POPUP_I18N.de;
  if (show) {
    fieldError.textContent = message || t.contentRequired;
    fieldError.hidden = false;
    textarea.setAttribute("aria-invalid", "true");
    textarea.setAttribute("aria-describedby", "addNoteCharHint addNoteFieldError");
  } else {
    fieldError.hidden = true;
    textarea.removeAttribute("aria-invalid");
    textarea.setAttribute("aria-describedby", "addNoteCharHint");
  }
}

function setAddNoteTagsError(form, show) {
  const bar = form?.querySelector("#addNoteTagsBar");
  const err = form?.querySelector("#addNoteTagsError");
  const t = POPUP_I18N[currentLang] || POPUP_I18N.de;
  if (err) {
    err.textContent = t.tagsRequired;
    err.hidden = !show;
  }
  if (bar) bar.classList.toggle("addNoteTagsBar--invalid", !!show);
}

function bindAddNoteFieldValidation(textarea, fieldError) {
  if (!textarea || textarea.dataset.fieldValidationBound === "1") return;
  textarea.dataset.fieldValidationBound = "1";
  textarea.addEventListener("input", () => {
    const form = textarea.closest(".addNotePopupForm");
    const hasText = textarea.value.trim().length > 0;
    if (hasText || pendingImageUrl) setAddNoteFieldError(fieldError, textarea, false);
  });
}

function bindAddNoteTagsValidation(form, tagsBar) {
  if (!tagsBar || tagsBar.dataset.tagsValidationBound === "1") return;
  tagsBar.dataset.tagsValidationBound = "1";
  tagsBar.addEventListener("click", () => {
    if (getSelectedTagsFromForm(form).length > 0) setAddNoteTagsError(form, false);
  });
}

function validateAddNoteForm(form) {
  const t = POPUP_I18N[currentLang] || POPUP_I18N.de;
  const textarea = form.querySelector("textarea");
  const fieldError = form.querySelector("#addNoteFieldError");
  const noteText = textarea?.value.trim() ?? "";
  const hasContent = noteText.length > 0 || !!pendingImageUrl;
  const tags = getSelectedTagsFromForm(form);
  let ok = true;

  if (!hasContent) {
    setAddNoteFieldError(fieldError, textarea, true, t.contentRequired);
    ok = false;
  } else {
    setAddNoteFieldError(fieldError, textarea, false);
  }

  if (tags.length === 0) {
    setAddNoteTagsError(form, true);
    ok = false;
  } else {
    setAddNoteTagsError(form, false);
  }

  return ok;
}

function createAddNoteFormHint(id, text) {
  const hint = document.createElement("p");
  hint.id = id;
  hint.className = "addNoteFormHint";
  hint.textContent = text;
  return hint;
}

/** Popup body for an existing note (image, place+date, description, category). */
function createMarkerPopupContent(note) {
  const root = document.createElement("div");
  root.className = "markerPopupBody";

  const viewport = document.createElement("div");
  viewport.className = "markerPopupImageViewport inlineZoomViewport";
  const img = document.createElement("img");
  img.className = "markerPopupImage";
  img.src = normalizeNoteImageUrl(note.imageUrl) || pickRandomArchiveImageUrl();
  img.alt = "";
  img.decoding = "async";
  img.loading = "lazy";
  bindImageFallback(img);
  viewport.appendChild(img);
  bindInlineZoomableImage(viewport, img);
  root.appendChild(viewport);

  const copy = document.createElement("div");
  copy.className = "markerPopupCopy";

  const metaText = formatMarkerPopupMeta(note);
  if (metaText) {
    const meta = document.createElement("p");
    meta.className = "markerPopupMeta";
    meta.textContent = metaText;
    copy.appendChild(meta);
  }

  const text = document.createElement("p");
  text.className = "markerPopupText";
  text.textContent = getPopupBodyText(note) || "—";
  copy.appendChild(text);

  root.appendChild(copy);

  root.appendChild(createPopupDivider());

  const labelsWrap = document.createElement("div");
  labelsWrap.className = "markerPopupLabels";

  const categoryId = normalizeNoteCategory(note.category);
  const categoryLabel = getCategoryLabel(categoryId);
  const categoryRow = document.createElement("div");
  categoryRow.className = "markerPopupCategoryRow";
  const categoryBtn = document.createElement("button");
  categoryBtn.type = "button";
  categoryBtn.className = "markerPopupTag markerPopupTag--category";
  categoryBtn.textContent = categoryLabel;
  categoryBtn.setAttribute(
    "aria-label",
    currentLang === "de"
      ? `Archiv nach ${categoryLabel} filtern`
      : `Open archive filtered by ${categoryLabel}`
  );
  categoryBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    openArchiveWithCategoryFilter(categoryId);
  });
  categoryRow.appendChild(categoryBtn);
  labelsWrap.appendChild(categoryRow);

  const tagIds = normalizeNoteTags(note.tags);
  if (tagIds.length) {
    const tagsRow = document.createElement("div");
    tagsRow.className = "markerPopupTagsRow";
    tagIds.forEach((tagId) => {
      const tagLabel = getTagLabel(tagId);
      const tagBtn = document.createElement("button");
      tagBtn.type = "button";
      tagBtn.className = "markerPopupTag";
      tagBtn.textContent = tagLabel;
      tagBtn.setAttribute(
        "aria-label",
        currentLang === "de"
          ? `Archiv nach ${tagLabel} filtern`
          : `Open archive filtered by ${tagLabel}`
      );
      tagBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openArchiveWithTagFilter(tagId);
      });
      tagsRow.appendChild(tagBtn);
    });
    labelsWrap.appendChild(tagsRow);
  }

  root.appendChild(labelsWrap);

  return root;
}

function createAddNotePhotoRow(t) {
  const row = document.createElement("div");
  row.className = "addNotePhotoRow";
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*,.heic,.heif";
  fileInput.name = "photo";
  fileInput.id = "addNotePhotoInput";
  fileInput.className = "addNotePhotoInput";
  fileInput.tabIndex = -1;
  fileInput.setAttribute("aria-hidden", "true");
  const pickBtn = document.createElement("button");
  pickBtn.type = "button";
  pickBtn.className = "addNotePhotoLabel";
  const labelText = document.createElement("span");
  labelText.className = "addNotePhotoLabelText";
  labelText.textContent = t.addPhoto;
  pickBtn.appendChild(labelText);
  const openPhotoPicker = () => fileInput.click();
  pickBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openPhotoPicker();
  });
  const photoError = document.createElement("p");
  photoError.className = "addNotePhotoError";
  photoError.setAttribute("role", "alert");
  photoError.hidden = true;
  const previewViewport = document.createElement("div");
  previewViewport.className = "addNotePhotoPreviewViewport inlineZoomViewport";
  previewViewport.hidden = true;
  const loadingEl = document.createElement("div");
  loadingEl.className = "addNotePhotoLoading";
  loadingEl.hidden = true;
  loadingEl.textContent = t.photoLoading;
  const preview = document.createElement("img");
  preview.className = "addNotePhotoPreview";
  preview.alt = "";
  preview.hidden = true;
  previewViewport.appendChild(loadingEl);
  previewViewport.appendChild(preview);
  bindInlineZoomableImage(previewViewport, preview);

  const setPhotoError = (msg) => {
    if (!msg) {
      photoError.hidden = true;
      photoError.textContent = "";
      return;
    }
    photoError.textContent = msg;
    photoError.hidden = false;
  };

  const resetPhotoPreview = () => {
    pendingImageUrl = null;
    previewViewport.hidden = true;
    previewViewport.classList.remove("is-loading");
    loadingEl.hidden = true;
    preview.hidden = true;
    preview.removeAttribute("src");
    labelText.textContent = t.addPhoto;
    setPhotoError("");
  };

  let photoBusy = false;
  const handlePhotoSelection = async () => {
    if (photoBusy) return;
    const file = fileInput.files?.[0];
    if (!file) {
      resetPhotoPreview();
      return;
    }
    photoBusy = true;
    setPhotoError("");
    previewViewport.hidden = false;
    previewViewport.classList.add("is-loading");
    loadingEl.hidden = false;
    loadingEl.textContent = t.photoLoading;
    preview.hidden = true;
    preview.removeAttribute("src");
    try {
      const dataUrl = await compressImageFileToDataUrl(file);
      pendingImageUrl = dataUrl;
      const addForm = document.querySelector(".addNotePopupForm");
      if (addForm) {
        const ta = addForm.querySelector("textarea");
        const fe = addForm.querySelector("#addNoteFieldError");
        if (ta && fe) setAddNoteFieldError(fe, ta, false);
      }
      preview.src = dataUrl;
      await new Promise((resolve, reject) => {
        if (preview.complete && preview.naturalWidth > 0) {
          resolve();
          return;
        }
        preview.onload = () => resolve();
        preview.onerror = () => reject(new Error("decode"));
      });
      previewViewport.classList.remove("is-loading");
      loadingEl.hidden = true;
      preview.hidden = false;
      labelText.textContent = t.photoSelected;
    } catch (err) {
      fileInput.value = "";
      resetPhotoPreview();
      const code = err instanceof Error ? err.message : "";
      if (code === "too-large-input" || code === "too-large-output") {
        setPhotoError(t.photoTooLarge);
      } else {
        setPhotoError(t.photoReadError);
      }
    } finally {
      photoBusy = false;
    }
  };

  fileInput.addEventListener("change", () => {
    void handlePhotoSelection();
  });
  fileInput.addEventListener("input", () => {
    void handlePhotoSelection();
  });

  row.appendChild(fileInput);
  row.appendChild(pickBtn);
  row.appendChild(photoError);
  row.appendChild(previewViewport);
  return row;
}

/** Open menu if needed and scroll to a section by id (e.g. "terms-of-use", "privacy-policy"). */
function scrollMenuToSection(sectionId) {
  if (!menuOverlay) return;
  const target = document.getElementById(sectionId);
  if (!target) return;
  if (!menuOverlay.classList.contains("open")) {
    toggleMenu();
  }
  menuActiveSectionId = sectionId;
  renderMenuFilterBar();
  requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function renderMenuFilterBar() {
  const bar = $("menuFilterBar");
  if (!bar) return;
  const sections = MENU_NAV_SECTIONS[currentLang] || MENU_NAV_SECTIONS.de;
  bar.replaceChildren();
  bar.setAttribute(
    "aria-label",
    currentLang === "de" ? "Menüabschnitte" : "Menu sections"
  );
  sections.forEach((section) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "menuFilterBtn";
    btn.textContent = section.label;
    btn.setAttribute("aria-pressed", menuActiveSectionId === section.sectionId ? "true" : "false");
    if (menuActiveSectionId === section.sectionId) btn.classList.add("menuFilterBtn--active");
    btn.addEventListener("click", () => scrollMenuToSection(section.sectionId));
    bar.appendChild(btn);
  });
}

function getSelectedCategoryFromForm(form) {
  const bar = form?.querySelector("#addNoteCategoryBar");
  const active = bar?.querySelector('.markerPopupTag--category[aria-pressed="true"]');
  const id = active?.getAttribute("data-category-id");
  return normalizeNoteCategory(id || DEFAULT_NOTE_CATEGORY);
}

function fillAddNoteCategoryBar(bar, selectedId = DEFAULT_NOTE_CATEGORY) {
  if (!bar) return;
  const selected = normalizeNoteCategory(selectedId);
  const t = POPUP_I18N[currentLang] || POPUP_I18N.de;
  bar.replaceChildren();
  NOTE_CATEGORIES.forEach((cat) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "markerPopupTag markerPopupTag--category";
    btn.dataset.categoryId = cat.id;
    btn.textContent = currentLang === "en" ? cat.en : cat.de;
    const active = cat.id === selected;
    btn.setAttribute("aria-pressed", active ? "true" : "false");
    btn.addEventListener("mousedown", (e) => e.stopPropagation());
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      bar.querySelectorAll(".markerPopupTag--category").forEach((b) => {
        b.setAttribute("aria-pressed", "false");
      });
      btn.setAttribute("aria-pressed", "true");
      releaseMapControlButton(btn);
    });
    bar.appendChild(btn);
  });
  bar.setAttribute("aria-label", t.categoryLabel);
}

function createAddNoteCategoryRow() {
  const row = document.createElement("div");
  row.className = "markerPopupCategoryRow";
  const bar = document.createElement("div");
  bar.id = "addNoteCategoryBar";
  bar.className = "addNoteCategoryBar";
  bar.setAttribute("role", "group");
  fillAddNoteCategoryBar(bar);
  row.appendChild(bar);
  return row;
}

function getSelectedTagsFromForm(form) {
  const bar = form?.querySelector("#addNoteTagsBar");
  if (!bar) return [];
  return [...bar.querySelectorAll('.markerPopupTag[aria-pressed="true"]')]
    .map((btn) => btn.getAttribute("data-tag-id"))
    .filter((id) => id && NOTE_TAGS.some((t) => t.id === id));
}

function fillAddNoteTagsBar(bar, selectedIds = []) {
  if (!bar) return;
  const selected = new Set(selectedIds);
  const t = POPUP_I18N[currentLang] || POPUP_I18N.de;
  bar.replaceChildren();
  NOTE_TAGS.forEach((tag) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "markerPopupTag";
    btn.dataset.tagId = tag.id;
    btn.textContent = currentLang === "en" ? tag.en : tag.de;
    const active = selected.has(tag.id);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
    btn.addEventListener("mousedown", (e) => e.stopPropagation());
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const on = btn.getAttribute("aria-pressed") !== "true";
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      releaseMapControlButton(btn);
    });
    bar.appendChild(btn);
  });
  bar.setAttribute("aria-label", t.tagsLabel);
}

function createAddNoteTagsRow() {
  const row = document.createElement("div");
  row.className = "markerPopupTagsRow";
  const bar = document.createElement("div");
  bar.id = "addNoteTagsBar";
  bar.className = "addNoteTagsBar";
  bar.setAttribute("role", "group");
  fillAddNoteTagsBar(bar);
  row.appendChild(bar);
  return row;
}

/** Build form content for the add-note popup (same look as marker popup). */
function createAddNotePopupContent() {
  const t = POPUP_I18N[currentLang] || POPUP_I18N.de;
  const form = document.createElement("form");
  form.className = "addNotePopupForm markerPopupBody";
  form.noValidate = true;

  form.appendChild(createAddNoteFormHint("addNoteContentHint", t.contentHint));
  form.appendChild(createPopupDivider());
  form.appendChild(createAddNotePhotoRow(t));
  form.appendChild(createPopupDivider());

  const textBlock = document.createElement("div");
  textBlock.className = "addNoteTextBlock";
  const textarea = document.createElement("textarea");
  textarea.placeholder = t.placeholder;
  textarea.rows = isMobileAddNoteViewport() ? 3 : 5;
  textarea.name = "note";
  textarea.maxLength = MAX_NOTE_CHARS;
  const fieldError = document.createElement("p");
  fieldError.id = "addNoteFieldError";
  fieldError.className = "addNoteFieldError";
  fieldError.setAttribute("role", "alert");
  fieldError.hidden = true;
  const hint = document.createElement("span");
  hint.id = "addNoteCharHint";
  hint.className = "addNoteConsentHint";
  hint.setAttribute("aria-live", "polite");
  const termsLink = document.createElement("a");
  termsLink.href = "#" + t.termsId;
  termsLink.textContent = t.termsOfUse;
  termsLink.addEventListener("click", (e) => {
    e.preventDefault();
    scrollMenuToSection(t.termsId);
  });
  const cocLink = document.createElement("a");
  cocLink.href = "#" + t.cocId;
  cocLink.textContent = t.codeOfConduct;
  cocLink.addEventListener("click", (e) => {
    e.preventDefault();
    scrollMenuToSection(t.cocId);
  });
  const privacyLink = document.createElement("a");
  privacyLink.href = "#" + t.privacyId;
  privacyLink.textContent = t.privacyPolicy;
  privacyLink.addEventListener("click", (e) => {
    e.preventDefault();
    scrollMenuToSection(t.privacyId);
  });
  hint.append(
    t.consentBeforeTerms,
    termsLink,
    t.consentBetweenTermsCoc,
    cocLink,
    t.consentBetweenCocPrivacy,
    privacyLink,
    t.consentEnd
  );
  textarea.setAttribute("aria-describedby", "addNoteCharHint");
  bindAddNoteFieldValidation(textarea, fieldError);
  bindAddNoteMobileMapGuard(textarea);
  textBlock.appendChild(textarea);
  textBlock.appendChild(fieldError);
  form.appendChild(textBlock);
  form.appendChild(createPopupDivider());

  const labelsWrap = document.createElement("div");
  labelsWrap.className = "markerPopupLabels addNotePopupLabels";
  labelsWrap.appendChild(createAddNoteCategoryRow());
  labelsWrap.appendChild(createAddNoteFormHint("addNoteCategoryHint", t.categoryHint));
  labelsWrap.appendChild(createPopupDivider());
  const tagsRow = createAddNoteTagsRow();
  labelsWrap.appendChild(tagsRow);
  labelsWrap.appendChild(createAddNoteFormHint("addNoteTagsHint", t.tagsHint));
  const tagsError = document.createElement("p");
  tagsError.id = "addNoteTagsError";
  tagsError.className = "addNoteTagsError";
  tagsError.setAttribute("role", "alert");
  tagsError.hidden = true;
  labelsWrap.appendChild(tagsError);
  bindAddNoteTagsValidation(form, tagsRow.querySelector("#addNoteTagsBar"));
  form.appendChild(labelsWrap);
  form.appendChild(createPopupDivider());

  form.appendChild(hint);
  form.appendChild(createPopupDivider());

  const submitRow = document.createElement("div");
  submitRow.className = "markerPopupCategoryRow addNoteSubmitRow";
  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className = "markerPopupTag addNoteSubmitBtn";
  submitBtn.textContent = t.submitLabel;
  submitRow.appendChild(submitBtn);
  form.appendChild(submitRow);

  pendingImageUrl = null;
  form.addEventListener("click", (e) => e.stopPropagation());
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateAddNoteForm(form)) {
      if (!textarea.value.trim() && !pendingImageUrl) textarea.focus();
      else {
        const tagsBar = form.querySelector("#addNoteTagsBar");
        const firstTag = tagsBar?.querySelector(".markerPopupTag");
        if (firstTag && typeof firstTag.focus === "function") firstTag.focus();
      }
      return;
    }
    const noteText = textarea.value.trim();
    const category = getSelectedCategoryFromForm(form);
    const tags = normalizeNoteTags(getSelectedTagsFromForm(form));
    if (!pendingPoint) return;
    textarea.blur();
    addNoteSavedMapView = null;
    submitNote(noteText, submitBtn, category, tags);
  });
  return form;
}

/** Update the open add-note popup to the current language (placeholder + consent text). */
function updateAddNotePopupLang() {
  if (!isAddNoteFormOpen()) return;
  let content = null;
  if (isAddNoteMobileSheetOpen()) {
    content = addNoteMobileSheetEl;
  } else if (typeof addNotePopup?.getContainer === "function") {
    content = addNotePopup.getContainer();
  }
  if (!content && map) {
    const mapContainer = map.getContainer();
    const popupWrapper = Array.from(mapContainer.querySelectorAll(".maplibregl-popup")).find(
      (el) => el.querySelector(".addNotePopupForm")
    );
    content = popupWrapper ? popupWrapper.querySelector(".maplibregl-popup-content") : null;
  }
  if (!content) return;
  const form = content.querySelector(".addNotePopupForm");
  const textBlock = form?.querySelector(".addNoteTextBlock");
  const textarea = textBlock?.querySelector("textarea");
  const hint = form?.querySelector("#addNoteCharHint");
  const fieldError = form?.querySelector("#addNoteFieldError");
  const categoryBar = form?.querySelector("#addNoteCategoryBar");
  const submitBtn = form?.querySelector(".addNoteSubmitBtn");
  if (!textarea || !hint) return;
  const t = POPUP_I18N[currentLang] || POPUP_I18N.de;
  if (fieldError && !fieldError.hidden) setAddNoteFieldError(fieldError, textarea, true, t.contentRequired);
  else if (fieldError) fieldError.textContent = t.contentRequired;
  const contentHint = form?.querySelector("#addNoteContentHint");
  const categoryHint = form?.querySelector("#addNoteCategoryHint");
  const tagsHint = form?.querySelector("#addNoteTagsHint");
  if (contentHint) contentHint.textContent = t.contentHint;
  if (categoryHint) categoryHint.textContent = t.categoryHint;
  if (tagsHint) tagsHint.textContent = t.tagsHint;
  const tagsError = form?.querySelector("#addNoteTagsError");
  if (tagsError && !tagsError.hidden) tagsError.textContent = t.tagsRequired;
  if (categoryBar) fillAddNoteCategoryBar(categoryBar, getSelectedCategoryFromForm(form));
  if (submitBtn) submitBtn.textContent = t.submitLabel;
  textarea.placeholder = t.placeholder;
  hint.textContent = "";
  const termsLink = document.createElement("a");
  termsLink.href = "#" + t.termsId;
  termsLink.textContent = t.termsOfUse;
  termsLink.addEventListener("click", (e) => {
    e.preventDefault();
    scrollMenuToSection(t.termsId);
  });
  const cocLink = document.createElement("a");
  cocLink.href = "#" + t.cocId;
  cocLink.textContent = t.codeOfConduct;
  cocLink.addEventListener("click", (e) => {
    e.preventDefault();
    scrollMenuToSection(t.cocId);
  });
  const privacyLink = document.createElement("a");
  privacyLink.href = "#" + t.privacyId;
  privacyLink.textContent = t.privacyPolicy;
  privacyLink.addEventListener("click", (e) => {
    e.preventDefault();
    scrollMenuToSection(t.privacyId);
  });
  hint.append(
    t.consentBeforeTerms,
    termsLink,
    t.consentBetweenTermsCoc,
    cocLink,
    t.consentBetweenCocPrivacy,
    privacyLink,
    t.consentEnd
  );
  const photoLabelText = form?.querySelector(".addNotePhotoLabelText");
  const photoLoading = form?.querySelector(".addNotePhotoLoading");
  if (photoLoading) photoLoading.textContent = t.photoLoading;
  if (photoLabelText) {
    photoLabelText.textContent =
      pendingImageUrl || form?.querySelector(".addNotePhotoPreviewViewport:not([hidden])")
        ? t.photoSelected
        : t.addPhoto;
  }
  const tagsBar = form?.querySelector("#addNoteTagsBar");
  if (tagsBar) {
    fillAddNoteTagsBar(tagsBar, getSelectedTagsFromForm(form));
    delete tagsBar.dataset.tagsValidationBound;
    bindAddNoteTagsValidation(form, tagsBar);
  }
}

function setLanguage(lang) {
  if (lang !== "de" && lang !== "en") return;
  currentLang = lang;
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch (_) {}
  document.documentElement.lang = lang;
  const menuDe = $("menuContentDe");
  const menuEn = $("menuContentEn");
  if (menuDe) menuDe.style.display = lang === "de" ? "" : "none";
  if (menuEn) menuEn.style.display = lang === "en" ? "" : "none";
  if (hamburgerBtn) {
    hamburgerBtn.setAttribute(
      "aria-label",
      lang === "de" ? (menuOverlay?.classList.contains("open") ? "Menü schließen" : "Menü öffnen") : menuOverlay?.classList.contains("open") ? "Close menu" : "Open menu"
    );
  }
  if (archiveBtn) {
    archiveBtn.setAttribute(
      "aria-label",
      lang === "de" ? (archiveOverlay?.classList.contains("open") ? "Archiv schließen" : "Archiv öffnen") : archiveOverlay?.classList.contains("open") ? "Close archive" : "Open archive"
    );
    archiveBtn.title = lang === "de" ? "Archiv" : "Archive";
  }
  const brandHomeBtn = /** @type {HTMLButtonElement|null} */ ($("brandHomeBtn"));
  if (brandHomeBtn) {
    const homeLabel = lang === "de" ? "Zurück zur Karte" : "Back to map";
    brandHomeBtn.setAttribute("aria-label", homeLabel);
    brandHomeBtn.title = homeLabel;
  }
  let seedTextChanged = false;
  notes.forEach((n) => {
    if (n.placeName && SEED_PLACE_NAMES.has(n.placeName)) {
      const next = seedNoteDescription(n.placeName, lang);
      if (n.note !== next) {
        n.note = next;
        seedTextChanged = true;
      }
    }
  });
  if (seedTextChanged) saveNotes();
  if (openMarkerPopup && openMarkerPopupId) {
    const note = notes.find((n) => n.id === openMarkerPopupId);
    if (note && typeof openMarkerPopup.setDOMContent === "function") {
      openMarkerPopup.setDOMContent(createMarkerPopupContent(note));
    }
  }
  if (menuOverlay?.classList.contains("open")) {
    renderMenuFilterBar();
  }
  if (archiveOverlay?.classList.contains("open")) {
    renderArchiveList();
  } else {
    showArchiveDetail(null);
  }
  updateArchiveDetailBackLabel();
  updateImageLightboxLabels();
  updateAddNotePopupLang();
}

function isMobileAddNoteViewport() {
  return window.matchMedia("(max-width: 600px), (pointer: coarse)").matches;
}

function isAddNoteMobileSheetOpen() {
  return !!(
    addNoteMobileSheetEl &&
    !addNoteMobileSheetEl.hidden &&
    addNoteMobileSheetEl.classList.contains("addNoteMobileSheet--visible")
  );
}

function captureAddNoteMapView() {
  if (!map) return;
  addNoteSavedMapView = {
    center: map.getCenter(),
    zoom: map.getZoom(),
    bearing: map.getBearing(),
    pitch: map.getPitch(),
    minZoom: map.getMinZoom(),
  };
}

function restoreAddNoteMapView() {
  const saved = addNoteSavedMapView;
  addNoteSavedMapView = null;
  if (!map || !saved) return;
  map.jumpTo({
    center: saved.center,
    zoom: saved.zoom,
    bearing: saved.bearing,
    pitch: saved.pitch,
  });
  if (typeof saved.minZoom === "number") map.setMinZoom(saved.minZoom);
  resetPageScrollAfterKeyboard();
}

function refreshMapLayoutAfterAddNote() {
  if (!map || isAddNoteFormOpen()) return;
  unlockMapLayoutForAddNote();
  map.resize();
  syncMinZoomToFitLeipzig();
  resetPageScrollAfterKeyboard();
}

function scheduleRestoreAddNoteMapView() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => restoreAddNoteMapView());
  });
}

function startAddNoteViewportWatch() {
  if (!window.visualViewport || addNoteVisualViewportHandler) return;
  let lastHeight = window.visualViewport.height;
  addNoteVisualViewportHandler = () => {
    if (!addNotePopup) return;
    const vv = window.visualViewport;
    if (!vv) return;
    if (vv.height > lastHeight + 48) {
      resetPageScrollAfterKeyboard();
      if (addNoteSavedMapView) scheduleRestoreAddNoteMapView();
    }
    lastHeight = vv.height;
  };
  window.visualViewport.addEventListener("resize", addNoteVisualViewportHandler);
}

function stopAddNoteViewportWatch() {
  if (!window.visualViewport || !addNoteVisualViewportHandler) return;
  window.visualViewport.removeEventListener("resize", addNoteVisualViewportHandler);
  addNoteVisualViewportHandler = null;
}

function bindAddNoteMobileMapGuard(textarea) {
  if (!textarea || textarea.dataset.mobileMapGuardBound === "1" || !isMobileAddNoteViewport()) return;
  textarea.dataset.mobileMapGuardBound = "1";
  textarea.style.setProperty("font-size", "14px", "important");
  textarea.style.setProperty("line-height", "1.5", "important");
  textarea.addEventListener("blur", () => {
    window.setTimeout(() => {
      const active = document.activeElement;
      if (active === textarea || (active && active.closest?.(".addNotePopupForm"))) return;
      resetPageScrollAfterKeyboard();
      scheduleRestoreAddNoteMapView();
    }, 150);
  });
}

function ensureAddNoteMobileSheet() {
  if (addNoteMobileSheetEl) return addNoteMobileSheetEl;
  const sheet = document.createElement("div");
  sheet.id = "addNoteMobileSheet";
  sheet.className = "addNoteMobileSheet";
  sheet.hidden = true;
  sheet.addEventListener("click", (e) => e.stopPropagation());
  sheet.addEventListener("touchstart", (e) => e.stopPropagation(), { passive: true });
  document.body.appendChild(sheet);
  addNoteMobileSheetEl = sheet;
  return sheet;
}

function reflyMapForOpenAddNoteSheet(lngLat) {
  if (!map) return;
  const center = Array.isArray(lngLat) ? lngLat : [lngLat.lng, lngLat.lat];
  flyMapToPlacePinForAddNote(center, { zoom: map.getZoom() });
  map.once("moveend", () => captureAddNoteMapView());
}

function openAddNoteMobileSheet(lngLat, content) {
  const sheet = ensureAddNoteMobileSheet();
  sheet.replaceChildren(content);
  sheet.hidden = false;
  sheet.classList.remove("addNoteMobileSheet--open");
  addNoteSavedMapView = null;
  document.body.classList.add("add-note-form-open");
  lockMapLayoutForAddNote();
  startAddNoteViewportWatch();

  const center = Array.isArray(lngLat) ? lngLat : [lngLat.lng, lngLat.lat];
  captureAddNoteMapView();

  requestAnimationFrame(() => {
    sheet.classList.add("addNoteMobileSheet--visible");
    requestAnimationFrame(() => {
      sheet.classList.add("addNoteMobileSheet--open");
      reflyMapForOpenAddNoteSheet(center);
      const onSlideEnd = (e) => {
        if (e.target !== sheet || e.propertyName !== "transform") return;
        sheet.removeEventListener("transitionend", onSlideEnd);
        reflyMapForOpenAddNoteSheet(center);
      };
      sheet.addEventListener("transitionend", onSlideEnd);
      window.setTimeout(() => reflyMapForOpenAddNoteSheet(center), PANEL_SLIDE_MS + 40);
    });
  });

  const ta = content.querySelector("textarea");
  if (ta) ta.value = "";
}

function closeAddNoteMobileSheetAnimated(done) {
  const sheet = addNoteMobileSheetEl;
  if (!sheet || sheet.hidden || !sheet.classList.contains("addNoteMobileSheet--open")) {
    done?.();
    return;
  }
  sheet.classList.remove("addNoteMobileSheet--open");
  const finish = () => {
    sheet.classList.remove("addNoteMobileSheet--visible");
    sheet.hidden = true;
    sheet.replaceChildren();
    done?.();
  };
  const onEnd = (e) => {
    if (e.target !== sheet || e.propertyName !== "transform") return;
    sheet.removeEventListener("transitionend", onEnd);
    finish();
  };
  sheet.addEventListener("transitionend", onEnd);
  window.setTimeout(finish, PANEL_SLIDE_MS + 80);
}

function openAddNotePopup(lngLat) {
  if (addNotePopup) {
    addNotePopup.remove();
    addNotePopup = null;
  }
  if (addNoteMobileSheetEl) {
    addNoteMobileSheetEl.classList.remove("addNoteMobileSheet--open", "addNoteMobileSheet--visible");
    addNoteMobileSheetEl.hidden = true;
    addNoteMobileSheetEl.replaceChildren();
  }
  addNoteSavedMapView = null;
  unlockMapLayoutForAddNote();

  const content = createAddNotePopupContent();
  const center = Array.isArray(lngLat) ? lngLat : [lngLat.lng, lngLat.lat];

  if (isMobileAddNoteViewport()) {
    openAddNoteMobileSheet(center, content);
    syncActiveMarkerEmphasis();
    return;
  }

  const popupOptions = {
    anchor: "bottom",
    offset: [0, -GAP_ABOVE_MARKER],
    closeButton: false,
    closeOnClick: true,
  };
  addNotePopup = new maplibregl.Popup(popupOptions)
    .setLngLat(center)
    .setDOMContent(content)
    .addTo(map);
  flyMapToPlacePin(center, { zoom: map.getZoom() });
  syncActiveMarkerEmphasis();
  addNotePopup.on("close", () => {
    closeAddNotePopup();
  });
  addNotePopup.once("open", () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const ta = content.querySelector("textarea");
        if (!ta) return;
          ta.value = "";
          ta.focus();
          ta.setSelectionRange(0, 0);
      });
    });
  });
}

function closeAddNotePopup(options = {}) {
  pendingImageUrl = null;
  document.body.classList.remove("add-note-form-open");
  stopAddNoteViewportWatch();
  if (addNotePopup) {
    addNotePopup.remove();
    addNotePopup = null;
  }

  const finalizeClose = () => {
    unlockMapLayoutForAddNote();
  if (pendingSubmitMarker) {
    pendingSubmitMarker.remove();
    pendingSubmitMarker = null;
  }
  pendingPoint = null;
    if (options.skipRestore) {
      addNoteSavedMapView = null;
    } else {
      scheduleRestoreAddNoteMapView();
    }
    clearAllMarkerEmphasis();
    window.setTimeout(refreshMapLayoutAfterAddNote, 400);
    options.onClosed?.();
  };

  if (addNoteMobileSheetEl && !addNoteMobileSheetEl.hidden && addNoteMobileSheetEl.classList.contains("addNoteMobileSheet--open")) {
    closeAddNoteMobileSheetAnimated(finalizeClose);
    return;
  }
  if (addNoteMobileSheetEl) {
    addNoteMobileSheetEl.classList.remove("addNoteMobileSheet--open", "addNoteMobileSheet--visible");
    addNoteMobileSheetEl.hidden = true;
    addNoteMobileSheetEl.replaceChildren();
  }
  finalizeClose();
}

/**
 * Single submit path: call API (or fallback to local), add note to state, update map, close popup, fly to marker.
 * @param {string} noteText
 * @param {HTMLButtonElement} [buttonEl] - Optional submit button to disable during request.
 * @param {string} [category]
 * @param {string[]} [tags]
 */
async function submitNote(noteText, buttonEl, category = DEFAULT_NOTE_CATEGORY, tags = []) {
  const text = (noteText || "").trim();
  if ((!text && !pendingImageUrl) || !pendingPoint) return;
  if (buttonEl) buttonEl.disabled = true;
  setStatus("");
  const { lng, lat } = pendingPoint;
  let placeName = guessPlaceNameFromNearbySeeds(lng, lat) || "Leipzig";
  try {
    placeName = await resolvePlaceNameForPoint(lng, lat);
  } catch (_) {
    /* keep seed fallback */
  }
  const applyItem = (item) => {
    notes.unshift(item);
    try {
    saveNotes();
    } catch {
      if (buttonEl) buttonEl.disabled = false;
      setStatus(currentLang === "de" ? "Speichern fehlgeschlagen (Speicher voll?)." : "Could not save (storage full?).");
      return;
    }
    if (archiveOverlay?.classList.contains("open")) {
      selectedArchiveNoteId = item.id;
      renderArchiveList();
    }
    if (pendingSubmitMarker) {
      pendingSubmitMarker.getElement().setAttribute("data-note-id", item.id);
      markersById.set(item.id, pendingSubmitMarker);
      pendingSubmitMarker = null;
    } else {
      if (previewMarker) {
        previewMarker.remove();
        previewMarker = null;
      }
      addMarker(item);
    }
    document.activeElement && document.activeElement.blur && document.activeElement.blur();
    closeAddNotePopup({
      skipRestore: true,
      onClosed: () => {
        if (!map) return;
        openOrToggleMarkerPopup(item.id);
      },
    });
  };
  const imageUrl = pendingImageUrl || null;
  const noteCategory = normalizeNoteCategory(category);
  const noteTags = normalizeNoteTags(tags);
  applyItem({
        id: makeId(),
        note: text,
        placeName,
        lng,
        lat,
        createdAt: Date.now(),
    category: noteCategory,
    tags: noteTags,
    ...(imageUrl ? { imageUrl } : {}),
  });
    if (buttonEl) buttonEl.disabled = false;
}

const GAP_ABOVE_MARKER = 80; // gap between popup tip and top of marker (popup above marker)
const MARKER_OFFSET_BELOW_CENTER = 200; // when centering on marker, place marker this many px below visual center
const ADD_NOTE_PIN_GAP_ABOVE_SHEET = 16; // mobile: pin tip sits this far above the form top edge
const PANEL_SLIDE_MS = 220;

/** Pixel offset for flyMapToPlacePin: pin appears this far below map center (negative = above center). */
function getAddNotePlacementOffsetPx() {
  if (!map?.getContainer()) return MARKER_OFFSET_BELOW_CENTER;
  if (!isMobileAddNoteViewport() || !addNoteMobileSheetEl || addNoteMobileSheetEl.hidden) {
    return MARKER_OFFSET_BELOW_CENTER;
  }
  const mapH = map.getContainer().clientHeight;
  const sheetH = addNoteMobileSheetEl.getBoundingClientRect().height;
  if (mapH <= 0 || sheetH <= 0) return MARKER_OFFSET_BELOW_CENTER;
  // Pin just above the sheet: screen Y ≈ mapH - sheetH - gap → offset from map vertical center
  return mapH / 2 - sheetH - ADD_NOTE_PIN_GAP_ABOVE_SHEET;
}

function flyMapToPlacePinForAddNote(lngLat, options = {}) {
  const offsetPx = options.offsetPx ?? getAddNotePlacementOffsetPx();
  flyMapToPlacePin(lngLat, { ...options, offsetPx });
}
/** At max zoom-out, ease in slightly so the centering pan fits inside maxBounds. */
const CAMERA_PLACEMENT_ZOOM_HEADROOM = 0.5;
const CAMERA_PLACEMENT_DURATION_MS = 480;

/** @param {{ lng: number, lat: number } | [number, number] | maplibregl.LngLat} lngLat */
function normalizeLngLatInput(lngLat) {
  if (Array.isArray(lngLat)) return { lng: lngLat[0], lat: lngLat[1] };
  if (lngLat && typeof lngLat.lng === "number" && typeof lngLat.lat === "number") {
    return { lng: lngLat.lng, lat: lngLat.lat };
  }
  return null;
}

function clampCenterToMaxBounds(center) {
  if (!map || !center) return center;
  const bounds = map.getMaxBounds();
  if (!bounds) return center;
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  return {
    lng: Math.min(Math.max(center.lng, sw.lng), ne.lng),
    lat: Math.min(Math.max(center.lat, sw.lat), ne.lat),
  };
}

/** Zoom for pin placement fly: never zoom out; at min zoom allow a little zoom-in headroom. */
function resolvePlacementFlyZoom(requestedZoom) {
  const minZ = map.getMinZoom();
  const current = map.getZoom();
  const maxZ = map.getMaxZoom();
  if (typeof requestedZoom === "number") {
    return Math.min(maxZ, Math.max(minZ, requestedZoom));
  }
  if (current <= minZ + 0.08) {
    return Math.min(maxZ, minZ + CAMERA_PLACEMENT_ZOOM_HEADROOM);
  }
  return Math.max(current, minZ);
}

/**
 * Pan/zoom to place a pin in the lower part of the view (add-note / marker popups).
 * @param {{ lng: number, lat: number } | [number, number] | maplibregl.LngLat} lngLat
 * @param {{ offsetPx?: number, zoom?: number, duration?: number }} [options]
 */
function flyMapToPlacePin(lngLat, options = {}) {
  if (!map) return;
  const pt = normalizeLngLatInput(lngLat);
  if (!pt) return;
  const offsetPx = options.offsetPx ?? MARKER_OFFSET_BELOW_CENTER;
  const targetZoom = resolvePlacementFlyZoom(options.zoom);
  let flyCenter = getCenterLngLatWithMarkerBelowAtZoom(pt, offsetPx, targetZoom);
  flyCenter = clampCenterToMaxBounds(flyCenter);
  map.easeTo({
    center: [flyCenter.lng, flyCenter.lat],
    zoom: targetZoom,
    duration: options.duration ?? CAMERA_PLACEMENT_DURATION_MS,
    essential: true,
  });
}

/** Return center lngLat so that the given point appears offsetPx pixels below the visual center after flyTo. */
function getCenterLngLatWithMarkerBelow(lngLat, offsetPx) {
  const point = map.project(lngLat);
  return map.unproject([point.x, point.y - offsetPx]);
}

/** Center the open popup in the map viewport (pan within maxBounds, small offset if needed). */
function centerPopupInMapView(popup) {
  if (!map || !popup) return;
  const container = map.getContainer();
  const popupEl = typeof popup.getElement === "function" ? popup.getElement() : null;
  if (!container || !popupEl) return;

  if (typeof popup.setOffset === "function") {
    popup.setOffset([0, -GAP_ABOVE_MARKER]);
  }

  const mapRect = container.getBoundingClientRect();
  const pr = popupEl.getBoundingClientRect();
  const dx = mapRect.left + mapRect.width / 2 - (pr.left + pr.width / 2);
  const dy = mapRect.top + mapRect.height / 2 - (pr.top + pr.height / 2);
  if (Math.abs(dx) < 2 && Math.abs(dy) < 2) return;

  map.panBy([dx, dy], { duration: 350 });
  map.once("moveend", () => {
    const pr2 = popupEl.getBoundingClientRect();
    const dx2 = mapRect.left + mapRect.width / 2 - (pr2.left + pr2.width / 2);
    const dy2 = mapRect.top + mapRect.height / 2 - (pr2.top + pr2.height / 2);
    if (Math.abs(dx2) < 2 && Math.abs(dy2) < 2) return;
    const cur = popup.getOffset();
    const ox = (typeof cur?.x === "number" ? cur.x : cur?.[0]) || 0;
    const oy = (typeof cur?.y === "number" ? cur.y : cur?.[1]) || -GAP_ABOVE_MARKER;
    popup.setOffset([ox + dx2, oy + dy2]);
  });
}

function scheduleCenterPopupInMapView(popup) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => centerPopupInMapView(popup));
  });
}

/** Pan toward marker (same gentle move as opening the add-note popup). */
function flyMapToMarker(lngLat, zoom) {
  flyMapToPlacePin(lngLat, { zoom, duration: CAMERA_PLACEMENT_DURATION_MS });
}

function bindPopupRecenterOnImageLoad(popup, root) {
  const img = root?.querySelector?.(".markerPopupImage");
  if (!img) return;
  const recenter = () => scheduleCenterPopupInMapView(popup);
  if (img.complete) return;
  img.addEventListener("load", recenter, { once: true });
  img.addEventListener("error", recenter, { once: true });
}

/**
 * Return center lngLat at targetZoom so that the given point appears offsetPx pixels below the visual center.
 * Use this when flying to a marker from a different view (e.g. after adding a note) so we don't zoom in place.
 */
function getCenterLngLatWithMarkerBelowAtZoom(lngLat, offsetPx, targetZoom) {
  const savedCenter = map.getCenter();
  const savedZoom = map.getZoom();
  map.setCenter(lngLat);
  map.setZoom(targetZoom);
  const flyCenter = getCenterLngLatWithMarkerBelow(lngLat, offsetPx);
  map.setCenter(savedCenter);
  map.setZoom(savedZoom);
  return flyCenter;
}

/** Open or toggle the note popup for a marker (standalone Popup so anchor/offset are respected). */
function openOrToggleMarkerPopup(noteId, options = {}) {
  const note = notes.find((n) => n.id === noteId);
  const marker = markersById.get(noteId);
  if (!note || !marker) return;
  if (openMarkerPopupId === noteId) {
    if (openMarkerPopup) openMarkerPopup.remove();
    openMarkerPopup = null;
    openMarkerPopupId = null;
    clearAllMarkerEmphasis();
    return;
  }
  if (openMarkerPopup) openMarkerPopup.remove();
  const lngLat = marker.getLngLat();
  flyMapToMarker(lngLat, options.zoom);
  const content = createMarkerPopupContent(note);
  const popup = new maplibregl.Popup({
    anchor: "bottom",
    offset: [0, -GAP_ABOVE_MARKER],
    closeButton: false,
    // Avoid same map click closing the popup immediately (differs by browser/timing).
    closeOnClick: false,
  })
    .setLngLat(lngLat)
    .setDOMContent(content)
    .addTo(map);
  popup.on("close", () => {
    openMarkerPopup = null;
    openMarkerPopupId = null;
    clearAllMarkerEmphasis();
  });
  popup.on("open", () => {
    scheduleCenterPopupInMapView(popup);
    map.once("moveend", () => scheduleCenterPopupInMapView(popup));
    bindPopupRecenterOnImageLoad(popup, content);
    syncActiveMarkerEmphasis();
  });
  openMarkerPopup = popup;
  openMarkerPopupId = noteId;
  syncActiveMarkerEmphasis();
}

function addMarker(note) {
  const markerElement = createCustomMarkerElement();
  markerElement.setAttribute("data-note-id", note.id);

  const marker = new maplibregl.Marker({
    element: markerElement,
    anchor: "bottom",
  })
    .setLngLat([note.lng, note.lat])
    .addTo(map);

  markersById.set(note.id, marker);
  if (updateMarkerPinColorsFn) updateMarkerPinColorsFn();
}

function removeAllMarkers() {
  for (const marker of markersById.values()) {
    marker.remove();
  }
  markersById.clear();
}

function setMapThemedVisible(visible) {
  const mapEl = $("map");
  if (!mapEl) return;
  mapEl.classList.toggle("map--themed", visible);
}

/** Load / seed notes from localStorage once (archive works even if map is slow). */
let notesHydrated = false;
function hydrateNotesFromStorage() {
  if (notesHydrated) return;
  notes = loadNotes();
  seedDemoNotesIfEmpty();
  ensureExtraSeedNotes();
  ensureRandomSeedNotes();
  ensureDemoImagesOnNotes();
  ensureNoteCategories();
  ensureNotePlaceAndText();
  notesHydrated = true;
}

function initMap() {
  if (window.location.protocol === "file:") {
    setStatus(
      "Open this page via http:// (e.g. run: python3 -m http.server 5173, then visit http://localhost:5173). file:// often breaks map rendering.",
    );
    return;
  }

  if (typeof maplibregl === "undefined") {
    setStatus(
      "Map library failed to load. Check your internet connection and reload.",
    );
    return;
  }

  if (typeof maplibregl.Map !== "function") {
    setStatus("Map library loaded, but Map constructor is missing.");
    return;
  }

  // Some builds don't expose maplibregl.supported(); do our own WebGL check.
  if (!isWebglSupported()) {
    setStatus(
      "Your browser does not support WebGL (required to display the map).",
    );
    return;
  }

  const waterColor = "#a8d5e2";
  const parkColor = "#ffbbdd";
  const majorStreetColor = "#fd78b8";
  const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/bright";

  setStatus(currentLang === "de" ? "Karte wird geladen…" : "Loading map…", {
    variant: "mapUi",
  });
  const leipzigViewBounds = getLeipzigViewBounds();
  const leipzigViewCenter = getLeipzigViewCenter(leipzigViewBounds);

  setMapThemedVisible(false);

  map = new maplibregl.Map({
    container: "map",
    style: MAP_STYLE_URL,
    center: leipzigViewCenter,
    zoom: 11.2,
    maxZoom: 18,
    maxBounds: leipzigViewBounds,
    pitch: 0,
    minPitch: 0,
    maxPitch: 0,
    touchPitch: false,
    attributionControl: false,
  });

  function lockMapPitch() {
    if (!map) return;
    if (map.getPitch() !== 0) map.setPitch(0);
  }

  let markersOnMap = false;
  let mapShown = false;

  function showMapWhenStyled() {
    if (!map || mapShown) return;
    applyMapTheme();
    void applyLeipzigOutsideMask();
    lockMapPitch();
    setMapThemedVisible(true);
    mapShown = true;
    setStatus("");
  }

  function restoreMarkersOnMap() {
    if (!map || markersOnMap) return;
    hydrateNotesFromStorage();
    for (const n of notes) addMarker(n);
    markersOnMap = true;
    updateMarkerPinColors();
  }

  map.on("style.load", showMapWhenStyled);
  map.on("styledata", () => {
    if (map.isStyleLoaded && map.isStyleLoaded()) showMapWhenStyled();
  });
  map.on("load", () => {
    lockMapPitch();
    showMapWhenStyled();
    applyAppCursor();
    applyMapThemeWithRetries();
    restoreMarkersOnMap();
    map.resize();
    syncMinZoomToFitLeipzig();
  });
  map.on("pitch", lockMapPitch);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (map.isStyleLoaded && map.isStyleLoaded()) showMapWhenStyled();
    });
  });
  setTimeout(() => {
    showMapWhenStyled();
    restoreMarkersOnMap();
  }, 2500);

  setTimeout(() => {
    if (mapShown) return;
    setStatus(
      currentLang === "de"
        ? "Karte lädt nicht. Internet nötig (unpkg.com + Karten-Tiles). Simulator: Safari erlauben, dann neu laden."
        : "Map not loading. Internet required (unpkg.com + map tiles). In Simulator: allow Safari network, then reload.",
      { variant: "mapUi" },
    );
  }, 20000);

  map.on("error", (e) => {
    const msg =
      e && e.error && typeof e.error.message === "string"
        ? e.error.message
        : null;
    if (msg) {
      setStatus(`Map error: ${msg}`);
      console.error("Map error:", e);
    }
  });

  const PREVIEW_PIN_COLOR = "#000";

  function updateMarkerPinColors() {
    const savedFill = MARKER_PIN_COLOR;
    const container = map && map.getContainer && map.getContainer();
    if (!container) return;
    const savedDefaultFill = "#000";
    container.querySelectorAll("[data-marker=\"true\"]").forEach((el) => {
      el.querySelectorAll('[data-marker-layer="default"] svg polygon, [data-marker-layer="default"] svg path, [data-marker-layer="default"] svg circle').forEach((node) => {
        node.setAttribute("fill", savedDefaultFill);
        node.style.fill = savedDefaultFill;
      });
      el.querySelectorAll('[data-marker-layer="default"] svg style').forEach((styleEl) => {
        if (styleEl.textContent) {
          styleEl.textContent = styleEl.textContent.replace(
            /fill:\s*#?[0-9a-fA-F]{3,8}/g,
            `fill: ${savedDefaultFill}`
          );
        }
      });
      el.querySelectorAll('[data-marker-layer="hover"] svg polygon, [data-marker-layer="hover"] svg path, [data-marker-layer="hover"] svg circle').forEach((node) => {
        node.setAttribute("fill", savedFill);
        node.style.fill = savedFill;
      });
      el.querySelectorAll('[data-marker-layer="hover"] svg style').forEach((styleEl) => {
        if (styleEl.textContent) {
          styleEl.textContent = styleEl.textContent.replace(
            /fill:\s*#?[0-9a-fA-F]{3,8}/g,
            `fill: ${savedFill}`
          );
        }
      });
    });
    container.querySelectorAll("[data-preview-marker=\"true\"]").forEach((el) => {
      el.querySelectorAll("svg polygon, svg path, svg circle").forEach((node) => {
        node.setAttribute("fill", "none");
        node.style.fill = "none";
        node.setAttribute("stroke", PREVIEW_PIN_COLOR);
        node.style.stroke = PREVIEW_PIN_COLOR;
        node.setAttribute("stroke-width", "48");
        node.setAttribute("stroke-linejoin", "round");
        node.setAttribute("stroke-linecap", "round");
      });
      el.querySelectorAll("svg style").forEach((styleEl) => {
        if (styleEl.textContent) {
          styleEl.textContent = styleEl.textContent
            .replace(/fill:\s*#?[0-9a-fA-F]{3,8}/g, "fill: none")
            .replace(/stroke:\s*[^;]+/g, `stroke: ${PREVIEW_PIN_COLOR}`);
        }
      });
    });
  }
  updateMarkerPinColorsFn = updateMarkerPinColors;

  /** Apply theme now and again after delays so custom colors stick when layers load late (initial load). */
  function applyMapThemeWithRetries() {
    applyMapTheme();
    [100, 300, 600].forEach((ms) => {
      setTimeout(applyMapTheme, ms);
    });
  }

  // Custom map colors: background, buildings, water, parks/greens, landuse, streets
  function applyMapTheme() {
    if (!map || !map.getStyle()) return;
    const baseColor = "#e0e0e0";
    const buildingColor = "#bababa";
    try {
      const style = map.getStyle();
      if (style && style.layers) {
        const bgLayers = style.layers.filter(l => l.type === "background");
        bgLayers.forEach(layer => {
          map.setPaintProperty(layer.id, "background-color", baseColor);
        });
      }
      if (map.getLayer("building-top")) {
        map.setPaintProperty("building-top", "fill-color", buildingColor);
      }
      if (map.getLayer("building")) {
        map.setPaintProperty("building", "fill-color", buildingColor);
      }
      const water = waterColor;
      if (map.getLayer("water")) {
        map.setPaintProperty("water", "fill-color", water);
      }
      if (map.getLayer("waterway")) {
        const waterwayLayer = map.getLayer("waterway");
        if (waterwayLayer && waterwayLayer.type === "line") {
          map.setPaintProperty("waterway", "line-color", water);
        } else if (waterwayLayer && waterwayLayer.type === "fill") {
          map.setPaintProperty("waterway", "fill-color", water);
        }
      }
      const greenLayers = [
        "park",
        "landcover-wood",
        "landcover-grass",
        "landcover-grass-park",
        "landuse-cemetery"
      ];
      greenLayers.forEach(layerId => {
        if (map.getLayer(layerId)) {
          const layer = map.getLayer(layerId);
          if (layer && layer.type === "fill") {
            map.setPaintProperty(layerId, "fill-color", parkColor);
            if (map.getPaintProperty(layerId, "fill-opacity") !== undefined) {
              map.setPaintProperty(layerId, "fill-opacity", 1);
            }
          }
        }
      });
      if (style && style.layers) {
        style.layers.forEach(layer => {
          const layerId = layer.id;
          if ((layerId.includes("park") || layerId.includes("wood") || layerId.includes("grass") ||
               layerId.includes("forest") || layerId.includes("cemetery") || layerId.includes("nature") || layerId.includes("green")) &&
              layer.type === "fill" && !greenLayers.includes(layerId)) {
            try {
              map.setPaintProperty(layerId, "fill-color", parkColor);
              if (map.getPaintProperty(layerId, "fill-opacity") !== undefined) {
                map.setPaintProperty(layerId, "fill-opacity", 1);
              }
            } catch (e) {
              console.warn("Could not style layer", layerId, e);
            }
          }
        });
      }
      const baseLanduseLayers = [
        "landuse-residential",
        "landuse-suburb",
        "landuse-commercial",
        "landuse-industrial",
        "landuse-hospital",
        "landuse-school",
        "landuse-railway"
      ];
      baseLanduseLayers.forEach(layerId => {
        if (map.getLayer(layerId)) {
          const layer = map.getLayer(layerId);
          if (layer && layer.type === "fill") {
            map.setPaintProperty(layerId, "fill-color", baseColor);
          }
        }
      });
      const isMajorRoadCore = (layerId) =>
        /motorway|trunk|primary|secondary/i.test(layerId) &&
        !/tertiary|link|ramp|minor|residential|unclassified|service|track|path|foot|label|name|shield|arrow|casing|outline|shadow|halo|tunnel|bridge|border|rail/i.test(layerId);
      const isParkColoredRoad = (layerId) => {
        if (/label|name|shield|arrow|rail|path|track|service|foot|cycle|steps|boundary|admin|water/i.test(layerId)) {
          return false;
        }
        if (/casing|outline|shadow|halo/i.test(layerId) && /road|highway|transport|motorway|trunk|primary|secondary|tertiary/i.test(layerId)) {
          return true;
        }
        return /tertiary|link|ramp/i.test(layerId);
      };
      if (style && style.layers) {
        style.layers.forEach((layer) => {
          const layerId = layer.id;
          if (layer.type !== "line") return;
          const color = isParkColoredRoad(layerId) ? parkColor : isMajorRoadCore(layerId) ? majorStreetColor : null;
          if (!color) return;
          try {
            map.setPaintProperty(layerId, "line-color", color);
          } catch (e) {
            console.warn("Could not style street layer", layerId, e);
          }
        });
      }
    } catch (error) {
      console.error("Error applying map theme:", error);
    }
      updateMarkerPinColors();
    updateLeipzigMaskTheme();
    if (map.isStyleLoaded && map.isStyleLoaded()) {
      setMapThemedVisible(true);
    }
  }

  const zoomInBtn = /** @type {HTMLButtonElement|null} */ ($("zoomInBtn"));
  const zoomOutBtn = /** @type {HTMLButtonElement|null} */ ($("zoomOutBtn"));
  if (zoomInBtn) {
    zoomInBtn.addEventListener("click", () => {
      if (map) map.zoomIn();
      releaseMapControlButton(zoomInBtn);
    });
  }
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener("click", () => {
      if (map) map.zoomOut();
      releaseMapControlButton(zoomOutBtn);
    });
  }

  // Resize map when viewport changes (fixes iOS Safari address bar / rotation).
  // Defer resize until after flyTo/move so UI doesn't jump during zoom animation.
  const onResize = () => {
    if (!map) return;
    if (isAddNoteFormOpen()) return;
    if (typeof map.isMoving === "function" && map.isMoving()) {
      map.once("moveend", () => {
        if (map) map.resize();
      });
      return;
    }
    map.resize();
    syncMinZoomToFitLeipzig();
  };
  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", () => {
    setTimeout(onResize, 100);
  });
  map.on("load", () => {
    requestAnimationFrame(onResize);
    setTimeout(onResize, 200);
  });

  map.on("click", (e) => {
    if (!map) return;

    const originalEvent = e.originalEvent;
    const target = originalEvent && originalEvent.target ? originalEvent.target : null;

    if (isAddNoteMobileSheetOpen()) {
      const inChrome =
        target &&
        target.closest &&
        (target.closest(".addNoteMobileSheet") ||
          target.closest(".leftControls") ||
          target.closest(".bottomRightControls") ||
          target.closest(".menuOverlay") ||
          target.closest(".archiveOverlay"));
      if (!inChrome) {
        closeAddNotePopup();
        return;
      }
    }
    const clickedPreview = target && target.closest && target.closest('[data-preview-marker="true"]');
    const clickedSavedMarker = target && target.closest && target.closest('[data-marker="true"]');

    // Click on saved note marker: open/toggle our popup above the marker (standalone Popup so anchor works)
    if (clickedSavedMarker && !clickedPreview) {
      const noteId = clickedSavedMarker.getAttribute("data-note-id");
      if (noteId) {
        setMarkerHoverLayers(clickedSavedMarker, false);
        queueMicrotask(() => openOrToggleMarkerPopup(noteId));
      }
      return;
    }

    // Click on preview marker: confirm placement → normal pin, open add-note popup
    if (clickedPreview && previewMarker) {
      const lngLat = previewMarker.getLngLat();
      pendingPoint = { lng: lngLat.lng, lat: lngLat.lat };
      previewMarker.remove();
      previewMarker = null;
      const normalEl = createCustomMarkerElement();
      pendingSubmitMarker = new maplibregl.Marker({
        element: normalEl,
        anchor: "bottom",
      })
        .setLngLat([pendingPoint.lng, pendingPoint.lat])
        .addTo(map);
      if (updateMarkerPinColorsFn) updateMarkerPinColorsFn();
      setMarkerHoverLayers(normalEl, true);
      bringMarkerWrapperToFront(normalEl);
      openAddNotePopup([pendingPoint.lng, pendingPoint.lat]);
      return;
    }

    // Click on empty map: place or replace grey preview pin (no modal)
    closeMarkerPopupIfOpen();
    if (!isInsideLeipzig(e.lngLat)) {
      const t = POPUP_I18N[currentLang] || POPUP_I18N.de;
      setStatus(t.outsideCity, { variant: "mapUi", autoDismiss: true });
      return;
    }
    setStatus("");
    if (previewMarker) {
      previewMarker.remove();
      previewMarker = null;
    }
    const previewEl = createPreviewMarkerElement();
    previewMarker = new maplibregl.Marker({
      element: previewEl,
      anchor: "bottom",
    })
      .setLngLat(e.lngLat)
      .addTo(map);
    if (updateMarkerPinColorsFn) updateMarkerPinColorsFn();
  });
}

function goToFrontPage() {
  closeImageLightbox();
  closeAddNotePopup();
  closeMenu();
  closeArchive();
  if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
  if (map) {
    const bounds = getLeipzigViewBounds();
    map.flyTo({
      center: getLeipzigViewCenter(bounds),
      zoom: 11.2,
      pitch: 0,
      duration: 900,
    });
    window.setTimeout(() => map.resize(), 120);
  }
}

function closeMenu() {
  if (!menuOverlay || !hamburgerBtn) return;
    menuOverlay.classList.remove("open");
    menuOverlay.setAttribute("aria-hidden", "true");
    hamburgerBtn.classList.remove("menuOpen");
    hamburgerBtn.setAttribute("aria-label", currentLang === "de" ? "Menü öffnen" : "Open menu");
  releaseMapControlButton(hamburgerBtn);
  menuActiveSectionId = null;
}

function openArchivePanel() {
  if (!archiveOverlay || !archiveBtn) return;
  syncArchiveCompactLayout();
  renderArchiveList();
  if (archiveOverlay.classList.contains("open")) return;
  archiveOverlay.classList.add("open");
  archiveOverlay.setAttribute("aria-hidden", "false");
  archiveBtn.classList.add("archiveOpen");
  archiveBtn.setAttribute(
    "aria-label",
    currentLang === "de" ? "Archiv schließen" : "Close archive"
  );
}

function closeMarkerPopupIfOpen() {
  if (openMarkerPopup) {
    openMarkerPopup.remove();
    openMarkerPopup = null;
    openMarkerPopupId = null;
  }
}

function openArchiveWithCategoryFilter(categoryId) {
  archiveCategoryFilter = normalizeNoteCategory(categoryId);
  closeMarkerPopupIfOpen();
  closeMenu();
  openArchivePanel();
}

function openArchiveWithTagFilter(tagId) {
  archiveTagFilters.clear();
  archiveTagFilters.add(tagId);
  closeMarkerPopupIfOpen();
  closeMenu();
  openArchivePanel();
}

function isArchiveCompactLayout() {
  return typeof window !== "undefined" && window.matchMedia(ARCHIVE_COMPACT_MQ).matches;
}

function syncArchiveCompactLayout() {
  if (!archiveOverlay) return;
  const compact = isArchiveCompactLayout();
  archiveOverlay.classList.toggle("archiveOverlay--compact", compact);
  if (!compact) {
    archiveOverlay.classList.remove("archiveOverlay--detailOpen");
  }
  const backBtn = /** @type {HTMLButtonElement|null} */ ($("archiveDetailBack"));
  if (backBtn) {
    backBtn.hidden = !compact;
  }
}

function setArchiveDetailOpen(open) {
  if (!archiveOverlay || !isArchiveCompactLayout()) return;
  archiveOverlay.classList.toggle("archiveOverlay--detailOpen", open);
}

function closeArchiveDetailPanel() {
  if (!archiveOverlay?.classList.contains("archiveOverlay--detailOpen")) return;
  const pane = document.querySelector(".archivePane--detail");
  if (pane) {
    pane.style.transform = "";
    pane.classList.remove("archivePane--detail--dragging");
  }
  setArchiveDetailOpen(false);
}

function bindArchiveDetailSwipeBack() {
  const pane = document.querySelector(".archivePane--detail");
  if (!pane || pane.dataset.swipeBackBound === "1") return;
  pane.dataset.swipeBackBound = "1";
  let startX = 0;
  let startY = 0;
  let dragging = false;
  let active = false;

  pane.addEventListener(
    "touchstart",
    (e) => {
      if (!archiveOverlay?.classList.contains("archiveOverlay--detailOpen")) return;
      const scrollEl = pane.querySelector(".archiveDetail");
      if (scrollEl && scrollEl.scrollTop > 6) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      dragging = false;
      active = true;
    },
    { passive: true }
  );

  pane.addEventListener(
    "touchmove",
    (e) => {
      if (!active) return;
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      const dx = x - startX;
      const dy = y - startY;
      if (!dragging) {
        if (Math.abs(dx) < 10) return;
        if (Math.abs(dy) > Math.abs(dx)) {
          active = false;
    return;
  }
        dragging = true;
        pane.classList.add("archivePane--detail--dragging");
      }
      if (dx > 0) pane.style.transform = `translateX(${dx}px)`;
    },
    { passive: true }
  );

  const endDrag = (e) => {
    if (!active) return;
    active = false;
    if (!dragging) return;
    dragging = false;
    pane.classList.remove("archivePane--detail--dragging");
    const dx = e.changedTouches[0].clientX - startX;
    pane.style.transform = "";
    if (dx > 72) closeArchiveDetailPanel();
  };

  pane.addEventListener("touchend", endDrag);
  pane.addEventListener("touchcancel", endDrag);
}

function updateArchiveDetailBackLabel() {
  const label = document.querySelector(".archiveDetailBackLabel");
  const backBtn = /** @type {HTMLButtonElement|null} */ ($("archiveDetailBack"));
  if (!label || !backBtn) return;
  const text = currentLang === "de" ? "← Liste" : "← List";
  label.textContent = text;
  backBtn.setAttribute("aria-label", currentLang === "de" ? "Zurück zur Liste" : "Back to list");
}

function closeArchive() {
  if (!archiveOverlay || !archiveBtn) return;
  archiveOverlay.classList.remove("open", "archiveOverlay--detailOpen", "archiveOverlay--compact");
  archiveOverlay.setAttribute("aria-hidden", "true");
  archiveBtn.classList.remove("archiveOpen");
  archiveBtn.setAttribute("aria-label", currentLang === "de" ? "Archiv öffnen" : "Open archive");
  releaseMapControlButton(archiveBtn);
  selectedArchiveNoteId = null;
  archiveTagFilters.clear();
}

function archiveDetailLabels() {
  return currentLang === "de"
    ? {
        empty: "Eintrag wählen …",
        filterAll: "Alle",
        where: "Ort",
        when: "Zeit",
        category: "Kategorie",
        tags: "Tags",
        what: "Inhalt",
      }
    : {
        empty: "Select an entry …",
        filterAll: "All",
        where: "Where",
        when: "When",
        category: "Category",
        tags: "Tags",
        what: "What",
      };
}

function renderArchiveFilterBar() {
  const bar = $("archiveFilterBar");
  if (!bar) return;
  const labels = archiveDetailLabels();
  bar.replaceChildren();
  const makeBtn = (id, label) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "archiveFilterBtn";
    btn.textContent = label;
    btn.setAttribute("aria-pressed", archiveCategoryFilter === id ? "true" : "false");
    if (archiveCategoryFilter === id) btn.classList.add("archiveFilterBtn--active");
    btn.addEventListener("click", () => {
      if (id === null) {
        archiveCategoryFilter = null;
      } else {
        archiveCategoryFilter = archiveCategoryFilter === id ? null : id;
      }
      renderArchiveFilterBar();
      renderArchiveList();
    });
    return btn;
  };
  bar.appendChild(makeBtn(null, labels.filterAll));
  NOTE_CATEGORIES.forEach((cat) => {
    bar.appendChild(makeBtn(cat.id, currentLang === "en" ? cat.en : cat.de));
  });
}

function renderArchiveTagBar() {
  const bar = $("archiveTagBar");
  if (!bar) return;
  bar.replaceChildren();
  bar.setAttribute(
    "aria-label",
    currentLang === "de" ? "Nach Tags filtern" : "Filter by tag"
  );
  NOTE_TAGS.forEach((tag) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "archiveTagBtn";
    btn.textContent = currentLang === "en" ? tag.en : tag.de;
    const active = archiveTagFilters.has(tag.id);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
    if (active) btn.classList.add("archiveTagBtn--active");
    btn.addEventListener("click", () => {
      if (archiveTagFilters.has(tag.id)) archiveTagFilters.delete(tag.id);
      else archiveTagFilters.add(tag.id);
      renderArchiveTagBar();
      renderArchiveList();
    });
    bar.appendChild(btn);
  });
}

function showArchiveDetail(note) {
  const detail = $("archiveDetail");
  if (!detail) return;
  const labels = archiveDetailLabels();
  detail.replaceChildren();
  if (!note) {
    const empty = document.createElement("p");
    empty.className = "archiveDetailEmpty";
    empty.textContent = labels.empty;
    detail.appendChild(empty);
    return;
  }
  const meta = document.createElement("div");
  meta.className = "archiveDetailMeta";

  const appendDetailRow = (label, value, extraClass) => {
    const row = document.createElement("p");
    row.className = extraClass ? `archiveDetailRow ${extraClass}` : "archiveDetailRow";
    const labelEl = document.createElement("strong");
    labelEl.textContent = label;
    row.appendChild(labelEl);
    row.appendChild(document.createTextNode(value));
    meta.appendChild(row);
  };

  appendDetailRow(labels.category, getCategoryLabel(note.category));
  appendDetailRow(labels.tags, formatNoteTagsDisplay(note));
  appendDetailRow(labels.where, formatNotePlaceName(note));
  appendDetailRow(labels.when, formatNoteDate(note.createdAt) || "—", "archiveDetailRow--when");
  appendDetailRow(labels.what, note.note || "—");

  const imageWrap = document.createElement("div");
  imageWrap.className = "archiveDetailImageWrap";
  const viewport = document.createElement("div");
  viewport.className = "archiveDetailImageViewport inlineZoomViewport";
  const img = document.createElement("img");
  img.className = "archiveDetailImage";
  img.src = normalizeNoteImageUrl(note.imageUrl) || pickRandomArchiveImageUrl();
  img.alt = "";
  img.decoding = "async";
  bindImageFallback(img);
  viewport.appendChild(img);
  bindArchiveDetailImage(viewport, img);
  imageWrap.appendChild(viewport);
  detail.appendChild(imageWrap);
  detail.appendChild(meta);
}

function selectArchiveEntry(noteId, options = {}) {
  const openDetailPanel = options.openDetailPanel !== false;
  selectedArchiveNoteId = noteId;
  document.querySelectorAll(".archiveEntry").forEach((el) => {
    el.classList.toggle("archiveEntry--selected", el.getAttribute("data-note-id") === noteId);
  });
  const note = notes.find((n) => n.id === noteId);
  showArchiveDetail(note || null);
  if (isArchiveCompactLayout() && noteId && openDetailPanel) {
    setArchiveDetailOpen(true);
  }
}

function toggleMenu() {
  if (!menuOverlay || !hamburgerBtn) return;
  if (menuOverlay.classList.contains("open")) {
    closeMenu();
    return;
  }
  closeArchive();
  renderMenuFilterBar();
  menuOverlay.classList.add("open");
  menuOverlay.setAttribute("aria-hidden", "false");
  hamburgerBtn.classList.add("menuOpen");
  hamburgerBtn.setAttribute("aria-label", currentLang === "de" ? "Menü schließen" : "Close menu");
}

function renderArchiveList() {
  renderArchiveFilterBar();
  renderArchiveTagBar();
  const list = $("archiveList");
  if (!list) return;
  list.replaceChildren();
  let filtered = notes;
  if (archiveCategoryFilter) {
    filtered = filtered.filter((n) => normalizeNoteCategory(n.category) === archiveCategoryFilter);
  }
  if (archiveTagFilters.size > 0) {
    filtered = filtered.filter((n) => {
      const tags = normalizeNoteTags(n.tags);
      for (const tagId of archiveTagFilters) {
        if (tags.includes(tagId)) return true;
      }
      return false;
    });
  }
  const sorted = [...filtered].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  if (!sorted.length) {
    selectedArchiveNoteId = null;
    showArchiveDetail(null);
    const empty = document.createElement("p");
    empty.className = "archiveListEmpty";
    const hasFilter = archiveCategoryFilter || archiveTagFilters.size > 0;
    empty.textContent =
      hasFilter && notes.length
        ? currentLang === "de"
          ? "Keine Einträge für diese Filter."
          : "No entries for these filters."
        : currentLang === "de"
          ? "Noch keine Einträge."
          : "No entries yet.";
    list.appendChild(empty);
    showArchiveDetail(null);
    return;
  }
  let selectId = selectedArchiveNoteId;
  if (!selectId || !sorted.some((n) => n.id === selectId)) {
    selectId = sorted[0].id;
  }
  sorted.forEach((note) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "archiveEntry";
    row.setAttribute("role", "listitem");
    row.setAttribute("data-note-id", note.id);

    const img = document.createElement("img");
    img.className = "archiveEntryImage";
    img.src = normalizeNoteImageUrl(note.imageUrl) || pickRandomArchiveImageUrl();
    img.alt = "";
    img.loading = "lazy";
    bindImageFallback(img);
    row.appendChild(img);

    const what = document.createElement("span");
    what.className = "archiveEntryWhat";
    what.textContent = note.note || "—";
    row.appendChild(what);

    const category = document.createElement("span");
    category.className = "archiveEntryCategory";
    category.textContent = getCategoryLabel(note.category);
    row.appendChild(category);

    const when = document.createElement("span");
    when.className = "archiveEntryWhen";
    when.textContent = formatNoteDate(note.createdAt) || "—";
    row.appendChild(when);

    const where = document.createElement("span");
    where.className = "archiveEntryWhere";
    where.textContent = formatNotePlaceName(note);
    row.appendChild(where);

    row.addEventListener("click", () => selectArchiveEntry(note.id));
    list.appendChild(row);
  });
  if (isArchiveCompactLayout()) {
    const note = sorted.find((n) => n.id === selectId);
    selectedArchiveNoteId = selectId;
    document.querySelectorAll(".archiveEntry").forEach((el) => {
      el.classList.toggle("archiveEntry--selected", el.getAttribute("data-note-id") === selectId);
    });
    showArchiveDetail(note || null);
    setArchiveDetailOpen(false);
      } else {
    selectArchiveEntry(selectId);
  }
}

function toggleArchive() {
  if (!archiveOverlay || !archiveBtn) return;
  if (archiveOverlay.classList.contains("open")) {
    closeArchive();
    return;
  }
  closeMenu();
  syncArchiveCompactLayout();
  renderArchiveList();
  archiveOverlay.classList.add("open");
  archiveOverlay.setAttribute("aria-hidden", "false");
  archiveBtn.classList.add("archiveOpen");
  archiveBtn.setAttribute("aria-label", currentLang === "de" ? "Archiv schließen" : "Close archive");
}

function initApp() {
  window.__RECHTS_APP_STARTED = true;
  if (window.__RECHTS_BOOT_TIMER) {
    clearTimeout(window.__RECHTS_BOOT_TIMER);
  }

  hamburgerBtn = /** @type {HTMLButtonElement|null} */ ($("hamburgerBtn"));
  archiveBtn = /** @type {HTMLButtonElement|null} */ ($("archiveBtn"));
  menuOverlay = $("menuOverlay");
  archiveOverlay = $("archiveOverlay");

  const brandHomeBtn = /** @type {HTMLButtonElement|null} */ ($("brandHomeBtn"));
  if (brandHomeBtn) {
    brandHomeBtn.addEventListener("click", () => {
      goToFrontPage();
      releaseMapControlButton(brandHomeBtn);
    });
  }

  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === "en" || saved === "de") {
      setLanguage(saved);
    } else {
      const browser = (navigator.languages && navigator.languages[0] ? navigator.languages[0] : navigator.language || navigator.userLanguage || "").toLowerCase();
      setLanguage(browser.startsWith("en") ? "en" : "de");
    }
  } catch (_) {
    setLanguage("de");
  }

  window.addEventListener("error", (ev) => {
    if (ev && typeof ev.message === "string" && ev.message) {
      setStatus(`Error: ${ev.message}`);
    }
  });
  window.addEventListener("unhandledrejection", (ev) => {
    const reason = ev && "reason" in ev ? ev.reason : null;
    const msg =
      reason instanceof Error
        ? reason.message
        : typeof reason === "string"
          ? reason
          : null;
    if (msg) setStatus(`Error: ${msg}`);
  });

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", () => {
      toggleMenu();
      if (!menuOverlay?.classList.contains("open")) {
        releaseMapControlButton(hamburgerBtn);
      }
    });
  }
  if (archiveBtn) {
    archiveBtn.addEventListener("click", () => {
      toggleArchive();
      if (!archiveOverlay?.classList.contains("open")) {
        releaseMapControlButton(archiveBtn);
      }
    });
  }
  const archiveDetailBack = /** @type {HTMLButtonElement|null} */ ($("archiveDetailBack"));
  if (archiveDetailBack) {
    archiveDetailBack.addEventListener("click", closeArchiveDetailPanel);
  }
  bindArchiveDetailSwipeBack();
  updateArchiveDetailBackLabel();
  syncArchiveCompactLayout();
  window.addEventListener("resize", syncArchiveCompactLayout);
  window.addEventListener("orientationchange", () => {
    setTimeout(syncArchiveCompactLayout, 100);
  });
  initImageLightbox();
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (closeImageLightbox()) return;
      closeAddNotePopup();
      if (menuOverlay?.classList.contains("open")) closeMenu();
      if (
        archiveOverlay?.classList.contains("open") &&
        archiveOverlay.classList.contains("archiveOverlay--detailOpen")
      ) {
        closeArchiveDetailPanel();
      } else if (archiveOverlay?.classList.contains("open")) {
        closeArchive();
      }
    }
  });

  // Preload SVG files, then initialize map
  const bootMap = async () => {
    hydrateNotesFromStorage();
    try {
      await ensureLeipzigBoundaryData();
    } catch (err) {
      console.warn("Leipzig boundary data not preloaded:", err);
    }
    initMap();
  };
  loadSvgFiles().then(bootMap).catch(() => {
    console.warn("SVG files not loaded, using embedded fallbacks");
    bootMap();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
