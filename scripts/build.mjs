import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite";

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, "dist");
const cacheDir = path.join(projectRoot, ".cache");
const serverOutDir = path.join(cacheDir, "ssr");

await mkdir(serverOutDir, { recursive: true });

await build({
  root: projectRoot,
  build: {
    outDir: distDir,
    emptyOutDir: true,
  },
});

await build({
  root: projectRoot,
  build: {
    ssr: path.join(projectRoot, "src/entry-server.tsx"),
    outDir: serverOutDir,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: "entry-server.js",
      },
    },
  },
});

const serverEntry = path.join(serverOutDir, "entry-server.js");
const { render } = await import(pathToFileURL(serverEntry).href);
const appHtml = render();
const htmlPath = path.join(distDir, "index.html");
const template = await readFile(htmlPath, "utf8");
const rootPlaceholder = '<div id="root"></div>';

if (!template.includes(rootPlaceholder)) {
  throw new Error("Could not find the root element in the built HTML");
}

const html = template.replace(
  rootPlaceholder,
  () => `<div id="root">${appHtml}</div>`,
);

await writeFile(htmlPath, html);
