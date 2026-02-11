import { cpSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, ".."); // Go up from scripts/ to project root

const dist = resolve(projectRoot, "dist");
const publicDir = resolve(projectRoot, "public");

if (!existsSync(dist)) {
  mkdirSync(dist, { recursive: true });
}

// Copy manifest.json
cpSync(resolve(publicDir, "manifest.json"), resolve(dist, "manifest.json"));

// Copy icons
for (const icon of ["icon16.png", "icon48.png", "icon128.png"]) {
  const src = resolve(publicDir, icon);
  if (existsSync(src)) {
    cpSync(src, resolve(dist, icon));
  }
}

console.log("✅ Copied manifest.json and icons to dist/");
