# TruckHub Website — 3 Trailers (Technical Reliability Update)

This archive preserves the original Pearl + Graphite colors, typefaces, and layout. It includes TH-T001 (Great Dane reefer), TH-T002 (Vanguard dry van), and TH-T003 (Vanguard reefer) with all original photos, plus bandwidth-friendly WebP equivalents.

## Fixes included

1. Narrow-screen overflow corrections for Contact, About, and shared grid elements (320–430 px).
2. Form validation: required customer details, phone-length check, maximum field lengths, existing honeypot, duplicate-submit protection, safe fallback messages, and provider-specific delivery.
3. Finance calculator validation: limits match sliders, invalid values never retain stale payment estimates, typed values clamp on editing completion, and financing enquiries carry only valid estimates.
4. WebP gallery images for faster delivery, existing JPEG originals preserved, unused legacy CSS/JS/video assets removed.
5. A production sitemap/canonical/Open Graph generator (see SEO deployment below).
6. Security response headers for Netlify/Cloudflare Pages, and validation/spam handling for supported form service.
7. 404.html rebuilt using the identical main design system, navigation and footer.

## CRITICAL: Enquiries need a real hosting form service

Automatic submission **is not enabled by default**, because this is a static website with no form backend. In assets/js/config.js, `formProvider: 'manual'` safely shows a prepared email/copy option instead of falsely claiming a form was received.

**For Netlify:** Upload/deploy this entire folder on Netlify (with its static HTML forms). In Netlify Forms, confirm `truck-enquiry` and `finance-enquiry` have been detected and enable notifications to the verified business email. Then set `formProvider: 'netlify'` in assets/js/config.js and redeploy. Submit an enquiry through each form and verify both received messages and email alerts in the Netlify dashboard. The existing hidden `bot-field` honeypot is recognized by Netlify.

**For Vercel, GitHub Pages or other static hosting:** Keep manual email/copy until you connect a real backend/form service. This ZIP does not falsely claim server-side filtering, rate limiting, or guaranteed email delivery. Set an appropriate form-provider integration before promising automatic enquiry delivery.

## CRITICAL: Production domain / SEO

We do not know your confirmed public HTTPS domain, so no fictitious sitemap URLs were generated. Before upload, from the site root run:

`python tools/prepare_production_seo.py https://YOUR-REAL-DOMAIN`

This writes sitemap.xml and robots.txt, fills canonical and social preview URL metadata, and updates `siteUrl` in the config. All 3 trailer detail URLs appear in the sitemap. After launch, submit sitemap.xml in Google Search Console. The individual trailer pages render their metadata with JavaScript; for deeper SEO consider pre-rendering full individual listing HTML on your hosting.

## Security and privacy

The `_headers` file configures browser security headers on hosts that support it (Netlify / Cloudflare Pages). Other hosts need equivalent settings configured in their own deployment controls. HTML and JavaScript validation improve the UX but **are not server-side security controls**. Netlify's form handling and spam prevention must be enabled separately.

Replace the site's generic legal copy with an approved privacy policy covering form collection, data retention and contact details before public launch. Verify business phone, address, inspection statements and all financing claims.

## Test checklist

- 320, 360, 390, 430, 768, 1024 and 1440 px: no document-wide horizontal scrolling.
- Inventory lists exactly 3 trailers; filters and full galleries work.
- Try invalid interest rates, blank/zero prices, down payment greater than price, and 500,000 entered into a 300,000 maximum: the calculator cannot show a stale or inconsistent estimate.
- Submit both forms to a test inbox on the actual host and confirm they appear in the Netlify dashboard if enabled.
- Verify the domain, sitemap, HTTPS certificate, analytics consent if tracking is added, and privacy policy.

## Inventory

- TH-T001: 2019 Great Dane 53 ft Reefer, Thermo King C600, 11,919 reported hours. 13 photographs.
- TH-T002: 2024 Vanguard 53 ft Dry Van, tandem 20,000 lb axles, 68,000 lb GVWR, Ontario MVI expired April 2026. 6 photographs.
- TH-T003: 2024 Vanguard 53 ft refrigerated trailer, Thermo King Precedent S-600, 9,632 reported hours. Inspection validity must be confirmed. 8 photographs.

No verified prices are provided; site shows Contact for price.
