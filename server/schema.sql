-- Run automatically at server startup (idempotent).

CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,
  unit_code TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  auto_score INTEGER,
  teacher_overrides JSONB NOT NULL DEFAULT '{}'::jsonb,
  teacher_score INTEGER,
  teacher_feedback TEXT,
  is_submitted BOOLEAN NOT NULL DEFAULT false,
  submitted_at TIMESTAMPTZ,
  graded_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, exercise_id)
);

CREATE INDEX IF NOT EXISTS idx_submissions_exercise ON submissions (exercise_id);
