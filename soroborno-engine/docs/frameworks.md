# Soroborno Framework Integration Guide

Complete examples for using Soroborno fonts across all supported modern frameworks.

---

## 1. Vanilla HTML / CSS

```html
<!-- Load prebuilt stylesheet from CDN -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Taraldinn/soroborno-cdn@main/public/fonts/solaiman-lipi/font.css">

<style>
  body {
    font-family: 'SolaimanLipi', sans-serif;
  }
</style>
```

---

## 2. React

```tsx
import React from 'react';
import { useFont } from '@shoroborno/react';

export default function App() {
  const font = useFont('solaiman-lipi');

  return (
    <main className={font.className}>
      <h1>আমার সোনার বাংলা</h1>
    </main>
  );
}
```

---

## 3. Vue 3

```vue
<script setup>
import { useFont } from '@shoroborno/vue';

const font = useFont('solaiman-lipi');
</script>

<template>
  <div :class="font.className">
    <h1>আমার সোনার বাংলা</h1>
  </div>
</template>
```

---

## 4. Next.js (App Router)

```tsx
// app/layout.tsx
import { SolaimanLipi } from '@shoroborno/next';

const solaiman = SolaimanLipi({
  weight: ['400', '700'],
  variable: '--font-solaiman',
  display: 'swap'
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={solaiman.variable}>
      <body className={solaiman.className}>
        {children}
      </body>
    </html>
  );
}
```

---

## 5. Nuxt 3

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@shoroborno/nuxt'],
  soroborno: {
    fonts: ['solaiman-lipi', 'kalpurush']
  }
});
```

---

## 6. Vite

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { sorobornoPlugin } from '@shoroborno/vite';

export default defineConfig({
  plugins: [
    sorobornoPlugin({
      fonts: ['solaiman-lipi', 'bornomala']
    })
  ]
});
```

---

## 7. Svelte & SvelteKit

```html
<script>
  import { sorobornoFont } from '@shoroborno/svelte';
</script>

<h1 use:sorobornoFont={'solaiman-lipi'}>
  আমার সোনার বাংলা
</h1>
```

---

## 8. Astro

```ts
// astro.config.mjs
import { defineConfig } from 'astro/config';
import { sorobornoAstro } from '@shoroborno/astro';

export default defineConfig({
  integrations: [
    sorobornoAstro({
      fonts: ['solaiman-lipi', 'bornomala']
    })
  ]
});
```
