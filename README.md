# Earthling Digital

The public website for Earthling Digital, an independent digital collective exploring open-source software, creative technology, and digital art.

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

Page content and the collaboration destination live in `src/App.tsx`; the contact link currently points to Steven’s GitHub profile. `src/styles.css` contains the site theme and responsive layout. Fonts are self-hosted through `src/fonts.css`; licenses are in `public/licenses`. The artwork lives in `src/components/SignalField.tsx` and `signal-shaders.ts`, with a static SVG fallback in `public/media`.

Add finished experiments to Open Work as they exist. Keep installations and exhibitions framed as a direction until there is real work to show.

Review visual changes at 1920 × 911 first, then at 1440, 1024, 768, 390, and 320 pixels wide. Preserve the artwork pause control, reduced-motion behavior, and static fallback.
