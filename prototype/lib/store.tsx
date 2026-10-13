'use client';

// The prototype's shared state. Approving something in one screen changes every count, badge and
// list that depends on it, on the phone and on the web. State lives in sessionStorage, so it
// survives reloads in the tab and is shared by the frames on the preview canvas (a change in one
// frame reaches the others through the storage event). "Reset example data" restores the design.

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import {
  AGENTS,
  APPROVALS,
  THREADS,
  type Agent,
  type Approval,
  type ApprovalKey,
  type Decision,
  type ListingKey,
  type Mode,
  type PlanKey,
  type PriceModel,
  type SellableKey,
  type ThreadKey,
} from './data';

export interface Install {
  listing: ListingKey;
  plan: PlanKey;
}

export interface Submission {
  id: string;
  thing: SellableKey;
  name: string;
  pitch: string;
  model: PriceModel;
  price: string;
}

export interface PrototypeState {
  decisions: Partial<Record<ApprovalKey, Decision>>;
  /** Picked option for decisions with choices (the launch date). */
  choices: Partial<Record<ApprovalKey, number>>;
  installs: Partial<Record<ListingKey, Install>>;
  submissions: Submission[];
  /** Messages the owner typed, per conversation. */
  sent: Partial<Record<ThreadKey, string[]>>;
  /** Conversations opened since the start, so their unread badges clear. */
  read: Partial<Record<ThreadKey, true>>;
  mode: Mode;
}

export const INITIAL_STATE: PrototypeState = {
  decisions: {},
  choices: {},
  installs: {},
  submissions: [],
  sent: {},
  read: {},
  mode: 'work',
};

type Action =
  | { type: 'decide'; key: ApprovalKey; decision: Decision }
  | { type: 'undo'; key: ApprovalKey }
  | { type: 'choose'; key: ApprovalKey; index: number }
  | { type: 'install'; install: Install }
  | { type: 'submit'; submission: Submission }
  | { type: 'send'; thread: ThreadKey; text: string }
  | { type: 'read'; thread: ThreadKey }
  | { type: 'mode'; mode: Mode }
  | { type: 'replace'; state: PrototypeState }
  | { type: 'reset' };

function reducer(state: PrototypeState, action: Action): PrototypeState {
  switch (action.type) {
    case 'decide':
      return { ...state, decisions: { ...state.decisions, [action.key]: action.decision } };
    case 'undo': {
      const decisions = { ...state.decisions };
      delete decisions[action.key];
      return { ...state, decisions };
    }
    case 'choose':
      return { ...state, choices: { ...state.choices, [action.key]: action.index } };
    case 'install':
      return { ...state, installs: { ...state.installs, [action.install.listing]: action.install } };
    case 'submit':
      return { ...state, submissions: [...state.submissions, action.submission] };
    case 'send': {
      const text = action.text.trim();
      if (!text) return state;
      return { ...state, sent: { ...state.sent, [action.thread]: [...(state.sent[action.thread] ?? []), text] } };
    }
    case 'read':
      return state.read[action.thread] ? state : { ...state, read: { ...state.read, [action.thread]: true } };
    case 'mode':
      return { ...state, mode: action.mode };
    case 'replace':
      return action.state;
    case 'reset':
      return INITIAL_STATE;
  }
}

const STORAGE_KEY = 'saydeed-prototype:v1';

function load(): PrototypeState | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PrototypeState>;
    return { ...INITIAL_STATE, ...parsed };
  } catch {
    return null;
  }
}

function save(state: PrototypeState) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private windows can refuse storage; the prototype still works for this page view.
  }
}

interface StoreValue {
  state: PrototypeState;
  dispatch: (action: Action) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function PrototypeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  // Saving waits until the saved state has been restored, or the first save would overwrite it.
  const [hydrated, setHydrated] = useState(false);

  // Restore after hydration, so the server render and the first client render agree.
  useEffect(() => {
    const saved = load();
    if (saved) dispatch({ type: 'replace', state: saved });
    setHydrated(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const next = e.newValue ? load() : INITIAL_STATE;
      dispatch({ type: 'replace', state: next ?? INITIAL_STATE });
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    let current: string | null = null;
    try {
      current = window.sessionStorage.getItem(STORAGE_KEY);
    } catch {
      current = null;
    }
    if (current !== JSON.stringify(state)) save(state);
  }, [state, hydrated]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

/** Everything a screen needs: current state, derived counts and actions. */
export function usePrototype() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('usePrototype must be used inside <PrototypeProvider>');
  const { state, dispatch } = ctx;

  const decisionOf = useCallback((key: ApprovalKey): Decision | undefined => state.decisions[key], [state.decisions]);
  const choiceOf = useCallback(
    (key: ApprovalKey): number => state.choices[key] ?? APPROVALS.find((a) => a.key === key)?.defaultChoice ?? 0,
    [state.choices],
  );

  const pending: Approval[] = useMemo(() => APPROVALS.filter((a) => !state.decisions[a.key]), [state.decisions]);

  /** Agents with their live state: an agent waiting on a decided approval is back at work. */
  const agents: Agent[] = useMemo(
    () =>
      AGENTS.map((a) =>
        a.waitsOn && state.decisions[a.waitsOn] === 'approved'
          ? { ...a, state: 'working', doing: a.afterDecision ?? a.doing }
          : a,
      ),
    [state.decisions],
  );

  const unreadOf = useCallback(
    (key: ThreadKey): number => (state.read[key] ? 0 : (THREADS.find((t) => t.key === key)?.unread ?? 0)),
    [state.read],
  );

  const actions = useMemo(
    () => ({
      approve: (key: ApprovalKey) => dispatch({ type: 'decide', key, decision: 'approved' }),
      reject: (key: ApprovalKey) => dispatch({ type: 'decide', key, decision: 'rejected' }),
      undo: (key: ApprovalKey) => dispatch({ type: 'undo', key }),
      choose: (key: ApprovalKey, index: number) => dispatch({ type: 'choose', key, index }),
      install: (install: Install) => dispatch({ type: 'install', install }),
      submit: (submission: Omit<Submission, 'id'>) =>
        dispatch({ type: 'submit', submission: { ...submission, id: `${submission.thing}-${Date.now().toString(36)}` } }),
      send: (thread: ThreadKey, text: string) => dispatch({ type: 'send', thread, text }),
      markRead: (thread: ThreadKey) => dispatch({ type: 'read', thread }),
      setMode: (mode: Mode) => dispatch({ type: 'mode', mode }),
      reset: () => dispatch({ type: 'reset' }),
    }),
    [dispatch],
  );

  return {
    state,
    pending,
    pendingCount: pending.length,
    agents,
    decisionOf,
    choiceOf,
    unreadOf,
    isInstalled: (key: ListingKey) => Boolean(state.installs[key]),
    sentTo: (key: ThreadKey) => state.sent[key] ?? [],
    ...actions,
  };
}

/** "3 need you", "1 needs you", "nothing needs you". */
export function needYouLabel(count: number): string {
  if (count === 0) return 'nothing needs you';
  return count === 1 ? '1 needs you' : `${count} need you`;
}
