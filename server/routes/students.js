import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// Students don't need a password: this just identifies who is answering,
// keyed by email, so a returning student picks up their saved progress.
router.post('/', async (req, res) => {
  const { name, email } = req.body ?? {};
  if (!name?.trim() || !email?.trim()) {
    return res.status(400).json({ error: 'Name and email are both required.' });
  }
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const existing = await query('SELECT id, name, email FROM students WHERE email = $1', [
      normalizedEmail,
    ]);
    if (existing.rows.length > 0) {
      // Keep the name in sync in case they typed it differently this time.
      const student = existing.rows[0];
      if (student.name !== name.trim()) {
        await query('UPDATE students SET name = $1 WHERE id = $2', [name.trim(), student.id]);
      }
      return res.json({ id: student.id, name: name.trim(), email: normalizedEmail });
    }

    const inserted = await query(
      'INSERT INTO students (name, email) VALUES ($1, $2) RETURNING id, name, email',
      [name.trim(), normalizedEmail]
    );
    return res.status(201).json(inserted.rows[0]);
  } catch (err) {
    console.error('[students] failed to upsert student', err);
    return res.status(500).json({ error: 'Could not save student record.' });
  }
});

export default router;
