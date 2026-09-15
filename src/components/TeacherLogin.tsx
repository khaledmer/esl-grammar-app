import { useState } from 'react';
import { Lock } from 'lucide-react';
import { teacherLogin } from '../api';

interface Props {
  onLoggedIn: (token: string) => void;
  onCancel: () => void;
}

export default function TeacherLogin({ onLoggedIn, onCancel }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const token = await teacherLogin(password);
      onLoggedIn(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Incorrect password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-xs flex-col items-center gap-4 rounded-2xl border border-(--color-chalk-line) bg-(--color-board-panel) p-6 text-center"
      >
        <Lock className="h-8 w-8 text-(--color-chalk-dim)" />
        <p className="text-sm text-(--color-chalk-dim)">Enter the teacher password to continue.</p>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-lg border border-(--color-chalk-line) bg-(--color-board-panel-alt) px-3 py-2 text-center text-(--color-chalk) outline-none focus:border-(--color-marker-yellow)"
        />
        {error && <p className="text-xs text-(--color-marker-coral)">{error}</p>}
        <div className="flex w-full gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-(--color-chalk-line) py-2 text-sm text-(--color-chalk) hover:bg-(--color-board-panel-alt)"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-xl bg-(--color-marker-yellow) py-2 text-sm font-semibold text-(--color-board) hover:brightness-105 disabled:opacity-60"
          >
            {loading ? 'Checking…' : 'Unlock'}
          </button>
        </div>
      </form>
    </div>
  );
}
