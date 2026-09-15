import crypto from 'node:crypto';

function expectedToken() {
  const password = process.env.TEACHER_PASSWORD;
  if (!password) {
    throw new Error(
      'TEACHER_PASSWORD is not set. Set it in your environment (Render dashboard, or .env locally) before teachers can log in.'
    );
  }
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function teacherLogin(req, res) {
  const { password } = req.body ?? {};
  let expected;
  try {
    expected = expectedToken();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
  const submittedHash = crypto.createHash('sha256').update(password ?? '').digest('hex');
  const matches = crypto.timingSafeEqual(
    Buffer.from(submittedHash),
    Buffer.from(expected)
  );
  if (!matches) {
    return res.status(401).json({ error: 'Incorrect password.' });
  }
  return res.json({ token: expected });
}

export function requireTeacher(req, res, next) {
  const auth = req.headers.authorization ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  let expected;
  try {
    expected = expectedToken();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
  if (!token || token.length !== expected.length) {
    return res.status(401).json({ error: 'Teacher login required.' });
  }
  const matches = crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  if (!matches) {
    return res.status(401).json({ error: 'Teacher login required.' });
  }
  next();
}
