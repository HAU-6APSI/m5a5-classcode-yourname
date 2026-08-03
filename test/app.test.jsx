import { describe, it, expect, beforeEach, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App.jsx'
import * as api from '../src/api.js'

// The API is not running during the tests. Instead we replace global.fetch, so
// every test controls exactly what the server "answers" and can assert what the
// front end asked for.

const INVESTIGATORS = [
  { id: 1, name: 'Ada Reyes', email: 'ada@hau.edu' },
  { id: 2, name: 'Boris Cruz', email: 'boris@hau.edu' },
]

const SIGHTINGS = [
  { id: 1, investigator_id: 1, place: 'Library 3rd floor', description: 'cold spot', spookiness: 2, investigator_name: 'Ada Reyes' },
  { id: 2, investigator_id: 1, place: 'Old gym', description: 'footsteps', spookiness: 5, investigator_name: 'Ada Reyes' },
  { id: 3, investigator_id: 2, place: 'Chapel', description: 'organ at 3am', spookiness: 4, investigator_name: 'Boris Cruz' },
]

const jsonResponse = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
})

// Answers any request from the demo world, and records the URLs asked for.
function installFetch({ sightings = SIGHTINGS, failWith = null } = {}) {
  const calls = []
  const fetchMock = vi.fn(async (url, options = {}) => {
    calls.push({ url: String(url), options })
    if (failWith && String(url).includes('/sightings') && (options.method ?? 'GET') === 'GET') {
      return jsonResponse({ error: failWith }, 500)
    }
    if (String(url).includes('/investigators')) return jsonResponse(INVESTIGATORS)
    if ((options.method ?? 'GET') === 'POST') return jsonResponse({ id: 99 }, 201)

    const match = String(url).match(/minSpookiness=(\d+)/)
    const rows = match ? sightings.filter((s) => s.spookiness >= Number(match[1])) : sightings
    return jsonResponse(rows)
  })
  vi.stubGlobal('fetch', fetchMock)
  return { calls, fetchMock }
}

beforeEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('api.js', () => {
  it('asks for every sighting when there is no filter', async () => {
    const { calls } = installFetch()
    await api.getSightings()
    expect(calls[0].url).toContain('/sightings')
    expect(calls[0].url).not.toContain('minSpookiness')
  })

  it('puts the filter in the query string', async () => {
    const { calls } = installFetch()
    await api.getSightings({ minSpookiness: 4 })
    expect(calls[0].url).toContain('minSpookiness=4')
  })

  it('throws when the API answers with an error status', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({ error: 'nope' }, 500)))
    await expect(api.getSightings()).rejects.toThrow()
  })

  it('posts a new sighting as JSON', async () => {
    const { calls } = installFetch()
    await api.createSighting({ investigator_id: 1, place: 'Roof', spookiness: 3 })
    const post = calls.find((c) => (c.options.method ?? 'GET') === 'POST')
    expect(post).toBeTruthy()
    expect(post.url).toContain('/sightings')
    expect(String(post.options.headers['Content-Type'])).toContain('application/json')
    expect(JSON.parse(post.options.body).place).toBe('Roof')
  })

  it('reads the investigators from the API', async () => {
    installFetch()
    await expect(api.getInvestigators()).resolves.toHaveLength(2)
  })
})

describe('Loading the sightings', () => {
  it('shows a loading state first', async () => {
    installFetch()
    render(<App />)
    expect(screen.getByTestId('loading')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument())
  })

  it('renders a card for every sighting', async () => {
    installFetch()
    render(<App />)
    await waitFor(() => expect(screen.getAllByTestId('sighting-card')).toHaveLength(3))
  })

  it('shows the place of each sighting', async () => {
    installFetch()
    render(<App />)
    expect(await screen.findByText('Old gym')).toBeInTheDocument()
  })

  it('shows who reported each sighting (the JOIN paying off)', async () => {
    installFetch()
    render(<App />)
    const card = (await screen.findByText('Chapel')).closest('[data-testid="sighting-card"]')
    expect(within(card).getByText(/Boris Cruz/)).toBeInTheDocument()
  })

  it('shows an error message when the API call fails', async () => {
    installFetch({ failWith: 'the crypt is closed' })
    render(<App />)
    expect(await screen.findByTestId('error')).toBeInTheDocument()
  })

  it('does not show the list when the API call fails', async () => {
    installFetch({ failWith: 'the crypt is closed' })
    render(<App />)
    await screen.findByTestId('error')
    expect(screen.queryByTestId('sighting-card')).not.toBeInTheDocument()
  })

  it('shows an empty state when there are no sightings', async () => {
    installFetch({ sightings: [] })
    render(<App />)
    expect(await screen.findByTestId('empty')).toBeInTheDocument()
  })
})

describe('The spookiness filter', () => {
  it('asks the API again with the filter in the query string', async () => {
    const { calls } = installFetch()
    render(<App />)
    await screen.findByText('Old gym')

    await userEvent.selectOptions(screen.getByTestId('filter'), '4')

    await waitFor(() =>
      expect(calls.some((c) => c.url.includes('minSpookiness=4'))).toBe(true)
    )
  })

  it('shows only the sightings the API returned for that filter', async () => {
    installFetch()
    render(<App />)
    await screen.findByText('Library 3rd floor')

    await userEvent.selectOptions(screen.getByTestId('filter'), '4')

    await waitFor(() => expect(screen.getAllByTestId('sighting-card')).toHaveLength(2))
    expect(screen.queryByText('Library 3rd floor')).not.toBeInTheDocument()
  })

  it('filters on the server, not in the browser', async () => {
    const { calls } = installFetch()
    render(<App />)
    await screen.findByText('Old gym')
    const before = calls.length

    await userEvent.selectOptions(screen.getByTestId('filter'), '5')

    await waitFor(() => expect(calls.length).toBeGreaterThan(before))
  })
})

describe('Reporting a new sighting', () => {
  it('offers the investigators from the API to choose from', async () => {
    installFetch()
    render(<App />)
    const form = await screen.findByTestId('new-sighting-form')
    await waitFor(() => expect(within(form).getByText('Ada Reyes')).toBeInTheDocument())
  })

  it('posts the new sighting to the API', async () => {
    const { calls } = installFetch()
    render(<App />)
    const form = await screen.findByTestId('new-sighting-form')
    await waitFor(() => expect(within(form).getByText('Boris Cruz')).toBeInTheDocument())

    await userEvent.selectOptions(within(form).getByLabelText(/reported by/i), '2')
    await userEvent.type(within(form).getByLabelText(/^place$/i), 'Rooftop')
    await userEvent.click(within(form).getByRole('button', { name: /add sighting/i }))

    await waitFor(() => {
      const post = calls.find((c) => (c.options.method ?? 'GET') === 'POST')
      expect(post).toBeTruthy()
      expect(JSON.parse(post.options.body).place).toBe('Rooftop')
    })
  })

  it('sends investigator_id and spookiness as numbers, not strings', async () => {
    const { calls } = installFetch()
    render(<App />)
    const form = await screen.findByTestId('new-sighting-form')
    await waitFor(() => expect(within(form).getByText('Ada Reyes')).toBeInTheDocument())

    await userEvent.selectOptions(within(form).getByLabelText(/reported by/i), '1')
    await userEvent.type(within(form).getByLabelText(/^place$/i), 'Stairwell')
    await userEvent.click(within(form).getByRole('button', { name: /add sighting/i }))

    await waitFor(() => {
      const post = calls.find((c) => (c.options.method ?? 'GET') === 'POST')
      expect(post).toBeTruthy()
      const body = JSON.parse(post.options.body)
      expect(typeof body.investigator_id).toBe('number')
      expect(typeof body.spookiness).toBe('number')
    })
  })

  it('reloads the list after a successful post', async () => {
    const { calls } = installFetch()
    render(<App />)
    const form = await screen.findByTestId('new-sighting-form')
    await waitFor(() => expect(within(form).getByText('Ada Reyes')).toBeInTheDocument())

    await userEvent.selectOptions(within(form).getByLabelText(/reported by/i), '1')
    await userEvent.type(within(form).getByLabelText(/^place$/i), 'Boiler room')
    await userEvent.click(within(form).getByRole('button', { name: /add sighting/i }))

    await waitFor(() => {
      const postIndex = calls.findIndex((c) => (c.options.method ?? 'GET') === 'POST')
      const laterGet = calls
        .slice(postIndex + 1)
        .some((c) => (c.options.method ?? 'GET') === 'GET' && c.url.includes('/sightings'))
      expect(laterGet).toBe(true)
    })
  })

  it('does not post an incomplete sighting', async () => {
    const { calls } = installFetch()
    render(<App />)
    const form = await screen.findByTestId('new-sighting-form')
    await screen.findByText('Old gym')

    await userEvent.click(within(form).getByRole('button', { name: /add sighting/i }))

    await waitFor(() => expect(within(form).getByRole('alert')).toBeInTheDocument())
    expect(calls.some((c) => (c.options.method ?? 'GET') === 'POST')).toBe(false)
  })
})
