// One sighting, on screen.
//
// It receives a sighting object and renders it. No fetch, no state: give it the
// same props and it draws the same thing every time. That is what makes a
// component easy to reuse and easy to test.

export default function SightingCard({ sighting }) {
  // TODO: render the sighting inside an element carrying
  // data-testid="sighting-card".
  //
  // It has to show:
  //   - the place
  //   - the description (when there is one - it is optional in the database)
  //   - the spookiness, 1 to 5, however you want to show it
  //   - WHO REPORTED IT: sighting.investigator_name
  //
  // That last field is the JOIN from m5a4 arriving on screen. The API row only
  // stores investigator_id, a number; the JOIN is what turns it into a name.
  return null
}
