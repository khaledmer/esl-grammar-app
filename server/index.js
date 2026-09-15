import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initSchema } from './db.js';
import { SUBMISSION_DEADLINE } from './config.js';
import studentsRouter from './routes/students.js';
import submissionsRouter from './routes/submissions.js';
import teacherRouter from './routes/teacher.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/students', studentsRouter);
app.use('/api/submissions', submissionsRouter);
app.use('/api/teacher', teacherRouter);

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.get('/api/config', (req, res) => res.json({ deadline: SUBMISSION_DEADLINE }));

// In production, Express serves the Vite build directly — one Render web
// service for both the API and the static frontend. In local dev, run the
// Vite dev server separately (`npm run dev`) which proxies /api here.
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
// Express 5 dropped bare '*' wildcard routes, so this is a plain
// catch-all middleware instead: anything that isn't an API call or a
// real static file falls back to index.html (client-side routing).
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next();
  });
});

initSchema()
  .catch((err) => {
    console.error('[db] failed to initialize schema — check DATABASE_URL', err);
  })
  .finally(() => {
    app.listen(PORT, () => console.log(`[server] listening on port ${PORT}`));
  });
