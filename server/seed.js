// PROVIDED: demo data, so the API has something to serve while you build the UI.
//
// This is the world your front end renders: three investigators and the
// sightings they reported. Change it if you want different test data on screen -
// nothing here is graded.

export const DEMO_INVESTIGATORS = [
  { name: 'Ada Reyes', email: 'ada@hau.edu' },
  { name: 'Boris Cruz', email: 'boris@hau.edu' },
  { name: 'Cara Lim', email: 'cara@hau.edu' },
]

export const DEMO_SIGHTINGS = [
  { investigator: 'ada@hau.edu', place: 'Library 3rd floor', description: 'A cold spot that follows you along the shelves.', spookiness: 2 },
  { investigator: 'ada@hau.edu', place: 'Old gym', description: 'Footsteps on the bleachers with nobody there.', spookiness: 5 },
  { investigator: 'boris@hau.edu', place: 'Chapel', description: 'The organ plays four notes at 3am, always the same four.', spookiness: 4 },
  { investigator: 'boris@hau.edu', place: 'Canteen freezer', description: 'Humming, in tune, from inside.', spookiness: 3 },
  { investigator: 'cara@hau.edu', place: 'Parking basement', description: 'Every car alarm at once, then silence.', spookiness: 5 },
  { investigator: 'cara@hau.edu', place: 'Room 402', description: 'Chairs stacked overnight. Nobody has the key.', spookiness: 1 },
]

export async function seed(pool, investigatorsRepo, sightingsRepo) {
  const byEmail = new Map()
  for (const person of DEMO_INVESTIGATORS) {
    byEmail.set(person.email, await investigatorsRepo.create(pool, person))
  }
  for (const s of DEMO_SIGHTINGS) {
    await sightingsRepo.create(pool, {
      investigator_id: byEmail.get(s.investigator).id,
      place: s.place,
      description: s.description,
      spookiness: s.spookiness,
    })
  }
}
