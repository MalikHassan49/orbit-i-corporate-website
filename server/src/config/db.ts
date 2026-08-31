import mongoose from 'mongoose'
import { env } from './env'

mongoose.set('strictQuery', true)

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.mongoUri)
    console.log(`[db] connected to MongoDB (${env.isProduction ? 'production' : 'development'})`)
  } catch (error) {
    console.error('[db] failed to connect to MongoDB', error)
    process.exit(1)
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] MongoDB connection lost')
  })
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect()
}
