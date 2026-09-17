# Soroborno Ecosystem — Architectural Design Specification

- **Date:** 2026-09-17
- **Author:** Antigravity Architect & Senior Open-Source Engineer
- **Project:** Soroborno Ecosystem
- **Font Repository:** `Taraldinn/soroborno-cdn`
- **Engine Repository:** `Taraldinn/soroborno-engine`

---

## 1. Problem Statement & Motivation

Soroborno was initially created as a single-repository Next.js web application (`webfont-cdn`) that also hosts font files under `fonts/`. Over time:
- Contributors are expected to provide font files, but the directory structure has grown inconsistent (mixing camelCase, PascalCase, uppercase, and spaces).
- Over 20 folders contain manually created `font.css` files, several of which reference non-existent `.woff2` files (e.g., `solaimanlipi-bold-v1.0.woff2`).
- Font weights and styles are guessed using simple regex/string searches in filenames (e.g., checking if string includes `'bold'`), which fails on diverse OpenType naming conventions.
- Fonts are not compressed into modern web formats (WOFF2/WOFF), forcing web users to load large uncompressed TTF binaries (some over 2MB each).
- Frontend developers across the Bangla web ecosystem have no official npm packages or framework integrations (React, Next.js, Vue, Nuxt, Vite, Astro, Svelte) to easily install and use these fonts.

To solve this, Soroborno is transitioning to a **Dual-Repository Architecture**:
1. **Font Repository (`soroborno-cdn`)**: Asset-only source of truth. Lightweight, zero build dependencies, beginner-friendly contributor workflow.
2. **Engine Repository (`soroborno-engine`)**: TypeScript monorepo containing the processing engine, font inspection & conversion tools, metadata generation, and framework packages.

---

## 2. In-Depth Current Repository Audit

| Metric / Item | Existing State | Issues / Required Changes |
| :--- | :--- | :--- |
| **Total Font Folders** | 39 folders in `fonts/` | Inconsistent naming: `Bornomala Vintage`, `Kohinoor Bangla`, `Nirlipta Lite`, `Osman Hadi`, `Potro Sans Bangla`, `FN Masud Chowa`, `Google_Sans`, `Tiro_Bangla`, `DROHO`, etc. |
| **Font Binaries** | 120 `.ttf`, 19 `.otf`, 1 `.woff`, 3 `.woff2` | Need automated conversion of all TTF/OTF into WOFF2 (Brotli) and WOFF. |
| **Duplicates** | `Tiro_Bangla` and `tiro-bangla` | Identical binaries present in both folders. Must unify under normalized `tiro-bangla` with backwards-compatible alias. |
| **Junk / OS Artifacts** | `__MACOSX`, `.DS_Store`, specimen `.pdf` | Found in `Nirlipta Lite`, `Osman Hadi`, `Boshonto`, `Chilekotha`, `Purno`, `Sorob`. Need clean-up and `.gitignore` updates. |
| **Metadata** | 39 `_index.md` files | Parsed using custom regex in `scripts/build-fonts.mjs`. Needs formal JSON Schema and OpenType table validation. |
| **CSS Generation** | Naive string interpolation in `scripts/build-fonts.mjs` + 20 manual `font.css` | 20 manual `font.css` files should be removed from the font repo; CSS should be generated automatically by the engine. |
| **CDN Usage** | `https://cdn.jsdelivr.net/gh/Taraldinn/soroborno-cdn@main/public/fonts/{slug}/font.css` | Must preserve backward compatibility while enabling versioned or modern paths. |
| **Showcase App** | Next.js 16 app in `src/app` | Serves library and playground. Can be cleanly separated into an app package within the monorepo or hosted via engine. |

---

## 3. Dual-Repository Design

### 3.1 Repository 1: Font Repository (`soroborno-cdn`)
**Guiding Principle:** Minimalist, asset-only, contributor-friendly.

```text
soroborno-cdn/
├── fonts/
│   ├── solaiman-lipi/
│   │   ├── SolaimanLipi-Regular.ttf
│   │   ├── SolaimanLipi-Bold.ttf
│   │   ├── LICENSE.txt
│   │   └── _index.md (optional metadata)
│   └── <font-slug>/
│       ├── <font>.ttf
│       └── LICENSE.txt
├── .github/
│   └── workflows/
│       ├── validate-pr.yml      # Verifies font files & license on PR
│       └── notify-engine.yml    # Dispatches webhook to engine on main merge
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

#### Contributor Experience
A contributor only needs to:
1. Create `fonts/<kebab-case-slug>/`
2. Drop `.ttf` or `.otf` file(s)
3. Drop `LICENSE.txt` or `OFL.txt`
4. Optionally provide `_index.md` for designer bio / notes.

They never write CSS, never convert fonts, and never edit package code.

### 3.2 Repository 2: Engine Monorepo (`soroborno-engine`)
**Guiding Principle:** Type-safe, modular, automated, reproducible.

```text
soroborno-engine/
├── packages/
│   ├── core/                  # @soroborno/core
│   │   ├── src/
│   │   │   ├── lookup.ts      # getFont, listFonts, getFontFamily
│   │   │   ├── cdn.ts         # getFontUrl, resolveCdnUrl
│   │   │   ├── css.ts         # getFontCss, generateFontFaceRule
│   │   │   └── types.ts       # Font, FontFile, Weight, Style
│   │   └── package.json
│   │
│   ├── fonts/                 # @soroborno/fonts
│   │   ├── src/
│   │   │   ├── index.ts       # Export all fonts as typed objects
│   │   │   └── generated/     # Generated from font pipeline
│   │   └── package.json
│   │
│   ├── css/                   # @soroborno/css
│   │   ├── dist/              # Generated static CSS files
│   │   └── src/index.ts
│   │
│   ├── react/                 # @soroborno/react
│   │   ├── src/
│   │   │   ├── useFont.ts     # React hook for dynamic font loading
│   │   │   └── FontLoader.tsx # React component for font injection
│   │   └── package.json
│   │
│   ├── vue/                   # @soroborno/vue
│   │   ├── src/
│   │   │   └── useFont.ts     # Vue 3 composable
│   │   └── package.json
│   │
│   ├── next/                  # @soroborno/next
│   │   ├── src/
│   │   │   └── fontLoader.ts  # Next.js font integration (similar to next/font)
│   │   └── package.json
│   │
│   ├── nuxt/                  # @soroborno/nuxt
│   │   ├── src/module.ts      # Nuxt 3 module with automatic CSS injection
│   │   └── package.json
│   │
│   ├── vite/                  # @soroborno/vite
│   │   ├── src/plugin.ts      # Vite plugin for font bundling & preload
│   │   └── package.json
│   │
│   ├── svelte/                # @soroborno/svelte
│   └── astro/                 # @soroborno/astro
│
├── engine/                    # The processing pipeline
│   ├── discovery/             # File scanner, path normalizer, alias resolver
│   ├── validation/            # Binary header check, license validator, unicode check
│   ├── inspection/            # OpenType table parser (opentype.js / fontkit)
│   ├── conversion/            # TTF -> WOFF & WOFF2 (wawoff2 WASM)
│   ├── metadata/              # Normalized JSON generator & schema validator
│   ├── css/                   # @font-face generator
│   └── pipeline/              # CLI orchestrator
│
├── scripts/
│   ├── sync-fonts.ts          # Pulls or links font repository
│   └── build-all.ts           # Runs pipeline and compiles all packages
│
├── .github/workflows/
│   ├── engine-ci.yml          # Tests & lint
│   ├── sync-and-build.yml     # Ingests font repo update, processes, commits/deploys
│   └── release.yml            # Changesets release to npm
│
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

---

## 4. Font Processing Engine Mechanics

### Step 1: Ingestion & Discovery
- Reads the font repository (either checked out via CI or configured as local path).
- Ignores junk files (`__MACOSX`, `.DS_Store`, `.git`, temporary files).
- Extracts folder names, normalizes them into kebab-case font IDs, and maps any legacy aliases (e.g. `"Bornomala Vintage"` -> `"bornomala-vintage"`).

### Step 2: Validation
- **Binary Integrity:** Checks first 4 bytes (`0x00010000` or `true` for TrueType, `OTTO` for OpenType).
- **License Compliance:** Requires presence of `LICENSE`, `LICENSE.txt`, `OFL.txt`, or license declarations in `_index.md`. Verifies allowable open-source license (OFL-1.1, Apache-2.0, MIT, GPL+FE).
- **Bangla Glyph Coverage:** Verifies font covers core Bengali Unicode range (`U+0980` - `U+09FF`), specifically checking key Bengali letters (`অ`, `আ`, `ক`, `খ`, etc.) in the `cmap` table.

### Step 3: OpenType Binary Inspection
Uses binary table parsing rather than naive filename regex:
- **Family & Subfamily:** Extracted from `name` table (IDs 1, 2, 16, 17).
- **Weight Class:** Extracted from `OS/2.usWeightClass` (100 to 900).
- **Style:** Extracted from `OS/2.fsSelection` (italic bit) and `head.macStyle`.
- **Typographic Version:** Extracted from `head.fontRevision` or `name` table ID 5.
- **Copyright & Designer:** Extracted from `name` table IDs 0, 8, 9, 13.

### Step 4: Font Conversion
- Uses `wawoff2` (WebAssembly build of Google's Brotli/WOFF2 encoder) for deterministic, high-compression `.woff2` generation.
- Uses `ttf2woff` for legacy `.woff` support.
- Stores output in the engine distribution directory with consistent naming:
  `{font-id}-{weight}-{style}.woff2` (e.g., `solaiman-lipi-400-normal.woff2`).

### Step 5: Metadata Normalization
Outputs normalized schema per font:
```json
{
  "id": "solaiman-lipi",
  "family": "SolaimanLipi",
  "displayName": "SolaimanLipi",
  "category": "sans-serif",
  "weights": [100, 400, 700],
  "styles": ["normal"],
  "subsets": ["bengali", "latin"],
  "designer": "Solaiman Karim",
  "version": "2.002",
  "license": {
    "name": "SIL OFL 1.1",
    "url": "https://scripts.sil.org/OFL"
  },
  "variants": [
    {
      "weight": 400,
      "style": "normal",
      "files": {
        "woff2": "solaiman-lipi-400-normal.woff2",
        "woff": "solaiman-lipi-400-normal.woff",
        "ttf": "solaimanlipi-normal-v1.0.ttf"
      }
    }
  ]
}
```

### Step 6: CSS Generation
Generates optimal CSS declarations:
```css
@font-face {
  font-family: 'SolaimanLipi';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('./solaiman-lipi-400-normal.woff2') format('woff2'),
       url('./solaiman-lipi-400-normal.woff') format('woff'),
       url('./solaimanlipi-normal-v1.0.ttf') format('truetype');
}
```

---

## 5. Framework Packages & API Design

### 5.1 `@soroborno/core`
Zero external dependencies. Runtime utilities for querying fonts and generating URLs:
```ts
import { getFont, getFontCss, getFontUrl, listFonts } from "@soroborno/core";

// Lookup
const font = getFont("solaiman-lipi");

// CDN URL
const url = getFontUrl("solaiman-lipi", { weight: 400, format: "woff2" });

// CSS declaration
const css = getFontCss("solaiman-lipi", { weights: [400, 700] });
```

### 5.2 `@soroborno/react`
Lightweight React hooks and components:
```tsx
import { useFont, FontLoader } from "@soroborno/react";

export function Article() {
  const font = useFont("solaiman-lipi", { weights: [400, 700] });
  return (
    <article className={font.className}>
      <h1>আমার সোনার বাংলা</h1>
    </article>
  );
}
```

### 5.3 `@soroborno/vue`
Vue 3 composable:
```vue
<script setup>
import { useFont } from "@soroborno/vue";
const font = useFont("solaiman-lipi");
</script>

<template>
  <div :class="font.className">
    আমি তোমায় ভালোবাসি
  </div>
</template>
```

### 5.4 `@soroborno/next`
Next.js server/client font loader compatible with Next.js App Router:
```tsx
import { SolaimanLipi } from "@soroborno/next";

const solaiman = SolaimanLipi({
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-solaiman"
});

export default function RootLayout({ children }) {
  return <html className={solaiman.variable}><body>{children}</body></html>;
}
```

### 5.5 `@soroborno/nuxt`
Nuxt 3 module with zero-config font loading:
```ts
export default defineNuxtConfig({
  modules: ["@soroborno/nuxt"],
  soroborno: {
    fonts: ["solaiman-lipi", "kalpurush"]
  }
});
```

---

## 6. Migration Plan for `soroborno-cdn`

1. **Clean up `soroborno-cdn` Font Directories:**
   - Remove `__MACOSX`, `.DS_Store`, and extraneous specimen PDFs into an optional docs folder.
   - Remove manual `font.css` files from individual font directories (the engine will generate these).
   - Normalize folder names to kebab-case, preserving backward-compatibility aliases:
     - `Bornomala Vintage` -> `bornomala-vintage`
     - `Google_Sans` -> `google-sans`
     - Merge `Tiro_Bangla` into `tiro-bangla`
2. **Setup PR Validation Workflow in `soroborno-cdn`:**
   - Install `.github/workflows/validate.yml` that runs a lightweight Node check on PRs.
3. **Repository Dispatch:**
   - On merge to `main`, dispatch notification to `soroborno-engine` to trigger the automated build and release.
4. **Backward-Compatibility CDN Hosting:**
   - Ensure the engine outputs generated `public/fonts/{slug}/font.css` and font assets to maintain 100% compatibility with existing jsDelivr CDN consumers.
