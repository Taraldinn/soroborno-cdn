# Webfont CDN

A free, open-source webfont CDN delivery platform. Push WOFF fonts to your GitHub repository and get instant CDN URLs via jsDelivr.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
[![Deploy to Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-orange)](https://pages.cloudflare.com)

## Features

- 🚀 **Instant CDN URLs** - Push fonts to GitHub, get jsDelivr CDN links immediately
- 🔐 **GitHub OAuth** - Sign in with your GitHub account
- 📦 **Auto-discovery** - Automatically finds all font files in your repos
- 🎨 **CSS Generator** - Copy-paste ready `@font-face` declarations
- ⚡ **Global CDN** - Fonts served via jsDelivr's worldwide CDN
- 💰 **100% Free** - Hosted on Cloudflare Pages, fonts via jsDelivr

## How It Works

```
1. Sign in with GitHub
2. Select your repository containing fonts
3. Get CDN URLs like:
   https://cdn.jsdelivr.net/gh/Taraldinn/soroborno-cdn/fonts/MyFont.woff2
4. Use in your CSS!
```

## Quick Start

### Prerequisites
- Node.js 18+
- GitHub OAuth App ([Create here](https://github.com/settings/developers))
- Cloudflare account (for deployment)

### Local Development

```bash
# Clone the repository
git clone https://github.com/Taraldinn/soroborno-cdn.git
cd webfont-cdn

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Configure your GitHub OAuth credentials in .env.local

# Start development server
npm run dev
```

### Deploy to Cloudflare Pages

```bash
npm run deploy
```

Or connect your GitHub repo to Cloudflare Pages for automatic deployments.

## Usage

After signing in, select a repository containing font files. The app will generate CDN URLs:

```css
@font-face {
  font-family: 'MyFont';
  src: url('https://cdn.jsdelivr.net/gh/Taraldinn/soroborno-cdn/fonts/MyFont.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

## Supported Formats

- `.woff2` (recommended)
- `.woff`
- `.ttf`
- `.otf`

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Hosting**: Cloudflare Pages
- **Auth**: NextAuth.js with GitHub
- **CDN**: jsDelivr
- **Styling**: Tailwind CSS

## How to Contribute Fonts

We welcome font contributions! Here's how you can add new fonts to the library:

1.  **Fork the Repository:** Create a fork of this repository to your own GitHub account.

2.  **Add Font Files:**
    *   Navigate to the `fonts/` directory.
    *   Create a new folder for your font (e.g., `fonts/MyNewFont`).
    *   Place your font files (`.ttf`, `.otf`, `.woff`, `.woff2`) inside this folder.
    *   *Note: Ensure you have the right to distribute these fonts.*

3.  **Add Metadata (`_index.md`):**
    *   Create a `_index.md` file inside your font folder.
    *   Add the following metadata structure:
    ```markdown
    title = "My New Font"

    # My New Font
    A brief description of the font goes here.

    **Designer:** Designer Name
    **Version:** 1.0
    **License:** SIL Open Font License (or Apache, etc.)
    ```

4.  **Generate Assets:**
    *   Run the build script to generate the necessary CSS and JSON files:
    ```bash
    npm run dev
    # or just the script:
    node scripts/build-fonts.mjs
    ```
    *   This will automatically create `font.css` in your font folder and update `src/data/fonts.json`.

5.  **Submit a Pull Request:** Commit your changes and open a Pull Request to the main repository.

## License

MIT License - see [LICENSE](LICENSE) for details.
