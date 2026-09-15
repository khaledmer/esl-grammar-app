import { Router } from 'express';
import { query } from '../db.js';
import { requireTeacher, teacherLogin } from '../teacherAuth.js';

const router = Router();

router.post('/login', teacherLogin);

router.use(requireTeacher);

// All submissions for one exercise, one row per student who has started it.
router.get('/submissions', async (req, res) => {
  const { exerciseId } = req.query;
  if (!exerciseId) return res.status(400).json({ error: 'exerciseId query param is required.' });
  try {
    const result = await query(
      `SELECT s.id, s.student_id, st.name, st.email, s.answers, s.auto_score,
              s.teacher_overrides, s.teacher_score, s.teacher_feedback,
              s.is_submitted, s.submitted_at, s.graded_at, s.updated_at
       FROM submissions s
       JOIN students st ON st.id = s.student_id
       WHERE s.exercise_id = $1
       ORDER BY st.name ASC`,
      [exerciseId]
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('[teacher] failed to list submissions', err);
    return res.status(500).json({ error: 'Could not load submissions.' });
  }
});

// Teacher correction: manual per-question overrides, a final score, and feedback.
router.patch('/submissions/:id', async (req, res) => {
  const { id } = req.params;
  const { teacherOverrides, teacherScore, teacherFeedback } = req.body ?? {};
  try {
    const result = await query(
      `UPDATE submissions
       SET teacher_overrides = COALESCE($1::jsonb, teacher_overrides),
           teacher_score = $2,
           teacher_feedback = $3,
           graded_at = now(),
           updated_at = now()
       WHERE id = $4
       RETURNING id, teacher_overrides, teacher_score, teacher_feedback, graded_at`,
      [teacherOverrides ? JSON.stringify(teacherOverrides) : null, teacherScore ?? null, teacherFeedback ?? null, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Submission not found.' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('[teacher] failed to grade submission', err);
    return res.status(500).json({ error: 'Could not save grading.' });
  }
});

// Wipe a submission entirely (wrong account, duplicate, or a clean
// redo after the deadline). This deletes the row outright — the student
// starts that exercise from scratch next time they open it.
router.delete('/submissions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('DELETE FROM submissions WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Submission not found.' });
    return res.json({ ok: true });
  } catch (err) {
    console.error('[teacher] failed to delete submission', err);
    return res.status(500).json({ error: 'Could not delete submission.' });
  }
});

export default router;
