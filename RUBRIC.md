# Rubric - m5a5 HAUnted Sightings client (front end capstone)

This capstone is worth **100 points**, split into an automated half and a design
half. Both halves are shown so this is the complete grading reference
(50 automated + 50 design = 100). The design half is graded from the published
screenshots (the `previews` branch) and the source.

## Automated checks (50 pts, scored from the tests - not by hand)

The automated 50 is proportional to the share of the suite that passes. The suite
is 26 tests, so each test is worth about 1.92 points. Here is what it covers:

| Check | Tests |
| --- | --- |
| `api.js`: no filter means no query string, a filter goes in the query string, a non-OK response throws, a new sighting is POSTed as JSON, investigators are read back | 5 |
| Loading: a loading state shows first, then a card per sighting, with the place visible | 3 |
| The JOIN on screen: each card names who reported it | 1 |
| Failure: an error message appears, and no stale list is left behind | 2 |
| Empty: an empty result says so rather than showing a blank screen | 1 |
| The filter: refetches with `?minSpookiness=`, shows what the API returned, and filters on the server rather than in the browser | 3 |
| The form: offers investigators from the API, POSTs the new sighting, converts the numeric fields, reloads the list afterwards, and refuses an incomplete sighting | 5 |
| `student.json` is filled in (one test per field) | 6 |
| **Automated subtotal** | **26 tests = 50 pts** |

## Design and front-end rubric (50 pts, scored by the instructor)

The AI proposes a score for ONLY this table; the automated half is scored
deterministically from the tests.

| Criterion | Max | Excellent (full marks) | Satisfactory (~60-80%) | Needs work (~0-40%) |
| --- | --- | --- | --- | --- |
| Visual design and hierarchy | 12 | deliberate spacing, type and colour; the sightings are pleasant to browse and the eye knows where to land | readable but plain or uneven | cluttered, or the browser defaults with a few colours dropped on top |
| Handling of real-world states | 10 | loading, error and empty are all designed, not afterthoughts; the screen never looks broken while it waits or when the API says no | present but bare (raw text dumped on the page) | missing, so a slow or failed request shows a blank or frozen screen |
| Responsive quality | 8 | adapts gracefully from 375px up, with sensible breakpoints and no overflow | works but awkward at some widths | only manages not to overflow |
| Component structure and data flow | 8 | a sensible split; every fetch lives in `api.js`; state sits at the level that needs it and is passed down as props; no duplicated server data | reasonable, with some drift (a stray fetch in a component, state kept too high or too low) | monolithic, fetch scattered through components, or server data copied into several places |
| Accessibility | 7 | real labels tied to every control, semantic elements, keyboard-usable, decent contrast | partly addressed | ignored: unlabelled inputs, div-only markup |
| Completeness and polish | 5 | the filter and the form are obvious and pleasant to use; the app feels finished | mostly there | thin or unfinished |

Design total: 50 points.

Notes for feedback: judge the design from the screenshots, not from the CSS
source. Name the concept to revisit or ask a guiding question; never hand over
corrected code. The states half (loading, error, empty) is the thing most
students skip, so say something concrete about it either way.
