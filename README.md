# TRUCK HUB — static website

A premium multi-page truck sales website, ready for direct GitHub upload. No npm installation, framework, database, API key or build command is required.

## Upload to GitHub

1. Extract the ZIP on your computer.
2. Open your GitHub repository and choose **Add file → Upload files**.
3. Drag all extracted files and the entire `assets` folder into the upload area. `index.html` must be at the repository root, beside `inventory.html`, `about.html`, and `contact.html`. Do not upload the ZIP itself.
4. Commit the files.
5. Open **Settings → Pages**. Select **Deploy from a branch**, choose **main** and **/(root)**, then save. GitHub shows the website link after deployment finishes.

For an existing website, remove any obsolete index file that would take precedence. All links use relative paths, so this works with a repository URL or a custom domain.

GitHub instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
Upload instructions: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository

## Included files

- `index.html` — Home with a real MP4 driving-truck hero
- `inventory.html` — searchable illustrative truck showcase
- `about.html` — About TRUCK HUB
- `contact.html` — contact details and vehicle-interest context
- `404.html` — not-found page
- `assets/styles.css` — responsive styling
- `assets/app.js` — menu, sticky header, motion controls and filters
- `assets/config.js` — editable contact details
- `assets/truck-hero.mp4` — 8-second Full HD H.264 video, about 1.5 MB
- `assets/hero.webp`, `assets/yard.webp` — optimized images
- `assets/favicon.svg` — TH brand icon
- `.nojekyll` — tells GitHub Pages to serve static files directly
- `CREDITS.md` — media provenance and terms

## Add your contact details

Edit `assets/config.js`. Fill the existing phone, email, address and hours values. They update across all pages. Leave a value empty to keep its coming-soon label. Do not put passwords or secret keys in this file.

Contact details are not yet configured. The site does not send form submissions. Showcase vehicles are illustrative, not confirmed stock. Replace showcase content with approved vehicle data and photos before representing it as live inventory.

## Video behaviour

The local MP4 plays muted, inline and on a loop, with a pause/play control. Playback pauses while the browser tab is hidden. Reduced-motion preferences are respected; the visitor can explicitly start playback. If autoplay is blocked, a still image remains and the play button allows a manual start. Some battery-saving or browser settings can prevent autoplay.

To replace the footage later, replace `assets/truck-hero.mp4` with your own licensed H.264 MP4, keeping the filename. The website does not depend on a stock-site video URL. Google Fonts is used for typography, with local system-font fallbacks when offline.

## Editing and previewing

Open `index.html` to preview the static site on your computer, or use a local static web server. You can edit the HTML, CSS and JavaScript directly. No developer tooling is needed for hosting.
