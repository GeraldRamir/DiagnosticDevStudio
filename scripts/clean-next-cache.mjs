import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));

const targets = [
  path.join(projectRoot, ".next"),
  path.join(projectRoot, "node_modules", ".cache", "next"),
];

for (const dir of targets) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`Removed: ${dir}`);
  } catch {
    /* ignore */
  }
}
