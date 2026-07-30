# AutoMinutes

AutoMinutes turns raw meeting transcripts into structured, actionable minutes. Upload a transcript, let AI extract the summary, decisions, and action items, then track everything through to done.

This is the web client — a React SPA that talks to the [AutoMinutes backend](https://github.com/HoteaEmanuel/backend-AutoMinutes) over GraphQL.

## What it does

**Meetings**

- Create a meeting and attach a transcript by pasting text or uploading `.txt`, `.docx`, or `.pdf` — files are parsed client-side, no audio or recording required.
- Attendees are auto-suggested from the transcript (an "Attendees" section or speaker labels like `Jane: ...`), with the option to add, edit, or remove them by hand.
- Meeting list with search, sort, status filtering, and pagination.
- Re-upload a transcript at any point; previous versions are kept and can be reviewed or restored from a version history.

**AI processing**

- One click generates a summary, key decisions, detailed notes, follow-ups, and a first pass at action items.
- Regenerate anytime — manual edits to action items and attendees are preserved across re-runs.

**Action items**

- Extracted automatically, then editable: description, assignee, deadline, status.
- Per-meeting board plus a cross-meeting "Todos" view that aggregates action items from every meeting, groupable by status with overdue items called out.
- One-click status toggle, filtering, and sorting.

**Export**

- Single meeting as PDF, Markdown, or JSON (summary, notes, transcript, attendees, and action items included).
- Action items as CSV, per meeting or across all meetings.
- Full meeting list as CSV or JSON.

**Account**

- Email/password signup with verification, plus Google OAuth.
- Password reset flow, in-app password change, avatar upload with cropping, and account deletion.
- Profile stats: total meetings, action items, and completion count.

**Everywhere**

- Light/dark theme.
- Toasts for success/error, inline form validation, confirmation dialogs before destructive actions.
- Responsive layout, mobile nav drawer.

## Tech stack

- **React 19 + TypeScript**, built with **Vite**
- **react-router v7** for routing
- **TanStack Query** for server state, **Zustand** for the in-memory auth session
- **react-hook-form + zod** for forms and validation
- **shadcn/ui** on top of **Base UI** primitives, styled with **Tailwind CSS v4**
- Hand-rolled **GraphQL** client (`src/lib/graphql.ts`) with automatic access-token refresh; types generated from the backend schema via `graphql-codegen`
- `mammoth` and `pdfjs-dist` for in-browser `.docx`/`.pdf` parsing, `jsPDF` for PDF export

## Project structure

Components follow atomic design under `src/components/`:

```
atoms/       smallest visual primitives
molecules/   small compositions of atoms/shadcn primitives
organisms/   meaningful UI sections, grouped by domain where relevant
templates/   own data fetching and page-level state, compose organisms
pages/       thin layout wrapper, routing lives in App.tsx
```

Non-UI feature code (GraphQL queries/mutations, TanStack Query hooks, transforms) lives in `src/features/<domain>/`, one folder per domain: `auth`, `meetings`, `action-items`, `attendees`, `ai-results`, `export`, `user`, `theme`.

Path aliases: `@`, `@atoms`, `@molecules`, `@organisms`, `@templates`, `@pages`, `@components` (see `vite.config.ts` / `tsconfig.app.json`).

## Getting started

```bash
npm install
```

Set the backend URL in `.env`:

```
VITE_REACT_API_URL=http://localhost:5000
```

```bash
npm run dev        # start the dev server
npm run build       # type-check and build for production
npm run preview     # preview the production build
npm run lint         # lint
npm run codegen      # regenerate GraphQL types from the backend schema
```

`npm run codegen` reads `../backend/src/schema.gql`, so the backend repo needs to be checked out alongside this one. Re-run it after any backend schema change — stale generated types fail silently rather than raising a build error.
