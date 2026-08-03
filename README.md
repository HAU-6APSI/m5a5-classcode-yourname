# Module 5 - Activity 5 - HAUnted Sightings client (front end capstone)

[![Made with Claude](https://img.shields.io/badge/Made_with-Claude-D97757?logo=anthropic&logoColor=white)](https://tjakoen.github.io/notes/ten-times-zero)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)

The last one. Everything the course covered meets in a single screen: JavaScript,
React, styling, a REST API and a relational database. You have spent this module
building an API nobody can see. Now you give it a face.

```
your React app  --fetch-->  the API  -->  PostgreSQL
   src/                     server/       two related tables
   YOU BUILD THIS           provided      provided
```

**The API is provided, finished and running.** Your work is entirely in `src/`.

## 🎓 This activity is graded (100 points)

**50 automated** (your tests pass) + **50 design**, judged from the screenshots
your Autograde run publishes and from your source. Read [`RUBRIC.md`](RUBRIC.md)
before you start. The thing most people skip, and the thing the rubric asks about
by name: **what the screen shows while it is loading, when the API fails, and
when there is nothing to show.**

## Start here

Two terminals, because two things are running:

```bash
npm install

npm run api     # terminal 1: the API on http://localhost:3000
npm run dev     # terminal 2: your app on http://localhost:5173
```

The API starts with an in-memory database already full of demo sightings, so
there is nothing to install and nothing to seed. Open
<http://localhost:3000/sightings> in a browser to see the raw JSON your front end
is about to render.

> Your fetch calls use relative URLs like `/api/sightings`. Vite forwards those to
> the API for you (see `vite.config.js`), which is why you never write
> `http://localhost:3000` in your code and never have to think about CORS.

## What to build

| File | What goes in it |
| --- | --- |
| [`src/api.js`](src/api.js) | every call to the API, and nothing else |
| [`src/App.jsx`](src/App.jsx) | state, loading the data, the filter, the three screen states |
| [`src/components/SightingList.jsx`](src/components/SightingList.jsx) | the list, or an honest empty state |
| [`src/components/SightingCard.jsx`](src/components/SightingCard.jsx) | one sighting, including **who reported it** |
| [`src/components/NewSightingForm.jsx`](src/components/NewSightingForm.jsx) | the report-a-sighting form |
| [`src/styles.css`](src/styles.css) | the design half of your grade |

The screen has to:

1. **Show every sighting**, each one naming the investigator who reported it.
   That name comes from the JOIN you wrote in m5a4: the API row stores only an
   id, and the JOIN turns it into a name.
2. **Filter by minimum spookiness**, by asking the API again with
   `?minSpookiness=<n>`. **Not** by fetching everything and filtering in the
   browser. The database is better at this than you are.
3. **Say what is happening**: a loading state, an error message when the API says
   no, and an empty state when nothing matches.
4. **Report a new sighting** through the form, then show it in the list.

The tests look for a few exact hooks so they can find things:
`data-testid` of `filter`, `loading`, `error`, `empty`, `sighting-list`,
`sighting-card`, and `new-sighting-form`, plus a real `<label>` on every form
field. Everything else, including how it all looks, is yours.

## Running the tests

```bash
npm test
```

The tests replace `fetch` with a fake, so they pass **without** the API running.
They check what your app *asked for* and what it *rendered*.

## Set up your repo

1. **Use this template -> Create a new repository.**
2. **Owner = the `HAU-6APSI` course org.**
3. **Name it** `m5a5-<classcode>-yourname`.
4. **Make it Private.**

```bash
git clone https://github.com/HAU-6APSI/m5a5-<classcode>-yourname.git
cd m5a5-<classcode>-yourname
```

## Confirm your submission

**Pushing your work is how you submit it.**

```bash
git add -A
git commit -m "Module 5 Activity 5 complete"
git push
```

Then open the **Actions** tab and confirm the green ✅ **Autograde** run. It also
starts the API, opens your built app at phone, tablet and desktop widths, and
publishes a screenshot of each to a `previews` branch. **Look at those
screenshots.** They are what your design half is graded from, so if one is blank
or broken, that is what your instructor sees.

## 💻 Work in a Codespace (recommended)

Already configured here - no local install. Open one: green **Code** button →
**Codespaces** → **Create codespace on main**. Nicer in VS Code Desktop
(☰ → **Open in VS Code Desktop**).

### ⏱️ Make your free hours last (please read)

1. **Idle timeout 10 min:** **github.com/settings/codespaces → Default idle
   timeout → 10 minutes → Save.**
2. **Stop it when you finish** (**github.com/codespaces → ••• → Stop codespace**).
3. **Delete the Codespace once submitted** (**github.com/codespaces → ••• →
   Delete**).

---
📚 **These materials were authored by [tjakoen](https://github.com/tjakoen), built with Claude.** I use AI in the open, and I expect you to use it to learn the material, not to skip the learning. [How I actually work with AI →](https://tjakoen.github.io/notes/ten-times-zero)
