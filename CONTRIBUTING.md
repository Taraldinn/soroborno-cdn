# Contributing to Soroborno Fonts

Thank you for contributing to the **Soroborno** Bangla font ecosystem! Our mission is to preserve, distribute, and standardize open-source Bangla typography for the modern web.

---

## ⚡ Simplified Contributor Experience

You do **NOT** need to:
* Convert fonts to WOFF or WOFF2
* Manually write CSS files (`font.css`)
* Write TypeScript definitions or edit package files
* Generate CDN URLs or manifests

All repetitive tasks are fully automated by the **Soroborno Engine** upon merge.

---

## 📁 Repository Structure

Each font resides in its own folder under `fonts/`:

```text
fonts/
└── <font-name>/
    ├── <font-name>.ttf (or .otf)
    ├── LICENSE.txt (or OFL.txt)
    └── _index.md (optional metadata and bio)
```

Folder names must be **lowercase and kebab-cased** (hyphen-separated), for example:
* `solaiman-lipi`
* `kalpurush`
* `bornomala-vintage`
* `potro-sans-bangla`

---

## 📜 Licensing Requirements

Soroborno strictly distributes only fonts with permissive open-source licenses:
* **SIL Open Font License 1.1 (OFL-1.1)** *(preferred)*
* **Apache License 2.0**
* **GNU GPL with Font Exception**
* **MIT License**

> ⚠️ **Notice:** Proprietary, pirated, or non-commercial-only fonts are strictly prohibited and will be rejected.

---

## 📝 Optional Metadata (`_index.md`)

If you wish to provide font designer credits, category, or notes, include an `_index.md` in your font folder:

```markdown
---
name: "SolaimanLipi"
designer: "Solaiman Karim"
license: "SIL Open Font License 1.1"
category: "sans-serif"
description: "A popular clean Bengali sans-serif typeface designed for high legibility on screens."
---

# SolaimanLipi

SolaimanLipi is one of the most widely used Bengali fonts on the web...
```

---

## 🚀 Submission Workflow

1. Fork this repository: `Taraldinn/soroborno-cdn`
2. Create a branch: `git checkout -b font/my-font-name`
3. Add your font folder under `fonts/<my-font-name>/` with font files, license, and optional `_index.md`.
4. Commit and push:
   ```bash
   git add fonts/<my-font-name>
   git commit -m "feat(fonts): add my-font-name"
   git push origin font/my-font-name
   ```
5. Open a Pull Request on GitHub. Automated validation checks will verify:
   - Valid TrueType/OpenType binary format
   - Presence of license file
   - Proper folder structure
6. Once merged to `main`, the Soroborno Engine will automatically convert your font to WOFF2, generate optimized CSS declarations, and publish it across npm packages and the CDN.
