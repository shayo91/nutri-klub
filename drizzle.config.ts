import { defineConfig } from "drizzle-kit";
import "dotenv/config";

// Determine which database to use
const isSQLite = process.env.DATABASE_TYPE === "sqlite" || 
                 (!process.env.DATABASE_URL && process.env.NODE_ENV !== "production");

export default defineConfig(
  isSQLite
    ? {
        // SQLite configuration for local development
        out: "./migrations",
        schema: "./shared/schema-sqlite.ts",
        dialect: "sqlite",
        dbCredentials: {
          url: process.env.SQLITE_DB_PATH || "./local.db",
        },
      }
    : {
        // PostgreSQL configuration for production
        out: "./migrations",
        schema: "./shared/schema-pg.ts",
        dialect: "postgresql",
        dbCredentials: {
          url: process.env.DATABASE_URL || (() => {
            throw new Error("DATABASE_URL is required for PostgreSQL. Set DATABASE_TYPE=sqlite for local development.");
          })(),
        },
      }
);
