// Load env first so Prisma CLI gets DATABASE_URL (e.g. for migrate deploy)
import { config } from "dotenv";
import path from "path";
import fs from "fs";
const root = process.cwd();
if (fs.existsSync(path.join(root, ".env"))) config({ path: path.join(root, ".env") });
if (fs.existsSync(path.join(root, ".env.local"))) config({ path: path.join(root, ".env.local") });

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    provider: "mysql",
    url: env("DATABASE_URL"),
  },
});
