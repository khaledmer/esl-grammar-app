import type { Question } from './types';

/** Case-insensitive, trailing/leading-space-insensitive comparison. */
export function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function isCorrect(question: Question, studentAnswer: string | undefined): boolean {
  if (!studentAnswer) return false;
  const candidates = [question.correctAnswer, ...(question.acceptableAlternatives ?? [])];
  const normalizedAnswer = normalize(studentAnswer);
  return candidates.some((c) => normalize(c) === normalizedAnswer);
}

export function localStorageKey(unitCode: string): string {
  return `esl_hw_answers_${unitCode}`;
}

/** Formats an ISO timestamp as "Sun, 20 Sep, 22:10" in Algiers time — used
 * everywhere a submission's day/time needs to be shown to a teacher or
 * student. Returns an em dash for exercises that haven't been submitted. */
export function formatSubmittedAt(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Algiers',
  }).format(new Date(iso));
}
