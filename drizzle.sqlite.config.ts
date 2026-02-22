import { defineConfig } from "drizzle-kit";

const dbPath = process.env.SQLITE_DB_PATH || "./local.db";

export default defineConfig({
  out: "./migrations-sqlite",
  schema: "./shared/schema-sqlite.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: dbPath.startsWith("file:") ? dbPath : `file:${dbPath}`,
  },
});
