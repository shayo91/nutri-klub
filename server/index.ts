import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic } from "./vite.js";
import { log } from "./log.js";

const app = express();

// Stripe webhook verifies raw body — must run before JSON parser
app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json", limit: "2mb" }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  let server: Server;
  if (app.get("env") === "development") {
    server = createServer(app);
    const serveSpa = await setupVite(app, server);
    await registerRoutes(app, { serveSpa, server });
  } else {
    server = await registerRoutes(app);
    serveStatic(app);
  }

  // Error handler middleware (must be last)
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
  });

  const port = 3000;
  const host = app.get("env") === "development" ? "127.0.0.1" : "0.0.0.0";
  server.listen(
    {
      port,
      host,
    },
    () => {
      log(`serving at http://${host}:${port}`);
    }
  );
})();
