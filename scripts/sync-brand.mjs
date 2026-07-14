import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "packages", "brand", "poop.png");

if (!existsSync(source)) {
  console.error(`
Missing brand icon: packages/brand/poop.png

Add the logo, then run:
  pnpm sync:brand
`);
  process.exit(1);
}

const copyTargets = [
  join(root, "packages", "brand", "icon.png"),
  join(root, "apps", "player", "public", "icon.png"),
  join(root, "apps", "player", "public", "favicon.png"),
  join(root, "apps", "player", "public", "icon-512.png"),
  join(root, "apps", "web", "public", "icon.png"),
  join(root, "apps", "web", "public", "favicon.png"),
  join(root, "apps", "web", "public", "icon-512.png"),
  join(root, "apps", "player", "app", "icon.png"),
  join(root, "apps", "player", "app", "apple-icon.png"),
  join(root, "apps", "web", "app", "icon.png"),
  join(root, "apps", "web", "app", "apple-icon.png"),
];

for (const dest of copyTargets) {
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(source, dest);
}

const faviconSizes = [16, 32, 48];
const faviconPngs = await Promise.all(
  faviconSizes.map((size) =>
    sharp(source).resize(size, size).png().toBuffer(),
  ),
);
const favicon = await pngToIco(faviconPngs);
for (const app of ["player", "web"]) {
  writeFileSync(join(root, "apps", app, "app", "favicon.ico"), favicon);
}

console.log("Synced brand icon to public folders and Next.js app icons.");
