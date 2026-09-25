import type { Request, Response } from 'express'
import { checkDatabase } from '../config/database'
import { env } from '../config/env'

/** Reports service, database, and runtime health. */
export async function getHealth(_req: Request, res: Response): Promise<void> {
  const databaseConnected = await checkDatabase()

  // Health checks drive Render's routing and the keep-alive workflow. Returning
  // 200 while the database is down hides an outage and leaves clients to fail
  // later on every data-backed endpoint.
  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? 'ok' : 'degraded',
    service: 'changia-server',
    version: '0.1.0',
    environment: env.NODE_ENV,
    uptimeSeconds: Math.round(process.uptime()),
    database: databaseConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  })
}
