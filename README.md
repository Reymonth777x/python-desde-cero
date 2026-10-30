# Python desde cero

A self-paced educational platform for learning Python programming from scratch, with an in-browser code editor, guided lessons, quizzes, and student progress tracking.

**Production domain:** https://python-desdecero.com

Python runs through a dedicated Cloudflare `workers.dev` runner origin, isolated from the academy's custom domain.

## Overview

Python desde cero is an independent educational web application designed to help beginners learn Python programming fundamentals. It combines structured course content with a live, browser-executable Python environment so learners can read, write, and run code without installing anything locally.

The platform is organized into modules and lessons, each with learning objectives, explanations, examples, exercises, and multiple-choice quizzes. Student progress and quiz results are persisted to a Supabase-backed PostgreSQL database with Row Level Security (RLS), so each learner's data is isolated to their own account.

## Features

- Structured course path — Modules and lessons covering Python fundamentals, with objectives, explanations, code examples, exercises, and quiz assessments
- In-browser Python editor — Monaco Editor with Pyodide in a dedicated Web Worker inside a sandboxed iframe hosted on a separate Cloudflare `workers.dev` origin
- Student authentication — Registration, email confirmation, login, logout, and password reset via Supabase Auth
- Progress tracking — Lesson completion and quiz scores stored per user, with module gating based on assessment results
- Admin invitation management — Admin-only page for generating one-time invitation codes for student registration
- Public registration — Users can register without an invitation code; providing a valid, unused, unexpired invitation code is optional
- Protected routes — Middleware-based route protection for `/practica` and `/academia` paths
- Responsive design — Tailwind CSS layout that adapts to desktop, tablet, and mobile screens
- PWA manifest — Web app manifest for installable progressive web app behavior

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 3 |
| Backend / Auth / Database | Supabase (Auth, PostgreSQL, RLS) |
| Code editor | Monaco Editor (`@monaco-editor/react`) |
| Python execution | Pyodide Web Worker inside the isolated runner iframe (`runner/`, `public/python-worker.js`) |
| State management | React hooks and local component state |
| Testing | Vitest |
| Deployment target | Cloudflare Workers (Vinext) |

## Architecture

The application follows Next.js App Router conventions:

- **Server-side**: Supabase server client (`@supabase/ssr` with `server-only`) for Auth and database operations in Server Components and Server Actions
- **Client-side**: Supabase browser client for interactive components; Monaco Editor communicates with the isolated runner iframe through a transferred `MessagePort`; Pyodide executes in a Web Worker on a separate origin
- **Proxy (`src/proxy.ts`)**: Next.js 16 verifies session claims, applies admin authorization to `/admin`, and generates a per-request CSP nonce
- **Database**: `profiles`, `invitations`, and `progress` tables with RLS policies enforcing user-level row isolation

## Requirements

- Node.js 24 (same major as CI)
- npm (dependencies are locked in `package-lock.json`)
- A Supabase project with Auth and PostgreSQL enabled

## Local setup (Windows + Docker)

Use Node.js 24, npm and Docker Desktop. The local launcher downloads and runs a pinned Supabase CLI 2.121.0 through npx on first use; a global CLI installation is not required. It starts the local stack and seeds local test users, but deliberately does not run migration up, db reset, db push or supabase link: the repository and remote migration histories must be reconciled before applying migrations.

1. Install dependencies once:

```powershell
npm ci
```

2. Open Docker Desktop and wait until its engine is running.

3. From the project root, run the local launcher:

```powershell
.\scripts\start-local.ps1
```

The launcher starts the Supabase stack in Docker, reads the local API URL and publishable key from `supabase status --output env`, writes an ignored `.env.development.local` for Next.js, creates three test accounts, and starts the app at [http://localhost:3000](http://localhost:3000). It does not run `supabase link`, `db push`, or `db reset`, and it does not connect the app to production.

Open Supabase Studio at [http://localhost:54323](http://localhost:54323). The API and database ports are read from the CLI output; do not confuse the API port (commonly 54321) with the database port (commonly 54322).

Test account passwords are stored only in `.local/dev-users.credentials.json`, which is ignored by Git. The seed creates two students for ownership/IDOR tests and one admin with `profiles.is_admin = true`. The current profile schema does not define a teacher role, so the seed does not pretend to create one.

To start the app without resetting the local test passwords:

```powershell
.\scripts\start-local.ps1 -SkipSeed
```

To stop Next.js, press `Ctrl+C`. To stop the local Supabase containers when finished, run `npx --yes supabase@2.121.0 stop`; this preserves their data volumes.

For a hosted Supabase development project instead of Docker, copy `.env.example` to `.env.local` and use that project's own URL and publishable key. Never put a service-role/secret key in a `NEXT_PUBLIC_` variable or commit it.

## Contributing as a team

This project is prepared for four individual contributors. Read [the four-partner onboarding guide](docs/team/GUIA-INICIO-4-SOCIOS.md) before changing production code. Each person uses their own GitHub account; never share passwords, personal tokens, service-role keys, or `.env.local`.

Production deployments run only after CI succeeds on `master` and the deployment workflow verifies that the tested SHA is still the current `master` HEAD. The branch is not yet protected by GitHub rules: review [issue #23](https://github.com/Reymonth777x/python-desde-cero/issues/23) before relying on mandatory PR approvals. Canonical database migrations live under `supabase/migrations/`; read [the migration status](docs/team/MIGRACIONES.md) and reconcile remote history before applying pending SQL.

## Available Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm test` | Run Vitest unit tests |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run lint` | Run ESLint |
| `npm run check:release` | Run the complete local release verification sequence |

## Authentication and Supabase

- User registration includes email confirmation through Supabase Auth
- Password reset is supported via email-generated reset links
- Middleware verifies session claims on protected routes (`/practica`, `/academia`) and redirects unauthenticated users to `/login`
- Server-side components use `createServerClient` from `@supabase/ssr` (isolated with `server-only`); client components use `createBrowserClient`
- All data tables have Row Level Security (RLS) policies so users can only access their own rows

## Course Structure

Course content is defined in `src/lib/course.ts` and organized as:

- **Modules** (`module-1` through `module-5`): thematic groupings of lessons
- **Lessons**: each has objectives, explanations, a code example, an exercise, and quiz questions
- **Assessments**: designated lessons that act as module gates — completing an assessment unlocks the next module

Quiz grading is handled in `src/lib/course-grading.ts` with a 75% passing threshold.

## Python Execution

Student code runs in Pyodide inside a dedicated Web Worker created by the runner iframe on the separate origin `https://python-desdecero-runner.pythondesdecero.workers.dev`. The academy embeds that origin in a sandboxed iframe and transfers a private `MessagePort` only after the iframe validates the parent window and exact allowed origin. Python output and Turtle commands return through that port; the app bounds code/input/output sizes and stops executions that exceed the time limit. The runner's response CSP only permits the academy's production hostnames and explicit localhost development origins as parents. See [the runner implementation](runner/runner-frame.js) and [its protocol](src/lib/use-python-worker.ts).

## Security Notes

- **Never commit `.env.local` or any file containing secret values.** These are excluded by `.gitignore`.
- Supabase RLS policies are the final layer of data protection; migration files in `supabase/migrations/` define the schema and policies but must be reviewed and applied deliberately.
- Migration files are stored in `supabase/migrations/` with timestamp prefixes. The remote PROD and DEV migration histories were inspected on October 30, 2026; the repository contains documented timestamp/name drift and the Supabase Preview branch has failed migrations. Read [docs/team/MIGRACIONES.md](docs/team/MIGRACIONES.md). Do not run `db push`, `migration repair`, or `db reset` against a remote project until that reconciliation has an explicit plan.

## Correo de autenticación

Supabase Auth gestiona los mensajes de confirmación de registro y recuperación de contraseña. El dominio raíz `python-desdecero.com` ya aparece como **Autentificado** en el panel de Brevo y como **Con marca**, con `em` como subdominio de marca. Cloudflare contiene los dos CNAME DKIM, los tres CNAME de marca, la verificación de Brevo y DMARC (`p=none`). El propietario también generó una clave SMTP Standard; ese secreto no se guarda aquí.

La autenticación del dominio en Brevo no demuestra por sí sola que Supabase esté usando la clave SMTP ni que cada flujo de Auth se haya completado. El siguiente control operativo es confirmar el SMTP guardado en Supabase DEV/PROD y completar pruebas reales de registro, confirmación y recuperación con un buzón externo controlado. La dirección del remitente debe ser una dirección verificada en Brevo; no se debe asumir que el login SMTP es también el remitente.

Para probar callbacks localmente, usa `http://localhost:3000/auth/callback` y añade el puerto alternativo real si Next.js arranca en `3001`. Para producción, la URL canónica de callback es `https://python-desdecero.com/auth/callback`.

No se incluyen credenciales SMTP, tokens ni claves API en este repositorio. La protección de contraseñas filtradas de Supabase requiere plan Pro o superior; no se puede habilitar mediante SQL en el plan Free.

## Current Status

### Implemented

- Course modules 1–5 with lessons, examples, exercises, and quizzes
- Authentication (register, login, logout, password reset) via Supabase Auth
- Protected routes and middleware-based session verification
- In-browser Python editor with a cross-origin isolated Pyodide runner
- Student progress tracking and quiz score persistence
- Admin invitation management page
- PWA manifest
- Security headers (CSP, X-Frame-Options, etc.)
- Automated quality suite: 24 Vitest test files, 168 Playwright E2E tests, TypeScript, ESLint, Next production build, Vinext/Cloudflare build, and course exercise verification (latest verified CI)

### Known Limitations

- Brevo reports the domain as authenticated and branded. Its dashboard showed four transactional emails in the last seven days, 100% delivered and 0% hard bounce/blocked; that aggregate does not identify which messages came from Supabase Auth. The saved SMTP host/login and complete registration/reset flows still require a controlled end-to-end check.
- PROD and DEV RLS/table grants have been inspected. Direct student INSERT/UPDATE/DELETE on `public.progress` is revoked; quiz submission and prerequisite checks run through the private authoritative function. See [docs/team/MIGRACIONES.md](docs/team/MIGRACIONES.md).
- Supabase migration history still differs from local filenames/timestamps, and the Production Preview branch reports migration failure. Do not apply migrations automatically.
- Real-device mobile and physical accessibility testing has not been completed.
- `master` branch protection is not enabled yet, and the public repository exposes historical course assessment material in Git history; see [issues #23](https://github.com/Reymonth777x/python-desde-cero/issues/23) and [#21](https://github.com/Reymonth777x/python-desde-cero/issues/21).

## Latest verified release

- GitHub `master`: `d072f962d96a9e3deb1d5d2a7a4a8a83ebec4e21` (October 30, 2026).
- CI: [run 41133763686](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41133763686) — passed, including 24 Vitest files, 168 Playwright tests, Next/Vinext builds and `npm audit` (0 vulnerabilities).
- Cloudflare deployment: [run 41134083974](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41134083974) — passed. Main Worker version `e9fbc812-68fa-4617-b23e-f1057dc2a6f5`; isolated Python runner version `612bdbbc-a1ef-4579-96c6-692a8ae5bc7f`.
- Production smoke test verified `/`, `/muestra`, `/login` with the Turnstile widget, `sitemap.xml`, the custom domain association, and `www` → apex redirect (HTTP 308).

## Release and sync instructions for the team

From an existing checkout with no uncommitted changes:

```powershell
git switch master
git pull --ff-only origin master
npm ci
```

For a new machine:

```powershell
git clone https://github.com/Reymonth777x/python-desde-cero.git
cd python-desde-cero
npm ci
```

Each partner must keep their own `.env.local` and use the DEV Supabase project. Never copy production credentials or secrets between computers. If a local branch has uncommitted work, commit or stash it before syncing; do not overwrite another partner's changes.

## License

No license has been applied yet. As of October 30, 2026, this GitHub repository is **public**; issue #21 tracks the owner's decision about keeping it public or moving internal development to a private repository. Public visibility allows anyone to inspect the source and its Git history, including historical course assessment material. The app's `server-only` boundaries protect runtime bundles, not the public Git repository. Do not port or reuse course content without confirming licensing terms.

This project is independent educational material. Confirm licensing before reusing external or course-provider materials.
