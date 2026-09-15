import { useEffect, useState } from 'react';
import { X, CheckCircle2, XCircle, Circle, Loader2, Trash2 } from 'lucide-react';
import type { GrammarExercise, TeacherSubmissionRow } from '../types';
import { fetchTeacherSubmissions, gradeSubmission, deleteSubmission } from '../api';
import { isCorrect, formatSubmittedAt } from '../utils';

interface Props {
  exercise: GrammarExercise;
  token: string;
  onClose: () => void;
}

export default function TeacherSubmissions({ exercise, token, onClose }: Props) {
  const [rows, setRows] = useState<TeacherSubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<TeacherSubmissionRow | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    setLoadError(null);
    fetchTeacherSubmissions(token, exercise.id)
      .then(setRows)
      .catch((err) => setLoadError(err instanceof Error ? err.message : 'Could not load submissions.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [exercise.id, token]);

  const handleDelete = async (row: TeacherSubmissionRow) => {
    const confirmed = window.confirm(
      `Delete ${row.name}'s submission for ${exercise.title}? This can't be undone — they'll start the exercise from scratch.`
    );
    if (!confirmed) return;
    setDeletingId(row.id);
    try {
      await deleteSubmission(token, row.id);
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      setSelected((prev) => (prev?.id === row.id ? null : prev));
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Could not delete submission.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60">
      <div className="flex h-full w-full max-w-3xl flex-col border-l border-(--color-chalk-line) bg-(--color-board-panel) shadow-2xl">
        <div className="flex items-center justify-between border-b border-(--color-chalk-line) px-5 py-4">
          <h2 className="font-(family-name:--font-display) text-xl text-(--color-chalk)">
            Submissions — {exercise.title}
          </h2>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-1.5 hover:bg-(--color-board-panel-alt)">
            <X className="h-5 w-5 text-(--color-chalk-dim)" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex h-full items-center justify-center gap-2 text-(--color-chalk-dim)">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading submissions…
            </div>
          ) : loadError ? (
            <p className="p-5 text-sm text-(--color-marker-coral)">{loadError}</p>
          ) : rows.length === 0 ? (
            <p className="p-5 text-sm text-(--color-chalk-dim)">
              No students have started this exercise yet.
            </p>
          ) : selected ? (
            <GradingPanel
              exercise={exercise}
              row={selected}
              token={token}
              onBack={() => setSelected(null)}
              onSaved={(updated) => {
                setRows((prev) => prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)));
                setSelected(null);
              }}
              onDelete={() => handleDelete(selected)}
              deleting={deletingId === selected.id}
            />
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-(--color-chalk-line) text-xs uppercase tracking-wide text-(--color-chalk-dim)">
                <tr>
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Submitted</th>
                  <th className="px-5 py-3">Auto score</th>
                  <th className="px-5 py-3">Grade</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-(--color-chalk-line)/60">
                    <td className="px-5 py-3">
                      <p className="text-(--color-chalk)">{row.name}</p>
                      <p className="text-xs text-(--color-chalk-dim)">{row.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      {row.is_submitted ? (
                        <span className="text-(--color-marker-green)">Submitted</span>
                      ) : (
                        <span className="text-(--color-chalk-dim)">In progress</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-(--color-chalk-dim)">
                      {formatSubmittedAt(row.submitted_at)}
                    </td>
                    <td className="px-5 py-3 text-(--color-chalk-dim)">
                      {row.auto_score ?? '—'}%
                    </td>
                    <td className="px-5 py-3">
                      {row.teacher_score != null ? (
                        <span className="font-semibold text-(--color-marker-yellow)">{row.teacher_score}%</span>
                      ) : (
                        <span className="text-(--color-chalk-dim)">Ungraded</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelected(row)}
                          className="rounded-lg border border-(--color-chalk-line) px-3 py-1.5 text-xs font-medium text-(--color-chalk) hover:bg-(--color-board-panel-alt)"
                        >
                          Review & grade
                        </button>
                        <button
                          onClick={() => handleDelete(row)}
                          disabled={deletingId === row.id}
                          title="Delete this submission"
                          className="rounded-lg border border-(--color-chalk-line) p-1.5 text-(--color-chalk-dim) hover:border-(--color-marker-coral)/50 hover:text-(--color-marker-coral) disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

interface GradingPanelProps {
  exercise: GrammarExercise;
  row: TeacherSubmissionRow;
  token: string;
  onBack: () => void;
  onSaved: (updated: Partial<TeacherSubmissionRow> & { id: number }) => void;
  onDelete: () => void;
  deleting: boolean;
}

function GradingPanel({ exercise, row, token, onBack, onSaved, onDelete, deleting }: GradingPanelProps) {
  const [overrides, setOverrides] = useState<Record<string, boolean>>(row.teacher_overrides ?? {});
  const [feedback, setFeedback] = useState(row.teacher_feedback ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveCorrect = (questionId: string, autoCorrect: boolean) =>
    overrides[questionId] ?? autoCorrect;

  const correctCount = exercise.questions.filter((q) =>
    effectiveCorrect(q.id, isCorrect(q, row.answers[q.id]))
  ).length;
  const score = Math.round((correctCount / exercise.questions.length) * 100);

  const toggleOverride = (questionId: string, autoCorrect: boolean) => {
    setOverrides((prev) => {
      const current = prev[questionId] ?? autoCorrect;
      return { ...prev, [questionId]: !current };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await gradeSubmission(token, row.id, {
        teacherOverrides: overrides,
        teacherScore: score,
        teacherFeedback: feedback,
      });
      onSaved({ id: row.id, teacher_overrides: overrides, teacher_score: score, teacher_feedback: feedback });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save grading.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-5">
      <button onClick={onBack} className="mb-4 text-xs text-(--color-chalk-dim) hover:text-(--color-chalk)">
        ← Back to all submissions
      </button>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-(--color-chalk)">{row.name}</p>
          <p className="text-xs text-(--color-chalk-dim)">{row.email}</p>
          <p className="mt-1 text-xs text-(--color-chalk-dim)">
            Submitted: <span className="text-(--color-chalk)">{formatSubmittedAt(row.submitted_at)}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-(--color-marker-yellow)/15 px-3 py-1 text-sm font-semibold text-(--color-marker-yellow)">
            Current grade: {score}%
          </span>
          <button
            onClick={onDelete}
            disabled={deleting}
            title="Delete this submission"
            className="rounded-lg border border-(--color-chalk-line) p-2 text-(--color-chalk-dim) hover:border-(--color-marker-coral)/50 hover:text-(--color-marker-coral) disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <ol className="space-y-3">
        {exercise.questions.map((q) => {
          const studentAnswer = row.answers[q.id];
          const autoCorrect = isCorrect(q, studentAnswer);
          const correct = effectiveCorrect(q.id, autoCorrect);
          const overridden = overrides[q.id] !== undefined && overrides[q.id] !== autoCorrect;
          return (
            <li key={q.id} className="rounded-xl border border-(--color-chalk-line) bg-(--color-board-panel-alt) p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-(--color-chalk-dim)">
                  {q.number}. {q.promptBefore} ___ {q.promptAfter}
                </p>
                <button
                  onClick={() => toggleOverride(q.id, autoCorrect)}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg border border-(--color-chalk-line) px-2 py-1 text-xs hover:bg-(--color-board)"
                  title="Click to override the auto-grade"
                >
                  {studentAnswer ? (
                    correct ? (
                      <CheckCircle2 className="h-4 w-4 text-(--color-marker-green)" />
                    ) : (
                      <XCircle className="h-4 w-4 text-(--color-marker-coral)" />
                    )
                  ) : (
                    <Circle className="h-4 w-4 text-(--color-chalk-dim)" />
                  )}
                  {overridden ? 'Overridden' : 'Auto-graded'}
                </button>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-(--color-chalk-dim)">Student wrote</p>
                  <p className="text-(--color-chalk)">{studentAnswer || <span className="italic text-(--color-chalk-dim)">No answer</span>}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-(--color-chalk-dim)">Correct answer</p>
                  <p className="text-(--color-marker-yellow)">
                    {q.correctAnswer}
                    {q.acceptableAlternatives?.length ? (
                      <span className="text-(--color-chalk-dim)"> / {q.acceptableAlternatives.join(' / ')}</span>
                    ) : null}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <label className="mt-4 block">
        <span className="mb-1 block text-xs text-(--color-chalk-dim)">Feedback for the student (optional)</span>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-(--color-chalk-line) bg-(--color-board-panel-alt) px-3 py-2 text-sm text-(--color-chalk) outline-none focus:border-(--color-marker-yellow)"
          placeholder="e.g. Watch out for 'unless' clauses — they never take will."
        />
      </label>

      {error && <p className="mt-2 text-xs text-(--color-marker-coral)">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-4 w-full rounded-xl bg-(--color-marker-yellow) py-2.5 text-sm font-semibold text-(--color-board) hover:brightness-105 disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save grade'}
      </button>
    </div>
  );
}
