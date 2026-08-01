import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = resolve(projectRoot, "dist");

const sourceFiles = [
  ["index.html", "text/html; charset=utf-8"],
  ["css/style.css", "text/css; charset=utf-8"],
  ["css/redesign.css", "text/css; charset=utf-8"],
  ["css/tailwind.css", "text/css; charset=utf-8"],
  ["js/main.js", "text/javascript; charset=utf-8"],
  ["js/darkmode.js", "text/javascript; charset=utf-8"],
  ["js/scrollReveal.js", "text/javascript; charset=utf-8"],
  ["js/counter.js", "text/javascript; charset=utf-8"],
  ["js/skillsBar.js", "text/javascript; charset=utf-8"],
  ["js/carousel.js", "text/javascript; charset=utf-8"],
  ["js/contactForm.js", "text/javascript; charset=utf-8"],
  ["js/motion.js", "text/javascript; charset=utf-8"],
  ["assets/images/favicon.ico", "image/x-icon"],
  ["assets/images/profile-photo.png", "image/png"],
  ["assets/images/projects/rentags.png", "image/png"],
  ["assets/resume/Talento_Resume.pdf", "application/pdf"]
];

const routes = {};

for (const [relativePath, contentType] of sourceFiles) {
  const source = await readFile(resolve(projectRoot, relativePath));
  routes[`/${relativePath}`] = {
    body: source.toString("base64"),
    contentType
  };
}

routes["/"] = routes["/index.html"];

const workerSource = `
const routes = ${JSON.stringify(routes)};

function decodeBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const route = routes[url.pathname] ?? (url.pathname.endsWith("/") ? routes["/"] : null);

    if (!route) {
      return new Response("Not found", {
        status: 404,
        headers: { "content-type": "text/plain; charset=utf-8" }
      });
    }

    return new Response(decodeBase64(route.body), {
      headers: {
        "content-type": route.contentType,
        "cache-control": route.contentType.startsWith("text/html")
          ? "no-cache"
          : "public, max-age=3600"
      }
    });
  }
};
`;

await rm(outputRoot, { recursive: true, force: true });
await mkdir(resolve(outputRoot, "server"), { recursive: true });
await writeFile(resolve(outputRoot, "server/index.js"), workerSource);

console.log("Sites deployment build created.");
