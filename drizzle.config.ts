import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

const isSQLite =
	process.env.DATABASE_TYPE === 'sqlite' ||
	(!process.env.DATABASE_URL && process.env.NODE_ENV !== 'production');

export default defineConfig(
	isSQLite
		? {
				out: './migrations',
				schema: './shared/schema-sqlite.ts',
				dialect: 'sqlite',
				dbCredentials: {
					url: process.env.SQLITE_DB_PATH || './local.db',
				},
			}
		: {
				out: './migrations',
				schema: './shared/schema.ts',
				dialect: 'postgresql',
				dbCredentials: {
					url: process.env.DATABASE_URL!,
				},
			},
);
