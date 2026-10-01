import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import express from "express";
import { createServer as createViteServer } from "vite";
import { askHandler } from "./api/ask.ts";
import { routeHandler } from "./api/route.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const isProd = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT ?? 5173);
const hmrPort = Number(process.env.HMR_PORT ?? 24678);

loadEnv({ path: path.join(root, ".env.local") });
loadEnv({ path: path.join(root, ".env") });

async function createApp() {
  const app = express();
  app.use(express.json({ limit: "256kb" }));

  const api = express.Router();
  api.post("/route", (req, res) => {
    void routeHandler(req, res);
  });
  api.post("/ask", (req, res) => {
    void askHandler(req, res);
  });
  app.use("/api", api);

  if (!isProd) {
    const vite = await createViteServer({
      root,
      configFile: path.join(root, "vite.config.ts"),
      server: {
        middlewareMode: true,
        hmr: { port: hmrPort },
      },
      appType: "custom",
    });

    app.use(vite.middlewares);

    app.use(async (req, res, next) => {
      if (req.method !== "GET" || req.path.startsWith("/api")) {
        next();
        return;
      }

      try {
        const raw = await fs.readFile(path.join(root, "index.html"), "utf-8");
        const html = await vite.transformIndexHtml(req.originalUrl, raw);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (error) {
        vite.ssrFixStacktrace(error as Error);
        next(error);
      }
    });
  } else {
    const dist = path.join(root, "dist");
    app.use(express.static(dist, { index: false }));
    app.get(/.*/, (_req, res) => {
      res.sendFile(path.join(dist, "index.html"));
    });
  }

  return app;
}

const app = await createApp();
app.listen(port, () => {
  console.log(`Мой куратор: http://localhost:${port}`);
});
