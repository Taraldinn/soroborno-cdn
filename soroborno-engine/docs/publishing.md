# Publishing Guide for Soroborno Ecosystem

This guide covers how to publish both **npm packages** and **CDN font distribution assets**.

---

## 1. Publishing npm Packages

The monorepo publishes the following packages under the `@soroborno` scope:
- `@soroborno/core`
- `@soroborno/fonts`
- `@soroborno/css`
- `@soroborno/react`
- `@soroborno/vue`
- `@soroborno/next`
- `@soroborno/nuxt`
- `@soroborno/vite`
- `@soroborno/svelte`
- `@soroborno/astro`

---

### Method A: Manual Publishing (CLI)

#### 1. Prerequisites
Ensure you have created the `@soroborno` organization or scope on npm ([npmjs.com](https://www.npmjs.com/)), and log in via terminal:

```bash
npm login
```

#### 2. Run Engine & Build
Ensure all font conversions and package builds are up to date:

```bash
cd soroborno-engine

# 1. Process fonts (converts TTF -> WOFF2, updates metadata & CSS)
pnpm run engine:process

# 2. Compile TypeScript across all packages
pnpm run build

# 3. Verify tests pass
pnpm test
```

#### 3. Publish to npm
Publish all packages in the workspace under public access:

```bash
pnpm run publish:packages
```
*(Or with dry run first: `pnpm -r publish --access public --dry-run`)*

---

### Method B: Automated Publishing via GitHub Actions

The repository includes [release.yml](../.github/workflows/release.yml) configured with **Changesets**.

1. **Add Secrets in GitHub:**
   - Go to your repository settings on GitHub: `Settings` $\rightarrow$ `Secrets and variables` $\rightarrow$ `Actions`.
   - Add secret `NPM_TOKEN` with an **Automation** token generated from [npmjs.com/settings/tokens](https://www.npmjs.com/settings/tokens).
2. **Version Bump:**
   When making package updates, record a changeset:
   ```bash
   pnpm changeset
   ```
3. **Merge to `main`:**
   When merged into the `main` branch, the GitHub Action automatically creates a release PR or publishes new versions directly to npm.

---

## 2. Publishing Font CDN Assets (jsDelivr)

External websites and projects consume prebuilt stylesheets and font files directly via **jsDelivr**:

```text
https://cdn.jsdelivr.net/gh/Taraldinn/soroborno-cdn@main/public/fonts/<font-id>/font.css
```

### How to update CDN assets:
1. Run the engine to populate `public/fonts`:
   ```bash
   cd soroborno-engine
   pnpm run engine:process
   ```
2. Commit and push the generated files in `public/fonts/`:
   ```bash
   git add public/fonts/
   git commit -m "chore(cdn): update optimized WOFF2 and CSS assets"
   git push origin main
   ```
3. **jsDelivr Purge (Instant Cache Invalidation):**
   If you updated an existing font file and need immediate cache purging without waiting for jsDelivr's 24-hour cache:
   ```bash
   curl -i https://purge.jsdelivr.net/gh/Taraldinn/soroborno-cdn@main/public/fonts/<font-id>/font.css
   ```
