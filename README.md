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
- Orilla practice — a Python river challenge with 12 guided stages, an open river, two advanced challenges, and per-user saved runs
- Student authentication — Registration, email confirmation, login, logout, and password reset via Supabase Auth
- Progress tracking — Lesson completion and quiz scores stored per user, with module gating based on assessment results
- Admin invitation management — Admin-only page for generating one-time invitation codes for student registration
- Public registration — Users can register without an invitation code; providing a valid, unused, unexpired invitation code is optional
- Protected routes — Middleware-based route protection for `/practica`, `/academia`, and `/orilla` paths
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

## Orilla

Orilla is an authenticated practice area at `/orilla`. It uses the same isolated Pyodide Worker and private `MessagePort` as the laboratory, with a separate Python engine at `public/orilla-engine.py`. The campaign has twelve stages linked to course concepts; attempts and personal progress are saved in `orilla_runs`. The Orilla check runs locally with `npm run test:orilla`. Its stars are practice feedback, not official assessment grades.

## Security Notes

- **Never commit `.env.local` or any file containing secret values.** These are excluded by `.gitignore`.
- Supabase RLS policies are the final layer of data protection; migration files in `supabase/migrations/` define the schema and policies but must be reviewed and applied deliberately.
- Migration files are stored in `supabase/migrations/` with timestamp prefixes. On October 31, 2026, production's active folder and remote ledger were reconciled to exactly 29 matching versions. The PROD repair marked only already-present baseline migrations 001, 002, 003 and 005 as applied in the ledger; it did not re-execute their SQL or change schema/data. DEV keeps a separate bootstrap and three environment-specific wrappers, so do not run `db push` against DEV until its history receives a separate verified mapping. See [docs/team/MIGRACIONES.md](docs/team/MIGRACIONES.md). The Supabase Preview branch `main` is now `FUNCTIONS_DEPLOYED` and its derived project is `ACTIVE_HEALTHY`; the latest Preview workflow log (2026-10-31 02:50:48 UTC) says `All migrations are up to date`. The workflow log is recorded in `docs/team/MIGRACIONES.md`; do not reset or delete the branch.

## Correo de autenticación

Supabase Auth gestiona los mensajes de confirmación de registro y recuperación de contraseña. El dominio raíz `python-desdecero.com` ya aparece como **Autentificado** en el panel de Brevo y como **Con marca**, con `em` como subdominio de marca. Cloudflare contiene los dos CNAME DKIM, los tres CNAME de marca, la verificación de Brevo y DMARC (`p=none`). El propietario también generó una clave SMTP Standard; ese secreto no se guarda aquí.

La autenticación del dominio en Brevo no demuestra por sí sola que Supabase esté usando la clave SMTP ni que cada flujo de Auth se haya completado. El siguiente control operativo es confirmar el SMTP guardado en Supabase DEV/PROD y completar pruebas reales de registro, confirmación y recuperación con un buzón externo controlado. La dirección del remitente debe ser una dirección verificada en Brevo; no se debe asumir que el login SMTP es también el remitente.

Para probar callbacks localmente, usa `http://localhost:3000/auth/callback` y añade el puerto alternativo real si Next.js arranca en `3001`. Para producción, la URL canónica de callback es `https://python-desdecero.com/auth/callback`.

No se incluyen credenciales SMTP, tokens ni claves API en este repositorio. La protección de contraseñas filtradas de Supabase requiere plan Pro o superior; no se puede habilitar mediante SQL en el plan Free.

## Current Status

### Implemented

- Course modules 1–5 with lessons, examples, exercises, and quizzes; module 5 is clearly identified as an optional extension.
- Authentication (registration, login, logout, password reset) via Supabase Auth, with protected student and administrator routes.
- In-browser Python editor with a cross-origin isolated Pyodide runner.
- Orilla authenticated practice area with 12 guided stages, an open river, two challenges, and saved personal runs.
- Student progress tracking and quiz score persistence, protected by Supabase RLS and server-side grading.
- Admin invitation management page and PWA manifest.
- Security headers (CSP, X-Frame-Options, etc.).
- Responsive viewport coverage for the lab controls and a production smoke test that checks the optional module's exact `05` / `OPCIONAL` label.
- Orilla draft recovery now rejects an invalid remote timestamp and does not overwrite an edit made before the delayed recovery callback.
- CI includes Vitest, course exercise verification, Orilla/Pyodide checks, TypeScript, ESLint, production builds, Playwright E2E, Vinext/Cloudflare build, pgTAP against an ephemeral local Supabase stack, and PowerShell launcher validation.

### Known Limitations

- The owner previously confirmed working Auth flows (registration, email confirmation, login, logout and recovery). The current project still needs a separately evidenced browser acceptance in the DEV Supabase project using disposable accounts, including its redirect URLs, real confirmation email and Turnstile challenge. Mocked Server Action tests do not prove email delivery or DEV provider configuration; see [issue #17](https://github.com/Reymonth777x/python-desde-cero/issues/17).
- PROD and DEV RLS/table grants have been inspected. Direct student INSERT/UPDATE/DELETE on `public.progress` and direct insertion into the private quiz-attempt table are not granted; quiz submission and prerequisite checks run through the private authoritative function. See [docs/team/MIGRACIONES.md](docs/team/MIGRACIONES.md).
- Production's active migration folder and remote ledger match 29/29 versions. DEV intentionally retains its own 11-version bootstrap and environment-specific wrappers; do not copy PROD's history or run `db push` blindly. Supabase Preview `main` reported `FUNCTIONS_DEPLOYED` and `ACTIVE_HEALTHY`; its workflow recorded `All migrations are up to date` on October 31, 2026. Do not reset or delete it as a shortcut.
- pgTAP is now executed by CI against a clean, ephemeral local Supabase stack. It is not run against DEV or PROD. This does not replace the remaining browser acceptance of Auth, quizzes, progress, Orilla and administrator flows in [issue #20](https://github.com/Reymonth777x/python-desde-cero/issues/20).
- The CI suite checks responsive viewports at 320, 360 and 390 px. Physical-device acceptance of the complete authenticated mobile interface (theme picker, Monaco/textarea, virtual keyboard, scrolling, focus and progress screens) remains open in [issue #18](https://github.com/Reymonth777x/python-desde-cero/issues/18).
- Orilla's production table currently has only the earlier `c01` draft with `attempts = 0`, `passed = false`, `stars = 0` and `best_steps = NULL`; DEV had no Orilla rows after the reversible tests. This is not a confirmed game completion. Test the first full run using a disposable DEV student account and verify the map and Academia; never use a production student's account for acceptance.
- `master` branch protection is not enabled yet. The repository remains public and its Git history includes historical course assessment material. Do not change visibility or rewrite history without the owner's decision; see [issues #23](https://github.com/Reymonth777x/python-desde-cero/issues/23) and [#21](https://github.com/Reymonth777x/python-desde-cero/issues/21).
- PR #107's dependency mitigation has been merged. The CI dependency audit is informational/non-blocking; do not interpret a green CI as proof that the dependency tree has zero advisories. Review the current audit output separately before declaring the dependency posture clean.
- A professional review of privacy, terms, cookies, retention, data-subject rights and any policy for minors in Costa Rica is still required before opening registration to external students; see [issue #98](https://github.com/Reymonth777x/python-desde-cero/issues/98).

## Latest verified release

- GitHub `master`: `a4d7f6a225813ab2bbb27948f6d2fed9bcae17e4` (October 31, 2026).
- CI: [run 41177442432](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41177442432) — success on that exact SHA. All three jobs passed: `test-and-build`, `powershell-launcher` and `supabase-pgtap`.
- Cloudflare deployment: [run 41177624316](https://github.com/Reymonth777x/python-desde-cero/actions/runs/41177624316) — success on the same SHA. The workflow published the isolated Python runner, compiled and deployed the Worker, verified that the custom domain remained connected, and checked the served version.
- Production smoke verification confirmed the homepage, `/muestra`, `/login`, the exact optional-module label (`05` and `OPCIONAL`), and that unauthenticated requests to `/practica` and `/orilla` require login. The deployment workflow also verifies the runner origin and its production-only policy.
- PRs #118–#126 delivered the mobile lab checks and wording, Orilla draft wiring/mobile guide improvements, Auth success-path tests, optional-module label regression test, and safe Orilla draft recovery. PR #123 was closed as superseded by #125; it was not merged.
- PROD has 29/29 active migration versions reconciled; DEV retains its separate 11-version bootstrap and wrappers. Preview `main` was confirmed healthy with all migrations up to date. No schema or migration changes were made in the Orilla draft guard fixes.
- The remaining acceptance items are browser-level DEV Auth and Orilla flows, physical mobile review, branch protection, owner decision on repository visibility/history, dependency-advisory review, and professional privacy/legal review.

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

No license has been applied yet. As of October 31, 2026, this GitHub repository is **public**; issue #21 tracks the owner's decision about keeping it public or moving internal development to a private repository. Public visibility allows anyone to inspect the source and its Git history, including historical course assessment material. The app's `server-only` boundaries protect runtime bundles, not the public Git repository. Do not port or reuse course content without confirming licensing terms.

This project is independent educational material. Confirm licensing before reusing external or course-provider materials.
