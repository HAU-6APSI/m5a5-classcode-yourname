// PROVIDED - do not edit. This is the finished m5a4 API, the back end your front
// end talks to. It is here so you can run the whole stack from one repo.
//
// The database schema: two RELATED tables.
//
// investigators is the "parent" table and sightings is the "child": every
// sighting is reported BY one investigator. The link is the foreign key
// sightings.investigator_id -> investigators.id, which the database itself
// enforces, so a sighting can never point at an investigator who does not exist.
//
// Order matters: the parent table has to exist before a table can reference it.

export async function createSchema(pool) {
  await pool.query(`CREATE TABLE IF NOT EXISTS investigators (
    id    SERIAL PRIMARY KEY,
    name  TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  )`)

  await pool.query(`CREATE TABLE IF NOT EXISTS sightings (
    id              SERIAL PRIMARY KEY,
    investigator_id INTEGER NOT NULL REFERENCES investigators(id) ON DELETE CASCADE,
    place           TEXT NOT NULL,
    description     TEXT,
    spookiness      INTEGER NOT NULL,
    reported_at     TIMESTAMPTZ DEFAULT now()
  )`)
}
