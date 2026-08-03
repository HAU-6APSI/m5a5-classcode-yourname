import { useState } from 'react'

// The report-a-sighting form.
//
// Props: `investigators` (for the dropdown) and `onAdd`, which the App gives you
// to call with the finished sighting. This component does not know the API
// exists - it just hands its result upwards. Research "lifting state up".

export default function NewSightingForm({ investigators, onAdd }) {
  // TODO: state for the fields being typed.

  // TODO: render a <form> carrying data-testid="new-sighting-form" with:
  //   - "Reported by": a dropdown built from the investigators prop
  //   - "Place":       a text input
  //   - "Description": a textarea
  //   - "Spookiness":  a control for 1 to 5
  //   - a submit button reading "Add sighting"
  //
  // Every field needs a real <label> tied to its input (htmlFor + id). That is
  // not decoration: it is how a screen reader, and the tests, find the field.

  // TODO: on submit
  //   - stop the browser reloading the page (research: event.preventDefault)
  //   - refuse to send an incomplete sighting, and say why in an element with
  //     role="alert"
  //   - call onAdd(...) with the values
  //
  // WATCH OUT: form inputs always give you STRINGS. The API wants
  // investigator_id and spookiness as NUMBERS. Converting them is your job.
  return null
}
