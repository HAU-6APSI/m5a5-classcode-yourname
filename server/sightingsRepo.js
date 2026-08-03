// PROVIDED - do not edit. This is the finished m5a4 API, the back end your front
// end talks to. It is here so you can run the whole stack from one repo.
//
// Data access for the sightings table.
//
// Every read JOINs investigators so the caller gets the reporter's name
// (investigator_name) alongside the sighting, instead of just a bare id. That is
// the whole point of relating two tables: one query, one joined-up answer.

// One SELECT reused by every read. The WHERE clause is built from the optional
// filters; both are parameterized, so nothing is ever glued into the SQL string.
const SELECT_JOINED = `
  SELECT s.*, i.name AS investigator_name
  FROM sightings s
  JOIN investigators i ON i.id = s.investigator_id`

export async function create(pool, { investigator_id, place, description, spookiness }) {
  const result = await pool.query(
    `INSERT INTO sightings (investigator_id, place, description, spookiness)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [investigator_id, place, description ?? null, spookiness]
  )
  return result.rows[0]
}

export async function getAll(pool, { minSpookiness } = {}) {
  if (minSpookiness === undefined || minSpookiness === null) {
    const result = await pool.query(`${SELECT_JOINED} ORDER BY s.id`)
    return result.rows
  }

  const result = await pool.query(
    `${SELECT_JOINED} WHERE s.spookiness >= $1 ORDER BY s.id`,
    [minSpookiness]
  )
  return result.rows
}

export async function getById(pool, id) {
  const result = await pool.query(`${SELECT_JOINED} WHERE s.id = $1`, [id])
  return result.rows[0] ?? null
}

export async function getByInvestigator(pool, investigatorId) {
  const result = await pool.query(
    `${SELECT_JOINED} WHERE s.investigator_id = $1 ORDER BY s.id`,
    [investigatorId]
  )
  return result.rows
}

export async function update(pool, id, { place, description, spookiness }) {
  const result = await pool.query(
    `UPDATE sightings
     SET place = $1, description = $2, spookiness = $3
     WHERE id = $4
     RETURNING id`,
    [place, description ?? null, spookiness, id]
  )
  if (result.rows.length === 0) return null

  // Re-read through getById so an updated sighting comes back in exactly the
  // same shape as every other read, investigator_name included.
  return getById(pool, id)
}

export async function remove(pool, id) {
  const result = await pool.query('DELETE FROM sightings WHERE id = $1 RETURNING id', [id])
  return result.rows.length > 0
}
