# Python desde cero

A self-paced educational platform for learning Python programming from scratch, with an in-browser code editor, guided lessons, quizzes, and student progress tracking.

**Production domain:** https://python-desdecero.com

The `workers.dev` address is the Cloudflare fallback; confirm the custom domain after each production release.

## Overview

Python desde cero is an independent educational web application designed to help beginners learn Python programming fundamentals. It combines structured course content with a live, browser-executable Python environment so learners can read, write, and run code without installing anything locally.

The platform is organized into modules and lessons, each with learning objectives, explanations, examples, exercises, and multiple-choice quizzes. Student progress and quiz results are persisted to a Supabase-backed PostgreSQL database with Row Level Security (RLS), so each learner's data is isolated to their own account.

## Features

- Structured course path — Modules and lessons covering Python fundamentals, with objectives, explanations, code examples, exercises, and quiz assessments
- In-browser Python editor — Monaco Editor with Pyodide running in a dedicated Web Worker, so Python executes entirely in the browser without blocking the UI
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
| Python execution | Pyodide in a Web Worker (`public/python-worker.js`) |
| State management | React hooks and local component state |
| Testing | Vitest |
| Deployment target | Cloudflare Workers (Vinext) |

## Architecture

The application follows Next.js App Router conventions:

- **Server-side**: Supabase server client (`@supabase/ssr` with `server-only`) for Auth and database operations in Server Components and Server Actions
- **Client-side**: Supabase browser client for interactive components; Monaco Editor and Pyodide Worker for Python execution
- **Proxy (`src/proxy.ts`)**: Next.js 16 verifies session claims, applies admin authorization to `/admin`, and generates a per-request CSP nonce
- **Database**: `profiles`, `invitations`, and `progress` tables with RLS policies enforcing user-level row isolation

## Requirements

- Node.js 24 (same major as CI)
- npm (dependencies are locked in `package-lock.json`)
- A Supabase project with Auth and PostgreSQL enabled

## Local setup (Windows + Docker)

Use Node.js 24, npm, Docker Desktop and the Supabase CLI. The repository already contains `supabase/config.toml` and the canonical migrations in `supabase/migrations/`.

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

To stop Next.js, press `Ctrl+C`. To stop the local Supabase containers when finished, run `supabase stop`; this preserves their data volumes.

For a hosted Supabase development project instead of Docker, copy `.env.example` to `.env.local` and use that project's own URL and publishable key. Never put a service-role/secret key in a `NEXT_PUBLIC_` variable or commit it.

## Contributing as a team

This project is prepared for four individual contributors. Read [the four-partner onboarding guide](docs/team/GUIA-INICIO-4-SOCIOS.md) before changing production code. Each person uses their own GitHub account; never share passwords, personal tokens, service-role keys, or `.env.local`.

Production deployments are gated by successful CI on `master`. Do not merge a pull request while any required check is failing. Canonical database migrations live under `supabase/migrations/`; reconcile the remote migration history before applying pending SQL.

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

Python code runs in the browser via Pyodide, loaded through a dedicated Web Worker (`public/python-worker.js`). This keeps the main UI responsive during environment initialization and code execution. The worker enforces limits on code length, output size, input lines, and execution time.

## Security Notes

- **Never commit `.env.local` or any file containing secret values.** These are excluded by `.gitignore`.
- Supabase RLS policies are the final layer of data protection; migration files in `supabase/migrations/` define the schema and policies but must be reviewed and applied deliberately.
- Migration files are stored in `supabase/migrations/` with timestamp prefixes (Supabase CLI convention). Historical copies under `src/app/supabase/migrations/` were retained as reference and not removed; they may be out of sync with the canonical folder.
- The remote Supabase project migration state has not been independently inspected (Supabase CLI not available locally). Do not assume which migrations are applied remotely without verifying against the remote project.

## Configuración de correo electrónico (plan gratuito de Supabase)

Supabase Auth envía correos de confirmación de registro y recuperación de contraseña. Para que funcionen en producción:

1. Configura las **URLs de callback** en el panel de Supabase Auth → URL Configuration:
   - `https://python-desde-cero.pythondesdecero.workers.dev/auth/callback`
   - `http://localhost:3000/auth/callback` (solo desarrollo)
2. Configura un **proveedor SMTP** en Supabase Auth → SMTP Settings. Una opción gratuita es Brevo Free (300 envíos diarios):
   - Crea tu propia cuenta en el proveedor
   - Verifica la dirección del remitente y el dominio cuando corresponda
   - Introduce las credenciales SMTP exclusivamente en el panel de Supabase
   - Comprueba la entrega de correos con una cuenta de prueba real
3. La protección de contraseñas filtradas (breached password detection) requiere plan Pro o superior de Supabase. En el plan gratuito, configura una longitud mínima adecuada (8 caracteres) desde los ajustes de Auth.

No se incluyen credenciales SMTP, tokens ni claves API en este repositorio.

## Current Status

### Implemented

- Course modules 1–5 with lessons, examples, exercises, and quizzes
- Authentication (register, login, logout, password reset) via Supabase Auth
- Protected routes and middleware-based session verification
- In-browser Python editor with Pyodide Web Worker
- Student progress tracking and quiz score persistence
- Admin invitation management page
- PWA manifest
- Security headers (CSP, X-Frame-Options, etc.)
- Unit tests (20 tests across 4 files)

### Known Limitations

- Email confirmation and password reset delivery depend on Supabase Auth email configuration, which has not been verified against a live provider
- Row Level Security policies and table grants remote state has not been independently inspected (Supabase CLI not available locally)
- Real-device mobile testing and physical device accessibility testing have not been performed

## Roadmap

| Status | Items |
|--------|-------|
| Completed | Course content, authentication, editor, progress tracking, admin invitations, security headers, unit tests |
| Proposed | Additional course modules, student profile page, admin dashboard analytics, offline PWA support, real-device mobile testing |

## License

No license has been applied yet. The repository is private until the owner decides on a license and visibility. Do not port or reuse course content without confirming licensing terms.

This project is independent educational material, created from scratch.
