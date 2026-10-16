# Rep Counter

A full-stack take-home exercise that counts squat repetitions from browser-local knee-angle samples and saves only a patient-owned session summary.

## Development approach

I used AI as a development assistant, guided by structured engineering skills such as TDD, code review, architecture review, and debugging. The AI helped me challenge design decisions, identify edge cases, and improve code quality; it did not replace my ownership of the solution.

I independently verified the final application locally, reviewed the implementation and API behaviour, and ran formatting, linting, type checks, automated tests, and production builds before submission.

## Run locally

Use Node.js 22 and pnpm 10.

```bash
pnpm install
pnpm dev
```

The web app runs at `http://localhost:5173` and the API at `http://localhost:3000`. The API creates its local SQLite database at `data/rep-counter.sqlite`.

## Commands

| Command             | Purpose                                     |
| ------------------- | ------------------------------------------- |
| `pnpm dev`          | Run the API and web app together.           |
| `pnpm format:check` | Check formatting.                           |
| `pnpm lint`         | Lint application code.                      |
| `pnpm typecheck`    | Run TypeScript checks across the workspace. |
| `pnpm test`         | Run unit and HTTP integration tests.        |
| `pnpm build`        | Produce production builds.                  |

## Architecture

The repository is a pnpm workspace managed with Turborepo.

- `apps/web` is a React and Vite client styled with Tailwind CSS and shadcn primitives.
- `apps/api` is a NestJS API using Drizzle with SQLite.
- `packages/contracts` contains the Zod session-result contract shared by API and client.
- `packages/rep-counter` contains the pure browser-side repetition-counting algorithm.
- `fixtures` contains deterministic exercise sessions used by the client and unit tests.

The client counts repetitions from angle samples locally. It sends only `sessionId`, `reps`, `durationSec`, and `performedAt`. Raw angle samples never cross the API boundary.

## Behaviour

A repetition is counted when an angle below `100°` is followed later by one above `160°`. The included fixtures produce 10 clean, 8 noisy, and 7 shallow repetitions.

Two static demo patients are available in the UI: Alice and Bob. Their bearer tokens map to separate API histories. A database unique constraint protects `(patientId, sessionId)`:

- An identical retry returns the originally stored session result.
- A different payload for the same patient and session ID returns `409 Conflict`.

If a save fails in the current page session, the client retains the exact payload and offers a retry rather than generating a new session ID.

## Verification

The test suite covers the pure repetition counter and the API HTTP boundary, including authentication, strict request validation, patient isolation, result ordering, idempotent retries, and conflicts. CI runs formatting, linting, type checks, tests, and the production build on every push and pull request.

## Intentional take-home compromises

- Authentication uses hard-coded demo bearer tokens instead of a real identity provider.
- SQLite is stored locally via `sql.js`; a production service would use a managed database, migrations, backups, and observability.
- The UI has no browser E2E suite for this submission; the automated coverage is focused on the repetition algorithm and API contract.
- A failed save is retryable while the page remains open; it is not queued across a browser restart.
