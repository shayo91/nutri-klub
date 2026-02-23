import express, { type Express, type Request, type Response } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config.js";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export type ServeSpa = (req: Request, res: Response) => void;

export async function setupVite(
  app: Express,
  server: Server
): Promise<ServeSpa> {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  const clientTemplate = path.resolve(
    import.meta.dirname,
    "..",
    "client",
    "index.html",
  );

  const serveSpa: ServeSpa = async (req, res) => {
    try {
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(req.originalUrl, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      res.status(500).send("Internal Server Error");
    }
  };

  app.use(vite.middlewares);
  return serveSpa;
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  const assetsPath = path.join(distPath, "assets");
  if (fs.existsSync(assetsPath)) {
    app.use(
      "/assets",
      express.static(assetsPath, {
        maxAge: "1y",
        immutable: true,
      }),
    );
  }

  app.use(
    express.static(distPath, {
      setHeaders: (res, filePath) => {
        const relativePath = path.relative(distPath, filePath);
        if (relativePath === "index.html" || relativePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-cache");
        } else if (
          !relativePath.startsWith("assets") &&
          (relativePath.endsWith(".js") ||
            relativePath.endsWith(".css") ||
            relativePath.endsWith(".svg"))
        ) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      },
    }),
  );

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
