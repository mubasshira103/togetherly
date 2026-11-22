<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Togetherly

Single Next.js 16 App Router app (UI brand is **Kindora**) plus a sibling Express API at `../togetherly-server`. No test runner, no CI, no formatter.

## Verify before finishing

- `cmd /c "npm run lint"` (flat ESLint config, whole repo), `node node_modules/typescript/bin/tsc --noEmit`, `cmd /c "npm run build"` — all three must pass.
- **The `npm`/`npx` PowerShell shims are blocked by execution policy** on this machine: prefix with `cmd /c` or invoke binaries via `node node_modules/<pkg>/...`. Bare `npm run lint` fails with `npm.ps1 cannot be loaded`.
- Nothing to run for tests: no test files, no `.github/`, and the sibling server's `test` script is a stub.

## Commands

- `cmd /c "npm run dev"` / `"npm run build"` / `"npm run start"`
- API server: `node index.js` inside `../togetherly-server` (port 5000). Data pages need it running; the home page (`/`) is static (its `UpcomingEvents` section is commented out) and does not call the API.
- **Reload loop = wedged dev server, not app code.** If the browser reloads every ~0.5s, stop `next dev`, delete `.next`, and restart. Confirm in `.next/dev/logs/next-development.log`: the wedged server repeats `Download the React DevTools` + `Compiled in 1-3ms` pairs indefinitely. That log is the first place to look for any dev-server weirdness.
- `NEXT_PUBLIC_API_URL` defaults to `http://localhost:5000/api` in `src/lib/api.ts`.

## Architecture

- Every data page is a `'use client'` component fetching in `useEffect` through `api()` (`src/lib/api.ts`): attaches the better-auth JWT as `Authorization: Bearer` (falls back to unauthenticated if `authClient.token()` throws), `cache: 'no-store'`, throws `Error(data.message)` on non-2xx. No server-side data fetching.
- **Two Mongo databases on one cluster:** better-auth uses `ticketoDb` (`src/lib/auth.ts`), the Express API uses `Togetherly`. Users/sessions are not in the same database as events — don't expect joins between them.
- better-auth: catch-all handler `src/app/api/auth/[...all]/route.ts`; `jwt` plugin pinned to `issuer`/`audience` = `BETTER_AUTH_URL`. The Express server verifies against `${AUTH_URL || CLIENT_URL}/api/auth/jwks` with the same issuer/audience, so changing `BETTER_AUTH_URL` breaks API auth until both env files match.
- Email+password (`minPasswordLength: 6`; the register form additionally requires an uppercase and a lowercase letter) and Google OAuth. Google is enabled only when both credentials exist and neither starts with `your-`/`replace-`; both `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` and the legacy `BETTER_AUTH_GOOGLE_*` names are read.
- Identity comes only from the verified token (`sub`, `email`, `name`). `POST /events` overwrites any body `creatorEmail`; `PATCH`/`DELETE /events/:id` return `403` unless `creatorId` (or legacy `creatorEmail`) matches the caller.

## API contract

- `GET /events` → `EventItem[]` (future events only, sorted by `eventDate` asc, optional `?type=`) · `GET /events/recent?limit=` · `GET /events/:id`
- `POST /events` (auth) · `PATCH /events/:id` (auth, owner) · `DELETE /events/:id` (auth, owner) · `POST /events/:id/join` (auth, no body)
- `GET /joins` (auth) returns **join rows** (`eventId`, `eventTitle`, `eventDate`, `eventImage`, `userEmail`, `joinedAt`), not events. Use `GET /me/joined` (auth) for `EventItem[]`; `GET /me/events` (auth) returns events created by the caller.
- `POST /newsletter` (public) exists, but the home newsletter form is a UI stub that only fires a toast — it never calls the API.
- Mutations return `{ message }` (plus `insertedId` on create), not the created/updated event.
- Responses are raw arrays/objects, never `{ events }` wrappers. Ids are 24-hex ObjectIds; malformed ids get `400`.
- Field names are `eventType` / `imageURL` (not `type` / `imageUrl`); types live in `src/types/index.ts`. The create-event form keeps local state as `type`/`imageUrl` and maps them at submit — keep that mapping.
- Validation is duplicated: the server enforces required fields, http(s) `imageURL`, future `eventDate`, and title/description lengths mirrored by the form (`minLength` 5/20, `maxLength` 100/2000). Change both sides together.

## Conventions

- **React Compiler is on** (`reactCompiler: true`). Lint errors on impure calls during render (`Date.now()`, `Math.random()`) and on synchronous `setState` inside `useEffect` (`react-hooks/set-state-in-effect`) — update state in async callbacks, derive it, or use uncontrolled inputs (`profile/page.tsx` uses `defaultValue`). Module-scope impure calls are fine and intentional (`create-event`'s `MIN_DATE`).
- **Cache Components + partial prefetching are on.** Any client page calling `useParams()` must be wrapped in `<Suspense>` (see `events/[id]`, `manage-events/[id]`), or prerendering fails.
- Styling = Tailwind v4 loaded via the `@tailwindcss/turbopack` rule in `next.config.ts` (no Tailwind config file) **plus** the hand-rolled design system in `src/app/globals.css`: `.container .section .btn .btn-outline .field .card .muted .eyebrow` and CSS vars (`--bg --card --line --muted --green --lime`, light/dark). Reuse these instead of inventing styles.
- Images are plain `<img>` with `// eslint-disable-next-line @next/next/no-img-element` because URLs are user-supplied; don't swap in `next/image`.
- Route handlers must be named `route.ts`; the auth catch-all depends on it. Path alias `@/*` → `src/*`.
- `.env` is gitignored (`.env*`) and needs `MONGODB_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_BETTER_AUTH_URL`, `NEXT_PUBLIC_API_URL` (plus optional Google keys).
- `README.md` is now an accurate project README (it documents env setup and the sibling server) — but it still carries a placeholder live-site URL.
