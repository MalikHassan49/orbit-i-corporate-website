import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import morgan from 'morgan'
import { env } from './config/env'
import { apiRateLimiter } from './middleware/rateLimiter'
import { notFoundHandler } from './middleware/validate'
import { errorHandler } from './middleware/errorHandler'
import apiRouter from './routes/index'

const app = express()

// --- Security & core middleware -------------------------------------------------
app.use(helmet())
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
)
app.use(compression())
app.use(cookieParser())
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(apiRateLimiter)

if (!env.isProduction) {
  app.use(morgan('dev'))
}

// --- Routes -----------------------------------------------------------------------
app.use('/api/v1', apiRouter)

// --- 404 + error handling ----------------------------------------------------------
app.use(notFoundHandler)
app.use(errorHandler)

export default app
