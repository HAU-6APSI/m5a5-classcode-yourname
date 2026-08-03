// PROVIDED: starts the HAUnted Sightings API for your front end to talk to.
//
//   npm run api      -> http://localhost:3000
//
// By default it runs against an IN-MEMORY Postgres (pg-mem) seeded with demo
// data, so you need no database installed to build the UI. Point it at a real
// PostgreSQL instead by setting DATABASE_URL:
//
//   DATABASE_URL=postgres://... npm run api
//
// This is the m5a4 API, unchanged. Your job in m5a5 is the front end that
// consumes it, so nothing in server/ needs editing.

import { createApp } from './app.js'
import { createSchema } from './schema.js'
import * as investigatorsRepo from './investigatorsRepo.js'
import * as sightingsRepo from './sightingsRepo.js'
import { seed } from './seed.js'

const port = process.env.PORT || 3000

async function makePool() {
  if (process.env.DATABASE_URL) {
    const pg = (await import('pg')).default
    console.log('API: using the real PostgreSQL at DATABASE_URL')
    return { pool: new pg.Pool({ connectionString: process.env.DATABASE_URL }), fresh: false }
  }
  const { newDb } = await import('pg-mem')
  const { Pool } = newDb().adapters.createPg()
  console.log('API: using an in-memory Postgres (pg-mem) with demo data')
  return { pool: new Pool(), fresh: true }
}

const { pool, fresh } = await makePool()
await createSchema(pool)

// Only seed the throwaway in-memory database. Never write demo rows into a real one.
if (fresh) await seed(pool, investigatorsRepo, sightingsRepo)

createApp(pool).listen(port, () => {
  console.log(`HAUnted Sightings API listening on http://localhost:${port}`)
})
