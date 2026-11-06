# PULP FUSION

A tiny fruit puzzle about greed. Drop fruit, fuse twins, press the harvest —
and never let the crate crest the DO NOT CROSS line.

**A product of Ahzab Lab.** Installable as a PWA. Runs fully offline.

---

## Files

| File | What it is |
|---|---|
| `index.html` | The homepage — hero, PLAY ORIGINAL, best-score plaque, version shelf |
| `pulp-fusion.html` | The game. Single file, zero dependencies |
| `manifest.webmanifest` | PWA identity (name, colors, icons, standalone display) |
| `sw.js` | Service worker — cache-first shell, offline support |
| `icons/` | App icon (192 / 512 / source master) |
| `server.js` | Tiny Node static server for local testing (`node server.js`) |

## Deploying to GitHub Pages

All asset references are **relative** (`./sw.js`, `./index.html`, …), so the
folder works at ANY path — repo root or a subfolder, no config changes needed.

1. Create a repo on GitHub (any name, e.g. `pulp-fusion`)
2. Push this folder's contents to the repo default branch (`main`)
3. Repo → **Settings → Pages** → Source: *Deploy from a branch* → `/ (root)` → *main*
4. Wait ~1 minute, then open `https://<you>.github.io/pulp-fusion/`

### Installing

- **Desktop Chrome/Edge:** visit the URL → click the ⤓ INSTALL APP pill on the
  homepage (or the install icon in the address bar)
- **Android Chrome:** visit → ⤓ INSTALL APP pill / three-dot menu → *Add to Home screen*
- **iOS Safari:** Share → *Add to Home Screen* (Safari uses the apple touch-icon
  path rather than the Chrome prompt, but the result opens standalone + works offline)

## Updating later — don't skip this

The service worker caches everything in cache name `pulp-fusion-v1`.
Whenever you change `index.html` or `pulp-fusion.html`, **bump the version**
in `sw.js` so installed users get the new build on their next visit:

```js
const CACHE = 'pulp-fusion-v1';   //  →  'pulp-fusion-v2', etc.
```

## Adding future game versions

Each new version = one HTML file + one line in the version registry inside
`index.html` (see the comment in the script — `VERSIONS = [...]`).
The ORIGINAL stays pinned and playable forever; newer versions slot in beside
it with their own best-score readouts.

---

*Say 'crushed' one more time.*
