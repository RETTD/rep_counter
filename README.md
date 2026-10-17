# Rep Counter

A full-stack take-home exercise that counts squat repetitions from browser-local knee-angle samples and saves only a patient-owned session summary.

## Development approach

The period between the first and last commit does not represent continuous work. I had pre-existing personal commitments, so I worked in smaller, focused sessions. Each commit represents a coherent, working increment rather than an incomplete snapshot.

I used AI as a development assistant throughout the task. It helped challenge decisions and speed up feedback loops, while I remained responsible for the final design, implementation, verification, and scope.

### Planning

I used structured AI-guided planning with `grill-with-docs` and `grilling` to clarify the domain boundaries, define the persistence and idempotency rules, choose the project structure, and keep the scope aligned with the take-home brief.

### Implementation

I used `tdd` for behaviour-first implementation, `diagnosing-bugs` to reproduce and resolve the NestJS development-server dependency-injection failure, and `ponytail` to keep feature work focused and avoid unnecessary abstraction.

This included validating API boundaries, keeping raw angle samples browser-only, and separating UI state from feature logic.

### Code review and verification

Before using AI review workflows, I reviewed the code myself for correctness, edge cases, ownership boundaries, naming, unnecessary complexity, and consistency with the chosen architecture.

I then used `caveman-review` for a concise whole-project review and `ponytail-review` for a deeper review of correctness, safety, test coverage, performance, and unnecessary code.

Those reviews identified and addressed issues around retry behaviour, timestamp ordering, database persistence, UI state during patient switching, and the CI build order for shared contracts.

I independently verified the final application locally and ran formatting, linting, type checks, automated tests, API checks, and production builds before submission.

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
