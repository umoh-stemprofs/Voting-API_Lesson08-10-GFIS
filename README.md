# Class Election — Voting API

A tiny classroom exercise: an Express API that tallies votes for three candidates, plus a
static web page that displays the results live. It ships with a second, unrelated
Node script that shares files over the local network.

The front end only renders data and does the maths. All vote storage lives in the
back end (`server.js`), in memory.

## Requirements

- Node.js 18+ (tested on Node 24)
- npm (comes with Node)

## Install

From the project root:

```bash
npm install
```

This installs the single runtime dependency, Express 5.

## Running the voting server

```bash
node server.js
```

The app listens on port **3000**:

- <http://localhost:3000/> — the election page
- <http://localhost:3000/candidates> — the raw JSON tally

To reach it from another device on the same network, use your machine's LAN IP,
e.g. `http://192.168.1.20:3000`.

Stop it with `Ctrl+C`. Votes are held in an array in memory, so **every restart resets
all counts to zero**.

## Running the file-sharing server

```bash
node share/share.js
```

It listens on port **8080** and serves everything inside the `share/share/` folder:

- <http://localhost:8080/> — an index listing the shared files
- <http://localhost:8080/<filename>> — download a file

This script is independent of the voting app and does not need Express. It is meant for
a trusted local network only: it has no authentication and lists directory contents.

## API routes

Base URL: `http://localhost:3000`

### `GET /candidates`

Returns every candidate with its current vote count.

```bash
curl http://localhost:3000/candidates
```

```json
[
  { "name": "Ada", "votes": 0 },
  { "name": "Tunde", "votes": 0 },
  { "name": "Chioma", "votes": 0 }
]
```

Status: `200`.

### `POST /vote`

Adds one vote to the named candidate. Send JSON with a `Content-Type: application/json`
header.

```bash
curl -X POST http://localhost:3000/vote \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada"}'
```

Success — `200`, returns the updated candidate:

```json
{ "name": "Ada", "votes": 1 }
```

Unknown candidate — `404`:

```json
{ "error": "Candidate not found" }
```

The page calls this same route when a Vote button is clicked.

> Note: the route is `/vote` (singular). An earlier version registered the handler at
> `/votes`, which made every vote return 404; both the server and the page now use
> `/vote`.

## How the page behaves

- Results refresh automatically every 2 seconds, showing total votes, the leader(s),
  a count and percentage per candidate, and a bar for each.
- To mimic one vote per browser, the page stores a `voted` flag in `localStorage` and
  disables the buttons afterwards. The clearing link at the bottom ("Let me vote again")
  removes that flag so you can test again — it only affects the browser, not the server.
- Because the one-vote rule is client side, the API itself will accept any number of
  votes for the same candidate.

## Project structure

```
server.js              Express voting API + static hosting for public/
public/index.html      Election page (fetches /candidates, posts to /vote)
package.json           Metadata and the express dependency
share/share.js         Standalone file-sharing server on port 8080
share/share/           Files offered by the sharing server
```

## Quick verification

With the server running:

```bash
curl http://localhost:3000/candidates
curl -X POST http://localhost:3000/vote -H "Content-Type: application/json" -d '{"name":"Ada"}'
curl -X POST http://localhost:3000/vote -H "Content-Type: application/json" -d '{"name":"Nobody"}'
```

You should see a `200` with `"votes": 1`, then a `404` with `"Candidate not found"`.
