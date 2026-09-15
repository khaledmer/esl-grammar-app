import { X, CheckCircle2, XCircle } from 'lucide-react';
import type { GrammarExercise, StudentAnswers } from '../types';
import { isCorrect } from '../utils';

interface Props {
  exercise: GrammarExercise;
  studentAnswers: StudentAnswers;
  onClose: () => void;
}

// Shown once the teacher is already authenticated at the App level.
// This is the master answer key + explanations, compared against whatever
// answers happen to be loaded in the current browser (handy while sitting
// with a student) — for grading real submissions from every student, see
// TeacherSubmissions instead.
export default function TeacherSolutionDashboard({ exercise, studentAnswers, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60">
      <div className="flex h-full w-full max-w-xl flex-col border-l border-(--color-chalk-line) bg-(--color-board-panel) shadow-2xl">
        <div className="flex items-center justify-between border-b border-(--color-chalk-line) px-5 py-4">
          <h2 className="font-(family-name:--font-display) text-xl text-(--color-chalk)">
            Answer key — {exercise.title}
          </h2>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-1.5 hover:bg-(--color-board-panel-alt)">
            <X className="h-5 w-5 text-(--color-chalk-dim)" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="mb-4 text-sm text-(--color-chalk-dim)">{exercise.instruction}</p>
          <ol className="space-y-4">
            {exercise.questions.map((q) => {
              const studentAnswer = studentAnswers[q.id];
              const correct = isCorrect(q, studentAnswer);
              return (
                <li key={q.id} className="rounded-xl border border-(--color-chalk-line) bg-(--color-board-panel-alt) p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-(--color-chalk-dim)">
                      {q.number}. {q.promptBefore} ___ {q.promptAfter}
                    </p>
                    {studentAnswer ? (
                      correct ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-(--color-marker-green)" />
                      ) : (
                        <XCircle className="h-4 w-4 shrink-0 text-(--color-marker-coral)" />
                      )
                    ) : null}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-(--color-chalk-dim)">This browser's answer</p>
                      <p className={studentAnswer ? (correct ? 'text-(--color-marker-green)' : 'text-(--color-marker-coral)') : 'italic text-(--color-chalk-dim)'}>
                        {studentAnswer || 'No answer yet'}
                      </p>
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

                  <p className="mt-3 rounded-lg bg-(--color-board) px-3 py-2 text-xs leading-relaxed text-(--color-chalk-dim)">
                    {q.explanation}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
