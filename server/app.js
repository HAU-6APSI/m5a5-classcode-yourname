// PROVIDED - do not edit. This is the finished m5a4 API, the back end your front
// end talks to. It is here so you can run the whole stack from one repo.
//
// The HTTP layer: Express routes over two related tables.
//
// The rule that holds the whole app together: routes speak HTTP (status codes,
// req/res) and the repos speak SQL. There is no SQL in this file, and there is no
// req/res in the repos.

import express from 'express'
import * as investigators from './investigatorsRepo.js'
import * as sightings from './sightingsRepo.js'

// --- middleware -------------------------------------------------------------

// Runs before the handler on any route with an :id, so no handler ever has to
// wonder whether the id it was given is a number.
function requireNumericId(req, res, next) {
  if (!/^\d+$/.test(req.params.id)) {
    return res.status(400).json({ error: 'id must be a number' })
  }
  next()
}

// The error handler. Four arguments is what makes Express treat it as one, and
// it must be registered last. Anything that throws or calls next(err) lands
// here, including a malformed JSON body rejected by express.json().
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 500
  res.status(status).json({ error: err.message || 'Internal server error' })
}

// --- validation -------------------------------------------------------------

function validInvestigator(body) {
  return (
    typeof body?.name === 'string' &&
    body.name.trim() !== '' &&
    typeof body?.email === 'string' &&
    body.email.includes('@')
  )
}

function validSighting(body) {
  return (
    Number.isInteger(body?.investigator_id) &&
    typeof body?.place === 'string' &&
    body.place.trim() !== '' &&
    Number.isInteger(body?.spookiness) &&
    body.spookiness >= 1 &&
    body.spookiness <= 5
  )
}

// --- the app ----------------------------------------------------------------

export function createApp(pool) {
  const app = express()
  app.use(express.json())

  app.get('/health', (req, res) => res.json({ status: 'ok' }))

  // --- investigators --------------------------------------------------------

  app.get('/investigators', async (req, res, next) => {
    try {
      res.json(await investigators.getAll(pool))
    } catch (err) {
      next(err)
    }
  })

  app.post('/investigators', async (req, res, next) => {
    try {
      if (!validInvestigator(req.body)) {
        return res.status(400).json({ error: 'name and email are required' })
      }
      if (await investigators.getByEmail(pool, req.body.email)) {
        return res.status(409).json({ error: 'that email is already registered' })
      }
      res.status(201).json(await investigators.create(pool, req.body))
    } catch (err) {
      next(err)
    }
  })

  // A nested route: the sightings that BELONG TO one investigator.
  app.get('/investigators/:id/sightings', requireNumericId, async (req, res, next) => {
    try {
      if (!(await investigators.getById(pool, req.params.id))) {
        return res.status(404).json({ error: 'investigator not found' })
      }
      res.json(await sightings.getByInvestigator(pool, req.params.id))
    } catch (err) {
      next(err)
    }
  })

  // --- sightings ------------------------------------------------------------

  app.get('/sightings', async (req, res, next) => {
    try {
      const raw = req.query.minSpookiness
      if (raw !== undefined && !/^\d+$/.test(raw)) {
        return res.status(400).json({ error: 'minSpookiness must be a number' })
      }
      const minSpookiness = raw === undefined ? undefined : Number(raw)
      res.json(await sightings.getAll(pool, { minSpookiness }))
    } catch (err) {
      next(err)
    }
  })

  app.get('/sightings/:id', requireNumericId, async (req, res, next) => {
    try {
      const row = await sightings.getById(pool, req.params.id)
      if (!row) return res.status(404).json({ error: 'sighting not found' })
      res.json(row)
    } catch (err) {
      next(err)
    }
  })

  app.post('/sightings', async (req, res, next) => {
    try {
      if (!validSighting(req.body)) {
        return res.status(400).json({ error: 'investigator_id, place and spookiness (1-5) are required' })
      }
      // The foreign key would reject this anyway, but a 400 with a clear reason
      // is a much better answer than a database error.
      if (!(await investigators.getById(pool, req.body.investigator_id))) {
        return res.status(400).json({ error: 'investigator_id does not exist' })
      }
      res.status(201).json(await sightings.create(pool, req.body))
    } catch (err) {
      next(err)
    }
  })

  app.patch('/sightings/:id', requireNumericId, async (req, res, next) => {
    try {
      const existing = await sightings.getById(pool, req.params.id)
      if (!existing) return res.status(404).json({ error: 'sighting not found' })

      const merged = { ...existing, ...req.body }
      res.json(await sightings.update(pool, req.params.id, merged))
    } catch (err) {
      next(err)
    }
  })

  app.delete('/sightings/:id', requireNumericId, async (req, res, next) => {
    try {
      const deleted = await sightings.remove(pool, req.params.id)
      if (!deleted) return res.status(404).json({ error: 'sighting not found' })
      res.status(204).end()
    } catch (err) {
      next(err)
    }
  })

  app.use((req, res) => res.status(404).json({ error: 'Not found' }))
  app.use(errorHandler)

  return app
}
