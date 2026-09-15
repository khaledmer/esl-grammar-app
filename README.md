# ESC Grammar Homework

A React + TypeScript grammar homework app for Units 6A (Passive), 7A (First
Conditional), and 8A (Gerunds vs. Infinitives) — with student sign-in,
a PostgreSQL-backed submission history, and a teacher dashboard for
reviewing and correcting every student's answers.

## Architecture

One Express server does two jobs: it exposes the JSON API under `/api/*`,
and (in production) it serves the built React app as static files. That
means **one Render web service** covers the whole thing — no separate
frontend/backend hosting to coordinate.

```
Browser  →  Express (server/index.js)  →  PostgreSQL
             ├─ /api/students     (student sign-in)
             ├─ /api/submissions  (autosave, submit, resume)
             └─ /api/teacher      (login, roster, grading)
```

## Local development

You need a PostgreSQL database reachable from your machine (a local
install, or a free instance from Render/Neon/Supabase all work).

```bash
npm install
cp .env.example .env   # then fill in DATABASE_URL and TEACHER_PASSWORD
npm run dev:all         # runs the Vite dev server + the API together
```

`npm run dev:all` starts both processes (colored `web` / `api` output) and
the Vite dev server proxies `/api` calls to Express on port 3001. Open the
URL Vite prints (typically `http://localhost:5173`).

To run just one side: `npm run dev` (frontend only) or `npm run server`
(API only, auto-restarts on change via nodemon).

## Deploying to Render

1. **Create a PostgreSQL database** on Render (Dashboard → New →
   PostgreSQL). Once it's up, copy its **Internal Database URL**.
2. **Create a Web Service** from this repo:
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
3. **Set environment variables** on the web service:
   - `DATABASE_URL` — the Internal Database URL from step 1
   - `TEACHER_PASSWORD` — whatever password teachers will use
   - Render sets `PORT` automatically; you don't need to add it.
4. Deploy. On first boot the server runs `server/schema.sql` automatically
   (`CREATE TABLE IF NOT EXISTS…`), so there's no separate migration step.

Because everything runs behind one Express server, there's no CORS
configuration to worry about in production, and no second Netlify/Render
service to keep in sync — the lesson from earlier portal builds (Netlify's
static hosting doesn't run an Express backend) doesn't apply here since
this is a Render **web service**, not static hosting.

## How it's put together

- **`server/`** — the Express + PostgreSQL backend.
  - `db.js` — connection pool and schema bootstrap.
  - `schema.sql` — `students` and `submissions` tables.
  - `teacherAuth.js` — password check against `TEACHER_PASSWORD`; issues a
    SHA-256 token the frontend sends back as `Authorization: Bearer …` on
    teacher-only requests.
  - `routes/students.js` — upserts a student by email (no password; email
    is just how returning students are matched to their saved progress).
  - `routes/submissions.js` — autosave one answer at a time, resume a
    student's progress, and lock in a final submission.
  - `routes/teacher.js` — login, the roster of everyone's submissions for
    a given exercise, and grading (per-question overrides + a final score
    + written feedback).
- **`src/mockData.ts`** — the three exercises, transcribed from the Unit
  6A / 7A / 8A master data. Unit 8A only has 8 questions (0–7) because
  that's where the source table was cut off.
- **`src/api.ts`** — every frontend call to the backend, in one place.
- **`src/components/StudentLogin.tsx`** — name + email capture shown
  before a student can start an exercise.
- **`src/components/TeacherLogin.tsx`** — the password gate for teacher
  mode.
- **`src/components/GrammarExerciseView.tsx`** — the split lesson-
  screenshot + question panel.
- **`src/components/SubmissionModal.tsx`** — completed/unanswered counts
  and an instant self-check score before final submission.
- **`src/components/TeacherSolutionDashboard.tsx`** — the master answer
  key with explanations for every item (a quick reference, not tied to any
  particular student).
- **`src/components/TeacherSubmissions.tsx`** — the roster: every student
  who has started the selected exercise, their auto-score, and a
  "Review & grade" panel where the teacher can override the auto-grade on
  any question, set a final score, and leave written feedback.

## Adding lesson screenshots

Put the teacher's lesson-note images in `public/screenshots/` as
`lesson-6a.png`, `lesson-7a.png`, `lesson-8a.png` — see the README inside
that folder. Until a file is there, the app shows a placeholder card
instead of a broken image.

## Known limitations to know about

- **The teacher token is a shared secret, not per-teacher accounts.**
  Anyone with the password gets full access to every student's answers.
  That matches the "one shared teacher password" pattern used in your
  other homework portals — fine for a single-teacher classroom tool, not
  meant for multiple teachers who shouldn't see each other's grading.
- **Students aren't authenticated beyond typing their email.** Nothing
  stops someone from entering another student's email and seeing (and
  overwriting) their in-progress answers. If that's a real concern, the
  next step would be emailing a one-time login link instead of a free-text
  email field.
- **A "Retake" doesn't reset the submitted flag in the database** — it
  only resets the local view so the student can edit and resubmit.
  Submitting again overwrites the score, but the roster will briefly show
  the exercise as "Submitted" while a student is mid-retake.
