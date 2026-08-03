// Module 5 - Activity 5 - the front end for the API you built in m5a4.
//
// The whole course meets here: JavaScript, React, styling, a REST API, and a
// relational database. Your app never talks to Postgres; it talks to the API,
// and the API talks to Postgres. Each layer only knows about the one below it.
//
// Research: useState, useEffect (and its dependency array), and how to render a
// list from an array of objects.

import { useState, useEffect } from 'react'
import { getSightings, getInvestigators, createSighting } from './api.js'
import SightingList from './components/SightingList.jsx'
import NewSightingForm from './components/NewSightingForm.jsx'

export default function App() {
  // TODO: state for the sightings, the investigators, the current filter value,
  // whether a load is in flight, and any error message.

  // TODO: load the sightings from the API.
  //   - it has to run when the app first appears, AND again whenever the filter
  //     changes (that is what makes the filter work)
  //   - set the loading state before, clear it after, whether it worked or not
  //   - a rejected promise means the API said no: store the message so the UI
  //     can show it, and do not leave a stale list on screen

  // TODO: load the investigators once, for the form's dropdown.

  // TODO: when the form reports a new sighting, send it to the API and then
  // reload the list so the new one appears.

  return (
    <div className="app">
      <header className="app__header">
        <h1>HAUnted Sightings</h1>
      </header>

      {/*
        TODO: the filter. A <label> reading "Minimum spookiness" and a control
        carrying data-testid="filter". Changing it must ask the API again with
        ?minSpookiness=<n>. An empty value means no filter at all.
      */}

      {/*
        TODO: the three states this screen can be in. Only ever one at a time:
          loading   -> an element with data-testid="loading"
          failed    -> an element with data-testid="error" holding the message
          loaded    -> <SightingList sightings={...} />
        A screen that shows nothing while it waits looks broken. This is the
        difference between an app and a demo.
      */}

      {/* TODO: <NewSightingForm investigators={...} onAdd={...} /> */}
    </div>
  )
}
