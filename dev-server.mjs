import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, resolve } from "node:path";

const root = resolve(process.cwd());
const port = Number(process.env.PORT || 4173);

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".webp", "image/webp"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".mp4", "video/mp4"]
]);

function isInsideRoot(filePath) {
  return filePath === root || filePath.startsWith(`${root}/`);
}

async function fileExists(filePath) {
  try {
    const info = await stat(filePath);
    return info.isFile();
  } catch {
    return false;
  }
}

async function sendFile(response, filePath, statusCode = 200) {
  const body = await readFile(filePath);
  const contentType = mimeTypes.get(extname(filePath)) || "application/octet-stream";
  response.writeHead(statusCode, {
    "Content-Type": contentType,
    "Cache-Control": "no-store"
  });
  response.end(body);
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
    const cleanPath = decodeURIComponent(url.pathname);
    const requestedPath = cleanPath === "/" ? "/index.html" : cleanPath;
    const filePath = resolve(join(root, requestedPath));

    if (!isInsideRoot(filePath)) {
      response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Forbidden");
      return;
    }

    if (await fileExists(filePath)) {
      await sendFile(response, filePath);
      return;
    }

    if (!extname(filePath)) {
      const fallbackFile = cleanPath === "/" ? "index.html" : "404.html";
      await sendFile(response, resolve(root, fallbackFile));
      return;
    }

    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(error instanceof Error ? error.message : "Server error");
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Serving Tea demo at http://127.0.0.1:${port}/`);
});
