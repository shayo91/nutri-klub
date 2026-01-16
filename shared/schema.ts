// Main schema file - for convenience, re-exports SQLite schema
// In production, server/db.ts will directly import schema-pg.ts
// This file is primarily for backward compatibility

export * from "./schema-sqlite";
