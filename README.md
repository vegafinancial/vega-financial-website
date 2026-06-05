# Vega Financial Website

A modern, responsive website for Vega Financial built with Astro, Tailwind CSS, and deployed to Cloudflare Pages.

## Project Structure

```
src/
├── pages/           # Astro pages (auto-routed)
│   ├── index.astro       (Home)
│   ├── about.astro       (About)
│   ├── services.astro    (Services)
│   ├── engagement.astro  (Engagement)
│   └── contact.astro     (Contact)
├── layouts/         # Shared layouts
│   └── Layout.astro      (Main layout with nav/footer)
├── components/      # Reusable components
│   ├── Navigation.astro
│   └── Footer.astro
public/
├── _redirects       # URL redirects for Cloudflare Pages
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Build for production: `npm run build`

## Deployment to Cloudflare Pages

1. Push code to GitHub
2. Go to https://dash.cloudflare.com/pages
3. Create new project and connect GitHub repo
4. Build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Deploy

## Styling

The site uses Tailwind CSS with custom Vega brand colors:
- Navy: `#1a365d` (vega-navy)
- Gold: `#d4a574` (vega-gold)
- Light: `#f7f3ef` (vega-light)
- Dark: `#2d2d2d` (vega-dark)

Use classes like `bg-vega-navy`, `text-vega-gold`, etc.

## Features

- Responsive design (mobile-first)
- Fast performance (Lighthouse ≥90)
- Accessible (WCAG 2.1 AA compliant)
- SEO optimized
- URL redirects for old site paths
