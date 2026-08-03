// Every call your front end makes to the API belongs here, and nowhere else.
//
// Components should never call fetch directly: they ask this module for data and
// get plain JavaScript back. That is the same layering idea as m5a4 (routes do
// HTTP, repos do SQL), one storey up - and it is why these functions are easy to
// test on their own.
//
// Use RELATIVE urls starting with /api. Vite proxies /api to the API on port
// 3000 (see vite.config.js), so never hardcode http://localhost:3000 here.
//
// Research: fetch, async/await, response.ok, response.json(), and what a POST
// needs in its options (method, headers, body).

const BASE = '/api'

// TODO (worth writing first): one small helper that does a fetch, THROWS an
// Error when response.ok is false, and otherwise returns the parsed JSON.
// Every function below can then be three lines long.
//
// When the API sends back an error it looks like { error: "some reason" }. Use
// that as the Error message when it is there, so the UI can show something
// better than "something went wrong".

export function getSightings({ minSpookiness } = {}) {
  // TODO: GET /api/sightings
  // When minSpookiness has a value, ask for /api/sightings?minSpookiness=<n>
  // instead. When it does not, send no query string at all.
  // The FILTERING HAPPENS ON THE SERVER - do not fetch everything and filter it
  // in the browser.
}

export function getInvestigators() {
  // TODO: GET /api/investigators. The form needs these for its dropdown.
}

export function createSighting(sighting) {
  // TODO: POST /api/sightings with the sighting as a JSON body.
  // Two things are easy to forget: the Content-Type header, and that the body
  // has to be a STRING (JSON.stringify).
}
