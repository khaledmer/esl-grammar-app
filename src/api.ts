// All calls go to the Express + PostgreSQL backend in /server. In dev,
// Vite proxies /api to http://localhost:3001 (see vite.config.ts); in
// production the same Express server serves both the API and the built
// frontend, so relative paths work in both places.

import type { Student, StudentAnswers, TeacherSubmissionRow } from './types';

const STUDENT_STORAGE_KEY = 'esl_hw_student';

async function asJson(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
  return data;
}

// --- Student identity -------------------------------------------------

export function getSavedStudent(): Student | null {
  const raw = localStorage.getItem(STUDENT_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Student;
  } catch {
    return null;
  }
}

export async function loginStudent(name: string, email: string): Promise<Student> {
  const res = await fetch('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email }),
  });
  const student = (await asJson(res)) as Student;
  localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(student));
  return student;
}

export function logoutStudent(): void {
  localStorage.removeItem(STUDENT_STORAGE_KEY);
}

// --- Student progress ---------------------------------------------------

export interface SubmissionSnapshot {
  answers: StudentAnswers;
  isSubmitted: boolean;
  score?: number;
  teacherFeedback?: string;
  submittedAt?: string;
}

export async function getSubmission(studentId: number, exerciseId: string): Promise<SubmissionSnapshot> {
  const res = await fetch(`/api/submissions/${studentId}/${exerciseId}`);
  return asJson(res) as Promise<SubmissionSnapshot>;
}

export async function saveAnswer(
  studentId: number,
  exerciseId: string,
  unitCode: string,
  questionId: string,
  value: string
): Promise<void> {
  await fetch('/api/submissions/answer', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, exerciseId, unitCode, questionId, value }),
  });
}

export async function submitExercise(
  studentId: number,
  exerciseId: string,
  unitCode: string,
  score: number
): Promise<void> {
  const res = await fetch('/api/submissions/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, exerciseId, unitCode, score }),
  });
  await asJson(res);
}

// --- Config -------------------------------------------------------------

export async function fetchConfig(): Promise<{ deadline: string }> {
  const res = await fetch('/api/config');
  return asJson(res) as Promise<{ deadline: string }>;
}

export async function teacherLogin(password: string): Promise<string> {
  const res = await fetch('/api/teacher/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const { token } = await asJson(res);
  return token as string;
}

export async function fetchTeacherSubmissions(
  token: string,
  exerciseId: string
): Promise<TeacherSubmissionRow[]> {
  const res = await fetch(`/api/teacher/submissions?exerciseId=${encodeURIComponent(exerciseId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return asJson(res) as Promise<TeacherSubmissionRow[]>;
}

export async function gradeSubmission(
  token: string,
  submissionId: number,
  payload: { teacherOverrides?: Record<string, boolean>; teacherScore?: number; teacherFeedback?: string }
): Promise<void> {
  const res = await fetch(`/api/teacher/submissions/${submissionId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  await asJson(res);
}

export async function deleteSubmission(token: string, submissionId: number): Promise<void> {
  const res = await fetch(`/api/teacher/submissions/${submissionId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  await asJson(res);
}
