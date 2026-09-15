import { useEffect, useMemo, useState } from 'react';
import { GraduationCap, ShieldCheck, ClipboardCheck, RotateCcw, LogOut } from 'lucide-react';
import { exercises } from './mockData';
import type { Student, StudentAnswers } from './types';
import {
  getSavedStudent,
  getSubmission,
  fetchConfig,
  logoutStudent,
  saveAnswer,
  submitExercise,
} from './api';
import { isCorrect, formatSubmittedAt } from './utils';
import StudentLogin from './components/StudentLogin';
import NavHint, { shouldShowNavHint, dismissNavHint } from './components/NavHint';
import TeacherLogin from './components/TeacherLogin';
import GrammarExerciseView from './components/GrammarExerciseView';
import TeacherSolutionDashboard from './components/TeacherSolutionDashboard';
import TeacherSubmissions from './components/TeacherSubmissions';
import SubmissionModal from './components/SubmissionModal';

type Mode = 'student' | 'teacher';

export default function App() {
  const [unitCode, setUnitCode] = useState(exercises[0].unitCode);
  const [mode, setMode] = useState<Mode>('student');

  const [student, setStudent] = useState<Student | null>(() => getSavedStudent());
  const [teacherToken, setTeacherToken] = useState<string | null>(null);
  const [showTeacherLogin, setShowTeacherLogin] = useState(false);

  const [answers, setAnswers] = useState<StudentAnswers>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | undefined>(undefined);
  const [submittedAt, setSubmittedAt] = useState<string | undefined>(undefined);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [showNavHint, setShowNavHint] = useState(shouldShowNavHint);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig()
      .then((cfg) => setDeadline(new Date(cfg.deadline)))
      .catch(() => setDeadline(null));
  }, []);

  const isPastDeadline = deadline !== null && Date.now() > deadline.getTime();
  const deadlineLabel = deadline
    ? new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'Africa/Algiers',
      }).format(deadline)
    : null;

  const exercise = useMemo(
    () => exercises.find((e) => e.unitCode === unitCode)!,
    [unitCode]
  );

  // Load this student's saved progress whenever the selected unit changes.
  useEffect(() => {
    if (!student) return;
    let cancelled = false;
    getSubmission(student.id, exercise.id).then((submission) => {
      if (cancelled) return;
      setAnswers(submission.answers);
      setIsSubmitted(submission.isSubmitted);
      setScore(submission.score);
      setSubmittedAt(submission.submittedAt);
    });
    return () => {
      cancelled = true;
    };
  }, [student, exercise.id]);

  const handleAnswerChange = (questionId: string, value: string) => {
    if (!student) return;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    saveAnswer(student.id, exercise.id, exercise.unitCode, questionId, value);
  };

  const handleConfirmSubmit = async () => {
    if (!student) return;
    const correctCount = exercise.questions.filter((q) => isCorrect(q, answers[q.id])).length;
    const pct = Math.round((correctCount / exercise.questions.length) * 100);
    try {
      await submitExercise(student.id, exercise.id, exercise.unitCode, pct);
      setIsSubmitted(true);
      setScore(pct);
      setSubmittedAt(new Date().toISOString());
      setShowSubmitModal(false);
      setSubmitError(null);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Could not submit homework.');
    }
  };

  const handleRetake = () => setIsSubmitted(false);

  const handleModeToggle = () => {
    if (mode === 'teacher') {
      setMode('student');
      return;
    }
    if (teacherToken) {
      setMode('teacher');
    } else {
      setShowTeacherLogin(true);
    }
  };

  const answeredCount = exercise.questions.filter((q) => (answers[q.id] ?? '').trim().length > 0).length;

  // Students must identify themselves before working on an exercise.
  if (mode === 'student' && !student) {
    return <StudentLogin onLoggedIn={setStudent} />;
  }

  return (
    <div className="chalkboard-texture min-h-screen bg-(--color-board)">
      <header className="relative border-b border-(--color-chalk-line)">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-(--color-marker-yellow)" />
            <div>
              <h1 className="font-(family-name:--font-display) text-2xl leading-none text-(--color-chalk)">
                ESC Grammar Homework
              </h1>
              <p className="text-xs text-(--color-chalk-dim)">
                {mode === 'student' && student ? `Signed in as ${student.name}` : 'Staff English Conversation Program'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <nav className="flex rounded-full border border-(--color-chalk-line) p-1">
              {exercises.map((ex) => (
                <button
                  key={ex.unitCode}
                  onClick={() => {
                    setUnitCode(ex.unitCode);
                    dismissNavHint();
                    setShowNavHint(false);
                  }}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    ex.unitCode === unitCode
                      ? 'bg-(--color-marker-yellow) text-(--color-board)'
                      : 'text-(--color-chalk-dim) hover:text-(--color-chalk)'
                  }`}
                >
                  {ex.unitCode}
                </button>
              ))}
            </nav>

            <button
              onClick={handleModeToggle}
              className="flex items-center gap-1.5 rounded-full border border-(--color-chalk-line) px-3 py-1.5 text-sm text-(--color-chalk) hover:bg-(--color-board-panel-alt)"
            >
              <ShieldCheck className="h-4 w-4" />
              {mode === 'student' ? 'Teacher mode' : 'Student mode'}
            </button>

            {mode === 'student' && student && (
              <button
                onClick={() => {
                  logoutStudent();
                  setStudent(null);
                }}
                title="Not you? Switch student"
                className="flex items-center gap-1.5 rounded-full border border-(--color-chalk-line) px-2.5 py-1.5 text-sm text-(--color-chalk-dim) hover:bg-(--color-board-panel-alt)"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {mode === 'student' && showNavHint && <NavHint onDismiss={() => setShowNavHint(false)} />}

      <main className="mx-auto max-w-5xl px-5 py-6">
        {mode === 'student' && deadlineLabel && (
          <div
            className={`mb-4 flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm ${
              isPastDeadline
                ? 'border-(--color-marker-coral)/50 bg-(--color-marker-coral)/10 text-(--color-marker-coral)'
                : 'border-(--color-chalk-line) bg-(--color-board-panel) text-(--color-chalk-dim)'
            }`}
          >
            {isPastDeadline ? (
              <span>The deadline passed on <strong>{deadlineLabel}</strong> — new submissions are no longer accepted.</span>
            ) : (
              <span>Deadline to submit all three units: <strong className="text-(--color-chalk)">{deadlineLabel}</strong></span>
            )}
          </div>
        )}

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-(family-name:--font-display) text-3xl text-(--color-chalk)">{exercise.title}</h2>
            <p className="text-sm text-(--color-chalk-dim)">{exercise.instruction}</p>
          </div>

          {mode === 'student' && (
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-(--color-board-panel) px-3 py-1 text-xs text-(--color-chalk-dim)">
                {answeredCount} / {exercise.questions.length} answered
              </span>
              {isSubmitted && score !== undefined && (
                <span className="rounded-full bg-(--color-marker-yellow)/15 px-3 py-1 text-xs font-semibold text-(--color-marker-yellow)">
                  Score: {score}%
                </span>
              )}
              {isSubmitted && submittedAt && (
                <span className="rounded-full bg-(--color-board-panel) px-3 py-1 text-xs text-(--color-chalk-dim)">
                  Submitted {formatSubmittedAt(submittedAt)}
                </span>
              )}
            </div>
          )}
        </div>

        {mode === 'student' ? (
          <>
            <GrammarExerciseView
              exercise={exercise}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              isSubmitted={isSubmitted}
            />

            <div className="mt-6 flex justify-end gap-3">
              {isSubmitted ? (
                !isPastDeadline && (
                  <button
                    onClick={handleRetake}
                    className="flex items-center gap-2 rounded-xl border border-(--color-chalk-line) px-4 py-2.5 text-sm font-medium text-(--color-chalk) hover:bg-(--color-board-panel-alt)"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Retake exercise
                  </button>
                )
              ) : isPastDeadline ? (
                <span className="rounded-xl border border-(--color-chalk-line) px-4 py-2.5 text-sm text-(--color-chalk-dim)">
                  Submission closed — the deadline has passed.
                </span>
              ) : (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="flex items-center gap-2 rounded-xl bg-(--color-marker-yellow) px-4 py-2.5 text-sm font-semibold text-(--color-board) hover:brightness-105"
                >
                  <ClipboardCheck className="h-4 w-4" />
                  Submit homework
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-(--color-chalk-line) bg-(--color-board-panel) p-10 text-center">
            <ShieldCheck className="h-8 w-8 text-(--color-marker-yellow)" />
            <p className="text-(--color-chalk-dim)">
              You're viewing <span className="text-(--color-chalk)">{exercise.title}</span> as a teacher.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setShowAnswerKey(true)}
                className="rounded-xl border border-(--color-marker-yellow)/50 px-4 py-2.5 text-sm font-medium text-(--color-marker-yellow) hover:bg-(--color-marker-yellow)/10"
              >
                View answer key
              </button>
              <button
                onClick={() => setShowSubmissions(true)}
                className="rounded-xl bg-(--color-marker-yellow) px-4 py-2.5 text-sm font-semibold text-(--color-board) hover:brightness-105"
              >
                Review student submissions
              </button>
            </div>
          </div>
        )}
      </main>

      {showSubmitModal && (
        <SubmissionModal
          exercise={exercise}
          answers={answers}
          onConfirm={handleConfirmSubmit}
          onCancel={() => {
            setShowSubmitModal(false);
            setSubmitError(null);
          }}
          error={submitError}
        />
      )}

      {showAnswerKey && (
        <TeacherSolutionDashboard
          exercise={exercise}
          studentAnswers={answers}
          onClose={() => setShowAnswerKey(false)}
        />
      )}

      {showSubmissions && teacherToken && (
        <TeacherSubmissions
          exercise={exercise}
          token={teacherToken}
          onClose={() => setShowSubmissions(false)}
        />
      )}

      {showTeacherLogin && (
        <TeacherLogin
          onLoggedIn={(token) => {
            setTeacherToken(token);
            setMode('teacher');
            setShowTeacherLogin(false);
          }}
          onCancel={() => setShowTeacherLogin(false)}
        />
      )}
    </div>
  );
}
