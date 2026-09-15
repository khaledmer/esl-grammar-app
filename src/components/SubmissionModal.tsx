import type { GrammarExercise, StudentAnswers } from '../types';
import { isCorrect } from '../utils';

interface Props {
  exercise: GrammarExercise;
  answers: StudentAnswers;
  onConfirm: () => void;
  onCancel: () => void;
  error?: string | null;
}

export default function SubmissionModal({ exercise, answers, onConfirm, onCancel, error }: Props) {
  const total = exercise.questions.length;
  const answered = exercise.questions.filter((q) => (answers[q.id] ?? '').trim().length > 0).length;
  const unanswered = total - answered;
  const correct = exercise.questions.filter((q) => isCorrect(q, answers[q.id])).length;
  const score = Math.round((correct / total) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-(--color-chalk-line) bg-(--color-board-panel) p-6 shadow-2xl">
        <h2 className="font-(family-name:--font-display) text-2xl text-(--color-chalk)">
          Ready to submit?
        </h2>
        <p className="mt-1 text-sm text-(--color-chalk-dim)">{exercise.title}</p>

        <dl className="mt-5 space-y-2 text-sm">
          <div className="flex items-center justify-between rounded-lg bg-(--color-board-panel-alt) px-3 py-2">
            <dt className="text-(--color-chalk-dim)">Completed</dt>
            <dd className="font-semibold text-(--color-marker-green)">{answered} / {total}</dd>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-(--color-board-panel-alt) px-3 py-2">
            <dt className="text-(--color-chalk-dim)">Unanswered</dt>
            <dd className={`font-semibold ${unanswered > 0 ? 'text-(--color-marker-coral)' : 'text-(--color-chalk-dim)'}`}>
              {unanswered}
            </dd>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-(--color-board-panel-alt) px-3 py-2">
            <dt className="text-(--color-chalk-dim)">Instant score</dt>
            <dd className="font-semibold text-(--color-marker-yellow)">{score}%</dd>
          </div>
        </dl>

        {unanswered > 0 && (
          <p className="mt-4 text-xs text-(--color-marker-coral)">
            You still have {unanswered} unanswered {unanswered === 1 ? 'question' : 'questions'}. You can
            submit anyway, or go back and finish first.
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-lg border border-(--color-marker-coral)/50 bg-(--color-marker-coral)/10 px-3 py-2 text-xs text-(--color-marker-coral)">
            {error}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-(--color-chalk-line) py-2.5 text-sm font-medium text-(--color-chalk) transition hover:bg-(--color-board-panel-alt)"
          >
            Keep working
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-(--color-marker-yellow) py-2.5 text-sm font-semibold text-(--color-board) transition hover:brightness-105"
          >
            Submit homework
          </button>
        </div>
      </div>
    </div>
  );
}
