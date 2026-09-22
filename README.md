# Earthling Digital

The public website for Earthling Digital, an independent, AI-native creative agency working across brand, product design, engineering, and creative technology. The agency is structured as a collective, founded by Steven Frady.

The original site experiments are preserved in `archive/legacy`.

## Development

Use Node.js 22.12 or newer, then install dependencies and start Vite:

```sh
npm install
npm run dev
```

## Production

```sh
npm run typecheck
npm run build
npm run preview
```

The build command creates the browser bundle, renders the React app to static HTML for search engines and visitors without JavaScript, and writes the deployable site to `dist`.

## Deployment

Keep the Vercel project root at the repository root. The checked-in Vercel configuration installs from `package-lock.json`, runs the production build, and deploys `dist`.

## Editing

Page content lives in `src/App.tsx`. The service cards, before/now shifts, process steps, studio principles, and ticker items are plain arrays at the top of that file. Outbound links and the contact address (contact@earthling.dev) are constants next to them.

## Agents and crawlers

The site is meant to be readable by agents as well as people. `public/llms.txt` is a plain-text summary of the agency, its services, and how to get in touch; keep it in sync when the page copy changes. `public/robots.txt` allows all crawlers and points to `public/sitemap.xml`, and `index.html` carries schema.org Organization JSON-LD plus a canonical URL. The canonical URL is currently `https://earthling.dev`; change it in `index.html`, `robots.txt`, `sitemap.xml`, and `llms.txt` if the site lives somewhere else.

`src/styles.css` contains the site theme, the blueprint frame lines, the scroll-reveal system, and the responsive layout. Fonts are self-hosted through `src/fonts.css`; licenses are in `public/licenses`. The hero artwork lives in `src/components/SignalField.tsx` and `signal-shaders.ts`, with a static SVG fallback in `public/media`.

Add shipped client work to the Work section as it exists. Keep claims honest: the studio is new, and the page says so.

Review visual changes at 1440 first, then at 1200, 960, 768, 390, and 320 pixels wide. Preserve the artwork motion toggle, reduced-motion behavior, and static fallback.
