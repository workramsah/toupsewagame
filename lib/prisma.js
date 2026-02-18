import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';

const envPath = path.resolve(process.cwd(), '.env');
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) config({ path: envPath });
if (fs.existsSync(envLocalPath)) config({ path: envLocalPath });

const globalForPrisma = globalThis;
let prisma;

if (!process.env.DATABASE_URL) {
  console.warn('[prisma] DATABASE_URL not set. Set it in .env or .env.local.');
  prisma = null;
} else {
  try {
    if (process.env.NODE_ENV === 'production') {
      prisma = new PrismaClient({ log: ['error'] });
    } else {
      if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = new PrismaClient({ log: ['error', 'warn'] });
      }
      prisma = globalForPrisma.prisma;
    }
  } catch (err) {
    console.error('Prisma init failed:', err);
    prisma = null;
  }
}

export { prisma };
