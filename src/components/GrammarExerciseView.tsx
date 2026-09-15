import { useState } from 'react';
import { ImageOff, CheckCircle2 } from 'lucide-react';
import type { GrammarExercise, StudentAnswers } from '../types';

interface Props {
  exercise: GrammarExercise;
  answers: StudentAnswers;
  onAnswerChange: (questionId: string, value: string) => void;
  isSubmitted: boolean;
}

export default function GrammarExerciseView({ exercise, answers, onAnswerChange, isSubmitted }: Props) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
      {/* Lesson screenshot panel */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <div className="overflow-hidden rounded-2xl border border-(--color-chalk-line) bg-(--color-board-panel)">
          <div className="border-b border-(--color-chalk-line) px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-(--color-chalk-dim)">Lesson notes</p>
          </div>
          {!imageFailed ? (
            <img
              src={exercise.screenshotUrl}
              alt={`Teacher's lesson notes for ${exercise.title}`}
              className="h-auto w-full object-contain"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="flex aspect-4/3 flex-col items-center justify-center gap-2 p-8 text-center text-(--color-chalk-dim)">
              <ImageOff className="h-8 w-8" />
              <p className="text-sm">
                No screenshot yet — drop the lesson image at
                <br />
                <code className="text-(--color-marker-yellow)">public{exercise.screenshotUrl}</code>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="rounded-2xl border border-(--color-chalk-line) bg-(--color-board-panel) p-5">
        <ol className="space-y-5">
          {exercise.questions.map((q) => {
            const value = answers[q.id] ?? '';
            const answeredThis = value.trim().length > 0;
            return (
              <li key={q.id} className="border-b border-(--color-chalk-line) pb-5 last:border-none last:pb-0">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--color-board-panel-alt) text-xs font-semibold text-(--color-chalk-dim)">
                    {q.number}
                  </span>
                  <div className="flex-1">
                    <p className="text-(--color-chalk)">
                      {q.promptBefore}{' '}
                      {exercise.type === 'fill-in-blank' ? (
                        <span className="mx-1 inline-flex items-center gap-1">
                          <input
                            type="text"
                            value={value}
                            disabled={isSubmitted}
                            onChange={(e) => onAnswerChange(q.id, e.target.value)}
                            placeholder="type your answer"
                            className="w-40 rounded-md border-b-2 border-(--color-chalk-line) bg-transparent px-1 py-0.5 text-center font-medium text-(--color-marker-yellow) outline-none placeholder:text-(--color-chalk-dim)/60 focus:border-(--color-marker-yellow) disabled:opacity-60"
                          />
                          {q.targetVerb && (
                            <span className="text-sm text-(--color-chalk-dim)">({q.targetVerb})</span>
                          )}
                        </span>
                      ) : null}
                      {' '}
                      {q.promptAfter}
                    </p>

                    {exercise.type === 'multiple-choice' && q.options && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {q.options.map((opt) => {
                          const selected = value === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              disabled={isSubmitted}
                              onClick={() => onAnswerChange(q.id, opt)}
                              className={`rounded-full border px-3 py-1.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                selected
                                  ? 'border-(--color-marker-yellow) bg-(--color-marker-yellow)/15 text-(--color-marker-yellow)'
                                  : 'border-(--color-chalk-line) text-(--color-chalk) hover:bg-(--color-board-panel-alt)'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {answeredThis && (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-(--color-marker-green)" />
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
