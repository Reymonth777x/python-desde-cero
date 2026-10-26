# Python desde cero

A self-paced educational platform for learning Python programming from scratch, with an in-browser code editor, guided lessons, quizzes, and student progress tracking.

## Overview

Python desde cero is an independent educational web application designed to help beginners learn Python programming fundamentals. It combines structured course content with a live, browser-executable Python environment so learners can read, write, and run code without installing anything locally.

The platform is organized into modules and lessons, each with learning objectives, explanations, examples, exercises, and multiple-choice quizzes. Student progress and quiz results are persisted to a Supabase-backed PostgreSQL database with Row Level Security (RLS), so each learner's data is isolated to their own account.

## Features

- Structured course path — Modules and lessons covering Python fundamentals, with objectives, explanations, code examples, exercises, and quiz assessments
- In-browser Python editor — Monaco Editor with Pyodide running in a dedicated Web Worker, so Python executes entirely in the browser without blocking the UI
- Student authentication — Registration, email confirmation, login, logout, and password reset via Supabase Auth
- Progress tracking — Lesson completion and quiz scores stored per user, with module gating based on assessment results
- Admin invitation management — Admin-only page for generating one-time invitation codes for student registration
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
| State management | Zustand |
| Testing | Vitest |
| Deployment target | Cloudflare (Vinext) |

## Architecture

The application follows Next.js App Router conventions:

- **Server-side**: Supabase server client (`@supabase/ssr` with `server-only`) for Auth and database operations in Server Components and Server Actions
- **Client-side**: Supabase browser client for interactive components; Monaco Editor and Pyodide Worker for Python execution
- **Middleware**: Next.js middleware verifies Supabase session claims and redirects unauthenticated users from protected learning pages
- **Database**: `profiles`, `invitations`, and `progress` tables with RLS policies enforcing user-level row isolation

## Requirements

- Node.js 20.9 or later
- npm (dependencies are locked in `package-lock.json`)
- A Supabase project with Auth and PostgreSQL enabled

## Setup

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the project root with the following variables (values are **never** committed to Git):

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
NEXT_PUBLIC_SITE_URL=https://your-site-domain.com
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm test` | Run Vitest unit tests |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run lint` | Run ESLint |

## Authentication and Supabase

- User registration includes email confirmation through Supabase Auth
- Password reset is supported via email-generated reset links
- Middleware verifies session claims on protected routes (`/practica`, `/academia`) and redirects unauthenticated users to `/login`
- Server-side components use `createServerClient` from `@supabase/ssr` (isolated with `server-only`); client components use `createBrowserClient`
- All data tables have Row Level Security (RLS) policies so users can only access their own rows

## Course Structure

Course content is defined in `src/lib/course.ts` and organized as:

- **Modules** (`module-1` through `module-4`): thematic groupings of lessons
- **Lessons**: each has objectives, explanations, a code example, an exercise, and quiz questions
- **Assessments**: designated lessons that act as module gates — completing an assessment unlocks the next module

Quiz grading is handled in `src/lib/course-grading.ts` with a 75% passing threshold.

## Python Execution

Python code runs in the browser via Pyodide, loaded through a dedicated Web Worker (`public/python-worker.js`). This keeps the main UI responsive during environment initialization and code execution. The worker enforces limits on code length, output size, input lines, and execution time.

## Security Notes

- **Never commit `.env.local` or any file containing secret values.** These are excluded by `.gitignore`.
- Supabase RLS policies are the final layer of data protection; migration files in `supabase/migrations/` define the schema and policies but must be reviewed and applied deliberately.
- The `004_explicit_client_table_grants.sql` and `005_public_signup_optional_invitation.sql` migrations are prepared locally but **have not been applied** to any remote database. They require explicit review and authorization before application.

## Current Status

### Implemented

- Course modules 1–4 with lessons, examples, exercises, and quizzes
- Authentication (register, login, logout, password reset)
- Protected routes and middleware-based session verification
- In-browser Python editor with Pyodide Web Worker
- Student progress tracking and quiz score persistence
- Admin invitation management page
- PWA manifest
- Security headers (CSP, X-Frame-Options, etc.)
- Unit tests (15 tests across 4 files)

### Known Limitations

- Email confirmation and password reset delivery depend on Supabase Auth email configuration, which has not been verified against a live provider
- Row Level Security policies and table grants are defined in local migration files; the effective remote Supabase ACL/RLS state has not been inspected
- The `004` (table grants) and `005` (optional invitation signup) migrations are pending review and application
- Real-device mobile testing and physical device accessibility testing have not been performed
- No production deployment has been executed yet

## Roadmap

| Status | Items |
|--------|-------|
| Completed | Course content, authentication, editor, progress tracking, admin invitations, security headers, unit tests |
| Pending (pre-release) | Apply migration 004 (table grants), apply migration 005 (optional invitation signup), verify Supabase RLS/ACL remotely, configure email templates and callback URLs |
| Proposed | Additional course modules, student profile page, admin dashboard analytics, offline PWA support, real-device mobile testing |

## License

No license has been applied yet. The repository is private until the owner decides on a license and visibility. Do not port or reuse course content without confirming licensing terms.
