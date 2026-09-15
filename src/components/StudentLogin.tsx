import { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { loginStudent } from '../api';
import type { Student } from '../types';

interface Props {
  onLoggedIn: (student: Student) => void;
}

export default function StudentLogin({ onLoggedIn }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const student = await loginStudent(name, email);
      onLoggedIn(student);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chalkboard-texture flex min-h-screen items-center justify-center bg-(--color-board) px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-(--color-chalk-line) bg-(--color-board-panel) p-6"
      >
        <div className="mb-5 flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-(--color-marker-yellow)" />
          <h1 className="font-(family-name:--font-display) text-2xl text-(--color-chalk)">
            ESC Grammar Homework
          </h1>
        </div>
        <p className="mb-4 text-sm text-(--color-chalk-dim)">
          Enter your name and email so your teacher can find your work.
        </p>

        <label className="mb-3 block">
          <span className="mb-1 block text-xs text-(--color-chalk-dim)">Full name</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Student"
            className="w-full rounded-lg border border-(--color-chalk-line) bg-(--color-board-panel-alt) px-3 py-2 text-(--color-chalk) outline-none focus:border-(--color-marker-yellow)"
          />
        </label>

        <label className="mb-4 block">
          <span className="mb-1 block text-xs text-(--color-chalk-dim)">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            className="w-full rounded-lg border border-(--color-chalk-line) bg-(--color-board-panel-alt) px-3 py-2 text-(--color-chalk) outline-none focus:border-(--color-marker-yellow)"
          />
        </label>

        {error && <p className="mb-3 text-xs text-(--color-marker-coral)">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-(--color-marker-yellow) py-2.5 text-sm font-semibold text-(--color-board) transition hover:brightness-105 disabled:opacity-60"
        >
          {loading ? 'Starting…' : 'Start homework'}
        </button>

        <p className="mt-3 text-center text-[11px] text-(--color-chalk-dim)/80">
          Use the same email each time — that's how your progress and submissions are matched to you.
        </p>
      </form>
    </div>
  );
}
