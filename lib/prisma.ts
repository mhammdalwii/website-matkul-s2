import "dotenv/config";
import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// CACHE BUSTING: Kita ubah nama kunci globalnya menjadi "_v2"
// Ini akan memaksa Turbopack melupakan memori lamanya
const globalForPrisma = global as unknown as {
  prisma_v2: PrismaClient;
  pgPool_v2: pg.Pool;
};

const pool = globalForPrisma.pgPool_v2 || new Pool({ connectionString });
if (process.env.NODE_ENV !== "production") globalForPrisma.pgPool_v2 = pool;

const adapter = new PrismaPg(pool);

// Buat instance baru menggunakan konfigurasi yang fresh
const prisma = globalForPrisma.prisma_v2 || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma_v2 = prisma;

export default prisma;
