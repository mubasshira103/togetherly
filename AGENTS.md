<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Togetherly

Single Next.js 16 App Router app (not a monorepo). No test runner, no CI, no formatter — verification is `lint → typecheck → build`; all three must stay green.

## Commands

- `npm run dev` / `npm run build` / `npm run start`
- `npm run lint` — `eslint` (flat config, `eslint-config-next`), runs over the whole repo.
- Typecheck has no script: `npx tsc --noEmit`.
- **This machine blocks the `npm`/`npx` PowerShell shims** (execution policy). Use `cmd /c "npm run lint"` or call binaries directly, e.g. `node node_modules/typescript/bin/tsc --noEmit`.

## Architecture

- Pages live in `src/app/`; data pages (events, profile, create-event, …) are `'use client'` components fetching in `useEffect`, not server-fetched.
- **Two backends:**
  1. **better-auth** — catch-all handler `src/app/api/auth/[...all]/route.ts`, config in `src/lib/auth.ts` → MongoDB (`MONGODB_URL`, database `ticketoDb`). The server enables the `jwt` plugin to match the client's `jwtClient()`. `src/lib/api.ts` attaches the session JWT as `Authorization: Bearer`.
  2. **Sibling Express API** — `../togetherly-server` (port 5000; client default `http://localhost:5000/api`). Start it separately with `node index.js` in that repo.
     - **Auth:** every mutating route (and `/joins`, `/me/*`) requires `Authorization: Bearer <jwt>`. The server verifies the signature against the Next app's JWKS (`${AUTH_URL || CLIENT_URL}/api/auth/jwks`) with `issuer`/`audience` = that same URL. Identity (`sub`, `email`, `name`) comes only from the verified token — body/query identity is ignored.
     - **Ownership:** events store `creatorId`, `creatorEmail`, `creatorName`; `PATCH`/`DELETE /events/:id` return `403` unless `creatorId` matches (or the legacy `creatorEmail` matches). `/me/events` and `/me/joined` only return the caller's rows.
- **API contract** (match exactly — responses are raw arrays/objects, not `{ events }` wrappers):
  - `GET /events` → `EventItem[]` (future events only), `GET /events/recent?limit=` → `EventItem[]`
  - `GET /events/:id` → `EventItem` · `POST /events` (auth) · `PATCH /events/:id` (auth, owner) · `DELETE /events/:id` (auth, owner)
  - `POST /events/:id/join` (auth, no body needed) · `GET /joins` (auth)
  - `GET /me/events` (auth) → `EventItem[]` created by the caller · `GET /me/joined` (auth) → `EventItem[]` joined by the caller
  - Field names are `eventType` / `imageURL` (not `type` / `imageUrl`); the types live in `src/types/index.ts`.
- `.env` is gitignored (`.env*`) and must provide `MONGODB_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_BETTER_AUTH_URL`, `NEXT_PUBLIC_API_URL`.
- Path alias `@/*` → `src/*`.

## Conventions

- **React Compiler is on** (`next.config.ts` → `reactCompiler: true`). Lint enforces its rules as errors: no impure calls (`Date.now()`, `Math.random()`) during render, and no synchronous `setState` inside `useEffect` (`react-hooks/set-state-in-effect`) — update state in async callbacks, derive it, or use uncontrolled inputs.
- **Cache Components are on** (`cacheComponents: true`). A client page that calls `useParams()` on a dynamic route suspends during prerendering, so wrap it in `<Suspense>` (see `events/[id]` and `manage-events/[id]`).
- Styling = Tailwind v4 (`@import 'tailwindcss'`, no config file, loaded via the Turbopack rule in `next.config.ts`) **plus** a hand-rolled design system in `src/app/globals.css`: CSS variables for light/dark and classes `.container .section .btn .btn-outline .field .card .muted .eyebrow`. Reuse these instead of inventing new styles.
- Route handlers must be named `route.ts`; the auth catch-all depends on it.
- `README.md` is untouched create-next-app boilerplate (it says `app/page.tsx`; code is in `src/app/`) — ignore it.
