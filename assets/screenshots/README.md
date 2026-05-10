# Screenshot assets & rotation

This folder holds WebP screenshots for the homepage hero and gallery. **Rotation is not automatic from the filesystem** — read the sections below before adding or renaming files.

---

## How rotation works (architecture)

- **Source of truth:** `screenshotGroups` in **`js/main.js`**. Each key (`home`, `room`, `gameplay`, `other`) is an **ordered array of image URLs** (paths like `./assets/screenshots/home/1.webp`).
- **No folder auto-scan:** Dropping a file into `assets/screenshots/home/` does **nothing** until that URL appears in the matching array in `main.js`. The site does not discover or glob folders.
- **Flexible count:** There is **no hardcoded maximum** number of images per group. Rotation uses `array.length` only — 2, 5, 10+ URLs are all fine.
- **Two DOM layers per device:** In `index.html`, each rotating phone has **exactly two** `<img class="screenshot-rotator__layer">` inside `.screenshot-rotator__screen`. Those two elements **crossfade**; the script swaps `src` on the hidden layer and toggles visibility. **You do not add extra `<img>` tags** for extra screenshots — only more entries in `screenshotGroups`.
- **Invalid paths:** A bad URL shows a broken frame for that step; the interval keeps running (no hard crash of the whole rotator). Fix the path or add the missing file.

---

## Folder layout (convention only)

```
assets/screenshots/
  home/
  room/
  gameplay/
  other/
```

Folder names are **organizational**; the script only cares about **paths listed in `screenshotGroups`** and **`data-screenshot-group`** on each figure in `index.html`. Naming folders differently would require updating those references yourself.

### Where each folder appears on the site

| Folder       | Homepage role |
| ------------ | ------------- |
| `home/`      | Hero phone **and** first “See how ChessTalk feels in use” device (two rotators, same `home` group). |
| `room/`      | Second gallery device (invites / room). |
| `gameplay/`  | Third gallery device (live play). |
| `other/`     | Fourth gallery device (captioned “Settings” in the UI). |

Gallery order: **Home → Room → Gameplay → Settings**.

---

## Maintainer workflow: add, remove, or reorder shots

1. Add or replace **`.webp`** files under the correct subfolder (keep paths predictable).
2. Update **`screenshotGroups`** in **`js/main.js`**: list **every** image URL for that group, in **rotation order**. Remove URLs you no longer use.
3. Optionally align the **initial** `src` on the two `<img class="screenshot-rotator__layer">` blocks for that figure in **`index.html`** with the first two URLs so the first paint matches before JS runs.
4. Deploy paths are **case-sensitive** on Linux / GitHub Pages — use the same casing as files on disk (e.g. `home`, not `Home`).

**Do not** remove one of the two layer `<img>` elements — rotation expects at least two layers per rotator.

---

## Naming conventions

- **No special filename pattern** is required by code — any valid relative URL in the array works.
- **Recommended:** simple numeric names (`1.webp`, `2.webp`, …) and **lowercase** folder names so URLs stay consistent across Windows dev and Linux hosting.

---

## Image format

Prefer **WebP** for size. The CSS frame targets a **1080 × 2273** style portrait; matching that aspect avoids awkward letterboxing inside the phone inset.

---

## Reduced motion

If the visitor has **`prefers-reduced-motion: reduce`**, auto-rotation is turned off and only the **first** image in each group’s array is shown (second layer may be removed by the script).

---

## Troubleshooting (missing or wrong screenshots)

| Symptom | Likely cause |
| ------- | ------------ |
| New file in a folder never appears | **Not listed** in `screenshotGroups` — add the URL to `main.js`. |
| One frame in the cycle is broken / empty | **404 or corrupt file** — typo, wrong extension, missing file, or path/case mismatch vs production (Linux). |
| Only two images ever show but three exist on disk | **Array only has two entries** — add the third URL to `screenshotGroups`. |
| Rotation stops entirely for one phone | Rare: check browser console; often **fewer than two** `.screenshot-rotator__layer` elements in HTML for that figure. |

---

## Quick reference

| Question | Answer |
| -------- | ------ |
| Where do I list images? | `screenshotGroups` in **`js/main.js`**. |
| Max images per group? | None (array length). |
| How many `<img>` layers per rotator? | Always **two** (`screenshot-rotator__layer`). |
| Does the folder alone register new shots? | **No** — update the array. |
