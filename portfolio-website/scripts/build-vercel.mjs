import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = resolve(projectRoot, "public");
const publicSources = ["index.html", "assets", "css", "fonts", "js"];

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

for (const relativePath of publicSources) {
  await cp(resolve(projectRoot, relativePath), resolve(outputRoot, relativePath), {
    recursive: true
  });
}

console.log("Vercel static output created in public/.");
