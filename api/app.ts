/**
 * Shared Express app for Vercel serverless functions.
 * Used by api/index.ts and api/[[...path]].ts
 */
import "dotenv/config"
import express, { type Request, Response, NextFunction } from "express"
import { registerRoutes } from "../server/routes.js"
import { log } from "../server/log.js"

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
	const start = Date.now()
	const path = req.path
	let capturedJsonResponse: Record<string, unknown> | undefined

	const originalResJson = res.json.bind(res)
	res.json = function (bodyJson: unknown) {
		capturedJsonResponse = bodyJson as Record<string, unknown>
		return originalResJson(bodyJson)
	}

	res.on("finish", () => {
		const duration = Date.now() - start
		if (path.startsWith("/api")) {
			let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`
			if (capturedJsonResponse) {
				logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`
			}
			if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…"
			log(logLine)
		}
	})
	next()
})

await registerRoutes(app)

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
	const status = (err as { status?: number }).status || 500
	const message = err.message || "Internal Server Error"
	res.status(status).json({ message })
})

export default app
