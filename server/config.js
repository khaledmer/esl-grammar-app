// Single source of truth for the submission deadline. The frontend never
// hardcodes this — it fetches it from GET /api/config — so changing the
// date here (or via the SUBMISSION_DEADLINE env var) is the only edit
// needed to move the deadline.

// Sunday, September 20th, 2026, end of day in Algeria (UTC+1, no DST).
const DEFAULT_DEADLINE = '2026-09-20T23:59:00+01:00';

export const SUBMISSION_DEADLINE = process.env.SUBMISSION_DEADLINE || DEFAULT_DEADLINE;

export function isPastDeadline() {
  return Date.now() > new Date(SUBMISSION_DEADLINE).getTime();
}
