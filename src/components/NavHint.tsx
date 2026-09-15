import { useState } from 'react';

const DISMISS_KEY = 'esl_hw_nav_hint_dismissed';

export function shouldShowNavHint(): boolean {
  return localStorage.getItem(DISMISS_KEY) !== 'true';
}

export function dismissNavHint(): void {
  localStorage.setItem(DISMISS_KEY, 'true');
}

export default function NavHint({ onDismiss }: { onDismiss: () => void }) {
  const [dismissing, setDismissing] = useState(false);

  const handleDismiss = () => {
    dismissNavHint();
    setDismissing(true);
    setTimeout(onDismiss, 150);
  };

  return (
    <div
      className={`pointer-events-none absolute right-4 top-full z-40 flex flex-col items-end sm:right-24 transition-opacity duration-150 ${
        dismissing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Bouncing arrow pointing up at the unit tabs / teacher-mode button */}
      <svg
        width="40"
        height="32"
        viewBox="0 0 40 32"
        fill="none"
        className="mr-6 animate-bounce text-(--color-marker-yellow)"
      >
        <path
          d="M20 2 L20 24 M20 2 L11 12 M20 2 L29 12"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="pointer-events-auto mt-1 max-w-[220px] rounded-xl border border-(--color-marker-yellow)/60 bg-(--color-board-panel) p-3 text-right shadow-xl">
        <p className="text-xs leading-snug text-(--color-chalk)">
          👆 Your <strong>3 assignments</strong> are up here — tap <strong>6A</strong>,{' '}
          <strong>7A</strong>, and <strong>8A</strong> to switch between them and complete all three.
        </p>
        <button
          onClick={handleDismiss}
          className="mt-2 rounded-lg bg-(--color-marker-yellow) px-3 py-1 text-xs font-semibold text-(--color-board) hover:brightness-105"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
