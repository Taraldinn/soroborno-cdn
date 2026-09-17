# Contributing to Soroborno Fonts

Thank you for contributing to the **Soroborno** Bangla font ecosystem! Our goal is to make contributing fonts as effortless as possible.

---

## ⚡ Quick Start (Under 5 Minutes)

You do **not** need to convert fonts to WOFF2, generate CSS, edit JSON files, or write code. The **Soroborno Engine** automates all of that upon merge.

All you need to submit is:

```text
fonts/<font-id>/
├── <font-name>.ttf (or .otf)
├── LICENSE.txt (or OFL.txt)
└── _index.md (optional metadata and bio)
```

### Steps:
1. Fork `https://github.com/Taraldinn/soroborno-cdn`.
2. Create a folder under `fonts/` using a **kebab-case** name (e.g., `fonts/my-bangla-font/`).
3. Add your TrueType (`.ttf`) or OpenType (`.otf`) file(s).
4. Add your license file (`LICENSE.txt` or `OFL.txt`).
5. Open a Pull Request.

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
name: "My Bangla Font"
designer: "Designer Name"
license: "SIL Open Font License 1.1"
category: "sans-serif"
description: "A clean and modern Bangla typeface designed for high screen legibility."
---

# My Bangla Font

Additional details about the typeface, glyph design, and history.
```
