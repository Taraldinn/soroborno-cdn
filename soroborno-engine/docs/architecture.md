# Soroborno Ecosystem — Architecture Guide

## Overview

The **Soroborno Ecosystem** is built around a **Dual-Repository Architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                 Taraldinn/soroborno-cdn                     │
│                     (Font Repository)                       │
│                                                             │
│   • fonts/<font-id>/                                        │
│       ├── <font-file>.ttf / .otf                            │
│       ├── LICENSE.txt / OFL.txt                             │
│       └── _index.md (optional metadata)                     │
│   • PR validation action                                    │
│   • Dispatches `font-repo-updated` event on merge to main   │
└──────────────────────────────┬──────────────────────────────┘
                               │
               repository_dispatch webhook
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               Taraldinn/soroborno-engine                    │
│                     (Engine Monorepo)                       │
│                                                             │
│   • Discovery: scans font repository and resolves aliases   │
│   • Validation: verifies binary headers, licenses, unicode  │
│   • Inspection: OpenType table parsing (opentype.js)        │
│   • Conversion: high-performance WOFF2 compression (wawoff2)│
│   • Metadata & CSS: JSON Schema & @font-face generation     │
│   • Packages: @shoroborno/core, @shoroborno/fonts, CSS,       │
│     React, Vue, Next.js, Nuxt, Vite, Svelte, Astro          │
│   • Publishing: Changesets automated releases               │
└─────────────────────────────────────────────────────────────┘
```

## Packages in the Monorepo

| Package | Role | Key APIs / Exports |
| :--- | :--- | :--- |
| **`@shoroborno/core`** | Zero-dependency core logic | `getFont()`, `getFontUrl()`, `getFontCss()`, `listFonts()` |
| **`@shoroborno/fonts`** | Generated typed font definitions | `fonts`, `fontMap`, individual fonts (`solaimanLipi`, `kalpurush`, etc.) |
| **`@shoroborno/css`** | CSS utilities and static links | `createHtmlLinkTag()`, `createCssImportRule()`, `createFontFamilyRule()` |
| **`@shoroborno/react`** | React hooks and components | `useFont()`, `<FontLoader />` |
| **`@shoroborno/vue`** | Vue 3 composables | `useFont()` |
| **`@shoroborno/next`** | Next.js App & Pages Router font loader | `SolaimanLipi()`, `sorobornoFont()` |
| **`@shoroborno/nuxt`** | Nuxt 3 module | `defineSorobornoNuxtModule()` |
| **`@shoroborno/vite`** | Vite plugin | `sorobornoPlugin()` |
| **`@shoroborno/svelte`**| Svelte action & SvelteKit integration | `use:sorobornoFont` |
| **`@shoroborno/astro`** | Astro build integration | `sorobornoAstro()` |

## Font Pipeline Steps

1. **Discovery (`engine/discovery`)**: Finds fonts, ignores system junk (`__MACOSX`, `.DS_Store`), maps backward-compatible aliases.
2. **Validation (`engine/validation`)**: Validates TrueType/OpenType magic bytes, license presence, and Bengali Unicode glyph range (`U+0980..U+09FF`).
3. **Inspection (`engine/inspection`)**: Reads OpenType `OS/2`, `head`, `name`, and `cmap` tables for exact weight classes (100-900), styles (normal, italic), version, and designer metadata.
4. **Conversion (`engine/conversion`)**: Converts TTF/OTF to WOFF2 using Google's Brotli compressor via `wawoff2`.
5. **Metadata Normalization (`engine/metadata`)**: Generates strongly-typed JSON catalogs.
6. **CSS Generation (`engine/css`)**: Generates optimized `@font-face` rules with `font-display: swap`.
