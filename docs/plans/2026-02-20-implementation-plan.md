# Gijsbert van de Kraats Website Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a bilingual (NL/EN) Astro website for patissier Gijsbert van de Kraats with 6 pages, warm artisanal design, SEO optimization, deployed to Cloudflare Pages.

**Architecture:** Astro 5 static site with Tailwind CSS 4 for styling. i18n via Astro's built-in routing with `/nl/` and `/en/` prefixes and browser language auto-detection middleware. Content stored in per-locale JSON files. Deployed to Cloudflare Pages.

**Tech Stack:** Astro 5, Tailwind CSS 4, Cloudflare Pages, Google Fonts (Playfair Display + DM Sans)

---

### Task 1: Project Scaffolding

**Files:**
- Create: `astro.config.mjs`
- Create: `package.json`
- Create: `tailwind.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`

**Step 1: Initialize git repo**

```bash
cd /Users/martinbal/gijsbertvandekraats
git init
```

**Step 2: Create Astro project**

```bash
cd /Users/martinbal/gijsbertvandekraats
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict
```

**Step 3: Install dependencies**

```bash
cd /Users/martinbal/gijsbertvandekraats
npm install
npm install @astrojs/tailwind @astrojs/cloudflare @astrojs/sitemap
```

**Step 4: Configure Astro with i18n, Tailwind, sitemap, and Cloudflare**

Update `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://gijsbertvandekraats.nl',
  output: 'static',
  integrations: [tailwind(), sitemap()],
  i18n: {
    defaultLocale: 'nl',
    locales: ['nl', 'en'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
});
```

**Step 5: Create global CSS with Tailwind and custom properties**

Create `src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  --color-cream: #FAF7F2;
  --color-chocolate: #3C2415;
  --color-caramel: #C8956C;
  --color-sage: #8B9E7E;
  --color-warm-white: #FFFDF9;
  --font-heading: 'Playfair Display', serif;
  --font-body: 'DM Sans', sans-serif;
}
```

**Step 6: Verify dev server starts**

```bash
cd /Users/martinbal/gijsbertvandekraats
npm run dev
```

Expected: Server starts on localhost:4321

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro project with Tailwind, i18n, and Cloudflare config"
```

---

### Task 2: Download Images from Current Website

**Files:**
- Create: `public/images/` directory with downloaded images

**Step 1: Create images directory**

```bash
mkdir -p /Users/martinbal/gijsbertvandekraats/public/images
```

**Step 2: Download all images from the current website**

Visit gijsbertvandekraats.nl and its subpages, identify all image URLs, and download them:

```bash
cd /Users/martinbal/gijsbertvandekraats/public/images
# Download images from the website — use wget or curl for each image found
# Organize into subdirectories: hero/, bruidstaarten/, zakelijk/, vijfheeren/, about/
mkdir -p hero bruidstaarten zakelijk vijfheeren about
```

Use `wget` or `curl` to download each image found on the site. Check page source for image URLs on: homepage, /bruidstaart/, /patisserie-voor-jouw-bedrijf/, /vijf-heeren/, /over-mij/

**Step 3: Commit images**

```bash
git add public/images/
git commit -m "assets: download images from current website"
```

---

### Task 3: i18n Translation System

**Files:**
- Create: `src/i18n/nl.json`
- Create: `src/i18n/en.json`
- Create: `src/i18n/utils.ts`
- Create: `src/middleware.ts`

**Step 1: Create Dutch translations**

Create `src/i18n/nl.json` with all UI strings, navigation labels, page content for all 6 pages. Include SEO-optimized text with target keywords (bruidstaart bestellen, bruidstaart op maat, patissier inhuren, zakelijke patisserie, etc.).

**Step 2: Create English translations**

Create `src/i18n/en.json` — mirror structure of nl.json with English equivalents. Target keywords: wedding cake Netherlands, custom wedding cake, corporate patisserie.

**Step 3: Create i18n utility functions**

Create `src/i18n/utils.ts`:

```typescript
import nl from './nl.json';
import en from './en.json';

const translations = { nl, en } as const;
type Locale = keyof typeof translations;

export function t(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: any = translations[locale];
  for (const k of keys) {
    value = value?.[k];
  }
  return value ?? key;
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, locale] = url.pathname.split('/');
  if (locale === 'en') return 'en';
  return 'nl';
}

export function getLocalizedPath(path: string, locale: Locale): string {
  return `/${locale}${path}`;
}

export const locales: Locale[] = ['nl', 'en'];
export type { Locale };
```

**Step 4: Create middleware for language detection**

Create `src/middleware.ts`:

```typescript
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = context.url;

  // Skip if already has locale prefix or is an asset
  if (pathname.startsWith('/nl') || pathname.startsWith('/en') || pathname.includes('.')) {
    return next();
  }

  // Detect browser language
  const acceptLang = context.request.headers.get('accept-language') || '';
  const preferredLocale = acceptLang.toLowerCase().startsWith('en') ? 'en' : 'nl';

  // Redirect to localized path
  return context.redirect(`/${preferredLocale}${pathname === '/' ? '' : pathname}`, 302);
});
```

**Step 5: Verify translations load correctly**

Test by importing and calling `t('nl', 'nav.home')` — should return Dutch nav label.

**Step 6: Commit**

```bash
git add src/i18n/ src/middleware.ts
git commit -m "feat: add i18n translation system with browser language detection"
```

---

### Task 4: Layout & Shared Components

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/LanguageSwitcher.astro`
- Create: `src/components/SEOHead.astro`

**Step 1: Create SEO head component**

Create `src/components/SEOHead.astro` — accepts props: title, description, ogImage, canonicalUrl, locale, alternateLocale. Renders `<head>` content with:
- Meta charset, viewport
- Title and meta description (SEO-optimized)
- Open Graph tags
- hreflang alternate links
- Google Fonts preload (Playfair Display + DM Sans)
- Schema.org LocalBusiness JSON-LD

**Step 2: Create Header component**

Create `src/components/Header.astro` — responsive nav with:
- Logo/brand name
- Navigation links (Home, Bruidstaarten, Zakelijke Patisserie, Vijf Heeren, Over Gijsbert, Contact)
- Language switcher (NL/EN toggle)
- Mobile hamburger menu
- Warm artisanal style: cream background, chocolate text, caramel accents

**Step 3: Create Footer component**

Create `src/components/Footer.astro`:
- Contact info (phone, email, address)
- Navigation links
- Social media links
- Copyright notice
- Warm styling matching header

**Step 4: Create LanguageSwitcher component**

Create `src/components/LanguageSwitcher.astro` — toggles between NL and EN, preserving current page path.

**Step 5: Create BaseLayout**

Create `src/layouts/BaseLayout.astro` — wraps all pages with:
- SEOHead component
- Global CSS import
- Header
- `<main>` slot
- Footer
- Scroll-to-top animation observer script

**Step 6: Verify layout renders**

Create a temporary test page, run dev server, check header/footer/layout renders correctly.

**Step 7: Commit**

```bash
git add src/layouts/ src/components/
git commit -m "feat: add base layout with header, footer, SEO head, and language switcher"
```

---

### Task 5: Shared UI Components

**Files:**
- Create: `src/components/Hero.astro`
- Create: `src/components/SectionHeading.astro`
- Create: `src/components/ServiceCard.astro`
- Create: `src/components/FadeIn.astro`
- Create: `src/components/ContactCTA.astro`

**Step 1: Create Hero component**

Full-width hero section with background image, overlay gradient, headline, subtitle, optional CTA button. Warm artisanal styling.

**Step 2: Create SectionHeading component**

Reusable section heading with Playfair Display title, optional subtitle, decorative line element.

**Step 3: Create ServiceCard component**

Card with image, title, short description, CTA link. Used on homepage for service highlights.

**Step 4: Create FadeIn component**

Wrapper component that fades in children on scroll using Intersection Observer. Pure CSS + minimal JS.

**Step 5: Create ContactCTA component**

Reusable call-to-action banner with "Neem contact op" / "Get in touch" text and button. Used at bottom of service pages.

**Step 6: Commit**

```bash
git add src/components/
git commit -m "feat: add shared UI components (Hero, ServiceCard, FadeIn, ContactCTA)"
```

---

### Task 6: Homepage

**Files:**
- Create: `src/pages/nl/index.astro`
- Create: `src/pages/en/index.astro`

**Step 1: Build Dutch homepage**

Create `src/pages/nl/index.astro` with sections:
1. Hero — full-screen with Gijsbert image, "Ambachtelijke Patisserie | Food Services | Onderwijs"
2. Service highlights — 3 cards (Bruidstaarten, Zakelijke Patisserie, Vijf Heeren)
3. Client logos bar — Waldorf Astoria, The Local Club, Het Raadhuis, Grand Hotel Karel V
4. Featured work — gallery grid of 3-4 best photos
5. Short about teaser with link to Over Gijsbert
6. ContactCTA

SEO: title "Gijsbert van de Kraats | Ambachtelijke Patisserie & Bruidstaarten", meta description with keywords.

**Step 2: Build English homepage**

Create `src/pages/en/index.astro` — same structure, English content. SEO: title "Gijsbert van de Kraats | Artisan Patisserie & Wedding Cakes Netherlands"

**Step 3: Verify both render correctly**

Run dev server, check `/nl/` and `/en/`, verify language switcher works.

**Step 4: Commit**

```bash
git add src/pages/
git commit -m "feat: add bilingual homepage with hero, services, and client logos"
```

---

### Task 7: Bruidstaarten Page (SEO Priority)

**Files:**
- Create: `src/pages/nl/bruidstaarten.astro`
- Create: `src/pages/en/wedding-cakes.astro`

**Step 1: Build Dutch bruidstaarten page**

Create `src/pages/nl/bruidstaarten.astro` — THE key SEO page:
1. Hero — stunning wedding cake photo, "Bruidstaart op Maat | Unieke Bruidstaarten voor Jouw Bruiloft"
2. Intro text — SEO-rich: mention "bruidstaart bestellen", "trouwtaart", "bruidstaart op maat", "bruidstaart zonder fondant", "bruidstaart prijs", "bruidstaart Utrecht", "bruidstaart Vijfheerenlanden"
3. Gallery grid — wedding cake portfolio photos
4. Process steps — (Kennismaking → Proeftaart → Ontwerp → De Grote Dag) with icons
5. Pricing table — per persoon €9,95–€12,95, individuele gebakjes €8,95, proeftaart inbegrepen, bezorging & opsnijden inbegrepen
6. FAQ section with schema markup:
   - "Wat kost een bruidstaart?"
   - "Hoeveel bruidstaart heb ik nodig per persoon?"
   - "Kan ik een bruidstaart zonder fondant bestellen?"
   - "Hoe ver van tevoren moet ik een bruidstaart bestellen?"
   - "Leveren jullie ook alternatieve bruidstaarten?"
7. ContactCTA

**Step 2: Add FAQPage schema.org markup**

Add JSON-LD FAQPage schema in the page head for rich Google snippets.

**Step 3: Build English wedding cakes page**

Create `src/pages/en/wedding-cakes.astro` — same structure, English content with keywords "wedding cake Netherlands", "custom wedding cake", "wedding cake price".

**Step 4: Verify pages render and FAQ schema is valid**

Run dev server, check both language versions. Validate JSON-LD with Google's Rich Results Test mentally.

**Step 5: Commit**

```bash
git add src/pages/nl/bruidstaarten.astro src/pages/en/wedding-cakes.astro
git commit -m "feat: add SEO-optimized bruidstaarten page with FAQ schema markup"
```

---

### Task 8: Zakelijke Patisserie Page

**Files:**
- Create: `src/pages/nl/zakelijke-patisserie.astro`
- Create: `src/pages/en/corporate-patisserie.astro`

**Step 1: Build Dutch corporate patisserie page**

Sections:
1. Hero — corporate/restaurant context photo
2. Services overview — desserts, ijs, koekjes, chocolade, gebak
3. Client case studies — Waldorf Astoria Amsterdam (cookies + ijs), The Local Club Gorinchem (desserts + ijs), Het Raadhuis Goudriaan (ijs + desserts). Each with photo, description, link.
4. "Hoe werkt het?" — 3 steps: Kennismaking, Proefmenu, Levering
5. ContactCTA

SEO keywords: "zakelijke patisserie", "patissier inhuren", "desserts voor restaurant", "ijs leverancier horeca"

**Step 2: Build English version**

**Step 3: Commit**

```bash
git add src/pages/nl/zakelijke-patisserie.astro src/pages/en/corporate-patisserie.astro
git commit -m "feat: add zakelijke patisserie page with client case studies"
```

---

### Task 9: Vijf Heeren Page

**Files:**
- Create: `src/pages/nl/vijf-heeren.astro`
- Create: `src/pages/en/vijf-heeren.astro`

**Step 1: Build Dutch Vijf Heeren page**

Sections:
1. Hero — cookie product photo
2. Story — heritage of Vijfheerenlanden, historical lords, local ingredients
3. Product details — apple/pear stroop, handmade, 5 cookies per box
4. Design story — chocolate-decorated lords from card game, coats of arms
5. Pricing + order CTA — €12.95, order via link
6. Product schema.org markup

**Step 2: Build English version**

**Step 3: Commit**

```bash
git add src/pages/nl/vijf-heeren.astro src/pages/en/vijf-heeren.astro
git commit -m "feat: add Vijf Heeren product page with heritage story"
```

---

### Task 10: Over Gijsbert Page

**Files:**
- Create: `src/pages/nl/over-gijsbert.astro`
- Create: `src/pages/en/about.astro`

**Step 1: Build Dutch about page**

Sections:
1. Hero — portrait photo
2. Biography — from 2006, passion for cooking, patisserie since 2015, Grand Hotel Karel V, independent since 2021
3. Career timeline — visual timeline: Van der Valk → Figi → Karel V → Eigen onderneming (2020)
4. Awards — Taugé Challenge 1e (2014), Patisserie Decathlon 1e (2019), Dobla Pastry Battle 2e (2020), Vijfheerenlanden Vijfje 2e (2024)
5. Certifications — Gespecialiseerd werkend kok, Leermeester, IJsbereider, Patisserie Next Level
6. Education offerings — masterclasses, gastlessen, examens

**Step 2: Build English version**

**Step 3: Commit**

```bash
git add src/pages/nl/over-gijsbert.astro src/pages/en/about.astro
git commit -m "feat: add about page with biography, timeline, and awards"
```

---

### Task 11: Contact Page

**Files:**
- Create: `src/pages/nl/contact.astro`
- Create: `src/pages/en/contact.astro`

**Step 1: Build Dutch contact page**

Sections:
1. Heading — "Neem Contact Op"
2. Contact form — name, email, phone, subject (dropdown: Bruidstaart, Zakelijke patisserie, Vijf Heeren bestellen, Masterclass, Anders), message, submit button. Form action: Cloudflare Pages function or mailto fallback.
3. Direct contact info — phone 06 12278654, email info@gijsbertvandekraats.nl, address Energieweg 3F Meerkerk
4. Google Maps embed (with privacy consent)

**Step 2: Build English version**

**Step 3: Commit**

```bash
git add src/pages/nl/contact.astro src/pages/en/contact.astro
git commit -m "feat: add contact page with form and map"
```

---

### Task 12: Cloudflare Pages Setup

**Files:**
- Create: `wrangler.toml` (if needed)

**Step 1: Install Wrangler**

```bash
npm install -D wrangler
```

**Step 2: Login to Cloudflare**

```bash
npx wrangler login
```

**Step 3: Create Cloudflare Pages project**

```bash
npx wrangler pages project create gijsbertvandekraats
```

**Step 4: Test build**

```bash
npm run build
```

Expected: Build succeeds, output in `dist/`

**Step 5: Deploy preview**

```bash
npx wrangler pages deploy dist/
```

**Step 6: Commit**

```bash
git add wrangler.toml package.json
git commit -m "chore: add Cloudflare Pages deployment config"
```

---

### Task 13: Final Polish & SEO Verification

**Step 1: Verify all pages render in both languages**

Check `/nl/` and `/en/` versions of all 6 pages.

**Step 2: Verify language auto-detection**

Test middleware redirects correctly based on Accept-Language header.

**Step 3: Check responsive design**

Test all pages at mobile (375px), tablet (768px), and desktop (1440px) widths.

**Step 4: Verify SEO elements**

- Check all pages have proper title, meta description, OG tags
- Verify hreflang tags on each page
- Verify Schema.org JSON-LD (LocalBusiness on all, FAQPage on bruidstaarten, Product on vijf-heeren)
- Verify sitemap at /sitemap-index.xml

**Step 5: Final commit**

```bash
git add -A
git commit -m "chore: final polish and SEO verification"
```
