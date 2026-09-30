// Copies the packaged app produced by `tauri build` into `dist/` at the repository root.
// Uses only Node built-ins so it works on macOS and Windows alike.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const bundleDir = join("src-tauri", "target", "release", "bundle");
const distDir = "dist";

if (!existsSync(bundleDir)) {
  console.error(`No bundle found in ${bundleDir}. Run \`npm run tauri build\` first.`);
  process.exit(1);
}

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir);

for (const format of readdirSync(bundleDir)) {
  cpSync(join(bundleDir, format), join(distDir, format), { recursive: true });
}

console.log(`Packaged app copied to ${distDir}/`);
