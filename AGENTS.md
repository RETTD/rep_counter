## Domain boundary

- Angle Samples are browser-only. Never send, accept, persist, log, or return them from the API.
- A Session Result belongs to one Patient and contains only `sessionId`, `reps`, `durationSec`, and `performedAt`.
- Preserve idempotency per `(patientId, sessionId)`: identical retries return the stored result; different payloads for that key are conflicts.

## Code shape

- Use strict TypeScript, precise names, and Zod at HTTP boundaries. Keep domain logic pure and outside React components.
- NestJS controllers map HTTP; services own application rules; repositories own persistence.
- Treat `shared/ui` as shadcn-owned and immutable. Application code imports UI only from `shared/components`, where shadcn primitives may be composed and styled.
- Organize application code by feature. Keep public contracts in the shared contracts package.

## Quality

- Add a behavior-focused test for every changed public seam.
- Do not add AI-generated code comments. Communicate intent through names, types, small functions, and tests.
- Keep scope to the take-home brief. Record any intentional production compromise in the README.
