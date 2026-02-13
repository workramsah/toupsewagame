import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import path from 'path'
import fs from 'fs'

// Load environment variables before initializing Prisma
if (!process.env.DATABASE_URL) {
  const envLocalPath = path.resolve(process.cwd(), '.env.local')
  const envPath = path.resolve(process.cwd(), '.env')
  
  console.log('Attempting to load env files...')
  console.log('Current working directory:', process.cwd())
  console.log('.env.local exists:', fs.existsSync(envLocalPath))
  console.log('.env exists:', fs.existsSync(envPath))
  
  if (fs.existsSync(envLocalPath)) {
    console.log('Loading .env.local from:', envLocalPath)
    const fileContent = fs.readFileSync(envLocalPath, 'utf8')
    console.log('File content preview:', fileContent.substring(0, 50) + '...')
    
    const result = config({ path: envLocalPath })
    if (result.error) {
      console.error('Error loading .env.local:', result.error)
    } else {
      console.log('Successfully loaded .env.local')
      console.log('DATABASE_URL after load:', process.env.DATABASE_URL ? 'SET' : 'NOT SET')
    }
  } else if (fs.existsSync(envPath)) {
    console.log('Loading .env from:', envPath)
    const result = config({ path: envPath })
    if (result.error) {
      console.error('Error loading .env:', result.error)
    } else {
      console.log('Successfully loaded .env')
    }
  }
  
  // Final check
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL still not found after loading .env files')
  } else {
    console.log('DATABASE_URL is now available')
  }
}

const globalForPrisma = globalThis

let prisma

try {
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient({
      log: ['error'],
    })
  } else {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient({
        log: ['query', 'error', 'warn'],
      })
    }
    prisma = globalForPrisma.prisma
  }
} catch (error) {
  console.error('Failed to initialize Prisma Client:', error)
  throw error
}

export { prisma }

