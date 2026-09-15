# Truck Hub — Pearl + Graphite Upgrade

This is a mobile-first static dealership website. Open `index.html` locally, or deploy the folder to GitHub Pages, Netlify, Vercel, or another static host.

## Important launch setup

1. Open `assets/js/config.js` and add the real phone, WhatsApp number, email, location and social URLs.
2. Replace the demonstration inventory in `assets/js/inventory-data.js` with verified trucks.
3. Replace sample truck photography with real inventory photos before advertising any listing as real.
4. The contact and finance forms include Netlify-compatible markup. On unsupported static hosts the site automatically gives the visitor copy/email/WhatsApp fallbacks when those contact values are configured.
5. Replace `assets/video/hero-drive.mp4` and `hero-drive-mobile.mp4` with a real truck-driving MP4 if you want true live-action footage. The included MP4 files are lightweight cinematic motion sequences generated from the project's supplied truck images so the project remains self-contained and copyright-safe.
6. When the production domain is known, create `sitemap.xml` from `sitemap-template.xml`, replace `{{SITE_URL}}` with the real origin, and add `Sitemap: https://your-domain/sitemap.xml` to `robots.txt`.
7. Review and replace the draft Privacy/Terms copy with business-approved legal text.

## Major upgrades included

- Pearl + Graphite visual system with restrained red accent.
- Transparent logo asset and compact frosted header.
- MP4 hero with mobile/desktop sources, pause control, animated highway lines and marquee strip.
- Mobile-first inventory with two-column compact cards, quick status chips and bottom-sheet filters.
- Structured inventory data with Available, Sold and Coming Soon states.
- Dedicated `truck.html?id=...` detail URLs with gallery slots, specifications, finance estimate, share button and Vehicle structured data.
- Finance calculator with range controls, monthly and bi-weekly estimates, principal/interest cost visualization and enquiry handoff.
- Netlify-ready lead forms with fallback delivery options.
- Reworked imagery so major sections no longer repeat the same hero image.
- Scroll reveals, count-up stats, card motion and reduced-motion support.
- Canada-focused visual details and copy.
- Trust, trade-in, recently sold and process sections.
- Unique page metadata, Open Graph image, AutoDealer/Vehicle structured data, robots file and sitemap template.
- Responsive image sources, optimized MP4s, lazy loading and lightweight JS.
- Refactored data/config/UI files for easier future maintenance.
