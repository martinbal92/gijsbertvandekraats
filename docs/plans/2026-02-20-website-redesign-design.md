# Gijsbert van de Kraats Website Redesign

## Overview

Redesign of gijsbertvandekraats.nl — a brand & prestige focused website for patissier Gijsbert van de Kraats. Built with Astro, deployed to Cloudflare Pages. Bilingual (NL/EN) with browser language auto-detection.

## Tech Stack

- **Framework:** Astro 5.x (static site generation)
- **Styling:** Tailwind CSS 4
- **Deployment:** Cloudflare Pages
- **i18n:** Astro built-in i18n with `/nl/` and `/en/` routing, browser language detection via middleware
- **Animations:** CSS transitions + Intersection Observer
- **Images:** Astro `<Image>` component for automatic WebP/AVIF optimization

## Visual Direction: Warm & Artisanal

### Color Palette

- Background: `#FAF7F2` (warm cream)
- Primary text: `#3C2415` (deep chocolate brown)
- Accent: `#C8956C` (warm gold/caramel)
- Secondary accent: `#8B9E7E` (sage green)
- White: `#FFFFFF`

### Typography

- Headlines: Playfair Display (serif) — brand continuity
- Body: DM Sans (clean sans-serif)
- Accent/quotes: Playfair Display Italic

### Design Elements

- Subtle linen/paper textures on backgrounds
- Soft shadows, organic rounded shapes
- Full-bleed hero images with overlay text
- Gallery-style product showcases with hover effects
- Generous whitespace, asymmetric grids
- Scroll-triggered fade-in animations (CSS-based)

## Page Structure (6 pages x 2 languages)

### 1. Home (`/`)

- Hero: Full-screen image of Gijsbert at work, tagline overlay
- Section: Brief intro — "Patisserie | Food Services | Onderwijs"
- Section: Three service highlight cards (Bruidstaarten, Zakelijk, Vijf Heeren) with images and CTAs
- Section: Client logos bar (Waldorf Astoria, The Local Club, Het Raadhuis, Grand Hotel Karel V)
- Section: Featured work gallery (3-4 best photos)
- Section: Short testimonial/quote
- Footer: Contact info, social links, navigation

### 2. Bruidstaarten (`/bruidstaarten/`)

- Hero: Stunning wedding cake photo with headline
- Section: Intro text — SEO-optimized description of wedding cake services
- Section: Gallery grid — portfolio of wedding cakes
- Section: Process steps (1. Kennismaking, 2. Proeftaart, 3. Ontwerp, 4. De grote dag)
- Section: Pricing table (per persoon, individuele gebakjes, proeftaart, etc.)
- Section: FAQ with schema markup (popular bruidstaart questions)
- CTA: Contact form / booking link

### 3. Zakelijke Patisserie (`/zakelijke-patisserie/`)

- Hero: Corporate context photo
- Section: Services overview (desserts, ijs, koekjes, chocolade)
- Section: Client case studies (Waldorf Astoria, The Local Club, Het Raadhuis) with photos
- Section: "How it works" process
- CTA: Contact for corporate inquiries

### 4. Vijf Heeren (`/vijf-heeren/`)

- Hero: Cookie product photo
- Section: Story & heritage of the cookies
- Section: Product details, ingredients, design story
- Section: Pricing (€12.95 / 5 stuks)
- CTA: Order button (Google Forms link or future e-commerce)

### 5. Over Gijsbert (`/over-gijsbert/`)

- Hero: Portrait photo
- Section: Biography — from 2006 to now
- Section: Career timeline (Van der Valk → Figi → Karel V → Eigen onderneming)
- Section: Awards & certifications
- Section: Education & masterclasses offered
- Optional: Photo of Gijsbert and Eva

### 6. Contact (`/contact/`)

- Contact form (name, email, phone, subject dropdown, message)
- Direct contact info (phone, email, address)
- Google Maps embed
- Social media links

## SEO Strategy

### Target Keywords (NL — high search volume)

- bruidstaart bestellen
- bruidstaart op maat
- trouwtaart
- bruidstaart prijs
- bruidstaart Utrecht / Vijfheerenlanden / Meerkerk
- patissier inhuren
- zakelijke patisserie
- taart voor bruiloft
- bruidstaart zonder fondant
- custom bruidstaart
- patisserie Meerkerk
- taart laten maken

### Target Keywords (EN)

- wedding cake Netherlands
- custom wedding cake Dutch
- corporate patisserie Netherlands
- pastry chef hire

### Technical SEO

- Schema.org: LocalBusiness, Product (Vijf Heeren), FAQPage (Bruidstaarten)
- XML Sitemap (auto-generated)
- Open Graph + Twitter Card meta tags
- hreflang tags for NL/EN
- Semantic HTML (proper heading hierarchy, landmarks)
- Optimized image alt texts with keywords
- Clean URL structure
- robots.txt

## i18n Architecture

- Default locale: `nl`
- Supported: `nl`, `en`
- Routing: `/nl/bruidstaarten/`, `/en/wedding-cakes/`
- Auto-detection: Middleware reads `Accept-Language` header, redirects on first visit
- Content: JSON translation files per locale + per-page content files

## Contact Information

- Phone: 06 12278654
- Email: info@gijsbertvandekraats.nl
- Address: Energieweg 3F, Meerkerk
