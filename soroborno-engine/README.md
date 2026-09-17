# 🌐 Soroborno Engine (`soroborno-engine`)

The official processing engine, package distribution monorepo, and framework integration toolkit for the **Soroborno** Bangla font ecosystem.

---

## 📦 Packages

| Package | Version | Description |
| :--- | :--- | :--- |
| [`@shoroborno/core`](./packages/core) | `0.1.0` | Framework-agnostic core font lookup, URL resolver, and CSS generator |
| [`@shoroborno/fonts`](./packages/fonts) | `0.1.0` | Typed font definitions and full Bangla font catalog |
| [`@shoroborno/css`](./packages/css) | `0.1.0` | CSS generators, stylesheet link helpers, and utilities |
| [`@shoroborno/react`](./packages/react) | `0.1.0` | React hooks (`useFont`) and declarative `<FontLoader />` |
| [`@shoroborno/vue`](./packages/vue) | `0.1.0` | Vue 3 composables (`useFont`) |
| [`@shoroborno/next`](./packages/next) | `0.1.0` | Next.js App Router and Pages router font loaders |
| [`@shoroborno/nuxt`](./packages/nuxt) | `0.1.0` | Nuxt 3 module with zero-config font injection |
| [`@shoroborno/vite`](./packages/vite) | `0.1.0` | Vite plugin with font preloading |
| [`@shoroborno/svelte`](./packages/svelte) | `0.1.0` | Svelte action (`use:sorobornoFont`) |
| [`@shoroborno/astro`](./packages/astro) | `0.1.0` | Astro integration |

---

## 🚀 Getting Started with the Engine

### Prerequisites
* Node.js >= 20
* pnpm >= 9

### Installation & Build
```bash
# Install dependencies
pnpm install

# Run the font processing engine against the fonts repository
pnpm run engine:process

# Run all tests
pnpm test

# Build all packages
pnpm run build
```

---

## 🛠️ Architecture & Documentation
* [Architecture Guide](./docs/architecture.md)
* [Framework Integrations Guide](./docs/frameworks.md)
* [Font Contributor Guide](./docs/contributing.md)

---

## 📄 License
MIT © [Taraldinn](https://github.com/Taraldinn)
