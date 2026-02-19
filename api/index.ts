/**
 * Re-export Express app for Vercel. The main entry is index.ts at root
 * (per Vercel zero-config Express deployment). This file remains for
 * any tooling that expects api/index.ts.
 */
export { default } from "../index"
