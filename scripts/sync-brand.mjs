import {
  copyFileSync,
  existsSync,
  mkdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const brandDir = join(root, "packages", "brand");
const transparentSource = join(brandDir, "poop.png");
const solidSource = join(brandDir, "icon-solid.png");

if (!existsSync(transparentSource)) {
  console.error(`
Missing brand icon: packages/brand/poop.png

Add the transparent logo (1024×1024 PNG), then run:
  pnpm sync:brand
`);
  process.exit(1);
}

async function writePng(source, dest, size) {
  mkdirSync(dirname(dest), { recursive: true });
  await sharp(source).resize(size, size).png().toBuffer().then((buf) => {
    writeFileSync(dest, buf);
  });
}

async function writeCopy(source, dest) {
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(source, dest);
}

const apps = ["player", "web"];

for (const app of apps) {
  const publicDir = join(root, "apps", app, "public");
  const appDir = join(root, "apps", app, "app");

  await writePng(transparentSource, join(publicDir, "icon.png"), 192);
  await writePng(transparentSource, join(appDir, "icon.png"), 512);
  await writePng(transparentSource, join(appDir, "apple-icon.png"), 180);
  await writePng(transparentSource, join(publicDir, "favicon.png"), 48);

  const maskableSource = existsSync(solidSource)
    ? solidSource
    : transparentSource;
  await writePng(maskableSource, join(publicDir, "icon-512.png"), 512);

  for (const stray of ["poop.png", "icon-solid.png"]) {
    const path = join(publicDir, stray);
    if (existsSync(path)) unlinkSync(path);
  }
}

await writeCopy(transparentSource, join(brandDir, "icon.png"));

const faviconSizes = [16, 32, 48];
const faviconPngs = await Promise.all(
  faviconSizes.map((size) =>
    sharp(transparentSource).resize(size, size).png().toBuffer(),
  ),
);
const favicon = await pngToIco(faviconPngs);
for (const app of apps) {
  writeFileSync(join(root, "apps", app, "app", "favicon.ico"), favicon);
}

console.log("Synced brand icons from packages/brand to player and web apps.");
if (existsSync(solidSource)) {
  console.log("  icon-512.png ← icon-solid.png (maskable PWA)");
}
console.log("  icon.png, favicons, apple-icon ← poop.png (transparent)");
