// Core data model for the ESL Grammar Homework app.
// Kept intentionally generic so new exercises (any unit, any question type)
// can be added to mockData.ts without touching component code.

export type ExerciseType =
  | 'multiple-choice'
  | 'fill-in-blank'
  | 'sentence-transformation'
  | 'error-correction';

export interface Question {
  id: string;
  number: number;
  /** Sentence text before the gap / choice. */
  promptBefore: string;
  /** Sentence text after the gap / choice (may be empty). */
  promptAfter?: string;
  /** The two (or more) choices shown for multiple-choice items. */
  options?: string[];
  /** Base verb shown in brackets for fill-in-the-blank items, e.g. "(take)". */
  targetVerb?: string;
  /** Original sentence, used for error-correction / transformation items. */
  originalSentence?: string;
  correctAnswer: string;
  acceptableAlternatives?: string[];
  explanation: string;
}

export interface GrammarExercise {
  id: string;
  unitCode: '6A' | '7A' | '8A';
  title: string;
  topic: string;
  instruction: string;
  type: ExerciseType;
  /** Placeholder path for the teacher's lesson-note screenshot. */
  screenshotUrl: string;
  questions: Question[];
}

export interface StudentAnswers {
  [questionId: string]: string;
}

export interface SubmissionState {
  isSubmitted: boolean;
  score?: number;
  submittedAt?: string;
  answers: StudentAnswers;
}

/** Per-exercise submission + progress, keyed by exercise id, as stored in LocalStorage. */
export interface AllSubmissions {
  [exerciseId: string]: SubmissionState;
}

export interface AnswerKeyEntry {
  questionId: string;
  correctAnswer: string;
  acceptableAlternatives: string[];
  explanation: string;
}

export interface TeacherSolution {
  exerciseId: string;
  answerKey: AnswerKeyEntry[];
}

export interface Student {
  id: number;
  name: string;
  email: string;
}

/** One row of the teacher roster — a single student's submission for one exercise. */
export interface TeacherSubmissionRow {
  id: number;
  student_id: number;
  name: string;
  email: string;
  answers: StudentAnswers;
  auto_score: number | null;
  teacher_overrides: Record<string, boolean>;
  teacher_score: number | null;
  teacher_feedback: string | null;
  is_submitted: boolean;
  submitted_at: string | null;
  graded_at: string | null;
  updated_at: string;
}
