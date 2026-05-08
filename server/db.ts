import "dotenv/config";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@shared/schema-sqlite";

// For local development, always use SQLite
// For production, this will be configured separately
const sqlite = new Database(process.env.SQLITE_DB_PATH || "./local.db");
export const db = drizzle(sqlite, { schema });

console.log("📦 Using SQLite database for local development");

// Note: For production with PostgreSQL, create a separate db-pg.ts file
// and use it conditionally based on environment
