import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

// Prisma CLI does not load Next.js's .env.local automatically.
config({ path: '.env.local' });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts'
  },
  // Use Neon direct/unpooled URL for schema operations; runtime uses the pooled URL.
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || ''
  }
});
