/**
 * Kreira jednog admin korisnika.
 * Pokretanje: npx tsx server/scripts/create-admin-user.ts
 * Opciono: ADMIN_EMAIL=x@y.ba ADMIN_PASSWORD=lozinka npx tsx server/scripts/create-admin-user.ts
 */

import "dotenv/config";
import { db } from "../db";
import { users } from "@shared/schema-sqlite";
import { hashPassword } from "../utils/password";
import { eq } from "drizzle-orm";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

async function createAdminUser() {
	console.log("Kreiranje admin korisnika...\n");

	const passwordHash = await hashPassword(ADMIN_PASSWORD);

	const existing = await db
		.select()
		.from(users)
		.where(eq(users.email, ADMIN_EMAIL))
		.limit(1);

	if (existing.length > 0) {
		await db
			.update(users)
			.set({
				role: "admin",
				passwordHash,
				subscriptionStatus: "active",
				updatedAt: new Date().toISOString(),
			})
			.where(eq(users.email, ADMIN_EMAIL));
		console.log("Korisnik već postoji – ažuriran na admin.");
	} else {
		await db.insert(users).values({
			email: ADMIN_EMAIL,
			passwordHash,
			firstName: "Admin",
			lastName: "Korisnik",
			role: "admin",
			subscriptionStatus: "active",
		});
		console.log("Kreiran novi admin korisnik.");
	}

	console.log("\nPrijava (admin):");
	console.log("  Email:    ", ADMIN_EMAIL);
	console.log("  Lozinka:  ", ADMIN_PASSWORD);
	console.log("");
}

createAdminUser()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
