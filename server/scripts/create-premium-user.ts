/**
 * Kreira jednog premium korisnika.
 * Pokretanje: npx tsx server/scripts/create-premium-user.ts
 * Opciono: PREMIUM_EMAIL=x@y.ba PREMIUM_PASSWORD=lozinka npx tsx server/scripts/create-premium-user.ts
 */

import "dotenv/config";
import { db } from "../db";
import { users } from "@shared/schema-sqlite";
import { hashPassword } from "../utils/password";
import { eq } from "drizzle-orm";

const PREMIUM_EMAIL = process.env.PREMIUM_EMAIL || "premium@example.com";
const PREMIUM_PASSWORD = process.env.PREMIUM_PASSWORD || "password123";

async function createPremiumUser() {
	console.log("Kreiranje premium korisnika...\n");

	const passwordHash = await hashPassword(PREMIUM_PASSWORD);
	const expiresAt = new Date();
	expiresAt.setFullYear(expiresAt.getFullYear() + 1);

	const existing = await db
		.select()
		.from(users)
		.where(eq(users.email, PREMIUM_EMAIL))
		.limit(1);

	if (existing.length > 0) {
		await db
			.update(users)
			.set({
				role: "premium",
				subscriptionStatus: "active",
				subscriptionTier: "yearly",
				subscriptionExpiresAt: expiresAt.toISOString(),
				updatedAt: new Date().toISOString(),
			})
			.where(eq(users.email, PREMIUM_EMAIL));
		console.log("Korisnik već postoji – ažuriran na premium.");
	} else {
		await db.insert(users).values({
			email: PREMIUM_EMAIL,
			passwordHash,
			firstName: "Premium",
			lastName: "Korisnik",
			role: "premium",
			subscriptionStatus: "active",
			subscriptionTier: "yearly",
			subscriptionExpiresAt: expiresAt.toISOString(),
		});
		console.log("Kreiran novi premium korisnik.");
	}

	console.log("\nPrijava:");
	console.log("  Email:    ", PREMIUM_EMAIL);
	console.log("  Lozinka:  ", PREMIUM_PASSWORD);
	console.log("");
}

createPremiumUser()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
