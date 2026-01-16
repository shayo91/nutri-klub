// Legacy MemStorage kept for backward compatibility
// New code should use dbStorage from server/db-storage.ts
// This file exports dbStorage as the default storage

export { dbStorage as storage } from "./db-storage";
