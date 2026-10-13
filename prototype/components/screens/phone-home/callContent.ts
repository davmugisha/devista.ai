// Words only the call screen uses (Call.dc.html): the three visuals Chief of Staff can put on the
// screen, what it says about each, and how each one reads once pinned to the Dashboard. Shared
// facts (the runway, the overdue invoices, the Umoja proposal) come from lib/data.ts.

import { NUMBERS, OVERDUE_TOTAL, getApproval } from '@/lib/data';
import type { CallVisual } from './session';

/** In the order of the switcher under the captions. */
export const CALL_VISUALS: { key: CallVisual; label: string }[] = [
  { key: 'inv', label: 'Invoices' },
  { key: 'run', label: 'Runway' },
  { key: 'pro', label: 'Proposal' },
];

export const DEFAULT_VISUAL: CallVisual = 'run';

export const CAPTIONS: Record<CallVisual, string> = {
  inv: 'Two invoices are overdue: Kivu Coffee at fourteen days, Nyota Labs at six.',
  run: 'If both invoices land this week, runway moves from 4.2 to 5.1 months.',
  pro: 'The Umoja proposal is ready: six weeks, $4,800. Want me to send it today?',
};

/** The proposal's client, as the decision itself names it. */
export const PROPOSAL_CLIENT = getApproval('umoja')?.fields.find((f) => f.label === 'Client')?.value ?? 'Umoja';

/** The month axis under the runway chart. */
export const RUNWAY_MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

/** How a pinned visual reads on the Dashboard. */
export const CALL_PINS: Record<CallVisual, { label: string; value: string; note: string }> = {
  run: {
    label: 'Cash runway',
    value: `${NUMBERS.runway.months} → ${NUMBERS.runway.after} months`,
    note: 'If both invoices are paid',
  },
  inv: { label: 'Overdue invoices', value: OVERDUE_TOTAL, note: 'Kivu Coffee Co., Nyota Labs' },
  pro: { label: 'Proposal · v2', value: PROPOSAL_CLIENT, note: '$4,800 · 6 weeks' },
};
