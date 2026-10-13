'use client';

// Two small pieces of state the call and the Dashboard share that the prototype store has no room
// for: the visuals pinned to the Dashboard during the call, and when the call started, so
// minimising the call keeps its clock running and ending it resets the clock. Both live in
// sessionStorage like the store, and every screen that reads them updates together.

import { useCallback, useSyncExternalStore } from 'react';

export type CallVisual = 'inv' | 'run' | 'pro';

const PINS_KEY = 'saydeed-prototype:call-pins';
const CALL_KEY = 'saydeed-prototype:call-started';
const NO_PINS: CallVisual[] = [];

const listeners = new Set<() => void>();
function emit() {
  for (const l of listeners) l();
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === PINS_KEY || e.key === null) listener();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

function readRaw(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: string | null) {
  try {
    if (value === null) window.sessionStorage.removeItem(key);
    else window.sessionStorage.setItem(key, value);
  } catch {
    // Private windows can refuse storage; the state then lasts for this page view only.
  }
}

// useSyncExternalStore needs the same array back while nothing changed.
let cachedRaw: string | null = null;
let cachedPins: CallVisual[] = NO_PINS;
let memoryPins: CallVisual[] | null = null;

function getPins(): CallVisual[] {
  if (memoryPins) return memoryPins;
  const raw = readRaw(PINS_KEY);
  if (raw === cachedRaw) return cachedPins;
  cachedRaw = raw;
  try {
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    cachedPins = Array.isArray(parsed) ? parsed.filter((v): v is CallVisual => v === 'inv' || v === 'run' || v === 'pro') : NO_PINS;
  } catch {
    cachedPins = NO_PINS;
  }
  return cachedPins;
}

function setPins(next: CallVisual[]) {
  const raw = JSON.stringify(next);
  writeRaw(PINS_KEY, raw);
  // If storage refused the write, keep the pins in memory for this page view.
  memoryPins = readRaw(PINS_KEY) === raw ? null : next;
  emit();
}

/** The call visuals pinned to the Dashboard, in the order they were pinned. */
export function usePins() {
  const pins = useSyncExternalStore(subscribe, getPins, () => NO_PINS);
  const toggle = useCallback((v: CallVisual) => {
    const current = getPins();
    setPins(current.includes(v) ? current.filter((p) => p !== v) : [...current, v]);
  }, []);
  const unpin = useCallback((v: CallVisual) => setPins(getPins().filter((p) => p !== v)), []);
  return { pins, isPinned: (v: CallVisual) => pins.includes(v), toggle, unpin };
}

/** The design's call is 3 minutes 12 seconds in when the screen opens. */
export const CALL_ELAPSED_AT_OPEN = 3 * 60 + 12;

/** When the current call started (ms since epoch), starting one if none is running. */
export function callStartedAt(now: number): number {
  const saved = Number(readRaw(CALL_KEY));
  if (Number.isFinite(saved) && saved > 0 && saved <= now) return saved;
  const started = now - CALL_ELAPSED_AT_OPEN * 1000;
  writeRaw(CALL_KEY, String(started));
  return started;
}

/** Hanging up: the next call starts its clock again. */
export function endCall() {
  writeRaw(CALL_KEY, null);
}

/** 192 -> "03:12". */
export function formatCallTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}
