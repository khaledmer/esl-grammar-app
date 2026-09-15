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
