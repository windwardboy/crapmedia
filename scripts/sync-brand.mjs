import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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

const targets = [
  join(root, "packages", "brand", "icon.png"),
  join(root, "apps", "player", "public", "icon.png"),
  join(root, "apps", "player", "public", "favicon.png"),
  join(root, "apps", "player", "public", "icon-512.png"),
  join(root, "apps", "web", "public", "icon.png"),
  join(root, "apps", "web", "public", "favicon.png"),
];

for (const dest of targets) {
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(source, dest);
}

console.log("Synced poop.png to app public folders.");
