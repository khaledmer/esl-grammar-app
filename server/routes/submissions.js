import { Router } from 'express';
import { query } from '../db.js';
import { isPastDeadline, SUBMISSION_DEADLINE } from '../config.js';

const router = Router();

// Resume: fetch a student's existing progress for one exercise.
router.get('/:studentId/:exerciseId', async (req, res) => {
  const { studentId, exerciseId } = req.params;
  try {
    const result = await query(
      `SELECT answers, is_submitted, auto_score, teacher_score, teacher_feedback, submitted_at
       FROM submissions WHERE student_id = $1 AND exercise_id = $2`,
      [studentId, exerciseId]
    );
    if (result.rows.length === 0) {
      return res.json({ answers: {}, isSubmitted: false });
    }
    const row = result.rows[0];
    return res.json({
      answers: row.answers,
      isSubmitted: row.is_submitted,
      score: row.teacher_score ?? row.auto_score,
      teacherFeedback: row.teacher_feedback,
      submittedAt: row.submitted_at,
    });
  } catch (err) {
    console.error('[submissions] failed to load submission', err);
    return res.status(500).json({ error: 'Could not load saved progress.' });
  }
});

// Autosave a single answer (called on every change while the student types/picks).
router.put('/answer', async (req, res) => {
  const { studentId, exerciseId, unitCode, questionId, value } = req.body ?? {};
  if (!studentId || !exerciseId || !unitCode || questionId === undefined) {
    return res.status(400).json({ error: 'studentId, exerciseId, unitCode, and questionId are required.' });
  }
  try {
    await query(
      `INSERT INTO submissions (student_id, exercise_id, unit_code, answers, updated_at)
       VALUES ($1, $2, $3, jsonb_build_object($4::text, $5::text), now())
       ON CONFLICT (student_id, exercise_id)
       DO UPDATE SET answers = submissions.answers || jsonb_build_object($4::text, $5::text),
                     updated_at = now()`,
      [studentId, exerciseId, unitCode, questionId, value]
    );
    return res.json({ ok: true });
  } catch (err) {
    console.error('[submissions] failed to autosave answer', err);
    return res.status(500).json({ error: 'Could not save your answer.' });
  }
});

// Final submit: locks in the auto-graded score and timestamp.
router.post('/submit', async (req, res) => {
  const { studentId, exerciseId, unitCode, score } = req.body ?? {};
  if (!studentId || !exerciseId || !unitCode || score === undefined) {
    return res.status(400).json({ error: 'studentId, exerciseId, unitCode, and score are required.' });
  }
  // The deadline is enforced here, not just in the UI — a request sent
  // straight to this endpoint after the cutoff is rejected the same way.
  if (isPastDeadline()) {
    return res.status(403).json({
      error: `The deadline for this assignment passed on ${new Date(SUBMISSION_DEADLINE).toLocaleString()}. Late submissions aren't accepted.`,
      deadline: SUBMISSION_DEADLINE,
    });
  }
  try {
    await query(
      `INSERT INTO submissions (student_id, exercise_id, unit_code, auto_score, is_submitted, submitted_at, updated_at)
       VALUES ($1, $2, $3, $4, true, now(), now())
       ON CONFLICT (student_id, exercise_id)
       DO UPDATE SET auto_score = $4, is_submitted = true, submitted_at = now(), updated_at = now()`,
      [studentId, exerciseId, unitCode, score]
    );
    return res.json({ ok: true });
  } catch (err) {
    console.error('[submissions] failed to submit', err);
    return res.status(500).json({ error: 'Could not submit homework.' });
  }
});

export default router;
