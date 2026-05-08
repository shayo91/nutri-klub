/**
 * Dashboard feature toggle.
 * Server: set ENABLE_DASHBOARD=true in .env
 * Client: GET /api/public-config reads same env at runtime.
 */

export function isDashboardEnabled (): boolean {
	const raw =
		process.env.ENABLE_DASHBOARD ?? process.env.VITE_ENABLE_DASHBOARD ?? ''
	const v = String(raw).toLowerCase().trim()
	return v === 'true' || v === '1' || v === 'yes'
}
