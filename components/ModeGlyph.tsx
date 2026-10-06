import type { Mode } from '@/lib/workflows';

/**
 * Who does a step, encoded by shape: a person is a solid circle, AI-assisted work is a
 * half-filled circle (shared between a person and AI), and an agent is a solid diamond.
 * Drawn in the current text colour; always paired with a text label.
 */
export function ModeGlyph({ mode, className = 'size-3' }: { mode: Mode; className?: string }) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className={'shrink-0 ' + className}>
      {mode === 'person' && <circle cx="6" cy="6" r="5.25" className="fill-current" />}
      {mode === 'assisted' && (
        <>
          <circle cx="6" cy="6" r="4.75" className="fill-transparent stroke-current" strokeWidth="1.5" />
          <path d="M6 0.75a5.25 5.25 0 0 0 0 10.5Z" className="fill-current" />
        </>
      )}
      {mode === 'agent' && <path d="M6 0.4 11.6 6 6 11.6 0.4 6Z" className="fill-current" />}
    </svg>
  );
}
