// PROVIDED - do not edit. This is the finished m5a4 API, the back end your front
// end talks to. It is here so you can run the whole stack from one repo.
//
// Data access for the investigators table. Every query is parameterized.

export async function create(pool, { name, email }) {
  const result = await pool.query(
    `INSERT INTO investigators (name, email)
     VALUES ($1, $2)
     RETURNING *`,
    [name, email]
  )
  return result.rows[0]
}

export async function getAll(pool) {
  const result = await pool.query('SELECT * FROM investigators ORDER BY id')
  return result.rows
}

export async function getById(pool, id) {
  const result = await pool.query('SELECT * FROM investigators WHERE id = $1', [id])
  return result.rows[0] ?? null
}

export async function getByEmail(pool, email) {
  const result = await pool.query('SELECT * FROM investigators WHERE email = $1', [email])
  return result.rows[0] ?? null
}
